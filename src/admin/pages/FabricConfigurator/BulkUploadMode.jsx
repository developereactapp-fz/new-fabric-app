import { useState, useCallback } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import ExcelUploader from "../../components/ExcelUploader";
import StatusBadge from "../../components/StatusBadge";
import { parseExcelBuffer, extractUniqueTabValues, extractAttributesFromFabricSheet, getColumnSummary } from "../../utils/excelParser";
import { findDuplicates } from "../../utils/validators";

const ATTRIBUTES = ["Color", "Material", "Sub Material", "Pattern", "Weave Pattern", "Season", "Feature"];

export default function BulkUploadMode({ category }) {
  const { state, importAttributeValues } = useAdmin();
  const [step, setStep] = useState("upload"); // upload | preview | validated | imported
  const [extractedValues, setExtractedValues] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheets, setSheets] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [importedCount, setImportedCount] = useState(0);

  const handleFileLoaded = useCallback((buffer, fileName) => {
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
        runValidation(values);
      }
    } catch (err) {
      console.error("Excel parse error:", err);
    }
  }, []);

  const runValidation = (values) => {
    const results = {};
    const existingAttrs = state.attributes[category] || {};

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
  };

  const handleImport = () => {
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

    importAttributeValues(category, attributeMap);
    setImportedCount(count);
    setStep("imported");
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
          {validationResults && (
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
          <div className="fc-actions">
            <button className="admin-btn admin-btn-secondary" onClick={() => { setStep("upload"); setExtractedValues(null); setValidationResults(null); }}>
              Cancel
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleImport}>
              Import to Master List
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
