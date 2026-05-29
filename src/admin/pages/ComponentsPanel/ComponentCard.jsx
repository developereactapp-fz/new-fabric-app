import StatusBadge from "../../components/StatusBadge";

export default function ComponentCard({ component, onToggle, onEdit, onDelete }) {
  const isActive = component.isActive;
  const totalValues = component.valueCount ?? 0;
  const activeValues = component.activeValueCount ?? 0;

  return (
    <div className={`cp-card ${!isActive ? "cp-card-inactive" : ""}`}>
      {/* Component Title Area */}
      <div className="cp-card-image" style={{ height: 100, background: 'linear-gradient(145deg, #eef2ff, #e0e7ff)' }}>
        <div className="cp-card-badge">
          <StatusBadge status={isActive ? "active" : "inactive"} size="xs" />
        </div>
        
        <div className="cp-card-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>

        {/* Product / Category Tag */}
        {component.productName && (
          <span className="cp-card-material-tag" style={{ fontSize: "10px" }}>
            {component.productName}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="cp-card-body">
        <h3 className="cp-card-name">{component.name || "Untitled Component"}</h3>
        <span className="cp-card-id">{component.id}</span>

        <div className="cp-card-meta">
          <div className="cp-card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>{totalValues} Values</span>
          </div>
          <div className="cp-card-meta-item">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{activeValues} Active</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="cp-card-footer">
        <div className="cp-card-availability">
          <span className={`cp-avail-label ${isActive ? "available" : "unavailable"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
          <label className="cp-toggle" title={isActive ? "Deactivate" : "Activate"}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onToggle(component.productId, component.id)}
            />
            <span className="cp-toggle-slider" />
          </label>
        </div>
        <div className="cp-card-divider" />
        <div className="cp-card-actions">
          <button className="cp-action-btn cp-action-edit" onClick={() => onEdit(component)} title="Manage Mappings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>Mappings</span>
          </button>
          <button className="cp-action-btn cp-action-delete" onClick={() => onDelete(component)} title="Delete Component">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
