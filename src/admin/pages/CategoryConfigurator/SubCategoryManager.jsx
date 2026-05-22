import { useState, useEffect } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";

/**
 * SubCategoryManager
 *
 * Manages Sub Categories (e.g. Inner Collar, Contrast Details) and their Values
 * for a selected Component (Part). Supports dependent and independent types.
 *
 * Note: Connected to backend subcategory APIs
 */
export default function SubCategoryManager({ componentId, componentName, productId }) {
  const {
    state,
    fetchSubCategories,
    fetchSubCategoryValues,
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
    addSubCategoryValue,
    editSubCategoryValue,
    deleteSubCategoryValue,
  } = useAdmin();

  const [selectedSubId, setSelectedSubId] = useState(null);
  const [selectedParentValId, setSelectedParentValId] = useState("");

  // Sub Category form
  const [newSubName, setNewSubName] = useState("");
  const [newSubType, setNewSubType] = useState("independent"); // "independent" | "dependent"
  const [newSubDependsOn, setNewSubDependsOn] = useState("parent"); // "parent" | "component:<compId>" | "sub-category:<subId>"

  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubName, setEditSubName] = useState("");

  // Sub Category Value form
  const [newValueName, setNewValueName] = useState("");
  const [editingValueId, setEditingValueId] = useState(null);
  const [editValueName, setEditValueName] = useState("");

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "sub" | "value"

  // Fetch subcategories when component changes
  useEffect(() => {
    if (componentId) {
      fetchSubCategories(componentId);
      setSelectedSubId(null);
    }
  }, [componentId, fetchSubCategories]);

  const subCategories = state.subCategories?.[componentId] || [];
  const selectedSub = subCategories.find((s) => s.id === selectedSubId);
  const subCategoryValues = state.subCategoryValues?.[selectedSubId] || [];

  // Get all components (Parts) for this product to support cross-component dependency
  const allComponents = (state.catalogParts || []).filter(
    (p) => p.productId === productId
  );

  // Fetch values for the dependency if the selected subcategory depends on another subcategory
  useEffect(() => {
    if (
      selectedSub?.type === "dependent" &&
      selectedSub?.dependsOn === "sub-category-id" &&
      selectedSub?.dependsOnEntityId
    ) {
      if (!state.subCategoryValues?.[selectedSub.dependsOnEntityId]) {
        fetchSubCategoryValues(selectedSub.dependsOnEntityId);
      }
    }
  }, [selectedSub, state.subCategoryValues, fetchSubCategoryValues]);

  // Get the values that the selected subcategory's options depend on
  const getDependencyParentValues = () => {
    if (!selectedSub || selectedSub.type !== "dependent") return [];

    const dependsOn = selectedSub.dependsOn || "parent";
    const entityId = selectedSub.dependsOnEntityId;

    if (dependsOn === "parent") {
      return (state.catalogPartTypes || []).filter((pt) => pt.partId === componentId);
    }

    if (dependsOn === "component") {
      return (state.catalogPartTypes || []).filter((pt) => pt.partId === entityId);
    }

    if (dependsOn === "sub-category-id") {
      const vals = state.subCategoryValues?.[entityId] || [];
      return vals.map(v => ({ id: v.id, name: v.valueName || v.name }));
    }

    return [];
  };

  const dependencyParentValues = getDependencyParentValues();

  // Auto-select first parent value if the selected subcategory is dependent
  useEffect(() => {
    if (selectedSub?.type === "dependent" && dependencyParentValues.length > 0) {
      if (!selectedParentValId || !dependencyParentValues.some(cv => cv.id === selectedParentValId)) {
        setSelectedParentValId(dependencyParentValues[0].id);
      }
    } else {
      setSelectedParentValId("");
    }
  }, [selectedSub, dependencyParentValues, selectedParentValId]);

  // Fetch subcategory values when selected subcategory or selected parent value changes
  useEffect(() => {
    if (selectedSubId) {
      if (selectedSub?.type === "dependent") {
        if (selectedParentValId) {
          fetchSubCategoryValues(selectedSubId, selectedParentValId);
        }
      } else {
        fetchSubCategoryValues(selectedSubId);
      }
    }
  }, [selectedSubId, selectedSub?.type, selectedParentValId, fetchSubCategoryValues]);

  // ── Sub Category Handlers ──
  const handleAddSubCategory = () => {
    const name = newSubName.trim();
    if (!name) return;

    let dependsOn = "parent";
    let dependsOnEntityId = null;

    if (newSubType === "dependent") {
      if (newSubDependsOn.startsWith("component:")) {
        dependsOn = "component";
        dependsOnEntityId = newSubDependsOn.split(":")[1];
      } else if (newSubDependsOn.startsWith("sub-category:")) {
        dependsOn = "sub-category-id";
        dependsOnEntityId = newSubDependsOn.split(":")[1];
      }
    }

    addSubCategory(componentId, name, newSubType, dependsOn, dependsOnEntityId);
    setNewSubName("");
    setNewSubType("independent");
    setNewSubDependsOn("parent");
  };

  const handleSaveSubEdit = () => {
    const name = editSubName.trim();
    if (!name) return;
    editSubCategory(componentId, editingSubId, { name });
    setEditingSubId(null);
  };

  const toggleSubActive = (sub) => {
    editSubCategory(componentId, sub.id, { isActive: !sub.isActive });
  };

  // ── Sub Category Value Handlers ──
  const handleAddValue = () => {
    const name = newValueName.trim();
    if (!name || !selectedSubId) return;

    const parentId = selectedSub?.type === "dependent" ? selectedParentValId : null;
    addSubCategoryValue(selectedSubId, parentId, name, false);
    setNewValueName("");
  };

  const handleSaveValueEdit = () => {
    const name = editValueName.trim();
    if (!name) return;
    editSubCategoryValue(selectedSubId, editingValueId, { valueName: name });
    setEditingValueId(null);
  };

  const toggleValueDefault = (val) => {
    editSubCategoryValue(selectedSubId, val.id, { isDefault: !val.isDefault });
  };

  const toggleValueActive = (val) => {
    editSubCategoryValue(selectedSubId, val.id, { isActive: !val.isActive });
  };

  // ── Delete Confirm ──
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteType === "sub") {
      deleteSubCategory(componentId, deleteTarget.id);
      if (selectedSubId === deleteTarget.id) setSelectedSubId(null);
    } else {
      deleteSubCategoryValue(selectedSubId, deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="cc-divider" />

      {/* ═══ SUB CATEGORIES SECTION ═══ */}
      <div className="cc-section">
        <div className="cc-section-header">
          <div className="cc-section-title">SUB CATEGORIES FOR "{componentName}"</div>
          <StatusBadge status="info" label={`${subCategories.length} sub-categories`} size="sm" />
        </div>

        <div className="cc-form-group">
          <div className="cc-input-row" style={{ alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <input
                className="cc-input"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. Inner Collar, Contrast Details"
                onKeyDown={(e) => e.key === "Enter" && handleAddSubCategory()}
              />
              <div className="cc-radio-group" style={{ marginTop: "4px" }}>
                <label className="cc-radio-label">
                  <input
                    type="radio"
                    checked={newSubType === "independent"}
                    onChange={() => setNewSubType("independent")}
                  />
                  <span>Independent</span>
                </label>
                <label className="cc-radio-label">
                  <input
                    type="radio"
                    checked={newSubType === "dependent"}
                    onChange={() => setNewSubType("dependent")}
                  />
                  <span>Dependent</span>
                </label>
              </div>

              {newSubType === "dependent" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  <select
                    className="cc-input"
                    value={newSubDependsOn}
                    onChange={(e) => setNewSubDependsOn(e.target.value)}
                    style={{ fontSize: "13px" }}
                  >
                    <option value="parent">Component Values ({componentName})</option>
                    {subCategories.map((s) => (
                      <option key={s.id} value={`sub-category:${s.id}`}>Sub-Category ({s.name})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              className="cc-btn cc-btn-primary"
              style={{ marginTop: "2px" }}
              onClick={handleAddSubCategory}
              disabled={!newSubName.trim()}
            >
              + Add
            </button>
          </div>
        </div>

        <div className="cc-sub-list">
          {state.isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="cc-sub-item cc-skeleton-item" style={{ height: "64px" }}>
                <div className="cc-sub-info" style={{ width: "100%" }}>
                  <div className="cc-skeleton-box" style={{ width: "120px", height: "18px" }}></div>
                  <div className="cc-skeleton-box" style={{ width: "80px", height: "16px", marginLeft: "12px" }}></div>
                </div>
              </div>
            ))
          ) : subCategories.length === 0 ? (
            <div className="cc-empty-text">No sub-categories added yet</div>
          ) : (
            subCategories.map((sub) => (
              <div
                key={sub.id}
                className={`cc-sub-item ${selectedSubId === sub.id ? "selected" : ""}`}
                onClick={() => setSelectedSubId(sub.id)}
              >
                {editingSubId === sub.id ? (
                  <div className="cc-edit-inline" onClick={(e) => e.stopPropagation()}>
                    <input
                      className="cc-input"
                      value={editSubName}
                      onChange={(e) => setEditSubName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveSubEdit()}
                    />
                    <button className="cc-btn cc-btn-primary" onClick={handleSaveSubEdit}>Save</button>
                    <button className="cc-btn cc-btn-ghost" onClick={() => setEditingSubId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="cc-sub-info">
                      <span className="cc-sub-name">{sub.name}</span>
                      <span className="cc-badge-outline">
                        {sub.type === "dependent" ? (
                          <>
                            Dependent ({sub.dependsOn === "parent" ? "Component Values" : sub.dependsOn === "component" ? "Another Component" : "Another Sub-Category"})
                          </>
                        ) : "Independent"}
                      </span>
                      {sub.isActive === false && <span className="cc-badge-inactive">Inactive</span>}
                    </div>
                    <div className="cc-sub-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="cc-btn-text" onClick={() => toggleSubActive(sub)}>
                        {sub.isActive === false ? "Enable" : "Disable"}
                      </button>
                      <button
                        className="cc-btn-text"
                        onClick={() => { setEditingSubId(sub.id); setEditSubName(sub.name); }}
                      >
                        Edit
                      </button>
                      <button
                        className="cc-btn-text text-danger"
                        onClick={() => { setDeleteTarget(sub); setDeleteType("sub"); }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ═══ SUB CATEGORY VALUES SECTION ═══ */}
      {selectedSubId && (
        <>
          <div className="cc-divider" />
          <div className="cc-section">
            <div className="cc-section-header">
              <div className="cc-section-title">VALUES FOR "{selectedSub?.name}"</div>
              <StatusBadge status="info" label={`${subCategoryValues.length} values`} size="sm" />
            </div>

            {selectedSub?.type === "dependent" && dependencyParentValues.length > 0 && (
              <div className="cc-form-group" style={{ marginBottom: "16px", padding: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
                <label className="cc-form-label" style={{ fontWeight: "600", color: "var(--primary-color, #4f46e5)", marginBottom: "6px", display: "block" }}>
                  Configure Options for Dependency Value
                </label>
                <select
                  className="cc-input"
                  value={selectedParentValId}
                  onChange={(e) => setSelectedParentValId(e.target.value)}
                  style={{ width: "100%", background: "var(--bg-card, #1f2937)", color: "var(--text-main, #f3f4f6)" }}
                >
                  <option value="" disabled>-- Select a Dependency Value --</option>
                  {dependencyParentValues.map((cv) => (
                    <option key={cv.id} value={cv.id}>{cv.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedSub?.type === "dependent" && dependencyParentValues.length === 0 && (
              <div style={{ marginBottom: "16px", padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#f87171", fontSize: "13px" }}>
                ⚠️ Please add values first for the selected dependency so you can map dependent subcategory options.
              </div>
            )}

            <div className="cc-form-group">
              <div className="cc-input-row">
                <input
                  className="cc-input"
                  value={newValueName}
                  onChange={(e) => setNewValueName(e.target.value)}
                  placeholder={selectedSub?.type === "dependent" && !selectedParentValId ? "Select a parent option first..." : "e.g. Red, Blue, Contrast White"}
                  onKeyDown={(e) => e.key === "Enter" && handleAddValue()}
                  disabled={selectedSub?.type === "dependent" && !selectedParentValId}
                />
                <button
                  className="cc-btn cc-btn-primary"
                  onClick={handleAddValue}
                  disabled={!newValueName.trim() || (selectedSub?.type === "dependent" && !selectedParentValId)}
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="cc-sub-list">
              {state.isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="cc-sub-item cc-skeleton-item" style={{ height: "64px" }}>
                    <div className="cc-sub-info" style={{ width: "100%" }}>
                      <div className="cc-skeleton-box" style={{ width: "120px", height: "18px" }}></div>
                      <div className="cc-skeleton-box" style={{ width: "80px", height: "16px", marginLeft: "12px" }}></div>
                    </div>
                  </div>
                ))
              ) : subCategoryValues.length === 0 ? (
                <div className="cc-empty-text">No values added yet</div>
              ) : (
                subCategoryValues.map((val) => (
                  <div key={val.id} className="cc-sub-item no-hover">
                    {editingValueId === val.id ? (
                      <div className="cc-edit-inline">
                        <input
                          className="cc-input"
                          value={editValueName}
                          onChange={(e) => setEditValueName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleSaveValueEdit()}
                        />
                        <button className="cc-btn cc-btn-primary" onClick={handleSaveValueEdit}>Save</button>
                        <button className="cc-btn cc-btn-ghost" onClick={() => setEditingValueId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="cc-sub-info">
                          <span className="cc-sub-name">{val.valueName}</span>
                          {val.isDefault && <span className="cc-badge-default">Default</span>}
                          {val.isActive === false && <span className="cc-badge-inactive">Inactive</span>}
                        </div>
                        <div className="cc-sub-actions">
                          <label className="cc-toggle-label">
                            <input
                              type="checkbox"
                              checked={val.isDefault}
                              onChange={() => toggleValueDefault(val)}
                            />
                            Default
                          </label>
                          <button className="cc-btn-text" onClick={() => toggleValueActive(val)}>
                            {val.isActive === false ? "Enable" : "Disable"}
                          </button>
                          <button
                            className="cc-btn-text"
                            onClick={() => { setEditingValueId(val.id); setEditValueName(val.valueName); }}
                          >
                            Edit
                          </button>
                          <button
                            className="cc-btn-text text-danger"
                            onClick={() => { setDeleteTarget(val); setDeleteType("value"); }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name || deleteTarget?.valueName}"?`}
        message={
          deleteType === "sub"
            ? "All values under this sub-category will be removed."
            : "This value will be removed."
        }
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
