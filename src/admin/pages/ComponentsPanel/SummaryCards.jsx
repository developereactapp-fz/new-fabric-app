export default function SummaryCards({ components, categories }) {
  const total = components.length;
  const active = components.filter((c) => c.status === "active").length;
  const catCount = categories.length;
  const totalValues = components.reduce((sum, c) => sum + (c.valueCount || 0), 0);

  const cards = [
    {
      label: "Total Components",
      value: total,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      className: "cp-summary-total",
    },
    {
      label: "Active Components",
      value: active,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      className: "cp-summary-active",
    },
    {
      label: "Categories",
      value: catCount,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
      className: "cp-summary-categories",
    },
    {
      label: "Component Values",
      value: totalValues,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      className: "cp-summary-values",
    },
  ];

  return (
    <div className="cp-summary-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`cp-summary-card ${card.className}`}
        >
          <div className="cp-summary-icon">{card.icon}</div>
          <div className="cp-summary-info">
            <span className="cp-summary-value">{card.value}</span>
            <span className="cp-summary-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

