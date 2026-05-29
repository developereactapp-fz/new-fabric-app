import { useState, useMemo } from "react";

/**
 * ContrastSection — Contrast panel for Collar/Cuff components.
 * Shows enable/disable toggle, default fabric info, text inputs to add contrast fabrics,
 * and uploader checklists for options under default and added contrast fabrics.
 */
export default function ContrastSection({
  componentName,
  enabled,
  onToggle,
  defaultFabric,
  checkedOptions = [],
  contrastFabrics = [],
  onAddContrastFabric,
  onRemoveContrastFabric,
  onImageUpload,
}) {

  const [newFabricCode, setNewFabricCode] = useState("");
  const [selectedCuffType, setSelectedCuffType] = useState("Single Round");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newFabricCode.trim()) return;
    onAddContrastFabric(newFabricCode.trim());
    setNewFabricCode("");
  };

  // Filter checked options based on Cuff Type dropdown (if component is Cuff)
  const filteredOptions = useMemo(() => {
    if (componentName.toLowerCase() !== "cuff") return checkedOptions;

    return checkedOptions.filter((opt) => {
      const label = opt.label.toLowerCase();
      if (selectedCuffType === "Single Round") {
        return label.includes("single round") || label.includes("single cuff one button") || label.includes("single round adjustable");
      } else if (selectedCuffType === "Single Square") {
        return label.includes("single square") || label.includes("single eclipse") || label.includes("single cuff elipse") || label.includes("single chisel");
      } else if (selectedCuffType === "Double Cuff") {
        return label.includes("double cuff") || label.includes("turnback cuff");
      }
      return true;
    });
  }, [componentName, checkedOptions, selectedCuffType]);

  return (
    <div className="csf-contrast">
      <div className="csf-contrast-header">
        <h4 className="csf-contrast-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 000 20" fill="currentColor" opacity="0.15" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          {componentName} Contrast
        </h4>
        <div className="admin-toggle-wrap">
          <span className="admin-toggle-label">{enabled ? "Enabled" : "Disabled"}</span>
          <button
            className={`admin-toggle ${enabled ? "active" : ""}`}
            onClick={onToggle}
            type="button"
            aria-label={`Toggle ${componentName} contrast`}
          />
        </div>
      </div>

      {enabled && (
        <div className="csf-contrast-body">
          {/* Cuff Type Dropdown for Cuff Contrast */}
          {componentName.toLowerCase() === "cuff" && (
            <div className="csf-global-group" style={{ marginBottom: 16 }}>
              <span className="csf-global-label" style={{ fontSize: 11, fontWeight: 700 }}>Cuff Type</span>
              <select
                className="admin-select"
                value={selectedCuffType}
                onChange={(e) => setSelectedCuffType(e.target.value)}
                style={{ width: "100%", marginTop: 4, height: 36, fontSize: 13 }}
              >
                <option value="Single Round">Single Round</option>
                <option value="Single Square">Single Square</option>
                <option value="Double Cuff">Double Cuff</option>
              </select>
            </div>
          )}

          {/* Default Configuration block */}
          <div className="csf-contrast-default" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "between", width: "100%" }}>
              <div>
                <span className="csf-contrast-default-label" style={{ fontSize: 11, color: "#6b7280" }}>DEFAULT CONFIGURATION</span>
                <div className="csf-contrast-default-value" style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                  Default Fabric: {defaultFabric ? `${defaultFabric.fabricId} – ${defaultFabric.fabricName}` : "Not selected"}
                </div>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>(Default is always active and cannot be removed)</span>
              </div>
              {defaultFabric && (
                <span className="csf-contrast-default-badge" style={{ alignSelf: "flex-start" }}>DEFAULT</span>
              )}
            </div>

            {/* Input to add other contrast fabrics */}
            <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                type="text"
                className="admin-select"
                placeholder="Enter Fabric ID (e.g. FAB002)..."
                value={newFabricCode}
                onChange={(e) => setNewFabricCode(e.target.value)}
                style={{ flex: 1, height: 34, fontSize: 13, paddingInline: 10 }}
              />
              <button type="submit" className="admin-btn admin-btn-primary" style={{ paddingInline: 12, height: 34, fontSize: 12 }}>
                + Add
              </button>
            </form>
          </div>

          {/* Render contrast fabrics: Default Fabric options first */}
          <div className="csf-contrast-fabrics-list" style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
            {/* 1. Options for Default Fabric */}
            {defaultFabric && filteredOptions.length > 0 && (
              <div className="csf-contrast-fabric-block" style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#4b5563", borderBottom: "1px solid #f3f4f6", paddingBottom: 6, marginBottom: 8 }}>
                  → {defaultFabric.fabricId} – {defaultFabric.fabricName}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredOptions.map((opt) => (
                    <div key={`default-${opt.key}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="checkbox" checked={true} disabled style={{ width: 15, height: 15 }} />
                        <span>{opt.label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 4, overflow: "hidden", border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                          {opt.image ? (
                            <img src={opt.image} alt={opt.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onImageUpload(opt.key, defaultFabric.id, file);
                            }}
                            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                          />
                        </div>
                        <button
                          type="button"
                          className="admin-btn"
                          style={{ paddingInline: 8, paddingBlock: 2, height: 26, fontSize: 11 }}
                          onClick={() => {
                            if (opt.image) window.open(opt.image, "_blank");
                          }}
                          disabled={!opt.image}
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Options for Added Contrast Fabrics */}
            {contrastFabrics.map((fabric) => (
              <div key={fabric.id} className="csf-contrast-fabric-block" style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: 6, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#111827" }}>
                    {fabric.fabricId} – {fabric.fabricName}
                  </div>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                    onClick={() => onRemoveContrastFabric(fabric.id)}
                  >
                    Delete
                  </button>
                </div>
                {filteredOptions.length === 0 ? (
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>No options checked in main component yet.</span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filteredOptions.map((opt) => (
                      <div key={`${fabric.id}-${opt.key}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input type="checkbox" checked={true} disabled style={{ width: 15, height: 15 }} />
                          <span>{opt.label}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 4, overflow: "hidden", border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            {opt.image ? (
                              <img src={opt.image} alt={opt.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                              </svg>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onImageUpload(opt.key, fabric.id, file);
                              }}
                              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                            />
                          </div>
                          <button
                            type="button"
                            className="admin-btn"
                            style={{ paddingInline: 8, paddingBlock: 2, height: 26, fontSize: 11 }}
                            onClick={() => {
                              if (opt.image) window.open(opt.image, "_blank");
                            }}
                            disabled={!opt.image}
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
