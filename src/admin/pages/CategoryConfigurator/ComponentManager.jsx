import { useState } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isDuplicate } from "../../utils/validators";

export default function ComponentManager({ categoryId, categoryName, selectedComponentId, onSelectComponent }) {
  const { state, addComponent, editComponent, deleteComponent, addComponentValue, editComponentValue, deleteComponentValue, setDefaultValue } = useAdmin();
  const [newCompName, setNewCompName] = useState("");
  const [newValName, setNewValName] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [editingCompId, setEditingCompId] = useState(null);
  const [editCompName, setEditCompName] = useState("");
  const [editingValId, setEditingValId] = useState(null);
  const [editValName, setEditValName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "component" | "value"

  const components = state.components[categoryId] || [];
  const selectedComp = components.find((c) => c.id === selectedComponentId);
  const compValues = selectedComponentId ? (state.componentValues[selectedComponentId] || []) : [];

  // Add component
  const handleAddComp = () => {
    const name = newCompName.trim();
    if (!name || isDuplicate(name, components.map((c) => c.name))) return;
    addComponent(categoryId, name);
    setNewCompName("");
  };

  // Add component value
  const handleAddValue = () => {
    const name = newValName.trim();
    if (!name || !selectedComponentId || isDuplicate(name, compValues.map((v) => v.valueName))) return;
    addComponentValue(selectedComponentId, name, setAsDefault);
    setNewValName("");
    setSetAsDefault(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteType === "component") {
      deleteComponent(categoryId, deleteTarget.id);
      if (selectedComponentId === deleteTarget.id) onSelectComponent(null);
    } else {
      deleteComponentValue(selectedComponentId, deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <>
      {/* Component List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Components for "{categoryName}"</h3>
            <p className="admin-card-subtitle">Add components like Collar, Cuff, Placket, etc.</p>
          </div>
        </div>

        <div className="cc-add-row">
          <input className="admin-input" value={newCompName} onChange={(e) => setNewCompName(e.target.value)} placeholder="New component name..." onKeyDown={(e) => e.key === "Enter" && handleAddComp()} />
          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddComp} disabled={!newCompName.trim()}>Add</button>
        </div>

        <div className="cc-component-grid">
          {components.length === 0 ? (
            <div className="admin-empty" style={{ padding: 16 }}><p>No components yet</p></div>
          ) : (
            components.map((comp) => (
              <div
                key={comp.id}
                className={`cc-comp-chip ${selectedComponentId === comp.id ? "selected" : ""}`}
                onClick={() => onSelectComponent(comp.id)}
              >
                {editingCompId === comp.id ? (
                  <div className="cc-edit-inline" onClick={(e) => e.stopPropagation()}>
                    <input className="admin-input" value={editCompName} onChange={(e) => setEditCompName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && (() => { editComponent(categoryId, editingCompId, { name: editCompName.trim() }); setEditingCompId(null); })()} />
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => { editComponent(categoryId, editingCompId, { name: editCompName.trim() }); setEditingCompId(null); }}>Save</button>
                    <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingCompId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="cc-comp-name">{comp.name}</span>
                    <span className="cc-comp-values-count">{(state.componentValues[comp.id] || []).length} values</span>
                    <div className="cc-comp-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditingCompId(comp.id); setEditCompName(comp.name); }}>Edit</button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { setDeleteTarget(comp); setDeleteType("component"); }}>×</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Component Values */}
      {selectedComp && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Values for "{selectedComp.name}"</h3>
              <p className="admin-card-subtitle">Add options. One must be the default.</p>
            </div>
            <StatusBadge status="info" label={`${compValues.length} values`} size="sm" />
          </div>

          <div className="cc-add-value-row">
            <input className="admin-input" value={newValName} onChange={(e) => setNewValName(e.target.value)} placeholder={`New ${selectedComp.name} value...`} onKeyDown={(e) => e.key === "Enter" && handleAddValue()} />
            <label className="cc-default-check">
              <input type="checkbox" checked={setAsDefault} onChange={(e) => setSetAsDefault(e.target.checked)} />
              <span>Set as Default</span>
            </label>
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAddValue} disabled={!newValName.trim()}>Add</button>
          </div>

          <div className="cc-values-list">
            {compValues.length === 0 ? (
              <div className="admin-empty" style={{ padding: 16 }}><p>No values yet</p></div>
            ) : (
              compValues.map((val) => (
                <div key={val.id} className={`cc-value-row ${val.isDefault ? "is-default" : ""}`}>
                  {editingValId === val.id ? (
                    <div className="cc-edit-inline">
                      <input className="admin-input" value={editValName} onChange={(e) => setEditValName(e.target.value)} autoFocus />
                      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => { editComponentValue(selectedComponentId, val.id, { valueName: editValName.trim() }); setEditingValId(null); }}>Save</button>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingValId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="cc-value-info">
                        <span className="cc-value-name">{val.valueName}</span>
                        {val.isDefault && <StatusBadge status="default" label="Default" size="xs" />}
                        <StatusBadge status={val.status} size="xs" />
                      </div>
                      <div className="cc-value-actions">
                        {!val.isDefault && (
                          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDefaultValue(selectedComponentId, val.id)}>Set Default</button>
                        )}
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditingValId(val.id); setEditValName(val.valueName); }}>Edit</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { setDeleteTarget(val); setDeleteType("value"); }}>Delete</button>
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
        title={`Delete "${deleteTarget?.name || deleteTarget?.valueName}"?`}
        message={deleteType === "component" ? "All values under this component will be removed." : "This value will be permanently removed."}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
