import React, { useState, useMemo } from "react";

/**
 * AddableDropdown — A select dropdown that allows adding new options inline.
 * Validates new values: non-empty, min 2 chars, no duplicates.
 */
export default function AddableDropdown({
  label,
  value,
  onChange,
  options,
  attrName,
  required = false,
  error,
  onAddNewAttr,
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [addError, setAddError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Case-insensitive duplicate check against existing options
  const existingLower = useMemo(() => options.map((o) => o.toLowerCase()), [options]);

  const validateNewValue = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return "Value cannot be empty";
    if (trimmed.length < 2) return "Must be at least 2 characters";
    if (existingLower.includes(trimmed.toLowerCase())) return `"${trimmed}" already exists`;
    return "";
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setNewValue(val);
    // Clear error while typing — validate on blur/submit
    if (addError) setAddError("");
  };

  const handleAddNew = async () => {
    const val = newValue.trim();
    const validationError = validateNewValue(val);
    if (validationError) {
      setAddError(validationError);
      return;
    }
    if (!onAddNewAttr) return;

    setIsAdding(true);
    try {
      await onAddNewAttr(attrName, val);
      setIsAddingNew(false);
      setNewValue("");
      setAddError("");
    } catch (err) {
      setAddError(err?.message || "Failed to add value");
    } finally {
      setIsAdding(false);
    }
  };

  const currentValidation = newValue.trim() ? validateNewValue(newValue) : "";
  const isValid = newValue.trim() && !currentValidation;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      <label className="admin-label">
        {label} {required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
      </label>
      
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <select
          className={`admin-select ${error ? "error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, ...(error ? { borderColor: "#ef4444", background: "#fef2f2" } : {}) }}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => { setIsAddingNew(true); setNewValue(""); setAddError(""); }}
          title={`Add new ${label}`}
          style={{ height: "42px", padding: "0 12px" }}
        >
          +
        </button>
      </div>

      {error && (
        <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "2px" }}>
          {error}
        </span>
      )}

      {isAddingNew && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px", background: "#f8fafc", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              className="admin-input"
              value={newValue}
              onChange={handleInputChange}
              placeholder={`New ${label}...`}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
              style={{
                flex: 1,
                height: "32px",
                padding: "4px 8px",
                ...(addError ? { borderColor: "#ef4444", background: "#fef2f2" } : {}),
              }}
            />
            <button 
              className="admin-btn admin-btn-primary admin-btn-sm" 
              onClick={handleAddNew}
              disabled={!isValid || isAdding}
              style={{ height: "32px", opacity: (!isValid || isAdding) ? 0.5 : 1 }}
            >
              {isAdding ? "..." : "Add"}
            </button>
            <button 
              className="admin-btn admin-btn-secondary admin-btn-sm" 
              onClick={() => { setIsAddingNew(false); setAddError(""); }}
              style={{ height: "32px", padding: "0 8px" }}
            >
              ×
            </button>
          </div>
          {/* Validation feedback */}
          {addError && (
            <span style={{ color: "#ef4444", fontSize: "11px" }}>
              ⚠ {addError}
            </span>
          )}
          {isValid && (
            <span style={{ color: "#16a34a", fontSize: "11px" }}>
              ✓ Available
            </span>
          )}
        </div>
      )}
    </div>
  );
}
