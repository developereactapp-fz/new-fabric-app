import React from "react";

/**
 * Toast — Reusable toast notification for success/error messages.
 */
export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`admin-toast ${type}`} style={toastStyles.container}>
      <div style={toastStyles.content}>
        {type === "success" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={toastStyles.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === "error" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={toastStyles.icon}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
          </svg>
        )}
        <span style={toastStyles.text}>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} style={toastStyles.closeBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

const toastStyles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "#10b981", // default success
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    minWidth: "300px",
    maxWidth: "400px",
    zIndex: 9999,
    animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  text: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.4,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
  }
};
