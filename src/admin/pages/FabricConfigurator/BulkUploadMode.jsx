import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { useAdmin } from "../../store/adminStore.jsx";
import ExcelUploader from "../../components/ExcelUploader";
import StatusBadge from "../../components/StatusBadge";
import { parseExcelBuffer, extractUniqueTabValues, extractAttributesFromFabricSheet, getColumnSummary } from "../../utils/excelParser";
import { findDuplicates } from "../../utils/validators";

const ATTRIBUTES = ["Color", "Material", "Sub Material", "Pattern", "Weave Pattern", "Season", "Feature"];
const API = import.meta.env.VITE_API_URL || "https://apperal-clothing-app-production.up.railway.app";

export default function BulkUploadMode({ category }) {
  const { state, importAttributeValues } = useAdmin();
  const [step, setStep] = useState("upload"); // upload | preview | validated | imported
  const [extractedValues, setExtractedValues] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheets, setSheets] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [importedCount, setImportedCount] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [importError, setImportError] = useState(null);

  const getToken = () => import.meta.env.VITE_AUTH_TOKEN;
  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-slug": "test-tenant",
  });

  // Ref to always have current state for validation inside callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleFileLoaded = useCallback(async (buffer) => {
    try {
      const result = parseExcelBuffer(buffer);
      setSheetNames(result.sheetNames);
      setSheets(result.sheets);

      // Auto-detect Unique_Tab or use first sheet
      const uniqueTab = result.sheetNames.find((n) => n.toLowerCase().includes("unique"));
      const fabricSheet = result.sheetNames.find((n) => n.toLowerCase().includes("fabric") && n.toLowerCase().includes("prop"));

      let values = null;
      let usedSheet = "";
      if (uniqueTab) {
        values = extractUniqueTabValues(result.sheets[uniqueTab]);
        usedSheet = uniqueTab;
      } else if (fabricSheet) {
        values = extractAttributesFromFabricSheet(result.sheets[fabricSheet]);
        usedSheet = fabricSheet;
      }

      if (values) {
        setExtractedValues(values);
        setSelectedSheet(usedSheet);
        setStep("preview");
        await runValidation(values);
      }
    } catch (err) {
      console.error("Excel parse error:", err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const runValidation = async (values) => {
    setIsValidating(true);
    const results = {};
    const existingAttrs = {};

    try {
      await Promise.all(ATTRIBUTES.map(async (attr) => {
        try {
          const res = await axios.get(`${API}/api/attributes`, {
            params: { category: attr },
            headers: authHeaders()
          });
          const raw = res.data?.data || res.data || [];
          existingAttrs[attr] = Array.isArray(raw) ? raw : [];
        } catch (err) {
          console.error(`Failed to fetch existing ${attr}`, err);
          existingAttrs[attr] = [];
        }
      }));

      ATTRIBUTES.forEach((attr) => {
        const vals = values[attr] || [];
        const existingVals = (existingAttrs[attr] || []).map((v) => v.value);
        const duplicatesInternal = findDuplicates(vals);
        const alreadyExist = vals.filter((v) =>
          existingVals.some((ev) => ev.toLowerCase() === v.toLowerCase())
        );
        const newValues = vals.filter(
          (v) =>
            !alreadyExist.some((ae) => ae.toLowerCase() === v.toLowerCase()) &&
            !duplicatesInternal.some((d) => d.toLowerCase() === v.toLowerCase())
        );

        results[attr] = {
          total: vals.length,
          duplicates: duplicatesInternal,
          alreadyExist,
          newValues,
          valid: duplicatesInternal.length === 0,
        };
      });

      setValidationResults(results);
      setStep("validated");
    } finally {
      setIsValidating(false);
    }
  };

  // ── POST all new values to server, then sync local store ──────────
  const handleImport = async () => {
    if (!extractedValues) return;

    const attributeMap = {};
    let count = 0;
    ATTRIBUTES.forEach((attr) => {
      const result = validationResults?.[attr];
      if (result && result.newValues.length > 0) {
        attributeMap[attr] = result.newValues;
        count += result.newValues.length;
      }
    });

    if (count === 0) return;

    setIsImporting(true);
    setImportError(null);

    try {
      // Fire all POST /api/attributes requests in parallel
      const requests = [];
      Object.entries(attributeMap).forEach(([attr, values]) => {
        values.forEach((value) => {
          requests.push(
            axios.post(
              `${API}/api/attributes`,
              { category: attr, value, isActive: true },
              { headers: authHeaders() }
            )
          );
        });
      });

      await Promise.all(requests);

      // Only update local store after server confirms success
      importAttributeValues(category, attributeMap);
      setImportedCount(count);
      setStep("imported");
    } catch (err) {
      console.error("Bulk import failed:", err);
      setImportError(
        err.response?.data?.message || "Some values failed to save. Please try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
    const rows = sheets[sheetName];
    if (!rows) return;

    let values = null;
    if (sheetName.toLowerCase().includes("unique")) {
      values = extractUniqueTabValues(rows);
    } else {
      values = extractAttributesFromFabricSheet(rows);
    }

    if (values) {
      setExtractedValues(values);
      runValidation(values);
    }
  };

  const summary = extractedValues ? getColumnSummary(extractedValues) : {};

  return (
    <div className="fc-bulk">
      {/* Upload Section */}
      {step === "upload" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Upload Excel File</h3>
              <p className="admin-card-subtitle">Upload an Excel file containing fabric attribute values. The system will auto-detect the Unique_Tab sheet.</p>
            </div>
          </div>
          <ExcelUploader onFileLoaded={handleFileLoaded} label="Upload Fabric Attributes Excel" />
        </div>
      )}

      {/* Sheet Selector + Preview */}
      {(step === "preview" || step === "validated") && extractedValues && (
        <>
          {/* Sheet tabs */}
          {sheetNames.length > 1 && (
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <label className="admin-label">Detected Sheets</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sheetNames.map((name) => (
                  <button
                    key={name}
                    className={`admin-btn ${name === selectedSheet ? "admin-btn-primary" : "admin-btn-secondary"} admin-btn-sm`}
                    onClick={() => handleSheetChange(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Column Summary */}
          <div className="admin-card" style={{ marginBottom: 16 }}>
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Column Summary</h3>
                <p className="admin-card-subtitle">Values found per attribute from "{selectedSheet}"</p>
              </div>
              <StatusBadge status="info" label={`Category: ${category}`} size="md" />
            </div>
            <div className="fc-summary-grid">
              {ATTRIBUTES.map((attr) => (
                <div key={attr} className="fc-summary-item">
                  <span className="fc-summary-label">{attr}</span>
                  <span className="fc-summary-count">{summary[attr] || 0} values</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Table */}
          <div className="admin-card" style={{ marginBottom: 16 }}>
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Extracted Values Preview</h3>
                <p className="admin-card-subtitle">Review values before importing</p>
              </div>
            </div>
            <div className="fc-preview-table-wrapper">
              <table className="fc-preview-table">
                <thead>
                  <tr>
                    {ATTRIBUTES.map((attr) => (
                      <th key={attr}>{attr}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.max(...ATTRIBUTES.map((a) => (extractedValues[a] || []).length), 1) }).map(
                    (_, rowIdx) => (
                      <tr key={rowIdx}>
                        {ATTRIBUTES.map((attr) => {
                          const val = (extractedValues[attr] || [])[rowIdx] || "";
                          const vr = validationResults?.[attr];
                          const isDup = vr?.duplicates?.some((d) => d.toLowerCase() === val.toLowerCase());
                          const exists = vr?.alreadyExist?.some((e) => e.toLowerCase() === val.toLowerCase());
                          return (
                            <td key={attr} className={isDup ? "fc-cell-error" : exists ? "fc-cell-warning" : ""}>
                              {val}
                              {isDup && <span className="fc-cell-tag error">Duplicate</span>}
                              {exists && <span className="fc-cell-tag warning">Exists</span>}
                            </td>
                          );
                        })}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Results */}
          {isValidating ? (
            <div className="admin-card" style={{ marginBottom: 16, padding: 32, textAlign: "center", color: "#64748b" }}>
              <p>Validating attributes against server...</p>
            </div>
          ) : validationResults && (
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Validation Results</h3>
                  <p className="admin-card-subtitle">Check before importing</p>
                </div>
              </div>
              <div className="fc-validation-grid">
                {ATTRIBUTES.map((attr) => {
                  const r = validationResults[attr];
                  if (!r) return null;
                  return (
                    <div key={attr} className="fc-validation-item">
                      <div className="fc-validation-header">
                        <span className="fc-validation-attr">{attr}</span>
                        <StatusBadge status={r.valid ? "active" : "error"} label={r.valid ? "Valid" : "Has Issues"} size="xs" />
                      </div>
                      <div className="fc-validation-stats">
                        <span>New: <strong>{r.newValues.length}</strong></span>
                        {r.duplicates.length > 0 && <span className="fc-val-error">Duplicates: {r.duplicates.length}</span>}
                        {r.alreadyExist.length > 0 && <span className="fc-val-warning">Already exist: {r.alreadyExist.length}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          {importError && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>
              ⚠ {importError}
            </p>
          )}
          <div className="fc-actions">
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => { setStep("upload"); setExtractedValues(null); setValidationResults(null); setImportError(null); }}
              disabled={isImporting || isValidating}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleImport}
              disabled={isImporting || isValidating}
            >
              {isImporting ? "Saving to server…" : "Import to Master List"}
            </button>
          </div>
        </>
      )}

      {/* Success */}
      {step === "imported" && (
        <div className="admin-card">
          <div className="fc-success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3>Import Successful!</h3>
            <p>{importedCount} new attribute values imported into <strong>{category}</strong></p>
            <button className="admin-btn admin-btn-primary" onClick={() => { setStep("upload"); setExtractedValues(null); setValidationResults(null); setImportedCount(0); }}>
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
