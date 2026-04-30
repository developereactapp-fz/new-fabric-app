import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore";
import "./ComponentActive.css";

export default function ComponentActivePage() {
  const { state, actions } = useAdmin();

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterComponent, setFilterComponent] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const categories = state.categories || [];
  
  // Flatten component values with their parent component and category info
  const flattenedValues = useMemo(() => {
    const list = [];
    Object.keys(state.components).forEach((categoryId) => {
      const catComps = state.components[categoryId];
      catComps.forEach((comp) => {
        const compValues = state.componentValues[comp.id] || [];
        compValues.forEach((val) => {
          // Calculate "Used In" count - number of fabric mappings using this value
          const usedCount = state.fabricMappings.filter(
            (m) => m.componentId === comp.id && m.componentValueId === val.id
          ).length;

          list.push({
            ...val,
            categoryId,
            componentId: comp.id,
            componentName: comp.name,
            usedCount,
          });
        });
      });
    });
    return list;
  }, [state.components, state.componentValues, state.fabricMappings]);

  // Derived filtered components for the second dropdown
  const availableComponents = useMemo(() => {
    if (filterCategory === "All") return [];
    return state.components[filterCategory] || [];
  }, [filterCategory, state.components]);

  // Handle cascading filter resets
  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setFilterComponent("All"); // reset component filter when category changes
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return flattenedValues.filter((item) => {
      if (filterCategory !== "All" && item.categoryId !== filterCategory) return false;
      if (filterComponent !== "All" && item.componentId !== filterComponent) return false;
      if (filterStatus !== "All" && item.status !== filterStatus) return false;
      return true;
    });
  }, [flattenedValues, filterCategory, filterComponent, filterStatus]);

  const handleToggleStatus = (item) => {
    const confirmMsg = item.status === "active"
      ? `Mark "${item.valueName}" as INACTIVE? This will hide it from new selections globally.`
      : `Mark "${item.valueName}" as ACTIVE?`;
      
    if (window.confirm(confirmMsg)) {
       // Since componentValues is keyed by componentId in the store, we need to pass entityKey
       actions.toggleStatus("componentValues", item.id, item.componentId);
    }
  };

  return (
    <div className="component-active-page">
      <div className="admin-page-header">
        <div>
          <h2>Component Global Control</h2>
          <p>Globally enable or disable specific component options across all fabrics</p>
        </div>
      </div>

      <div className="admin-card filters-card">
        <div className="filter-group">
          <label className="admin-label">Category</label>
          <select className="admin-select" value={filterCategory} onChange={handleCategoryChange}>
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="admin-label">Component</label>
          <select 
            className="admin-select" 
            value={filterComponent} 
            onChange={(e) => setFilterComponent(e.target.value)}
            disabled={filterCategory === "All"}
          >
            <option value="All">All Components</option>
            {availableComponents.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="admin-label">Status</label>
          <select className="admin-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="admin-card list-card">
        <div className="list-header">
          <h3>Component Values ({filteredList.length})</h3>
        </div>
        
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Component</th>
                <th>Value Name</th>
                <th>Used In (Mappings)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className={item.status === "inactive" ? "inactive-row" : ""}>
                    <td>{item.categoryId}</td>
                    <td>{item.componentName}</td>
                    <td className="value-name-cell">
                      {item.valueName}
                      {item.isDefault && <span className="default-tag">Default</span>}
                    </td>
                    <td>
                      <span className="used-count">{item.usedCount}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-btn small ${item.status === "active" ? "danger" : "primary"}`}
                        onClick={() => handleToggleStatus(item)}
                      >
                        {item.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-cell">
                    No component values match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
