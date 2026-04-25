import React from "react";

const QuickAccessToolbar = ({ isToolbarCollapsed, setIsToolbarCollapsed }) => {
  return (
    <div className="quick-access-container">
      <div className="quick-access-inner">
        {/* Left - AI Bot Large */}
        <button className="qa-btn qa-ai-bot" title="AI Bot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="10" width="16" height="10" rx="3" />
            <circle cx="12" cy="5" r="2.5" />
            <path d="M12 8v3" />
            <path d="M9 14h6" />
          </svg>
          <span>AI Bot</span>
        </button>

        {/* Right Column */}
        <div className="qa-right-col">
          {/* Top Row */}
          <div className="qa-row">
            <button className="qa-btn qa-pill" title="Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="7" r="3.5" />
                <path d="M4 20c0-3.5 3.5-5.5 8-5.5s8 2 8 5.5" />
              </svg>
              <span>Profile with symbol</span>
            </button>
            <button className="qa-btn qa-pill" title="Saved">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <polyline points="13 2 13 8 19 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <span>Saved files symbol</span>
            </button>
          </div>

          {/* Bottom Row - Toggleable */}
          {!isToolbarCollapsed && (
            <div className="qa-row">
              <button className="qa-btn qa-pill" title="Normal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 3h12l4 6-4 2v11H6V11L2 9l4-6z" />
                  <path d="M12 3v20" />
                </svg>
                <span>Normal</span>
              </button>
              <button className="qa-btn qa-pill" title="Tuxedo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 3h12l4 6-4 2v11H6V11L2 9l4-6z" />
                  <path d="M12 3v20" />
                  <path d="M9 7l3-3 3 3" />
                </svg>
                <span>Tuxedo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Min/Max Toggle - Bottom Center */}
      <button
        className="qa-toggle-center"
        onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
      >
        <span>{isToolbarCollapsed ? "Maximize to select style preference" : ""}</span>
        <svg
          viewBox="0 0 24 24"
          fill="#e74c3c"
          className={isToolbarCollapsed ? "" : "rotated"}
        >
          <path d="M12 16l-6-6h12z" />
        </svg>
      </button>
    </div>
  );
};

export default QuickAccessToolbar;
