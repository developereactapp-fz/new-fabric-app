/**
 * ConfirmDialog — Reusable confirmation modal for delete/disable actions.
 */
export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  details = null,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger", // "danger" | "warning" | "primary"
  onConfirm,
  onCancel,
  children,
}) {
  if (!open) return null;

  const variantStyles = {
    danger: { bg: "#dc2626", hover: "#b91c1c" },
    warning: { bg: "#f59e0b", hover: "#d97706" },
    primary: { bg: "#6366f1", hover: "#4f46e5" },
  };

  const vs = variantStyles[confirmVariant] || variantStyles.danger;

  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="admin-confirm-icon">
          {confirmVariant === "danger" ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>

        <h3 className="admin-confirm-title">{title}</h3>
        <p className="admin-confirm-message">{message}</p>

        {details && (
          <div className="admin-confirm-details">
            {Array.isArray(details) ? (
              <ul>
                {details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : (
              <p>{details}</p>
            )}
          </div>
        )}

        {children}

        <div className="admin-confirm-actions">
          <button className="admin-confirm-btn cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className="admin-confirm-btn confirm"
            style={{ background: vs.bg }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
