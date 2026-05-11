import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService";
import { useAdmin, ACTIONS } from "../../store/adminStore.jsx";


import SearchInput from "../../components/SearchInput";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isDuplicate, validateName } from "../../utils/validators";

import { ATTRIBUTES } from "../../config/appConfig";

export default function ManualEntryMode({ category }) {
  const { state, dispatch, addAttributeValue, editAttributeValue, deleteAttributeValue } = useAdmin();
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
  const [isLoading, setIsLoading] = useState(false);



  // ── GET: fetch values for the currently selected attribute from server ──
  // Runs on mount and whenever category or selectedAttr changes (one request each time).
  const fetchAttributes = useCallback(async (attr, signal) => {
    setIsLoading(true);
    try {
      const res = await adminService.getAttributes({ category: attr });
      const raw = res.data?.data || res.data || [];
      const items = Array.isArray(raw) ? raw : [];
      const values = items.map((item) => ({
        id: item.id,
        value: item.value,
        // API returns isActive (boolean), normalise to status string
        status: item.isActive !== undefined
          ? (item.isActive ? "active" : "inactive")
          : (item.status || "active"),
      }));
      dispatch({
        type: ACTIONS.SET_ATTRIBUTE_VALUES,
        payload: { category, attribute: attr, values },
      });
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return; // ignore aborted requests
      console.error("Failed to fetch attributes", err);
    } finally {
      setIsLoading(false);
    }
  }, [category, dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAttributes(selectedAttr, controller.signal);
  }, [fetchAttributes, selectedAttr]);

  const catAttrs = state.attributes[category] || {};
  const attrValues = catAttrs[selectedAttr] || [];

  const filteredValues = useMemo(() => {
    if (!search) return attrValues;
    const q = search.toLowerCase();
    return attrValues.filter((v) => v.value.toLowerCase().includes(q));
  }, [attrValues, search]);

  const existingNames = attrValues.map((v) => v.value);

  // ── POST: Add value ──
  const handleAdd = async () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    if (isDuplicate(trimmed, existingNames)) return;

    setIsSaving(true);
    try {
      const res = await adminService.createAttribute(
        { category: selectedAttr, value: trimmed, isActive: newStatus === "active" }
      );
      // Use server-returned id so DELETE/PATCH work correctly
      const created = res.data?.data || res.data;
      const serverId = created?.id;
      const catAttrs = { ...(state.attributes[category] || {}) };
      const existing = catAttrs[selectedAttr] || [];
      catAttrs[selectedAttr] = [
        ...existing,
        { id: serverId || String(Date.now()), value: trimmed, status: newStatus },
      ];
      dispatch({ type: ACTIONS.SET_ATTRIBUTES, payload: { ...state.attributes, [category]: catAttrs } });
      setRecentlyAdded((prev) => [trimmed, ...prev].slice(0, 5));
      setNewValue("");
      setNewStatus("active");
    } catch (err) {
      console.error("Failed to save attribute to server", err);
      toast.error(err.response?.data?.message || "Failed to save attribute to server");
    } finally {
      setIsSaving(false);
    }
  };

  // Start edit
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.value);
    setEditStatus(item.status);
  };

  // ── PATCH: Save edit ──
  const saveEdit = async () => {
    if (!editName.trim()) return;
    const otherNames = attrValues.filter((v) => v.id !== editingId).map((v) => v.value);
    if (isDuplicate(editName.trim(), otherNames)) return;

    const updates = { value: editName.trim(), status: editStatus };
    const apiUpdates = { value: editName.trim(), isActive: editStatus === "active" };
    try {
      await adminService.updateAttribute(editingId, apiUpdates);
      editAttributeValue(category, selectedAttr, editingId, updates);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update attribute", err);
      toast.error(err.response?.data?.message || "Failed to update attribute");
    }
  };

  // ── DELETE: Remove attribute value ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteAttribute(deleteTarget.id);
      deleteAttributeValue(category, selectedAttr, deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete attribute", err);
      toast.error(err.response?.data?.message || "Failed to delete attribute");
    }
  };

  // ── PATCH: Toggle status ──
  const toggleItemStatus = async (item) => {
    const newSt = item.status === "active" ? "inactive" : "active";
    try {
      await adminService.updateAttribute(item.id, { isActive: newSt === "active" });
      editAttributeValue(category, selectedAttr, item.id, { status: newSt });
    } catch (err) {
      console.error("Failed to toggle attribute status", err);
      toast.error(err.response?.data?.message || "Failed to update attribute status");
    }
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
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => { const ctrl = new AbortController(); fetchAttributes(selectedAttr, ctrl.signal); }}
              disabled={isLoading}
              title="Refresh from server"
            >
              {isLoading ? "↻ Loading…" : "↻ Refresh"}
            </button>
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
            {isLoading ? (
              <div className="admin-empty" style={{ padding: 24 }}>
                <p style={{ color: "#9ca3af" }}>Loading attributes…</p>
              </div>
            ) : filteredValues.length === 0 ? (
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
