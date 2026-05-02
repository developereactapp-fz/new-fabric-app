import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import PageHeader from "../../components/PageHeader";
import PropertyGrid from "../../components/PropertyGrid";
import EmptyState from "../../components/EmptyState";
import ActionBar from "../../components/ActionBar";
import FabricMappingTable from "./FabricMappingTable";
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

  const handleEditFabric = () => {
    // In a real app, pass the ID to the onboarding page
    alert("Navigating to Edit Fabric: " + selectedFabric.fabricName);
  };

  const handleEditMappings = () => {
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

  // PropertyGrid items for the selected fabric
  const fabricProperties = selectedFabric
    ? [
        { label: "Fabric ID", value: selectedFabric.fabricId },
        { label: "Name", value: selectedFabric.fabricName },
        {
          label: "Status",
          value: selectedFabric.status,
          render: (v) => <span className={`status-badge ${v}`}>{v}</span>,
        },
        { label: "Color", value: selectedFabric.color },
        { label: "Material", value: selectedFabric.material },
        { label: "Pattern", value: selectedFabric.pattern },
        { label: "Season", value: selectedFabric.season },
        { label: "GSM", value: selectedFabric.gsm },
      ]
    : [];

  return (
    <div className="fabric-detail-page">
      <PageHeader title="Fabric Detail" subtitle="View complete details and component mappings for a single fabric" />

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
          <ActionBar>
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
          </ActionBar>

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
              <PropertyGrid items={fabricProperties} />
            </div>
          </div>

          <div className="admin-card mappings-card">
            <h3>Component Mappings</h3>
            <FabricMappingTable mappingsByCategory={mappingsByCategory} />
          </div>
        </div>
      ) : (
        <EmptyState message="Please select a fabric to view its details and mappings." />
      )}
    </div>
  );
}
