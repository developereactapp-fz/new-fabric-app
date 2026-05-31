import { useState } from "react";
import BulkUploadMode from "./BulkUploadMode";
import ManualEntryMode from "./ManualEntryMode";
import "./FabricConfigurator.css";

import { CATEGORIES, ATTRIBUTES } from "../../config/appConfig";
import { adminService } from "../../../services/adminService";
import { toast } from "sonner";

export default function FabricConfiguratorPage() {
  const [mode, setMode] = useState("bulk"); // "bulk" | "manual"
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleDeduplicate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to scan and remove duplicate attribute values from the server? This will delete duplicate values case-insensitively across all attributes (keeping the first unique instance)."
    );
    if (!confirmed) return;

    setIsCleaning(true);
    let deletedCount = 0;
    try {
      for (const attr of ATTRIBUTES) {
        const res = await adminService.getAttributes({ category: attr });
        const raw = res.data?.data || res.data || [];
        const items = Array.isArray(raw) ? raw : [];

        const seen = new Set();
        const duplicates = [];

        for (const item of items) {
          const valLower = item.value?.trim().toLowerCase();
          if (!valLower) continue;
          if (seen.has(valLower)) {
            duplicates.push(item);
          } else {
            seen.add(valLower);
          }
        }

        for (const dup of duplicates) {
          await adminService.deleteAttribute(dup.id);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        toast.success(`Deduplication complete. Removed ${deletedCount} duplicate values.`);
      } else {
        toast.success("Deduplication complete. No duplicate values found.");
      }

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Deduplication failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to remove duplicate values from the server."
      );
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="fc-page">
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2>Fabric Main Configurator</h2>
          <p>Manage master-level fabric attributes for dropdowns, filtering, and mapping</p>
        </div>
        <div>
          <button
            className="admin-btn admin-btn-secondary fc-dedup-btn"
            onClick={handleDeduplicate}
            disabled={isCleaning}
          >
            {isCleaning ? (
              <>
                <span className="fc-spinner" /> Deduplicating...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deduplicate Server Values
              </>
            )}
          </button>
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
