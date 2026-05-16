import { useState } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isDuplicate } from "../../utils/validators";

export default function FabricGroupManager({ selectedGroupId, onSelectGroup }) {
  const { state, addFabricGroup, editFabricGroup, deleteFabricGroup, toggleFabricGroup } = useAdmin();
  const [newGroupName, setNewGroupName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showToggleConfirm, setShowToggleConfirm] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const groups = state.fabricGroups;
  const existingNames = groups.map((g) => g.groupName);

  const handleAdd = () => {
    const name = newGroupName.trim();
    if (!name || isDuplicate(name, existingNames)) return;
    addFabricGroup({ groupName: name });
    setNewGroupName("");
  };

  const handleSaveEdit = () => {
    const name = editName.trim();
    if (!name) return;
    const others = groups.filter((g) => g.id !== editingId).map((g) => g.groupName);
    if (isDuplicate(name, others)) return;
    editFabricGroup(editingId, { groupName: name });
    setEditingId(null);
  };

  const handleToggle = (group) => {
    setShowToggleConfirm(group);
  };

  const confirmToggle = () => {
    if (showToggleConfirm) {
      toggleFabricGroup(showToggleConfirm.id);
      setShowToggleConfirm(null);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteFabricGroup(deleteTarget.id);
    if (selectedGroupId === deleteTarget.id) onSelectGroup(null);
    setDeleteTarget(null);
  };

  // Count fabrics mapped to each group
  const getFabricCount = (groupId) => {
    return state.fabricGroupMappings.filter((m) => m.groupId === groupId).length;
  };

  const dupCheck = newGroupName.trim() ? isDuplicate(newGroupName.trim(), existingNames) : false;

  return (
    <div className="admin-card fo-group-card">
      <div className="admin-card-header" style={{ cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="admin-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: -2 }}>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Fabric Groups
          </h3>
          <p className="admin-card-subtitle">Manage fabric groups across categories</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StatusBadge status="info" label={`${groups.length} groups`} size="sm" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {expanded && (
        <>
          {/* Add Group */}
          <div className="fo-group-add-row">
            <input
              className="admin-input"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New group name..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAdd} disabled={!newGroupName.trim() || dupCheck}>
              Add Group
            </button>
          </div>
          {dupCheck && <p className="admin-input-error" style={{ marginTop: -6, marginBottom: 8 }}>Group already exists</p>}

          {/* Group List */}
          <div className="fo-group-list">
            {groups.length === 0 ? (
              <div className="admin-empty" style={{ padding: 20 }}>
                <p>No groups yet. Create one to organize your fabrics.</p>
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className={`fo-group-row ${selectedGroupId === group.id ? "selected" : ""} ${!group.isActive ? "inactive" : ""}`}
                  onClick={() => onSelectGroup(group.id)}
                >
                  {editingId === group.id ? (
                    <div className="cc-edit-inline" onClick={(e) => e.stopPropagation()}>
                      <input className="admin-input" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()} />
                      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSaveEdit}>Save</button>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="fo-group-info">
                        <span className="fo-group-name">{group.groupName}</span>
                        <StatusBadge status={group.isActive ? "active" : "inactive"} size="xs" />
                        <span className="fo-group-count">{getFabricCount(group.id)} fabrics</span>
                      </div>
                      <div className="fo-group-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className={`admin-btn admin-btn-sm ${group.isActive ? "admin-btn-secondary" : "admin-btn-primary"}`}
                          onClick={() => handleToggle(group)}
                          title={group.isActive ? "Deactivate" : "Activate"}
                        >
                          {group.isActive ? "Disable" : "Enable"}
                        </button>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditingId(group.id); setEditName(group.groupName); }}>Edit</button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(group)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Toggle Confirm */}
      <ConfirmDialog
        open={!!showToggleConfirm}
        title={`${showToggleConfirm?.isActive ? "Deactivate" : "Activate"} "${showToggleConfirm?.groupName}"?`}
        message={
          showToggleConfirm?.isActive
            ? "Deactivating this group will hide it from active mappings. Existing data is preserved."
            : "Activating this group will make it available for fabric mappings."
        }
        confirmLabel={showToggleConfirm?.isActive ? "Deactivate" : "Activate"}
        confirmVariant={showToggleConfirm?.isActive ? "danger" : "primary"}
        onConfirm={confirmToggle}
        onCancel={() => setShowToggleConfirm(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.groupName}"?`}
        message={`This group will be permanently removed. ${getFabricCount(deleteTarget?.id || "") > 0 ? `It has ${getFabricCount(deleteTarget?.id)} fabric mappings that will be affected.` : ""}`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
