import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import useFilteredList from "../../hooks/useFilteredList";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FilterToolbar from "../../components/FilterToolbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/Toast";
import SummaryCards from "./SummaryCards";
import ComponentCard from "./ComponentCard";
import "./ComponentsPanel.css";

export default function ComponentsPanelPage() {
  const { state, updateComponent, deleteComponent } = useAdmin();
  const navigate = useNavigate();

  // ── Local State ──
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // component to delete

  // ── Flatten & Enrich Components ──
  const allComponents = useMemo(() => {
    return Object.values(state.components).flat().map(comp => {
      const category = state.categories.find(c => c.id === comp.categoryId);
      const values = state.componentValues[comp.id] || [];
      return {
        ...comp,
        categoryName: category ? category.name : "Unknown Category",
        valueCount: values.length,
        activeValueCount: values.filter(v => v.status === "active").length,
      };
    });
  }, [state.components, state.categories, state.componentValues]);

  // ── Filtering Logic ──
  const {
    filtered: displayedComponents,
    search: searchValue,
    setSearch: onSearchChange,
    filterValues,
    setFilter,
  } = useFilteredList(allComponents, {
    searchFields: ["name", "id", "categoryName"],
    filters: {
      status: { default: "all", match: (item, val) => item.status === val },
      category: { default: "all", match: (item, val) => item.categoryName === val },
    }
  });

  const filterConfigs = useMemo(() => [
    {
      key: "status",
      label: "Status",
      type: "chips",
      options: [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      value: filterValues.status,
      onChange: (val) => setFilter("status", val),
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: state.categories.map(c => ({ value: c.name, label: c.name })),
      value: filterValues.category,
      onChange: (val) => setFilter("category", val),
    }
  ], [state.categories, filterValues, setFilter]);

  // ── Handlers ──
  const handleToggleStatus = useCallback(
    (categoryId, componentId) => {
      const comp = allComponents.find(c => c.id === componentId);
      if (!comp) return;
      const newStatus = comp.status === "active" ? "inactive" : "active";
      updateComponent(categoryId, componentId, { status: newStatus });
      setToast(`Component marked as ${newStatus}`);
      setTimeout(() => setToast(null), 3000);
    },
    [allComponents, updateComponent]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (confirmDelete) {
      deleteComponent(confirmDelete.categoryId, confirmDelete.id);
      setToast("Component deleted successfully.");
      setTimeout(() => setToast(null), 3000);
    }
    setConfirmDelete(null);
  }, [confirmDelete, deleteComponent]);

  return (
    <div className="cp-page">
      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-left">
          <PageHeader
            title="Components Panel"
            subtitle="Overview and management of all components across categories."
          />
          <span className="cp-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="cp-header-right">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => navigate("/admin/category-configurator")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Component
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <SummaryCards components={allComponents} categories={state.categories} />

      {/* Toolbar */}
      <div style={{ marginTop: 24 }}>
        <FilterToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search components..."
          filters={filterConfigs}
          resultCount={displayedComponents.length}
          totalCount={allComponents.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Components Grid/List */}
      {displayedComponents.length > 0 ? (
        <div className={`cp-cards-container ${viewMode === "list" ? "cp-list-view" : ""}`}>
          {displayedComponents.map((comp) => (
            <ComponentCard
              key={comp.id}
              component={comp}
              onToggle={handleToggleStatus}
              onEdit={() => navigate(`/admin/category-configurator?category=${comp.categoryId}&component=${comp.id}`)}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          }
          heading="No components found"
          message={
            searchValue || Object.values(filterValues).some(v => v !== "all")
              ? "Try adjusting your search or filters to find what you're looking for."
              : "No components have been added yet. Head to the Category & Components configurator to add some."
          }
        />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Component"
          message={
            <>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone and will remove all associated component values.
            </>
          }
          confirmLabel="Delete Component"
          isDestructive={true}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
