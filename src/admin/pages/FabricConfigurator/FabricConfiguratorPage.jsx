import { useState } from "react";
import BulkUploadMode from "./BulkUploadMode";
import ManualEntryMode from "./ManualEntryMode";
import "./FabricConfigurator.css";

const CATEGORIES = [
  "Custom Shirt",
  "Custom Tuxedo Shirt",
  "Custom Pant",
  "Custom Jacket",
  "Custom Waistcoat",
  "Custom Suit",
];

export default function FabricConfiguratorPage() {
  const [mode, setMode] = useState("bulk"); // "bulk" | "manual"
  const [category, setCategory] = useState(CATEGORIES[0]);

  return (
    <div className="fc-page">
      <div className="admin-page-header">
        <div>
          <h2>Fabric Main Configurator</h2>
          <p>Manage master-level fabric attributes for dropdowns, filtering, and mapping</p>
        </div>
      </div>

      {/* Mode & Category Selection */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="fc-controls">
          <div className="fc-mode-section">
            <label className="admin-label">Configuration Mode</label>
            <div className="fc-mode-tabs">
              <button
                className={`fc-mode-btn ${mode === "bulk" ? "active" : ""}`}
                onClick={() => setMode("bulk")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Bulk Upload
              </button>
              <button
                className={`fc-mode-btn ${mode === "manual" ? "active" : ""}`}
                onClick={() => setMode("manual")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Manual Entry
              </button>
            </div>
          </div>

          <div className="fc-category-section">
            <label className="admin-label">Apply to Category</label>
            <select
              className="admin-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mode Content */}
      {mode === "bulk" ? (
        <BulkUploadMode category={category} />
      ) : (
        <ManualEntryMode category={category} />
      )}
    </div>
  );
}
