/**
 * PropertyGrid — Key-value property display grid for detail views.
 *
 * Usage:
 *   <PropertyGrid items={[
 *     { label: "Fabric ID", value: fabric.fabricId },
 *     { label: "Status", value: fabric.status, render: (v) => <StatusBadge status={v} /> },
 *   ]} />
 */
export default function PropertyGrid({ items = [], columns = 2, className = "" }) {
  return (
    <div
      className={`prop-grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "12px",
      }}
    >
      {items.map((item, idx) => (
        <div key={item.label || idx} className="prop-item">
          <span className="prop-label">{item.label}</span>
          {item.render ? (
            item.render(item.value)
          ) : (
            <span className="prop-value">{item.value || "N/A"}</span>
          )}
        </div>
      ))}
    </div>
  );
}
