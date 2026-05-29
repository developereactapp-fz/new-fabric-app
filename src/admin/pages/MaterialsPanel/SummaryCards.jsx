export default function SummaryCards({ fabrics, categories }) {
  const total = fabrics.length;
  const active = fabrics.filter((f) => f.status === "active").length;
  const available = fabrics.filter((f) => f.status === "active" && (f.stock ?? 0) > 0).length;
  const catCount = categories.length;

  const cards = [
    {
      label: "Total Fabrics",
      value: total,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      color: "#eef2ff",
      border: "#c7d2fe",
    },
    {
      label: "Active Fabrics",
      value: active,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      label: "Available Now",
      value: available,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "Categories",
      value: catCount,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
      color: "#faf5ff",
      border: "#e9d5ff",
    },
  ];

  return (
    <div className="mp-summary-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className="mp-summary-card"
          style={{ background: card.color, borderColor: card.border }}
        >
          <div className="mp-summary-icon">{card.icon}</div>
          <div className="mp-summary-info">
            <span className="mp-summary-value">{card.value}</span>
            <span className="mp-summary-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
