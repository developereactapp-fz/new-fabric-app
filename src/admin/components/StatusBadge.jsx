/**
 * StatusBadge — Reusable badge for Active/Inactive/Default/Error/Warning states.
 */
export default function StatusBadge({ status, label, size = "sm" }) {
  const styles = {
    active: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    inactive: { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
    default: { bg: "#ede9fe", color: "#5b21b6", border: "#ddd6fe" },
    error: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
    warning: { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
    info: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    missing: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
    available: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    exists: { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  };

  const sizeStyles = {
    xs: { fontSize: "10px", padding: "1px 6px", borderRadius: "4px" },
    sm: { fontSize: "11px", padding: "2px 8px", borderRadius: "6px" },
    md: { fontSize: "12px", padding: "4px 10px", borderRadius: "8px" },
    lg: { fontSize: "13px", padding: "5px 12px", borderRadius: "8px" },
  };

  const key = (status || "inactive").toLowerCase();
  const s = styles[key] || styles.inactive;
  const sz = sizeStyles[size] || sizeStyles.sm;

  const displayLabel = label || status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontWeight: 600,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        ...sz,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: s.color,
          flexShrink: 0,
        }}
      />
      {displayLabel}
    </span>
  );
}
