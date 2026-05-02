import { useMemo } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import { useNavigate } from "react-router-dom";
import useFilteredList from "../../hooks/useFilteredList";
import PageHeader from "../../components/PageHeader";
import FilterToolbar from "../../components/FilterToolbar";
import EmptyState from "../../components/EmptyState";
import FabricCard from "./FabricCard";
import SummaryCards from "./SummaryCards";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useState } from "react";
import "./MaterialsPanel.css";

export default function MaterialsPanelPage() {
  const { state, toggleStatus, deleteFabric } = useAdmin();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Extract unique filter values
  const materials = useMemo(() => {
    const set = new Set(state.fabrics.map((f) => f.material).filter(Boolean));
    return [...set].sort();
  }, [state.fabrics]);

  const colors = useMemo(() => {
    const set = new Set(state.fabrics.map((f) => f.color).filter(Boolean));
    return [...set].sort();
  }, [state.fabrics]);

  const {
    filtered,
    search,
    setSearch,
    filterValues,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useFilteredList(state.fabrics, {
    searchFields: ["fabricId", "fabricName", "material", "color", "pattern"],
    filters: {
      status: { default: "all", match: (item, val) => item.status === val },
      material: { default: "all", match: (item, val) => item.material === val },
      color: { default: "all", match: (item, val) => item.color === val },
    },
  });

  const handleToggle = (fabricId) => {
    toggleStatus("fabrics", fabricId);
  };

  const handleEdit = (fabricId) => {
    navigate("/admin/fabric-onboarding", { state: { editFabricId: fabricId } });
  };

  const handleDeleteClick = (fabric) => {
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter definitions for FilterToolbar
  const toolbarFilters = [
    {
      key: "status",
      label: "Status",
      type: "chips",
      options: [
        { value: "all", label: "All" },
        { value: "active", label: "✓ Active" },
        { value: "inactive", label: "✗ Inactive" },
      ],
      value: filterValues.status,
      onChange: (val) => setFilter("status", val),
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      options: materials,
      value: filterValues.material,
      onChange: (val) => setFilter("material", val),
    },
    {
      key: "color",
      label: "Color",
      type: "select",
      options: colors,
      value: filterValues.color,
      onChange: (val) => setFilter("color", val),
    },
  ];

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

      {/* Toolbar with filters */}
      <FilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search fabrics by ID, name, material, color..."
        filters={toolbarFilters}
        resultCount={filtered.length}
        totalCount={state.fabrics.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Fabric Cards Grid */}
      {filtered.length === 0 ? (
        <div className="admin-card">
          <EmptyState
            icon={
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            }
            heading={state.fabrics.length === 0 ? "No Fabrics Yet" : "No Matching Fabrics"}
            message={
              state.fabrics.length === 0
                ? "Add fabrics via the Fabric Onboarding page to see them here."
                : "Try adjusting your search or filters to find what you're looking for."
            }
            actionLabel={state.fabrics.length === 0 ? "Go to Fabric Onboarding" : undefined}
            onAction={state.fabrics.length === 0 ? () => navigate("/admin/fabric-onboarding") : undefined}
          />
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
