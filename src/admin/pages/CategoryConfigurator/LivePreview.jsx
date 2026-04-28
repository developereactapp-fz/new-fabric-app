import { useAdmin } from "../../store/adminStore.jsx";

export default function LivePreview({ categoryId, categoryName }) {
  const { state } = useAdmin();

  if (!categoryId) {
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

  const components = state.components[categoryId] || [];

  return (
    <div className="admin-card cc-preview-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Live Preview</h3>
          <p className="admin-card-subtitle">Category structure tree</p>
        </div>
      </div>

      <div className="cc-tree">
        <div className="cc-tree-root">
          <div className="cc-tree-node root">
            <span className="cc-tree-icon">📁</span>
            <span className="cc-tree-label">{categoryName}</span>
            <span className="cc-tree-count">{components.length} components</span>
          </div>

          {components.length === 0 ? (
            <div className="cc-tree-empty">No components added yet</div>
          ) : (
            <div className="cc-tree-children">
              {components.map((comp) => {
                const values = state.componentValues[comp.id] || [];
                const subCats = state.subCategories[comp.id] || [];

                return (
                  <div key={comp.id} className="cc-tree-branch">
                    <div className="cc-tree-node component">
                      <span className="cc-tree-icon">🔧</span>
                      <span className="cc-tree-label">{comp.name}</span>
                      <span className="cc-tree-count">{values.length} values</span>
                    </div>

                    {values.length > 0 && (
                      <div className="cc-tree-children">
                        {values.map((val) => {
                          // Find dependent sub-categories for this value
                          const dependentSubs = subCats.filter((sc) => sc.type === "dependent");

                          return (
                            <div key={val.id} className="cc-tree-branch">
                              <div className={`cc-tree-node value ${val.isDefault ? "default" : ""}`}>
                                <span className="cc-tree-icon">{val.isDefault ? "⭐" : "•"}</span>
                                <span className="cc-tree-label">{val.valueName}</span>
                                {val.isDefault && <span className="cc-tree-badge">Default</span>}
                                <span className={`cc-tree-status ${val.status}`}>{val.status}</span>
                              </div>

                              {/* Dependent sub-category values for this parent value */}
                              {dependentSubs.length > 0 && (
                                <div className="cc-tree-children">
                                  {dependentSubs.map((sub) => {
                                    const subValsForParent = (state.subCategoryValues[sub.id] || [])
                                      .filter((sv) => sv.parentValueId === val.id);

                                    if (subValsForParent.length === 0) return null;

                                    return (
                                      <div key={sub.id} className="cc-tree-branch">
                                        <div className="cc-tree-node subcategory">
                                          <span className="cc-tree-icon">📂</span>
                                          <span className="cc-tree-label">{sub.name}</span>
                                        </div>
                                        <div className="cc-tree-children">
                                          {subValsForParent.map((sv) => (
                                            <div key={sv.id} className={`cc-tree-node subvalue ${sv.isDefault ? "default" : ""}`}>
                                              <span className="cc-tree-icon">{sv.isDefault ? "★" : "◦"}</span>
                                              <span className="cc-tree-label">{sv.valueName}</span>
                                              {sv.isDefault && <span className="cc-tree-badge">Default</span>}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Independent sub-categories (not nested under parent values) */}
                    {subCats.filter((sc) => sc.type === "independent").length > 0 && (
                      <div className="cc-tree-children">
                        {subCats.filter((sc) => sc.type === "independent").map((sub) => {
                          const subValues = state.subCategoryValues[sub.id] || [];
                          return (
                            <div key={sub.id} className="cc-tree-branch">
                              <div className="cc-tree-node subcategory">
                                <span className="cc-tree-icon">📂</span>
                                <span className="cc-tree-label">{sub.name}</span>
                                <span className="cc-tree-tag">independent</span>
                                <span className="cc-tree-count">{subValues.length} values</span>
                              </div>
                              {subValues.length > 0 && (
                                <div className="cc-tree-children">
                                  {subValues.map((sv) => (
                                    <div key={sv.id} className={`cc-tree-node subvalue ${sv.isDefault ? "default" : ""}`}>
                                      <span className="cc-tree-icon">{sv.isDefault ? "★" : "◦"}</span>
                                      <span className="cc-tree-label">{sv.valueName}</span>
                                      {sv.isDefault && <span className="cc-tree-badge">Default</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
