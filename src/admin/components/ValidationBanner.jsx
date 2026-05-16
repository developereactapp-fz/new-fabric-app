import React from "react";

/**
 * ValidationBanner — Reusable banner for displaying validation issues.
 */
export default function ValidationBanner({ issues = [], title = "Validation Issues" }) {
  if (!issues || issues.length === 0) return null;

  return (
    <div style={styles.container}>
      <span style={styles.icon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </span>
      <div style={styles.content}>
        <div style={styles.header}>
          <strong style={{ fontWeight: 600 }}>{title}</strong>
          <span style={styles.count}>{issues.length} {issues.length === 1 ? 'issue' : 'issues'} found</span>
        </div>
        <ul style={styles.list}>
          {issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  icon: {
    color: "#ef4444",
    width: "20px",
    height: "20px",
    flexShrink: 0,
    marginTop: "2px",
  },
  content: {
    flex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#991b1b",
    marginBottom: "8px",
    fontSize: "14px",
  },
  count: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#7f1d1d",
    fontSize: "13px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  }
};
