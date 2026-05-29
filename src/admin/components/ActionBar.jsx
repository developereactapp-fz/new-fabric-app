/**
 * ActionBar — Bottom/inline action bar for save/cancel/status buttons.
 *
 * Usage:
 *   <ActionBar>
 *     <button className="admin-btn primary" onClick={handleSave}>Save</button>
 *     <button className="admin-btn secondary" onClick={handleCancel}>Cancel</button>
 *   </ActionBar>
 */
export default function ActionBar({ children, className = "", sticky = false }) {
  return (
    <div
      className={`admin-action-bar ${sticky ? "admin-action-bar-sticky" : ""} ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "16px 0",
        ...(sticky
          ? {
              position: "sticky",
              bottom: 0,
              background: "white",
              borderTop: "1px solid #e2e8f0",
              padding: "16px 20px",
              marginTop: "auto",
              zIndex: 10,
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
}
