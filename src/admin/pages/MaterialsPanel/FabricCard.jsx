import StatusBadge from "../../components/StatusBadge";
import { getPublicAssetUrl } from "../../utils/assetUtils";

export default function FabricCard({ fabric, onToggle, onEdit, onDelete }) {
  const isActive = fabric.status === "active";
  const price = fabric.price != null ? Number(fabric.price).toFixed(2) : null;
  const isAvailable = isActive;
  const fabricImage = getPublicAssetUrl(fabric.assetId || fabric.asset?.id) || fabric.image || fabric.imageUrl || fabric.asset?.url || null;
  const gsmValue = fabric.gsm || null;

  return (
    <div className={`mp-card ${!isActive ? "mp-card-inactive" : ""}`}>
      {/* Image Section */}
      <div className="mp-card-image">
        <div className="mp-card-badge">
          <StatusBadge status={fabric.status} size="xs" />
        </div>
        {fabricImage ? (
          <img src={fabricImage} alt={fabric.fabricName} />
        ) : (
          <div className="mp-card-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {/* Material Tag */}
        {fabric.material && (
          <span className="mp-card-material-tag">{fabric.material}</span>
        )}
      </div>

      {/* Info Section */}
      <div className="mp-card-body">
        <h3 className="mp-card-name">{fabric.fabricName || "Untitled Fabric"}</h3>
        <span className="mp-card-id">{fabric.fabricId}</span>

        <div className="mp-card-meta">
          <div className="mp-card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span>{price != null ? `₹${price}/m` : "—"}</span>
          </div>
          {gsmValue && (
            <div className="mp-card-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>{gsmValue} GSM</span>
            </div>
          )}
        </div>

        {/* Color chips */}
        <div className="mp-card-chips">
          {fabric.color && (
            <span className="mp-chip mp-chip-color">
              {fabric.colorHex && <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: fabric.colorHex, marginRight: 4, verticalAlign: "middle" }} />}
              {fabric.color}
            </span>
          )}
          {fabric.pattern && <span className="mp-chip">{fabric.pattern}</span>}
          {fabric.season && <span className="mp-chip">{fabric.season}</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="mp-card-footer">
        <div className="mp-card-availability">
          <span className={`mp-avail-label ${isAvailable ? "available" : "unavailable"}`}>
            {isAvailable ? "Available" : "Unavailable"}
          </span>
          <label className="mp-toggle" title={isActive ? "Deactivate" : "Activate"}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onToggle(fabric.id)}
            />
            <span className="mp-toggle-slider" />
          </label>
        </div>
        <div className="mp-card-divider" />
        <div className="mp-card-actions">
          <button className="mp-action-btn mp-action-edit" onClick={() => onEdit(fabric.id)} title="Edit Fabric">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <span>Edit</span>
          </button>
          <button className="mp-action-btn mp-action-delete" onClick={() => onDelete(fabric)} title="Delete Fabric">
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
