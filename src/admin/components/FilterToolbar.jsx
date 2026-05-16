import { useState } from "react";
import SearchInput from "./SearchInput";

/**
 * FilterToolbar — Expandable filter panel with active filter pills and clear-all.
 *
 * Usage:
 *   <FilterToolbar
 *     searchValue={search}
 *     onSearchChange={setSearch}
 *     searchPlaceholder="Search fabrics..."
 *     filters={[
 *       { key: "status", label: "Status", type: "chips", options: ["all","active","inactive"], value: filterStatus, onChange: setFilterStatus },
 *       { key: "material", label: "Material", type: "select", options: materials, value: filterMaterial, onChange: setFilterMaterial },
 *     ]}
 *     resultCount={filtered.length}
 *     totalCount={total.length}
 *     viewMode={viewMode}
 *     onViewModeChange={setViewMode}
 *   />
 */
export default function FilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  resultCount,
  totalCount,
  viewMode,
  onViewModeChange,
  className = "",
}) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = filters.filter((f) => f.value !== "all" && f.value !== "");
  const activeFilterCount = activeFilters.length;

  const clearFilters = () => {
    filters.forEach((f) => f.onChange(f.defaultValue ?? "all"));
    onSearchChange("");
  };

  return (
    <div className={`mp-toolbar ${className}`}>
      {/* Top bar: search + actions */}
      <div className="mp-toolbar-top">
        <div className="mp-search-wrap">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="mp-toolbar-actions">
          {filters.length > 0 && (
            <button
              className={`mp-filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="mp-filter-count-badge">{activeFilterCount}</span>
              )}
            </button>
          )}

          {/* View mode toggle */}
          {viewMode !== undefined && onViewModeChange && (
            <div className="mp-view-toggle">
              <button
                className={`mp-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => onViewModeChange("grid")}
                title="Grid View"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className={`mp-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => onViewModeChange("list")}
                title="List View"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Filter Row */}
      {showFilters && (
        <div className="mp-filter-row">
          {filters.map((filter) => (
            <div key={filter.key} className="mp-filter-group">
              <label className="mp-filter-label">{filter.label}</label>
              {filter.type === "chips" ? (
                <div className="mp-filter-chips">
                  {filter.options.map((opt) => {
                    const optValue = typeof opt === "string" ? opt : opt.value;
                    const optLabel = typeof opt === "string" ? (opt === "all" ? "All" : opt) : opt.label;
                    return (
                      <button
                        key={optValue}
                        className={`mp-filter-chip ${filter.value === optValue ? "active" : ""}`}
                        onClick={() => filter.onChange(optValue)}
                      >
                        {optLabel}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <select
                  className="admin-select mp-filter-select"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                >
                  <option value="all">All {filter.label}s</option>
                  {filter.options.map((opt) => {
                    const optValue = typeof opt === "string" ? opt : opt.value;
                    const optLabel = typeof opt === "string" ? opt : opt.label;
                    return (
                      <option key={optValue} value={optValue}>{optLabel}</option>
                    );
                  })}
                </select>
              )}
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button className="mp-clear-all-btn" onClick={clearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Results bar with active filter pills */}
      {(resultCount !== undefined || activeFilterCount > 0) && (
        <div className="mp-results-bar">
          {resultCount !== undefined && (
            <span className="mp-results-count">
              Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong>
            </span>
          )}
          {activeFilterCount > 0 && (
            <div className="mp-active-filters">
              {activeFilters.map((f) => (
                <span key={f.key} className="mp-active-pill">
                  {f.label}: {f.value}
                  <button onClick={() => f.onChange(f.defaultValue ?? "all")}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
