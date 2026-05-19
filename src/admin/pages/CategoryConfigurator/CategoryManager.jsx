import { useState } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { isDuplicate } from "../../utils/validators";

export default function CategoryManager({ selectedCategoryId, onSelectCategory }) {
  const { state, addCatalogCategory, editCatalogCategory, deleteCatalogCategory } = useAdmin();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = state.catalogCategories || [];
  const existingNames = categories.map((c) => c.name);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name || isDuplicate(name, existingNames)) return;
    addCatalogCategory({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: "",
      sortOrder: categories.length,
      isCombined: false
    });
    setNewName("");
  };

  const startEdit = (cat) => { setEditingId(cat.id); setEditName(cat.name); };

  const saveEdit = () => {
    const name = editName.trim();
    if (!name) return;
    const otherNames = categories.filter((c) => c.id !== editingId).map((c) => c.name);
    if (isDuplicate(name, otherNames)) return;
    editCatalogCategory(editingId, { name });
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCatalogCategory(deleteTarget.id);
    if (selectedCategoryId === deleteTarget.id) onSelectCategory(null);
    setDeleteTarget(null);
  };

  const dupCheck = newName.trim() ? isDuplicate(newName.trim(), existingNames) : false;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Categories</h3>
          <p className="admin-card-subtitle">Create and manage product categories</p>
        </div>
        <StatusBadge status="info" label={`${categories.length} categories`} size="sm" />
      </div>

      {/* Add Category */}
      <div className="cc-add-row">
        <input
          className="admin-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleAdd} disabled={!newName.trim() || dupCheck}>
          Add
        </button>
      </div>
      {dupCheck && <p className="admin-input-error" style={{ marginTop: -8 }}>Category already exists</p>}

      {/* Category List */}
      <div className="cc-category-list">
        {categories.length === 0 ? (
          <div className="admin-empty" style={{ padding: 20 }}>
            <p>No categories yet. Create one above.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className={`cc-category-row ${selectedCategoryId === cat.id ? "selected" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {editingId === cat.id ? (
                <div className="cc-edit-inline">
                  <input className="admin-input" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && saveEdit()} />
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveEdit}>Save</button>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="cc-category-info">
                    <span className="cc-category-name">{cat.name}</span>
                    <StatusBadge status="active" size="xs" />
                    <span className="cc-category-count">{cat.childCount || 0} parts</span>
                  </div>
                  <div className="cc-category-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(cat)}>Edit</button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(cat)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="All components and values under this category will be removed."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
