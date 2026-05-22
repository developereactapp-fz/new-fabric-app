import { useState, useEffect } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import ComponentManager from "./ComponentManager";
import SubCategoryManager from "./SubCategoryManager";
import LivePreview from "./LivePreview";
import "./CategoryConfigurator.css";

/**
 * CategoryConfiguratorPage
 *
 * Wireframe modes:
 *   (•) Create Category
 *   ( ) Edit Category
 *   ( ) Manage Components
 *
 * Category flow: select/create → then manage its Components (Parts),
 *   Component Values (Part Types), and Sub Categories (local state).
 *
 * The "Product" layer is hidden — we auto-select the first product under a category.
 */
export default function CategoryConfiguratorPage() {
  const {
    state,
    fetchCatalogCategories,
    fetchCatalogProducts,
    addCatalogCategory,
    editCatalogCategory,
    deleteCatalogCategory,
    fetchProductParts,
    addCatalogProduct,
  } = useAdmin();

  const [mode, setMode] = useState("create"); // "create" | "edit" | "manage"
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [creatingProductIdFor, setCreatingProductIdFor] = useState(null);

  // Create form
  const [newCatName, setNewCatName] = useState("");
  const [newCatStatus, setNewCatStatus] = useState("active");

  // Edit form
  const [editCatName, setEditCatName] = useState("");
  const [editCatStatus, setEditCatStatus] = useState("active");

  const categories = state.catalogCategories || [];
  const products = state.catalogProducts || [];

  // Fetch on mount
  useEffect(() => {
    fetchCatalogCategories();
    fetchCatalogProducts();
  }, [fetchCatalogCategories, fetchCatalogProducts]);

  // Auto-select first product when category changes
  const categoryProducts = products.filter(
    (p) => p.categoryId === selectedCategoryId
  );
  const autoProductId = categoryProducts.length > 0 ? categoryProducts[0].id : null;

  // Auto-create a default product if a category is selected but has no products
  useEffect(() => {
    if (selectedCategoryId && categories.length > 0 && creatingProductIdFor !== selectedCategoryId) {
      const currentCategoryProducts = products.filter(
        (p) => p.categoryId === selectedCategoryId
      );
      if (currentCategoryProducts.length === 0) {
        const cat = categories.find((c) => c.id === selectedCategoryId);
        if (cat) {
          setCreatingProductIdFor(selectedCategoryId);
          const name = `Default ${cat.name}`;
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          addCatalogProduct({
            name,
            slug,
            description: `Default product for ${cat.name}`,
            isActive: true,
            basePrice: 0,
            currency: "INR",
            categoryId: selectedCategoryId
          });
        }
      }
    }
  }, [selectedCategoryId, products, categories, addCatalogProduct, creatingProductIdFor]);

  // Fetch parts for the auto-selected product
  useEffect(() => {
    if (autoProductId) {
      fetchProductParts(autoProductId);
    }
  }, [autoProductId, fetchProductParts]);

  const parts = (state.catalogParts || []).filter(
    (p) => p.productId === autoProductId
  );

  // ── Category selection ──
  const handleSelectCategory = (id) => {
    setSelectedCategoryId(id);
    setSelectedComponentId(null);
    // Populate edit form
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setEditCatName(cat.name);
      setEditCatStatus(cat.isActive !== false ? "active" : "inactive");
    }
  };

  // ── Create Category ──
  const handleCreateCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    addCatalogCategory({ name, slug, description: "", sortOrder: categories.length, isCombined: false });
    setNewCatName("");
    setNewCatStatus("active");
  };

  // ── Save Edit ──
  const handleSaveEdit = () => {
    if (!selectedCategoryId || !editCatName.trim()) return;
    editCatalogCategory(selectedCategoryId, {
      name: editCatName.trim(),
      isActive: editCatStatus === "active",
    });
  };

  // ── Delete Category ──
  const handleDeleteCategory = () => {
    if (!selectedCategoryId) return;
    deleteCatalogCategory(selectedCategoryId);
    setSelectedCategoryId(null);
    setMode("create");
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedComponent = parts.find((p) => p.id === selectedComponentId);

  return (
    <div className="cc-page">
      {/* ═══ HEADER ═══ */}
      <div className="admin-page-header">
        <div>
          <h2>Category & Component Configuration</h2>
          <p>Manage categories, components, values, and sub-categories</p>
        </div>
      </div>

      <div className="cc-layout">
        {/* ═══ LEFT PANEL ═══ */}
        <div className="cc-left">
          {/* ── MODE SELECTOR ── */}
          <div className="cc-section">
            <div className="cc-section-title">MODE</div>
            <div className="cc-radio-group">
              {[
                { key: "create", label: "Create Category" },
                { key: "edit", label: "Edit Category" },
                { key: "manage", label: "Manage Components" },
              ].map((m) => (
                <label key={m.key} className="cc-radio-label">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === m.key}
                    onChange={() => setMode(m.key)}
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="cc-divider" />

          {/* ── CREATE CATEGORY FORM ── */}
          {mode === "create" && (
            <div className="cc-section">
              <div className="cc-section-title">CATEGORY</div>
              <div className="cc-form-group">
                <label className="cc-form-label">Category Name</label>
                <div className="cc-input-row">
                  <input
                    className="cc-input"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Custom Jacket"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                  />
                  <button
                    className="cc-btn cc-btn-primary"
                    onClick={handleCreateCategory}
                    disabled={!newCatName.trim()}
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div className="cc-form-group">
                <label className="cc-form-label">Status</label>
                <div className="cc-radio-group">
                  <label className="cc-radio-label">
                    <input type="radio" checked={newCatStatus === "active"} onChange={() => setNewCatStatus("active")} />
                    <span>Active</span>
                  </label>
                  <label className="cc-radio-label">
                    <input type="radio" checked={newCatStatus === "inactive"} onChange={() => setNewCatStatus("inactive")} />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── EDIT CATEGORY FORM ── */}
          {mode === "edit" && selectedCategoryId && (
            <div className="cc-section">
              <div className="cc-section-title">EDIT CATEGORY</div>
              <div className="cc-form-group">
                <label className="cc-form-label">Category Name</label>
                <input
                  className="cc-input"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                />
              </div>
              <div className="cc-form-group">
                <label className="cc-form-label">Status</label>
                <div className="cc-radio-group">
                  <label className="cc-radio-label">
                    <input type="radio" checked={editCatStatus === "active"} onChange={() => setEditCatStatus("active")} />
                    <span>Active</span>
                  </label>
                  <label className="cc-radio-label">
                    <input type="radio" checked={editCatStatus === "inactive"} onChange={() => setEditCatStatus("inactive")} />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>
              <div className="cc-btn-row">
                <button className="cc-btn cc-btn-primary" onClick={handleSaveEdit}>Save Changes</button>
                <button className="cc-btn cc-btn-danger" onClick={handleDeleteCategory}>Delete</button>
              </div>
            </div>
          )}

          {mode === "edit" && !selectedCategoryId && (
            <div className="cc-section">
              <div className="cc-empty-text">Select a category from the right to edit</div>
            </div>
          )}

          {/* ── MANAGE COMPONENTS ── */}
          {mode === "manage" && selectedCategoryId ? (
            <>
              <ComponentManager
                categoryId={selectedCategoryId}
                categoryName={selectedCategory?.name || ""}
                productId={autoProductId}
                components={parts}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
              />

              {selectedComponentId && (
                <SubCategoryManager
                  componentId={selectedComponentId}
                  componentName={selectedComponent?.name || ""}
                  productId={autoProductId}
                />
              )}
            </>
          ) : mode === "manage" && !selectedCategoryId && (
            <div className="admin-card cc-preview-card">
              <div className="admin-empty" style={{ padding: 32 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 12, opacity: 0.4 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <p>Select a category from the right to manage its components</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="cc-right">
          {/* ── EXISTING CATEGORIES ── */}
          <div className="cc-section">
            <div className="cc-section-title">Existing Categories</div>
            <div className="cc-category-list">
              {categories.length === 0 ? (
                <div className="cc-empty-text">No categories yet</div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`cc-category-row ${selectedCategoryId === cat.id ? "selected" : ""}`}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <div className="cc-category-info">
                      <span className="cc-category-name">{cat.name}</span>
                    </div>
                    {cat.isActive === false && (
                      <span className="cc-badge-inactive">Inactive</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="cc-divider" />

          {/* ── LIVE PREVIEW ── */}
          <LivePreview
            categoryId={selectedCategoryId}
            categoryName={selectedCategory?.name}
            productId={autoProductId}
          />
        </div>
      </div>
    </div>
  );
}
