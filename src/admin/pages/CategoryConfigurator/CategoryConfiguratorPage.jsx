import { useState } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import CategoryManager from "./CategoryManager";
import ComponentManager from "./ComponentManager";
import LivePreview from "./LivePreview";
import "./CategoryConfigurator.css";

export default function CategoryConfiguratorPage() {
  const { state } = useAdmin();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const selectedCategory = state.categories.find((c) => c.id === selectedCategoryId);
  const categoryComponents = selectedCategoryId ? (state.components[selectedCategoryId] || []) : [];

  return (
    <div className="cc-page">
      <div className="admin-page-header">
        <div>
          <h2>Category & Component Configurator</h2>
          <p>Define product categories, components, and values</p>
        </div>
      </div>

      <div className="cc-layout">
        {/* Left Column — Category + Component Management */}
        <div className="cc-left">
          {/* Category Management */}
          <CategoryManager
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => { setSelectedCategoryId(id); setSelectedComponentId(null); }}
          />

          {/* Component Management (only when category selected) */}
          {selectedCategoryId && (
            <ComponentManager
              categoryId={selectedCategoryId}
              categoryName={selectedCategory?.name || ""}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
            />
          )}
        </div>

        {/* Right Column — Live Preview */}
        <div className="cc-right">
          <LivePreview
            categoryId={selectedCategoryId}
            categoryName={selectedCategory?.name}
          />
        </div>
      </div>
    </div>
  );
}
