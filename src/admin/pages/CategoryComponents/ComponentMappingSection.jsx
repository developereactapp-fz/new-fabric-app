import { useState, useMemo } from "react";

/**
 * ComponentMappingSection — Expandable card for one component (e.g. Collar).
 * Displays component values as a checkbox grid with image upload and default selection.
 *
 * Props:
 *   component    — { id, name }
 *   values       — [{ id, valueName, isDefault, status }] from componentValues
 *   mappings     — current local mapping state { [valueId]: { checked, image, isDefault } }
 *   onChange      — (valueId, updates) => void
 *   onSetDefault  — (valueId) => void
 *   startExpanded — boolean
 */
export default function ComponentMappingSection({
  component,
  values = [],
  mappings = {},
  onChange,
  onSetDefault,
  startExpanded = false,
}) {
  const [expanded, setExpanded] = useState(startExpanded);

  const activeValues = useMemo(
    () => values.filter((v) => v.status === "active"),
    [values]
  );

  const selectedCount = activeValues.filter((v) => mappings[v.id]?.checked).length;

  // Status logic
  const missingImages = activeValues.filter(
    (v) => mappings[v.id]?.checked && !mappings[v.id]?.image
  ).length;
  const hasDefault = activeValues.some((v) => mappings[v.id]?.isDefault && mappings[v.id]?.checked);

  let statusLabel = "Not configured";
  let statusClass = "empty";
  if (selectedCount > 0 && missingImages === 0 && hasDefault) {
    statusLabel = "Complete";
    statusClass = "complete";
  } else if (selectedCount > 0) {
    statusLabel = missingImages > 0 ? `${missingImages} missing image${missingImages > 1 ? "s" : ""}` : "No default";
    statusClass = "incomplete";
  }

  const handleImageUpload = (valueId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(valueId, { image: url });
  };

  return (
    <div className="cc-section">
      <div className="cc-section-header" onClick={() => setExpanded(!expanded)}>
        <div className="cc-section-left">
          <div className="cc-section-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
          </div>
          <h3 className="cc-section-title">{component.name}</h3>
        </div>
        <div className="cc-section-right">
          <span className={`cc-section-count ${selectedCount > 0 ? "has-selected" : ""}`}>
            {selectedCount}/{activeValues.length}
          </span>
          <span className={`cc-section-status ${statusClass}`}>{statusLabel}</span>
          <span className={`cc-section-chevron ${expanded ? "open" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {expanded && (
        <div className="cc-section-body">
          {activeValues.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              No values configured for this component. Add values in the Category Configurator.
            </div>
          ) : (
            <div className="cc-options-grid">
              {activeValues.map((val) => {
                const m = mappings[val.id] || {};
                const checked = !!m.checked;
                const hasImage = !!m.image;
                let optionClass = "cc-option";
                if (checked) optionClass += " checked";
                if (checked && hasImage) optionClass += " has-image";
                if (checked && !hasImage) optionClass += " missing-image";

                return (
                  <div key={val.id} className={optionClass}>
                    <input
                      type="checkbox"
                      className="cc-option-checkbox"
                      checked={checked}
                      onChange={(e) => onChange(val.id, { checked: e.target.checked })}
                    />
                    <span className="cc-option-name">{val.valueName}</span>

                    {/* Image upload */}
                    <div className="cc-option-image" title={hasImage ? "Change image" : "Upload image"}>
                      {hasImage ? (
                        <img src={m.image} alt={val.valueName} />
                      ) : (
                        <span className="cc-upload-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(val.id, e)}
                      />
                    </div>

                    {/* Default radio */}
                    {checked && (
                      <label className={`cc-option-default ${m.isDefault ? "is-default" : ""}`}>
                        <input
                          type="radio"
                          name={`default-${component.id}`}
                          checked={!!m.isDefault}
                          onChange={() => onSetDefault(val.id)}
                        />
                        {m.isDefault ? "Default" : "Set"}
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
