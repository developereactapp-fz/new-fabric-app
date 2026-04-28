export default function PlaceholderPage({ title = "Coming Soon" }) {
  return (
    <div className="admin-empty" style={{ minHeight: 400 }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
      <p style={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>{title}</p>
      <p>This page will be built in an upcoming phase.</p>
    </div>
  );
}
