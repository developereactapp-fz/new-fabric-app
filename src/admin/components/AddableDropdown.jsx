import React, { useState } from "react";

/**
 * AddableDropdown — A select dropdown that allows adding new options inline.
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

  const handleAddNew = () => {
    const val = newValue.trim();
    if (val && onAddNewAttr) {
      onAddNewAttr(attrName, val);
    }
    setIsAddingNew(false);
    setNewValue("");
  };

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
          onClick={() => { setIsAddingNew(true); setNewValue(""); }}
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
        <div style={{ display: "flex", gap: "8px", marginTop: "4px", background: "#f8fafc", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <input
            className="admin-input"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`New ${label}...`}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
            style={{ flex: 1, height: "32px", padding: "4px 8px" }}
          />
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm" 
            onClick={handleAddNew}
            style={{ height: "32px" }}
          >
            Add
          </button>
          <button 
            className="admin-btn admin-btn-secondary admin-btn-sm" 
            onClick={() => setIsAddingNew(false)}
            style={{ height: "32px", padding: "0 8px" }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
