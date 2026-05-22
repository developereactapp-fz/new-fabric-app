import { useEffect } from "react";
import { useAdmin } from "../../store/adminStore.jsx";

/**
 * LivePreview — shows the catalog hierarchy tree for the selected category.
 *
 * Props:
 *   categoryId, categoryName — selected category
 *   productId — the auto-selected product
 */
export default function LivePreview({ categoryId, categoryName, productId }) {
  const { state, fetchSubCategories, fetchSubCategoryValues } = useAdmin();

  if (!categoryId || !productId) {
    return (
      <div className="admin-card cc-preview-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Live Preview</h3>
        </div>
        <div className="admin-empty" style={{ padding: 32 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <p>Select a category to preview its structure</p>
        </div>
      </div>
    );
  }

  // Get parts (Components) for this product
  const components = (state.catalogParts || []).filter(
    (p) => p.productId === productId
  );

  // Fetch subcategories for all components of this product
  useEffect(() => {
    if (components.length > 0) {
      components.forEach((comp) => {
        fetchSubCategories(comp.id);
      });
    }
  }, [components, fetchSubCategories]);

  // Fetch values for all subcategories
  useEffect(() => {
    components.forEach((comp) => {
      const subs = state.subCategories?.[comp.id] || [];
      subs.forEach((sub) => {
        if (!state.subCategoryValues?.[sub.id]) {
          fetchSubCategoryValues(sub.id);
        }
      });
    });
  }, [components, state.subCategories, state.subCategoryValues, fetchSubCategoryValues]);

  return (
    <div className="admin-card cc-preview-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Catalog Structure</h3>
          <p className="admin-card-subtitle">Category → Component → Values</p>
        </div>
      </div>

      <div className="cc-tree">
        <div className="cc-tree-root">
          {/* Category Root */}
          <div className="cc-tree-node root">
            <span className="cc-tree-label">{categoryName}</span>
            <span className="cc-tree-count">{components.length} components</span>
          </div>

          {components.length === 0 ? (
            <div className="cc-tree-empty">No components added yet</div>
          ) : (
            <div className="cc-tree-children">
              {components.map((comp) => {
                const compValues = (state.catalogPartTypes || []).filter((t) => t.partId === comp.id);
                const subCats = state.subCategories?.[comp.id] || [];

                return (
                  <div key={comp.id} className="cc-tree-branch">
                    {/* Component Node */}
                    <div className="cc-tree-node component">
                      <span className="cc-tree-label" style={{ textDecoration: comp.isActive === false ? 'line-through' : 'none' }}>
                        {comp.name}
                      </span>
                      {comp.isActive === false && <span className="cc-badge-inactive" style={{ marginLeft: 6 }}>Inactive</span>}
                    </div>

                    <div className="cc-tree-children">
                      {/* Component Values */}
                      {compValues.map((val) => (
                        <div key={val.id} className={`cc-tree-node value ${val.isDefault ? 'default' : ''}`}>
                          <span className="cc-tree-icon">↳</span>
                          <span className="cc-tree-label" style={{ textDecoration: val.isActive === false ? 'line-through' : 'none' }}>
                            {val.name}
                          </span>
                          {val.isDefault && <span className="cc-badge-default" style={{ marginLeft: 6 }}>Default</span>}
                          {val.isActive === false && <span className="cc-badge-inactive" style={{ marginLeft: 6 }}>Inactive</span>}
                        </div>
                      ))}

                      {/* Sub Categories */}
                      {subCats.map((sub) => {
                        const subValues = state.subCategoryValues?.[sub.id] || [];

                        // Resolve dependency label
                        let depLabel = "";
                        if (sub.type === "dependent") {
                          const dependsOn = sub.dependsOn || "parent";
                          if (dependsOn === "parent") {
                            depLabel = "depends on Component Values";
                          } else if (dependsOn === "component") {
                            const depComp = (state.catalogParts || []).find(c => c.id === sub.dependsOnEntityId);
                            depLabel = `depends on Component Values: ${depComp ? depComp.name : "Unknown"}`;
                          } else if (dependsOn === "sub-category-id") {
                            let depSubName = "Unknown";
                            Object.values(state.subCategories || {}).forEach(list => {
                              const found = list.find(s => s.id === sub.dependsOnEntityId);
                              if (found) depSubName = found.name;
                            });
                            depLabel = `depends on Sub-Category: ${depSubName}`;
                          }
                        }

                        return (
                          <div key={sub.id} className="cc-tree-branch">
                            <div className="cc-tree-node component" style={{ marginTop: 4 }}>
                              <span className="cc-tree-label" style={{ color: '#888', fontStyle: 'italic', textDecoration: sub.isActive === false ? 'line-through' : 'none' }}>
                                {sub.name} <small>({sub.type === "dependent" && depLabel ? depLabel : sub.type})</small>
                              </span>
                            </div>
                            <div className="cc-tree-children" style={{ paddingLeft: 16 }}>
                              {subValues.map((sv) => (
                                <div key={sv.id} className={`cc-tree-node value ${sv.isDefault ? 'default' : ''}`}>
                                  <span className="cc-tree-icon">↳</span>
                                  <span className="cc-tree-label" style={{ textDecoration: sv.isActive === false ? 'line-through' : 'none' }}>
                                    {sv.valueName}
                                  </span>
                                  {sv.isDefault && <span className="cc-badge-default" style={{ marginLeft: 6 }}>Default</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick info panel */}
      <div className="cc-preview-info">
        <div className="cc-preview-info-item">
          <span className="cc-preview-info-label">Category</span>
          <span className="cc-preview-info-value">{categoryName}</span>
        </div>
        <div className="cc-preview-info-item">
          <span className="cc-preview-info-label">Components</span>
          <span className="cc-preview-info-value">{components.length}</span>
        </div>
        <div className="cc-preview-info-item">
          <span className="cc-preview-info-label">Hierarchy</span>
          <span className="cc-preview-info-value" style={{ fontSize: 11 }}>
            Category → Component → Values <br />
            &emsp;↳ Sub Categories → Values
          </span>
        </div>
      </div>
    </div>
  );
}
