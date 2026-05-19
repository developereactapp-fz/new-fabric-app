import { useState, useEffect } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";

/**
 * ComponentManager
 *
 * Manages "Components" (Catalog Parts) and "Component Values" (Catalog Part Types)
 * for the auto-selected Product.
 *
 * Props:
 *   categoryId, categoryName — the selected category
 *   productId — the auto-selected product
 *   components — the parts for this product
 *   selectedComponentId, onSelectComponent — part selection
 */
export default function ComponentManager({
  categoryId,
  categoryName,
  productId,
  components,
  selectedComponentId,
  onSelectComponent,
}) {
  const {
    state,
    addProductPart,
    editCatalogPart,
    deleteCatalogPart,
    fetchPartTypes,
    addCatalogType,
    editCatalogType,
    deleteCatalogType,
  } = useAdmin();

  // Component (Part) form state
  const [newCompName, setNewCompName] = useState("");
  const [editingCompId, setEditingCompId] = useState(null);
  const [editCompName, setEditCompName] = useState("");

  // Value (Part Type) form state
  const [newValueName, setNewValueName] = useState("");
  const [editingValueId, setEditingValueId] = useState(null);
  const [editValueName, setEditValueName] = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "component" | "value"

  // Fetch Part Types when a Component is selected
  useEffect(() => {
    if (selectedComponentId) {
      fetchPartTypes(selectedComponentId);
    }
  }, [selectedComponentId, fetchPartTypes]);

  const componentValues = (state.catalogPartTypes || []).filter(
    (pt) => pt.partId === selectedComponentId
  );

  // ── Component Handlers ──
  const handleAddComponent = () => {
    const name = newCompName.trim();
    if (!name || !productId) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    addProductPart(productId, { name, slug, isRequired: false, isActive: true });
    setNewCompName("");
  };

  const handleSaveComponentEdit = () => {
    const name = editCompName.trim();
    if (!name) return;
    editCatalogPart(editingCompId, { name });
    setEditingCompId(null);
  };

  const toggleComponentActive = (comp) => {
    editCatalogPart(comp.id, { isActive: !comp.isActive });
  };

  // ── Value Handlers ──
  const handleAddValue = () => {
    const name = newValueName.trim();
    if (!name || !selectedComponentId) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    addCatalogType(selectedComponentId, { name, slug, isDefault: false, isActive: true });
    setNewValueName("");
  };

  const handleSaveValueEdit = () => {
    const name = editValueName.trim();
    if (!name) return;
    editCatalogType(editingValueId, { name });
    setEditingValueId(null);
  };

  const toggleValueDefault = (val) => {
    editCatalogType(val.id, { isDefault: !val.isDefault });
  };

  const toggleValueActive = (val) => {
    editCatalogType(val.id, { isActive: !val.isActive });
  };

  // ── Delete Confirm ──
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteType === "component") {
      deleteCatalogPart(deleteTarget.id);
      if (selectedComponentId === deleteTarget.id) onSelectComponent(null);
    } else {
      deleteCatalogType(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  return (
    <>
      {/* ═══ COMPONENTS SECTION ═══ */}
      <div className="cc-section">
        <div className="cc-section-header">
          <div className="cc-section-title">COMPONENTS</div>
          <StatusBadge status="info" label={`${components.length} components`} size="sm" />
        </div>
        
        <div className="cc-form-group">
          <div className="cc-input-row">
            <input
              className="cc-input"
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              placeholder="e.g. Collar, Cuff"
              onKeyDown={(e) => e.key === "Enter" && handleAddComponent()}
            />
            <button
              className="cc-btn cc-btn-primary"
              onClick={handleAddComponent}
              disabled={!newCompName.trim()}
            >
              + Add
            </button>
          </div>
        </div>

        <div className="cc-component-list">
          {components.length === 0 ? (
            <div className="cc-empty-text">No components added yet</div>
          ) : (
            components.map((comp) => (
              <div
                key={comp.id}
                className={`cc-list-item ${selectedComponentId === comp.id ? "selected" : ""}`}
                onClick={() => onSelectComponent(comp.id)}
              >
                {editingCompId === comp.id ? (
                  <div className="cc-edit-inline" onClick={(e) => e.stopPropagation()}>
                    <input
                      className="cc-input"
                      value={editCompName}
                      onChange={(e) => setEditCompName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveComponentEdit()}
                    />
                    <button className="cc-btn cc-btn-primary" onClick={handleSaveComponentEdit}>Save</button>
                    <button className="cc-btn cc-btn-ghost" onClick={() => setEditingCompId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="cc-list-item-info">
                      <span className="cc-list-item-name">{comp.name}</span>
                      {comp.isActive === false && <span className="cc-badge-inactive">Inactive</span>}
                    </div>
                    <div className="cc-list-item-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="cc-btn-text" onClick={() => toggleComponentActive(comp)}>
                        {comp.isActive === false ? "Enable" : "Disable"}
                      </button>
                      <button
                        className="cc-btn-text"
                        onClick={() => { setEditingCompId(comp.id); setEditCompName(comp.name); }}
                      >
                        Edit
                      </button>
                      <button
                        className="cc-btn-text text-danger"
                        onClick={() => { setDeleteTarget(comp); setDeleteType("component"); }}
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

      <div className="cc-divider" />

      {/* ═══ COMPONENT VALUES SECTION ═══ */}
      {selectedComponentId && (
        <div className="cc-section">
          <div className="cc-section-header">
            <div className="cc-section-title">COMPONENT VALUES ({selectedComponent?.name})</div>
            <StatusBadge status="info" label={`${componentValues.length} values`} size="sm" />
          </div>

          <div className="cc-form-group">
            <div className="cc-input-row">
              <input
                className="cc-input"
                value={newValueName}
                onChange={(e) => setNewValueName(e.target.value)}
                placeholder="e.g. Classic Collar, Spread Collar"
                onKeyDown={(e) => e.key === "Enter" && handleAddValue()}
              />
              <button
                className="cc-btn cc-btn-primary"
                onClick={handleAddValue}
                disabled={!newValueName.trim()}
              >
                + Add
              </button>
            </div>
          </div>

          <div className="cc-component-list">
            {componentValues.length === 0 ? (
              <div className="cc-empty-text">No values added yet</div>
            ) : (
              componentValues.map((val) => (
                <div key={val.id} className="cc-list-item no-hover">
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
                      <div className="cc-list-item-info">
                        <span className="cc-list-item-name">{val.name}</span>
                        {val.isDefault && <span className="cc-badge-default">Default</span>}
                        {val.isActive === false && <span className="cc-badge-inactive">Inactive</span>}
                      </div>
                      <div className="cc-list-item-actions">
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
                          onClick={() => { setEditingValueId(val.id); setEditValueName(val.name); }}
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
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message={
          deleteType === "component"
            ? "All values under this component will be removed."
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
