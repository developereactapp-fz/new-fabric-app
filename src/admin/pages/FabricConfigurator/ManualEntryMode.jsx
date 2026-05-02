import { useState, useMemo } from "react";
import axios from "axios";
import { useAdmin } from "../../store/adminStore.jsx";

const API = import.meta.env.VITE_API_URL || "https://apperal-clothing-app-production.up.railway.app";
import SearchInput from "../../components/SearchInput";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isDuplicate, validateName } from "../../utils/validators";

import { ATTRIBUTES } from "../../config/appConfig";

export default function ManualEntryMode({ category }) {
  const { state, addAttributeValue, editAttributeValue, deleteAttributeValue } = useAdmin();
  const [selectedAttr, setSelectedAttr] = useState(ATTRIBUTES[0]);
  const [search, setSearch] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const catAttrs = state.attributes[category] || {};
  const attrValues = catAttrs[selectedAttr] || [];

  const filteredValues = useMemo(() => {
    if (!search) return attrValues;
    const q = search.toLowerCase();
    return attrValues.filter((v) => v.value.toLowerCase().includes(q));
  }, [attrValues, search]);

  const existingNames = attrValues.map((v) => v.value);

  // Add value
  const handleAdd = async () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    if (isDuplicate(trimmed, existingNames)) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${API}/api/attributes`, {
        name: trimmed,
        value: trimmed,
        attribute: selectedAttr,
        category: category,
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-slug": "test-tenant"
        }
      });
    } catch (err) {
      console.error("Failed to save attribute to server", err);
      alert(err.response?.data?.message || "Failed to save attribute to server");
      setIsSaving(false);
      return;
    }
    setIsSaving(false);

    addAttributeValue(category, selectedAttr, trimmed);
    // If user selected "inactive" status, update the newly-added value
    if (newStatus === "inactive") {
      // The new value was just appended to the end of the attribute array
      // We need to find it after the next render, so we use a microtask
      setTimeout(() => {
        const updatedVals = state.attributes[category]?.[selectedAttr] || [];
        const lastVal = updatedVals[updatedVals.length - 1];
        if (lastVal && lastVal.value === trimmed) {
          editAttributeValue(category, selectedAttr, lastVal.id, { status: "inactive" });
        }
      }, 0);
    }
    setRecentlyAdded((prev) => [trimmed, ...prev].slice(0, 5));
    setNewValue("");
    setNewStatus("active");
  };

  // Start edit
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.value);
    setEditStatus(item.status);
  };

  // Save edit
  const saveEdit = () => {
    if (!editName.trim()) return;
    const otherNames = attrValues.filter((v) => v.id !== editingId).map((v) => v.value);
    if (isDuplicate(editName.trim(), otherNames)) return;

    editAttributeValue(category, selectedAttr, editingId, {
      value: editName.trim(),
      status: editStatus,
    });
    setEditingId(null);
  };

  // Delete
  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAttributeValue(category, selectedAttr, deleteTarget.id);
    setDeleteTarget(null);
  };

  // Toggle status
  const toggleItemStatus = (item) => {
    editAttributeValue(category, selectedAttr, item.id, {
      status: item.status === "active" ? "inactive" : "active",
    });
  };

  // Validation for new value
  const newValValidation = validateName(newValue);
  const dupCheck = newValue.trim() ? isDuplicate(newValue.trim(), existingNames) : false;

  return (
    <div className="fc-manual">
      <div className="fc-manual-layout">
        {/* Left — Attribute Panel */}
        <div className="admin-card fc-attr-panel">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Attribute Manager</h3>
              <p className="admin-card-subtitle">Select an attribute to manage its values</p>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Select Attribute</label>
            <select
              className="admin-select"
              value={selectedAttr}
              onChange={(e) => { setSelectedAttr(e.target.value); setSearch(""); setEditingId(null); }}
            >
              {ATTRIBUTES.map((a) => (
                <option key={a} value={a}>{a} ({(catAttrs[a] || []).length})</option>
              ))}
            </select>
          </div>

          {/* Current Values */}
          <div className="fc-values-header">
            <span className="fc-values-title">Current Values ({attrValues.length})</span>
            <SearchInput value={search} onChange={setSearch} placeholder={`Search ${selectedAttr}...`} />
          </div>

          <div className="fc-values-list">
            {filteredValues.length === 0 ? (
              <div className="admin-empty" style={{ padding: 24 }}>
                <p>No values found</p>
              </div>
            ) : (
              filteredValues.map((item) => (
                <div key={item.id} className={`fc-value-row ${editingId === item.id ? "editing" : ""}`}>
                  {editingId === item.id ? (
                    /* Edit Mode */
                    <div className="fc-edit-form">
                      <input
                        className="admin-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Edit value name"
                        autoFocus
                      />
                      <div className="fc-edit-status">
                        <label>
                          <input type="radio" name="edit-status" value="active" checked={editStatus === "active"} onChange={() => setEditStatus("active")} />
                          Active
                        </label>
                        <label>
                          <input type="radio" name="edit-status" value="inactive" checked={editStatus === "inactive"} onChange={() => setEditStatus("inactive")} />
                          Inactive
                        </label>
                      </div>
                      <div className="fc-edit-actions">
                        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveEdit}>Save</button>
                        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div className="fc-value-info">
                        <span className="fc-value-name">{item.value}</span>
                        <StatusBadge status={item.status} size="xs" />
                      </div>
                      <div className="fc-value-actions">
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleItemStatus(item)}>
                          {item.status === "active" ? "Disable" : "Enable"}
                        </button>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(item)}>Edit</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(item)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right — Add Value + Live Preview */}
        <div className="fc-right-panel">
          {/* Add Value */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Add New Value</h3>
                <p className="admin-card-subtitle">Add a new {selectedAttr} value</p>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">New Value</label>
              <input
                className="admin-input"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter new ${selectedAttr}...`}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              {newValue.trim() && (
                <p className={dupCheck ? "admin-input-error" : "admin-input-success"}>
                  {dupCheck ? "⚠ Already Exists" : "✓ Available"}
                </p>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Status</label>
              <div style={{ display: "flex", gap: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <input type="radio" value="active" checked={newStatus === "active"} onChange={() => setNewStatus("active")} />
                  Active
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <input type="radio" value="inactive" checked={newStatus === "inactive"} onChange={() => setNewStatus("inactive")} />
                  Inactive
                </label>
              </div>
            </div>

            <button
              className="admin-btn admin-btn-primary"
              onClick={handleAdd}
              disabled={!newValue.trim() || dupCheck || isSaving}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {isSaving ? "Saving..." : `Add ${selectedAttr} Value`}
            </button>
          </div>

          {/* Live Preview */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Live Preview</h3>
                <p className="admin-card-subtitle">{selectedAttr} for {category}</p>
              </div>
            </div>

            {recentlyAdded.length > 0 && (
              <div className="fc-recently-added">
                <span className="fc-recent-label">Recently Added:</span>
                {recentlyAdded.map((v, i) => (
                  <StatusBadge key={i} status="active" label={v} size="sm" />
                ))}
              </div>
            )}

            <div className="fc-preview-stats">
              <div className="fc-preview-stat">
                <span className="fc-preview-stat-value">{attrValues.length}</span>
                <span className="fc-preview-stat-label">Total Values</span>
              </div>
              <div className="fc-preview-stat">
                <span className="fc-preview-stat-value">{attrValues.filter((v) => v.status === "active").length}</span>
                <span className="fc-preview-stat-label">Active</span>
              </div>
              <div className="fc-preview-stat">
                <span className="fc-preview-stat-value">{attrValues.filter((v) => v.status === "inactive").length}</span>
                <span className="fc-preview-stat-label">Inactive</span>
              </div>
            </div>

            <div className="fc-preview-list">
              {attrValues.map((v) => (
                <div key={v.id} className="fc-preview-item">
                  <span>{v.value}</span>
                  <StatusBadge status={v.status} size="xs" />
                </div>
              ))}
              {attrValues.length === 0 && <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", padding: 12 }}>No values yet</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.value}"?`}
        message="This value will be permanently removed."
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <div style={{ marginBottom: 12 }}>
          <button
            className="admin-btn admin-btn-warning admin-btn-sm"
            style={{ width: "100%", justifyContent: "center", background: "#fef3c7", color: "#92400e" }}
            onClick={() => { toggleItemStatus(deleteTarget); setDeleteTarget(null); }}
          >
            Disable Instead (Recommended)
          </button>
        </div>
      </ConfirmDialog>
    </div>
  );
}
