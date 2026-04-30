import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import { useNavigate } from "react-router-dom";
import FabricCard from "./FabricCard";
import SummaryCards from "./SummaryCards";
import SearchInput from "../../components/SearchInput";
import ConfirmDialog from "../../components/ConfirmDialog";
import "./MaterialsPanel.css";

export default function MaterialsPanelPage() {
  const { state, toggleStatus, deleteFabric } = useAdmin();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMaterial, setFilterMaterial] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique filter values
  const materials = useMemo(() => {
    const set = new Set(state.fabrics.map((f) => f.material).filter(Boolean));
    return [...set].sort();
  }, [state.fabrics]);

  const colors = useMemo(() => {
    const set = new Set(state.fabrics.map((f) => f.color).filter(Boolean));
    return [...set].sort();
  }, [state.fabrics]);

  // Filtered fabrics
  const filtered = useMemo(() => {
    let result = state.fabrics;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.fabricId?.toLowerCase().includes(q) ||
          f.fabricName?.toLowerCase().includes(q) ||
          f.material?.toLowerCase().includes(q) ||
          f.color?.toLowerCase().includes(q) ||
          f.pattern?.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((f) => f.status === filterStatus);
    }
    if (filterMaterial !== "all") {
      result = result.filter((f) => f.material === filterMaterial);
    }
    if (filterColor !== "all") {
      result = result.filter((f) => f.color === filterColor);
    }

    return result;
  }, [state.fabrics, search, filterStatus, filterMaterial, filterColor]);

  const handleToggle = (fabricId) => {
    toggleStatus("fabrics", fabricId);
  };

  const handleEdit = (fabricId) => {
    navigate("/admin/fabric-onboarding", { state: { editFabricId: fabricId } });
  };

  const handleDeleteClick = (fabric) => {
    // Check dependencies
    const inGroups = state.fabricGroupMappings.filter((m) => m.fabricId === fabric.id).length;
    const inMappings = state.fabricMappings.filter((m) => m.fabricId === fabric.id).length;
    setDeleteTarget({ ...fabric, inGroups, inMappings });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteFabric(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterMaterial("all");
    setFilterColor("all");
  };

  const hasActiveFilters = filterStatus !== "all" || filterMaterial !== "all" || filterColor !== "all";
  const activeFilterCount = [filterStatus, filterMaterial, filterColor].filter(f => f !== "all").length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mp-page">
      {/* Page Header */}
      <div className="mp-header">
        <div className="mp-header-left">
          <h1 className="admin-page-title">Materials Panel</h1>
          <span className="mp-date">{today}</span>
        </div>
        <div className="mp-header-right">
          <button className="admin-btn admin-btn-primary" onClick={() => navigate("/admin/fabric-onboarding")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Fabric
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mp-toolbar">
        <div className="mp-toolbar-top">
          <div className="mp-search-wrap">
            <SearchInput value={search} onChange={setSearch} placeholder="Search fabrics by ID, name, material, color..." />
          </div>
          <div className="mp-toolbar-actions">
            <button
              className={`mp-filter-toggle-btn ${showFilters ? 'active' : ''}`}
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
            <div className="mp-view-toggle">
              <button
                className={`mp-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
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
                onClick={() => setViewMode("list")}
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
          </div>
        </div>

        {/* Expandable Filter Row */}
        {showFilters && (
          <div className="mp-filter-row">
            <div className="mp-filter-group">
              <label className="mp-filter-label">Status</label>
              <div className="mp-filter-chips">
                {["all", "active", "inactive"].map(s => (
                  <button
                    key={s}
                    className={`mp-filter-chip ${filterStatus === s ? "active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === "all" ? "All" : s === "active" ? "✓ Active" : "✗ Inactive"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mp-filter-group">
              <label className="mp-filter-label">Material</label>
              <select className="admin-select mp-filter-select" value={filterMaterial} onChange={(e) => setFilterMaterial(e.target.value)}>
                <option value="all">All Materials</option>
                {materials.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="mp-filter-group">
              <label className="mp-filter-label">Color</label>
              <select className="admin-select mp-filter-select" value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
                <option value="all">All Colors</option>
                {colors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {hasActiveFilters && (
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
      </div>

      {/* Active Filter Pills */}
      <div className="mp-results-bar">
        <span className="mp-results-count">
          Showing <strong>{filtered.length}</strong> of <strong>{state.fabrics.length}</strong> fabrics
        </span>
        {hasActiveFilters && (
          <div className="mp-active-filters">
            {filterStatus !== "all" && (
              <span className="mp-active-pill">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus("all")}>×</button>
              </span>
            )}
            {filterMaterial !== "all" && (
              <span className="mp-active-pill">
                Material: {filterMaterial}
                <button onClick={() => setFilterMaterial("all")}>×</button>
              </span>
            )}
            {filterColor !== "all" && (
              <span className="mp-active-pill">
                Color: {filterColor}
                <button onClick={() => setFilterColor("all")}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Fabric Cards Grid */}
      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty" style={{ padding: 60 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <h3 style={{ margin: "16px 0 4px", color: "#475569" }}>
              {state.fabrics.length === 0 ? "No Fabrics Yet" : "No Matching Fabrics"}
            </h3>
            <p style={{ color: "#94a3b8", maxWidth: 360 }}>
              {state.fabrics.length === 0
                ? "Add fabrics via the Fabric Onboarding page to see them here."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
            {state.fabrics.length === 0 && (
              <button className="admin-btn admin-btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/admin/fabric-onboarding")}>
                Go to Fabric Onboarding
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`mp-cards-container ${viewMode === "list" ? "mp-list-view" : ""}`}>
          {filtered.map((fabric) => (
            <FabricCard
              key={fabric.id}
              fabric={fabric}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards fabrics={state.fabrics} categories={state.categories} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Fabric"
        message={
          deleteTarget
            ? deleteTarget.inGroups > 0 || deleteTarget.inMappings > 0
              ? `"${deleteTarget.fabricName}" is used in ${deleteTarget.inGroups} group(s) and ${deleteTarget.inMappings} mapping(s). It's recommended to deactivate instead. Delete anyway?`
              : `Are you sure you want to delete "${deleteTarget.fabricName}" (${deleteTarget.fabricId})? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
