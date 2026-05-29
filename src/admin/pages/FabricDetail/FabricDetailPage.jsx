import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import { adminService } from "../../../services/adminService";
import PageHeader from "../../components/PageHeader";
import PropertyGrid from "../../components/PropertyGrid";
import EmptyState from "../../components/EmptyState";
import ActionBar from "../../components/ActionBar";
import FabricMappingTable from "./FabricMappingTable";
import { getPublicAssetUrl } from "../../utils/assetUtils";
import "./FabricDetail.css";


export default function FabricDetailPage() {
  const { state, actions } = useAdmin();
  const navigate = useNavigate();

  const [selectedFabricId, setSelectedFabricId] = useState("");

  // ── Catalog lookup cache ──
  // Maps partTypeId → { categoryName, partName, typeName, isDefault, image }
  const [partTypeLookup, setPartTypeLookup] = useState({});
  const [lookupLoading, setLookupLoading] = useState(true);

  // ── Mapping state ──
  const [mappingData, setMappingData] = useState(null); // { availability: [], contrast: [] }
  const [mappingLoading, setMappingLoading] = useState(false);
  const [mappingError, setMappingError] = useState(null);

  // ──────────────────────────────────────────────────────────────
  // Task 1.1 + 1.2 + 1.3: Build catalog lookup cache on mount
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const buildLookup = async () => {
      setLookupLoading(true);
      try {
        // 1.1 Load all catalog products
        const productsRes = await adminService.getProducts();
        const products = productsRes.data?.data || productsRes.data || [];

        // 1.2 Fetch all product trees in parallel
        const treeResults = await Promise.allSettled(
          products.map((p) => adminService.getProductTree(p.id))
        );

        // 1.3 Construct lookup map
        const lookup = {};
        treeResults.forEach((result, idx) => {
          if (result.status !== "fulfilled") return;
          const tree = result.value.data?.data || result.value.data || {};
          const product = products[idx];
          const categoryName = product.name || "Unknown Category";
          const parts = tree.parts || [];

          parts.forEach((part) => {
            const partName = part.name || "Unknown Part";
            const types = part.types || [];
            types.forEach((type) => {
              lookup[type.id] = {
                categoryName,
                partName,
                typeName: type.name || "Unknown Type",
                isDefault: !!type.isDefault,
                image:
                  getPublicAssetUrl(type.assetId || type.asset?.id) ||
                  type.imageUrl ||
                  type.asset?.url ||
                  null,
              };
            });
          });
        });

        setPartTypeLookup(lookup);
      } catch (err) {
        console.error("Failed to build catalog lookup:", err);
      } finally {
        setLookupLoading(false);
      }
    };
    buildLookup();
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Task 2.1 + 2.2: Fetch mapping when fabric selection changes
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedFabricId) {
      setMappingData(null);
      setMappingError(null);
      return;
    }

    const fetchMapping = async () => {
      setMappingLoading(true);
      setMappingError(null);
      try {
        const res = await adminService.getMapping(selectedFabricId);
        const data = res.data?.data || res.data || {};
        setMappingData(data);
      } catch (err) {
        console.error("Failed to fetch mappings:", err);
        setMappingError("Failed to load mappings for this fabric.");
        setMappingData(null);
      } finally {
        setMappingLoading(false);
      }
    };
    fetchMapping();
  }, [selectedFabricId]);

  // ──────────────────────────────────────────────────────────────
  // Task 3.1: Resolve availability list into table rows
  // ──────────────────────────────────────────────────────────────
  const resolvedMappings = useMemo(() => {
    if (!mappingData?.availability || Object.keys(partTypeLookup).length === 0) {
      return {};
    }

    const grouped = {};
    mappingData.availability.forEach((item) => {
      const info = partTypeLookup[item.partTypeId];
      if (!info) return; // skip unknown part types

      const categoryName = info.categoryName;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }

      grouped[categoryName].push({
        id: item.id,
        partTypeId: item.partTypeId,
        partName: info.partName,
        typeName: info.typeName,
        isDefault: info.isDefault,
        isChecked: !!item.isChecked,
        image: info.image,
      });
    });

    return grouped;
  }, [mappingData, partTypeLookup]);

  // Derived selected fabric
  const selectedFabric = useMemo(() => {
    return (state.fabrics || []).find((f) => f.id === selectedFabricId) || null;
  }, [state.fabrics, selectedFabricId]);

  const handleEditFabric = () => {
    // In a real app, pass the ID to the onboarding page
    toast.info("Navigating to Edit Fabric: " + selectedFabric.fabricName);
  };

  const handleEditMappings = () => {
    navigate("/admin/custom-shirt");
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
          {state.fabrics.map((f) => (
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
              {(() => {
                const fabricImage = getPublicAssetUrl(selectedFabric.assetId || selectedFabric.asset?.id) || selectedFabric.image || selectedFabric.imageUrl || selectedFabric.asset?.url || null;
                return fabricImage ? (
                  <img src={fabricImage} alt={selectedFabric.fabricName} />
                ) : (
                  <div className="no-image-placeholder">No Image Available</div>
                );
              })()}
            </div>


            <div className="admin-card fabric-props-card">
              <h3>Core Details</h3>
              <PropertyGrid items={fabricProperties} />
            </div>
          </div>

          <div className="admin-card mappings-card">
            <h3>Component Mappings</h3>
            {lookupLoading || mappingLoading ? (
              <p style={{ color: "#64748b", padding: "16px 0" }}>⏳ Loading mappings...</p>
            ) : mappingError ? (
              <p style={{ color: "#dc2626", padding: "16px 0" }}>{mappingError}</p>
            ) : (
              <FabricMappingTable resolvedMappings={resolvedMappings} />
            )}
          </div>
        </div>
      ) : (
        <EmptyState message="Please select a fabric to view its details and mappings." />
      )}
    </div>
  );
}
