import { useNavigate } from "react-router-dom";

/**
 * ContrastSection — Contrast toggle panel for Collar/Cuff components.
 * Shows enable/disable toggle, default fabric info, and link to advanced mapping.
 *
 * Props:
 *   componentName — "Collar" | "Cuff"
 *   enabled       — boolean
 *   onToggle      — () => void
 *   defaultFabric — { fabricName, fabricId } | null
 */
export default function ContrastSection({
  componentName,
  enabled,
  onToggle,
  defaultFabric,
}) {
  const navigate = useNavigate();

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
          {/* Default fabric display */}
          <div className="csf-contrast-default">
            <span className="csf-contrast-default-label">Default Fabric:</span>
            <span className="csf-contrast-default-value">
              {defaultFabric
                ? `${defaultFabric.fabricId} – ${defaultFabric.fabricName}`
                : "No fabric selected"}
            </span>
            {defaultFabric && (
              <span className="csf-contrast-default-badge">DEFAULT</span>
            )}
          </div>

          {/* Info / link to advanced tools */}
          <div className="csf-contrast-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Configure contrast options via{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/group-builder");
                }}
              >
                Group Builder
              </a>{" "}
              and{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/contrast-mapper");
                }}
              >
                Contrast Mapper
              </a>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
