import { useState } from "react";
import ContrastSection from "./ContrastSection";

/**
 * ShirtComponentSection — Expandable card for one shirt component section.
 * Used in CustomShirtPage to render each of the 10 shirt components.
 *
 * Props:
 *   index          — section number (1-based)
 *   title          — component display name (e.g. "Collar")
 *   options        — [{ key, label }] hardcoded options
 *   mappings       — { [optionKey]: { checked, image, isDefault } }
 *   onChange        — (optionKey, updates) => void
 *   onSetDefault    — (optionKey) => void
 *   hasContrast     — boolean, whether to show contrast panel
 *   contrastEnabled — boolean
 *   onContrastToggle — () => void
 *   defaultFabric   — fabric object for contrast default display
 *   startExpanded   — boolean
 */
export default function ShirtComponentSection({
  index,
  title,
  options = [],
  mappings = {},
  onChange,
  onSetDefault,
  hasContrast = false,
  contrastEnabled = false,
  onContrastToggle,
  defaultFabric = null,
  startExpanded = false,
}) {
  const [expanded, setExpanded] = useState(startExpanded);

  const selectedCount = options.filter((o) => mappings[o.key]?.checked).length;
  const missingImages = options.filter(
    (o) => mappings[o.key]?.checked && !mappings[o.key]?.image
  ).length;
  const hasDefault = options.some(
    (o) => mappings[o.key]?.isDefault && mappings[o.key]?.checked
  );

  let badgeLabel = "Not set";
  let badgeClass = "empty";
  if (selectedCount > 0 && missingImages === 0 && hasDefault) {
    badgeLabel = "✓ Complete";
    badgeClass = "complete";
  } else if (selectedCount > 0 && missingImages > 0) {
    badgeLabel = `${missingImages} missing`;
    badgeClass = "warning";
  } else if (selectedCount > 0) {
    badgeLabel = `${selectedCount} selected`;
    badgeClass = "selected";
  }

  const handleImageUpload = (optionKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(optionKey, { image: url });
  };

  return (
    <div className="csf-section">
      <div className="csf-section-header" onClick={() => setExpanded(!expanded)}>
        <div className="csf-section-left">
          <span className="csf-section-number">{index}</span>
          <h3 className="csf-section-title">{title}</h3>
        </div>
        <div className="csf-section-right">
          <span className={`csf-section-badge ${badgeClass}`}>{badgeLabel}</span>
          <span className={`csf-section-chevron ${expanded ? "open" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {expanded && (
        <div className="csf-section-body">
          <div className="csf-options-grid">
            {options.map((opt) => {
              const m = mappings[opt.key] || {};
              const checked = !!m.checked;
              const hasImage = !!m.image;
              let optionClass = "csf-option";
              if (checked) optionClass += " checked";
              if (checked && hasImage) optionClass += " has-image";
              if (checked && !hasImage) optionClass += " missing-image";

              return (
                <div key={opt.key} className={optionClass}>
                  <input
                    type="checkbox"
                    className="csf-option-checkbox"
                    checked={checked}
                    onChange={(e) => onChange(opt.key, { checked: e.target.checked })}
                  />
                  <span className="csf-option-name">{opt.label}</span>

                  {/* Image upload */}
                  <div className="csf-option-image" title={hasImage ? "Change image" : "Upload image"}>
                    {hasImage ? (
                      <img src={m.image} alt={opt.label} />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(opt.key, e)}
                    />
                  </div>

                  {/* Default radio */}
                  {checked && (
                    <label className={`csf-option-default ${m.isDefault ? "is-default" : ""}`}>
                      <input
                        type="radio"
                        name={`default-${title}`}
                        checked={!!m.isDefault}
                        onChange={() => onSetDefault(opt.key)}
                      />
                      {m.isDefault ? "Default" : "Set"}
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contrast Panel (Collar / Cuff only) */}
          {hasContrast && (
            <ContrastSection
              componentName={title}
              enabled={contrastEnabled}
              onToggle={onContrastToggle}
              defaultFabric={defaultFabric}
            />
          )}
        </div>
      )}
    </div>
  );
}
