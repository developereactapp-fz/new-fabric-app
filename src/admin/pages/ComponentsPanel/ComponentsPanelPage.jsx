import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import { adminService } from "../../../services/adminService";
import useFilteredList from "../../hooks/useFilteredList";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FilterToolbar from "../../components/FilterToolbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/Toast";
import SummaryCards from "./SummaryCards";
import ComponentCard from "./ComponentCard";
import { getPublicAssetUrl } from "../../utils/assetUtils";
import "./ComponentsPanel.css";

export default function ComponentsPanelPage() {
  const { actions } = useAdmin();
  const navigate = useNavigate();

  // ── Data Fetching States ──
  const [productTrees, setProductTrees] = useState([]);
  const [fabricsList, setFabricsList] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);

  // ── Local UI States ──
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // component to delete

  // ── Drawer States ──
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [mappings, setMappings] = useState({}); // { [partTypeId]: { availability: [], loaded: false, loading: false } }
  const [expandedValueId, setExpandedValueId] = useState(null);
  const [mappingActionLoading, setMappingActionLoading] = useState(false);

  // ── Fetch All Catalog Products, Trees & Fabrics on Mount ──
  const fetchData = useCallback(async () => {
    setGlobalLoading(true);
    try {
      // 1. Fetch fabrics
      const fabricsRes = await adminService.getFabrics({ limit: 100 });
      const fabrics = fabricsRes.data?.data || fabricsRes.data || [];
      setFabricsList(fabrics);

      // 2. Fetch products
      const productsRes = await adminService.getProducts();
      const products = productsRes.data?.data || productsRes.data || [];

      // 3. Fetch product trees
      const treesRes = await Promise.allSettled(
        products.map((p) => adminService.getProductTree(p.id))
      );

      const trees = [];
      treesRes.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          trees.push({
            tree: result.value.data?.data || result.value.data || {},
            product: products[idx],
          });
        }
      });
      setProductTrees(trees);
    } catch (err) {
      console.error("Failed to load catalog data:", err);
      setToast("Failed to load catalog components.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Flatten & Enrich Components (Catalog Parts) ──
  const allComponents = useMemo(() => {
    const list = [];
    productTrees.forEach(({ tree, product }) => {
      const parts = tree.parts || [];
      parts.forEach((part) => {
        const types = part.types || [];
        list.push({
          id: part.id,
          name: part.name,
          productId: product.id,
          productName: product.name,
          categoryName: product.category?.name || "Unknown Product",
          isActive: part.isActive !== false,
          status: part.isActive !== false ? "active" : "inactive",
          values: types,
          valueCount: types.length,
          activeValueCount: types.filter((t) => t.isActive !== false).length,
        });
      });
    });
    return list;
  }, [productTrees]);

  // ── Build categories for filtering & metrics ──
  const categoriesList = useMemo(() => {
    const uniqNames = new Set(allComponents.map((c) => c.categoryName));
    return [...uniqNames].map((name) => ({ id: name, name }));
  }, [allComponents]);

  // ── Filtering Logic ──
  const {
    filtered: displayedComponents,
    search: searchValue,
    setSearch: onSearchChange,
    filterValues,
    setFilter,
  } = useFilteredList(allComponents, {
    searchFields: ["name", "id", "categoryName", "productName"],
    filters: {
      status: { default: "all", match: (item, val) => item.status === val },
      category: { default: "all", match: (item, val) => item.categoryName === val },
    },
  });

  const filterConfigs = useMemo(
    () => [
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
        options: categoriesList.map((c) => ({ value: c.name, label: c.name })),
        value: filterValues.category,
        onChange: (val) => setFilter("category", val),
      },
    ],
    [categoriesList, filterValues, setFilter]
  );

  // ── Component Active status toggle ──
  const handleToggleStatus = useCallback(
    async (productId, partId) => {
      const comp = allComponents.find((c) => c.id === partId);
      if (!comp) return;
      const newStatus = !comp.isActive;
      try {
        await adminService.updatePart(partId, { isActive: newStatus });
        fetchData();
        setToast(`Component marked as ${newStatus ? "active" : "inactive"}`);
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        console.error("Failed to toggle component status:", err);
        setToast("Failed to update status.");
        setTimeout(() => setToast(null), 3000);
      }
    },
    [allComponents, fetchData]
  );

  // ── Component Delete ──
  const handleDeleteConfirm = useCallback(async () => {
    if (confirmDelete) {
      try {
        await adminService.deletePart(confirmDelete.id);
        fetchData();
        setToast("Component deleted successfully.");
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        console.error("Failed to delete component:", err);
        setToast("Failed to delete component.");
        setTimeout(() => setToast(null), 3000);
      }
    }
    setConfirmDelete(null);
  }, [confirmDelete, fetchData]);

  // ── Open Drawer and Fetch Mappings ──
  const handleOpenDrawer = useCallback(
    async (comp) => {
      setSelectedComponent(comp);
      setExpandedValueId(null);
      const initialMappings = {};
      comp.values.forEach((v) => {
        initialMappings[v.id] = { availability: [], loaded: false, loading: true };
      });
      setMappings(initialMappings);

      try {
        const results = await Promise.allSettled(
          comp.values.map((v) => adminService.getMappingByPart(v.id))
        );

        const newMappings = {};
        comp.values.forEach((v, idx) => {
          const result = results[idx];
          if (result.status === "fulfilled") {
            const data = result.value.data?.data || result.value.data || {};
            newMappings[v.id] = {
              availability: data.availability || [],
              loaded: true,
              loading: false,
            };
          } else {
            newMappings[v.id] = { availability: [], loaded: true, loading: false };
          }
        });
        setMappings(newMappings);
      } catch (err) {
        console.error("Failed to load mappings:", err);
      }
    },
    []
  );

  // ── Toggle Individual Fabric Mapping ──
  const handleToggleFabricMapping = async (partTypeId, fabricId, currentChecked) => {
    setMappingActionLoading(true);
    const newChecked = !currentChecked;

    // Optimistic update
    setMappings((prev) => {
      const entry = prev[partTypeId] || { availability: [] };
      const exists = entry.availability.some((a) => a.fabricId === fabricId);
      let updatedAvail = [];
      if (exists) {
        updatedAvail = entry.availability.map((a) =>
          a.fabricId === fabricId ? { ...a, isChecked: newChecked } : a
        );
      } else {
        updatedAvail = [...entry.availability, { fabricId, isChecked: newChecked }];
      }
      return {
        ...prev,
        [partTypeId]: { ...entry, availability: updatedAvail },
      };
    });

    try {
      await adminService.createMapping({
        fabricId,
        partTypeId,
        isChecked: newChecked,
      });
    } catch (err) {
      console.error("Failed to save mapping:", err);
      setToast("Failed to save mapping.");
      setTimeout(() => setToast(null), 3000);
      // Revert mapping
      setMappings((prev) => {
        const entry = prev[partTypeId] || { availability: [] };
        const updatedAvail = entry.availability.map((a) =>
          a.fabricId === fabricId ? { ...a, isChecked: currentChecked } : a
        );
        return {
          ...prev,
          [partTypeId]: { ...entry, availability: updatedAvail },
        };
      });
    } finally {
      setMappingActionLoading(false);
    }
  };

  // ── Toggle Master Switch (Main Switch) for a Component Value ──
  const handleToggleMasterSwitch = async (partTypeId, isCurrentlyOn) => {
    setMappingActionLoading(true);
    const targetChecked = !isCurrentlyOn;

    // Optimistic update all fabrics
    setMappings((prev) => {
      const entry = prev[partTypeId] || { availability: [] };
      const updatedAvail = fabricsList.map((f) => {
        const existing = entry.availability.find((a) => a.fabricId === f.id);
        return {
          id: existing?.id,
          fabricId: f.id,
          isChecked: targetChecked,
        };
      });
      return {
        ...prev,
        [partTypeId]: { ...entry, availability: updatedAvail },
      };
    });

    try {
      // Parallel API calls to update mappings for all fabrics
      await Promise.all(
        fabricsList.map((f) =>
          adminService.createMapping({
            fabricId: f.id,
            partTypeId,
            isChecked: targetChecked,
          })
        )
      );
      setToast(`Mapping status updated for all fabrics.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Failed to save master mappings:", err);
      setToast("Failed to save master mappings.");
      setTimeout(() => setToast(null), 3000);
      // Reload mappings from server to ensure state consistency
      handleOpenDrawer(selectedComponent);
    } finally {
      setMappingActionLoading(false);
    }
  };

  return (
    <div className="cp-page">
      {/* Header */}
      <div className="cp-header">
        <div className="cp-header-left">
          <PageHeader
            title="Components Panel"
            subtitle="Overview and management of all components across categories."
          />
          <span className="cp-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
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

      {globalLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "64px" }}>
          <p style={{ color: "#64748b" }}>⏳ Loading catalog components...</p>
        </div>
      ) : (
        <>
          {/* Summary Metrics */}
          <SummaryCards components={allComponents} categories={categoriesList} />

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
                  onEdit={() => handleOpenDrawer(comp)} // Opens mapping detail drawer
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
                searchValue || Object.values(filterValues).some((v) => v !== "all")
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "No components have been added yet. Head to the Category & Components configurator to add some."
              }
            />
          )}
        </>
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

      {/* Slide-over detail drawer for mapping management */}
      {selectedComponent && (
        <div className="cp-drawer-overlay" onClick={() => setSelectedComponent(null)}>
          <div className="cp-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cp-drawer-header">
              <div>
                <h2>{selectedComponent.name}</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                  Product: {selectedComponent.productName} ({selectedComponent.categoryName})
                </p>
              </div>
              <button className="cp-drawer-close" onClick={() => setSelectedComponent(null)}>
                &times;
              </button>
            </div>

            <div className="cp-drawer-body">
              <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                Component Values
              </h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#64748b" }}>
                Manage mapping and fabric availability for individual values.
              </p>

              {selectedComponent.values.length === 0 ? (
                <p style={{ fontStyle: "italic", color: "#94a3b8" }}>No values added to this component.</p>
              ) : (
                selectedComponent.values.map((val) => {
                  const mappingEntry = mappings[val.id] || { availability: [], loaded: false, loading: true };
                  const activeFabrics = mappingEntry.availability.filter((a) => a.isChecked);
                  const activeCount = activeFabrics.length;
                  const isExpanded = expandedValueId === val.id;

                  // Main Switch is ON if any fabric is checked
                  const isMasterOn = activeCount > 0;

                  return (
                    <div key={val.id} className="cp-value-item">
                      {/* Header Row */}
                      <div
                        className="cp-value-header"
                        onClick={() => setExpandedValueId(isExpanded ? null : val.id)}
                      >
                        <div className="cp-value-header-left">
                          <span className="cp-value-title">{val.name}</span>
                          {mappingEntry.loading ? (
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Loading...</span>
                          ) : (
                            <span className="cp-value-count">
                              Mapped to {activeCount} fabric{activeCount !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="cp-value-header-right" onClick={(e) => e.stopPropagation()}>
                          {/* Master Main Switch */}
                          <label className="cp-toggle" title={isMasterOn ? "Disable for all fabrics" : "Enable for all fabrics"}>
                            <input
                              type="checkbox"
                              checked={isMasterOn}
                              disabled={mappingEntry.loading || mappingActionLoading}
                              onChange={() => handleToggleMasterSwitch(val.id, isMasterOn)}
                            />
                            <span className="cp-toggle-slider" />
                          </label>

                          <svg
                            className={`cp-chevron-icon ${isExpanded ? "open" : ""}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            onClick={() => setExpandedValueId(isExpanded ? null : val.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>

                      {/* Expanded Fabrics List */}
                      {isExpanded && (
                        <div className="cp-fabric-list">
                          {mappingEntry.loading ? (
                            <p style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", padding: "12px" }}>
                              ⏳ Loading fabric list...
                            </p>
                          ) : (
                            (() => {
                              const mappedFabrics = fabricsList.filter((fab) => {
                                const match = mappingEntry.availability.find((a) => a.fabricId === fab.id);
                                return !!match?.isChecked;
                              });

                              if (mappedFabrics.length === 0) {
                                return (
                                  <p style={{ color: "#94a3b8", fontSize: "12px", fontStyle: "italic", padding: "12px", textAlign: "center" }}>
                                    No fabrics mapped to this component value.
                                  </p>
                                );
                              }

                              return mappedFabrics.map((fab) => {
                                const match = mappingEntry.availability.find((a) => a.fabricId === fab.id);
                                const isChecked = !!match?.isChecked;
                                const fabImage = getPublicAssetUrl(fab.assetId || fab.asset?.id) || fab.image || fab.imageUrl || fab.asset?.url || null;

                                return (
                                  <div key={fab.id} className="cp-fabric-row">
                                    <div className="cp-fabric-info">
                                      {fabImage ? (
                                        <img src={fabImage} alt={fab.fabricName} className="cp-fabric-thumbnail" />
                                      ) : (
                                        <div
                                          className="cp-fabric-thumbnail"
                                          style={{ background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#94a3b8" }}
                                        >
                                          No Img
                                        </div>
                                      )}
                                      <div className="cp-fabric-details">
                                        <span className="cp-fabric-name">{fab.fabricName}</span>
                                        <span className="cp-fabric-code">{fab.fabricId}</span>
                                      </div>
                                    </div>

                                    <label className="cp-toggle" title={isChecked ? "Disable mapping" : "Enable mapping"}>
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={mappingActionLoading}
                                        onChange={() => handleToggleFabricMapping(val.id, fab.id, isChecked)}
                                      />
                                      <span className="cp-toggle-slider" />
                                    </label>
                                  </div>
                                );
                              });
                            })()
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
