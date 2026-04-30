import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import "./FabricDetail.css";

export default function FabricDetailPage() {
  const { state, actions } = useAdmin();
  const navigate = useNavigate();

  const [selectedFabricId, setSelectedFabricId] = useState("");

  const fabrics = state.fabrics || [];
  const mappings = state.fabricMappings || [];

  // Derived selected fabric
  const selectedFabric = useMemo(() => {
    return fabrics.find((f) => f.id === selectedFabricId) || null;
  }, [fabrics, selectedFabricId]);

  // Derived mappings for this fabric
  const fabricMappings = useMemo(() => {
    if (!selectedFabric) return [];
    return mappings.filter((m) => m.fabricId === selectedFabric.id);
  }, [mappings, selectedFabric]);

  // Group mappings by category
  const mappingsByCategory = useMemo(() => {
    const grouped = {};
    fabricMappings.forEach((m) => {
      if (!grouped[m.categoryId]) {
        grouped[m.categoryId] = [];
      }
      grouped[m.categoryId].push(m);
    });
    return grouped;
  }, [fabricMappings]);

  // Helpers to get component and value names
  const getComponentName = (categoryId, componentId) => {
    const catComps = state.components[categoryId] || [];
    const comp = catComps.find((c) => c.id === componentId);
    return comp ? comp.name : "Unknown Component";
  };

  const getComponentValueName = (componentId, valueId) => {
    const vals = state.componentValues[componentId] || [];
    const val = vals.find((v) => v.id === valueId);
    return val ? val.valueName : "Unknown Value";
  };

  const handleEditFabric = () => {
    // In a real app, pass the ID to the onboarding page
    alert("Navigating to Edit Fabric: " + selectedFabric.fabricName);
  };

  const handleEditMappings = () => {
    // Route to category-components mapped to this fabric
    navigate("/admin/category-components");
  };

  const handleDisableFabric = () => {
    if (!selectedFabric) return;
    const confirmMsg = selectedFabric.status === "active" 
      ? "Disable this fabric?" 
      : "Enable this fabric?";
    if (window.confirm(confirmMsg)) {
       actions.toggleStatus("fabrics", selectedFabric.id);
    }
  };

  const handleDeleteFabric = () => {
    if (!selectedFabric) return;
    if (window.confirm("Are you sure you want to delete this fabric? This action cannot be undone.")) {
      actions.deleteFabric(selectedFabric.id);
      setSelectedFabricId("");
    }
  };

  return (
    <div className="fabric-detail-page">
      <div className="admin-page-header">
        <div>
          <h2>Fabric Detail</h2>
          <p>View complete details and component mappings for a single fabric</p>
        </div>
      </div>

      <div className="admin-card fabric-selector-card">
        <label className="admin-label">Select Fabric to View</label>
        <select
          className="admin-select"
          value={selectedFabricId}
          onChange={(e) => setSelectedFabricId(e.target.value)}
        >
          <option value="">-- Choose a Fabric --</option>
          {fabrics.map((f) => (
            <option key={f.id} value={f.id}>
              {f.fabricId} - {f.fabricName}
            </option>
          ))}
        </select>
      </div>

      {selectedFabric ? (
        <div className="fabric-detail-content">
          <div className="fabric-detail-actions">
            <button className="admin-btn secondary" onClick={handleEditFabric}>
              Edit Fabric Details
            </button>
            <button className="admin-btn secondary" onClick={handleEditMappings}>
              Edit Component Mappings
            </button>
            <button 
              className={`admin-btn ${selectedFabric.status === "active" ? "danger" : "primary"}`} 
              onClick={handleDisableFabric}
            >
              {selectedFabric.status === "active" ? "Disable Fabric" : "Enable Fabric"}
            </button>
            <button className="admin-btn danger" onClick={handleDeleteFabric}>
              Delete Fabric
            </button>
          </div>

          <div className="fabric-info-grid">
            <div className="admin-card fabric-image-card">
              {selectedFabric.image ? (
                <img src={selectedFabric.image} alt={selectedFabric.fabricName} />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
            </div>

            <div className="admin-card fabric-props-card">
              <h3>Core Details</h3>
              <div className="prop-grid">
                <div className="prop-item">
                  <span className="prop-label">Fabric ID</span>
                  <span className="prop-value">{selectedFabric.fabricId}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">Name</span>
                  <span className="prop-value">{selectedFabric.fabricName}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">Status</span>
                  <span className={`status-badge ${selectedFabric.status}`}>
                    {selectedFabric.status}
                  </span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">Color</span>
                  <span className="prop-value">{selectedFabric.color || "N/A"}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">Material</span>
                  <span className="prop-value">{selectedFabric.material || "N/A"}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">Pattern</span>
                  <span className="prop-value">{selectedFabric.pattern || "N/A"}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">Season</span>
                  <span className="prop-value">{selectedFabric.season || "N/A"}</span>
                </div>
                <div className="prop-item">
                  <span className="prop-label">GSM</span>
                  <span className="prop-value">{selectedFabric.gsm || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card mappings-card">
            <h3>Component Mappings</h3>
            {Object.keys(mappingsByCategory).length === 0 ? (
              <p className="no-mappings-text">No components have been mapped to this fabric yet.</p>
            ) : (
              Object.entries(mappingsByCategory).map(([categoryId, catMappings]) => (
                <div key={categoryId} className="category-mapping-section">
                  <h4 className="category-heading">{categoryId}</h4>
                  <div className="mapping-table-wrapper">
                    <table className="mapping-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Value</th>
                          <th>Default?</th>
                          <th>Availability</th>
                          <th>Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catMappings.map((m) => (
                          <tr key={m.id}>
                            <td>{getComponentName(m.categoryId, m.componentId)}</td>
                            <td>{getComponentValueName(m.componentId, m.componentValueId)}</td>
                            <td>
                              {m.isDefault ? (
                                <span className="badge default-badge">Default</span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              <span className={`badge ${m.isAvailable ? "available" : "unavailable"}`}>
                                {m.isAvailable ? "Available" : "N/A"}
                              </span>
                            </td>
                            <td>
                              {m.image ? (
                                <img src={m.image} alt="Mapped" className="mapped-thumbnail" />
                              ) : (
                                <span className="no-img-text">None</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state-card">
          <p>Please select a fabric to view its details and mappings.</p>
        </div>
      )}
    </div>
  );
}
