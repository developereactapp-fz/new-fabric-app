import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isDuplicate } from "../../utils/validators";

/**
 * SubCategoryManager — Manages sub-categories for a selected component.
 * Supports Independent and Dependent types.
 * - Independent: global values not tied to parent values.
 * - Dependent: values mapped per parent component value.
 */
export default function SubCategoryManager({ componentId, componentName }) {
  const {
    state,
    addSubCategory, editSubCategory, deleteSubCategory,
    addSubCategoryValue, editSubCategoryValue, deleteSubCategoryValue,
  } = useAdmin();

  const [newSubName, setNewSubName] = useState("");
  const [newSubType, setNewSubType] = useState("independent"); // "independent" | "dependent"
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubType, setEditSubType] = useState("independent");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteKind, setDeleteKind] = useState(""); // "sub" | "subval"

  // Sub-category value form
  const [newValName, setNewValName] = useState("");
  const [newValDefault, setNewValDefault] = useState(false);
  const [selectedParentValId, setSelectedParentValId] = useState(null);
  const [editingValId, setEditingValId] = useState(null);
  const [editValName, setEditValName] = useState("");

  const subCategories = state.subCategories[componentId] || [];
  const parentValues = state.componentValues[componentId] || [];
  const selectedSub = subCategories.find((s) => s.id === selectedSubId);
  const subValues = selectedSubId ? (state.subCategoryValues[selectedSubId] || []) : [];

  // For dependent sub-categories, filter values by selected parent
  const filteredSubValues = useMemo(() => {
    if (!selectedSub) return [];
    if (selectedSub.type === "independent") return subValues;
    if (!selectedParentValId) return [];
    return subValues.filter((sv) => sv.parentValueId === selectedParentValId);
  }, [selectedSub, subValues, selectedParentValId]);

  const existingSubNames = subCategories.map((s) => s.name);
  const existingValNames = filteredSubValues.map((v) => v.valueName);

  // ── Add sub-category ──
  const handleAddSub = () => {
    const name = newSubName.trim();
    if (!name || isDuplicate(name, existingSubNames)) return;
    addSubCategory(componentId, name, newSubType, newSubType === "dependent" ? "parent" : null, 1);
    setNewSubName("");
    setNewSubType("independent");
  };

  // ── Save edit sub-category ──
  const handleSaveEditSub = () => {
    const name = editSubName.trim();
    if (!name) return;
    const others = subCategories.filter((s) => s.id !== editingSubId).map((s) => s.name);
    if (isDuplicate(name, others)) return;
    editSubCategory(componentId, editingSubId, { name, type: editSubType });
    setEditingSubId(null);
  };

  // ── Add sub-category value ──
  const handleAddValue = () => {
    const name = newValName.trim();
    if (!name || isDuplicate(name, existingValNames)) return;
    const parentId = selectedSub?.type === "dependent" ? selectedParentValId : null;
    addSubCategoryValue(selectedSubId, parentId, name, newValDefault);
    setNewValName("");
    setNewValDefault(false);
  };

  // ── Delete confirm ──
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteKind === "sub") {
      deleteSubCategory(componentId, deleteTarget.id);
      if (selectedSubId === deleteTarget.id) setSelectedSubId(null);
    } else {
      deleteSubCategoryValue(selectedSubId, deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  // ── Set default for sub-value ──
  const setSubValueDefault = (valId) => {
    // Un-default siblings, set this one as default
    filteredSubValues.forEach((v) => {
      if (v.id === valId) {
        editSubCategoryValue(selectedSubId, v.id, { isDefault: true });
      } else if (v.isDefault) {
        editSubCategoryValue(selectedSubId, v.id, { isDefault: false });
      }
    });
  };

  if (subCategories.length === 0 && !newSubName) {
    // Show add prompt
  }

  return (
    <div className="admin-card cc-sub-manager">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Sub-Categories for "{componentName}"</h3>
          <p className="admin-card-subtitle">Add sub-categories (e.g., Ticket Pocket, Chest Pocket)</p>
        </div>
        <StatusBadge status="info" label={`${subCategories.length} sub-categories`} size="sm" />
      </div>

      {/* ── Add Sub-Category ── */}
      <div className="cc-sub-add-form">
        <div className="cc-sub-add-row">
          <input
            className="admin-input"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            placeholder="New sub-category name..."
            onKeyDown={(e) => e.key === "Enter" && handleAddSub()}
          />
          <select
            className="admin-select cc-sub-type-select"
            value={newSubType}
            onChange={(e) => setNewSubType(e.target.value)}
          >
            <option value="independent">Independent</option>
            <option value="dependent">Dependent</option>
          </select>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={handleAddSub}
            disabled={!newSubName.trim()}
          >
            Add
          </button>
        </div>
        <p className="cc-sub-type-hint">
          {newSubType === "dependent"
            ? "Values will be configured per-parent-value (e.g., different options for each Pocket style)"
            : "Values are global and not tied to parent component values"}
        </p>
      </div>

      {/* ── Sub-Category List ── */}
      {subCategories.length > 0 && (
        <div className="cc-sub-list">
          {subCategories.map((sub) => (
            <div
              key={sub.id}
              className={`cc-sub-row ${selectedSubId === sub.id ? "selected" : ""}`}
              onClick={() => { setSelectedSubId(sub.id); setSelectedParentValId(null); }}
            >
              {editingSubId === sub.id ? (
                <div className="cc-edit-inline" onClick={(e) => e.stopPropagation()}>
                  <input className="admin-input" value={editSubName} onChange={(e) => setEditSubName(e.target.value)} autoFocus />
                  <select className="admin-select cc-sub-type-select" value={editSubType} onChange={(e) => setEditSubType(e.target.value)}>
                    <option value="independent">Independent</option>
                    <option value="dependent">Dependent</option>
                  </select>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSaveEditSub}>Save</button>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingSubId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="cc-sub-info">
                    <span className="cc-sub-name">{sub.name}</span>
                    <StatusBadge status={sub.type === "dependent" ? "warning" : "active"} label={sub.type} size="xs" />
                    <span className="cc-sub-val-count">{(state.subCategoryValues[sub.id] || []).length} values</span>
                  </div>
                  <div className="cc-sub-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditingSubId(sub.id); setEditSubName(sub.name); setEditSubType(sub.type); }}>Edit</button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { setDeleteTarget(sub); setDeleteKind("sub"); }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Category Value Manager ── */}
      {selectedSub && (
        <div className="cc-subval-section">
          <div className="cc-subval-header">
            <h4>
              Values for "{selectedSub.name}" 
              <span style={{ fontSize: "0.85em", color: "var(--text-tertiary)", marginLeft: "8px", fontWeight: "normal" }}>
                (Parent: {componentName})
              </span>
            </h4>
            <StatusBadge status={selectedSub.type === "dependent" ? "warning" : "active"} label={selectedSub.type} size="xs" />
          </div>

          {/* Parent value selector for dependent type */}
          {selectedSub.type === "dependent" && (
            <div className="cc-parent-selector">
              <label className="admin-label">Select Parent "{componentName}" Value</label>
              {parentValues.length === 0 ? (
                <p className="cc-sub-type-hint">No parent values exist. Add values to "{componentName}" first.</p>
              ) : (
                <div className="cc-parent-chips">
                  {parentValues.map((pv) => {
                    const pvSubVals = subValues.filter((sv) => sv.parentValueId === pv.id);
                    return (
                      <button
                        key={pv.id}
                        className={`cc-parent-chip ${selectedParentValId === pv.id ? "selected" : ""}`}
                        onClick={() => setSelectedParentValId(pv.id)}
                      >
                        <span className="cc-parent-chip-name">{pv.valueName}</span>
                        <span className="cc-parent-chip-count">{pvSubVals.length} opts</span>
                        {pv.isDefault && <span className="cc-parent-chip-default">★</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Value add form (show for independent always, for dependent only when parent selected) */}
          {(selectedSub.type === "independent" || selectedParentValId) && (
            <>
              <div className="cc-add-value-row" style={{ marginTop: 12 }}>
                <input
                  className="admin-input"
                  value={newValName}
                  onChange={(e) => setNewValName(e.target.value)}
                  placeholder={`New ${selectedSub.name} option...`}
                  onKeyDown={(e) => e.key === "Enter" && handleAddValue()}
                />
                <label className="cc-default-check">
                  <input type="checkbox" checked={newValDefault} onChange={(e) => setNewValDefault(e.target.checked)} />
                  <span>Default</span>
                </label>
                <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddValue} disabled={!newValName.trim()}>Add</button>
              </div>

              {/* Value list */}
              <div className="cc-subval-list">
                {filteredSubValues.length === 0 ? (
                  <div className="admin-empty" style={{ padding: 16 }}>
                    <p>No values yet{selectedSub.type === "dependent" ? ` for this parent` : ""}</p>
                  </div>
                ) : (
                  filteredSubValues.map((val) => (
                    <div key={val.id} className={`cc-value-row ${val.isDefault ? "is-default" : ""}`}>
                      {editingValId === val.id ? (
                        <div className="cc-edit-inline">
                          <input className="admin-input" value={editValName} onChange={(e) => setEditValName(e.target.value)} autoFocus />
                          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => { editSubCategoryValue(selectedSubId, val.id, { valueName: editValName.trim() }); setEditingValId(null); }}>Save</button>
                          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingValId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div className="cc-value-info">
                            <span className="cc-value-name">{val.valueName}</span>
                            {val.isDefault && <StatusBadge status="default" label="Default" size="xs" />}
                          </div>
                          <div className="cc-value-actions">
                            {!val.isDefault && filteredSubValues.length > 1 && (
                              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setSubValueDefault(val.id)}>Set Default</button>
                            )}
                            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditingValId(val.id); setEditValName(val.valueName); }}>Edit</button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { setDeleteTarget(val); setDeleteKind("subval"); }}>Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name || deleteTarget?.valueName}"?`}
        message={
          deleteKind === "sub"
            ? "All values and dependency mappings under this sub-category will be removed."
            : "This sub-category value will be permanently removed."
        }
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
