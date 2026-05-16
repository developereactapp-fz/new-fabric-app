/**
 * EmptyState — Placeholder display for empty data states.
 *
 * Usage:
 *   <EmptyState
 *     icon={<svg>...</svg>}
 *     heading="No Fabrics Yet"
 *     message="Add fabrics via the Fabric Onboarding page."
 *     actionLabel="Go to Onboarding"
 *     onAction={() => navigate("/admin/fabric-onboarding")}
 *   />
 */
export default function EmptyState({
  icon,
  heading,
  message,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`admin-empty ${className}`} style={{ padding: 60, textAlign: "center" }}>
      {icon && <div className="admin-empty-icon">{icon}</div>}
      {heading && (
        <h3 style={{ margin: "16px 0 4px", color: "#475569" }}>{heading}</h3>
      )}
      {message && (
        <p style={{ color: "#94a3b8", maxWidth: 360, margin: "0 auto" }}>
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          className="admin-btn admin-btn-primary"
          style={{ marginTop: 12 }}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
