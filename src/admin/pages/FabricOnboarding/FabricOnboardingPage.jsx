import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAdmin } from "../../store/adminStore.jsx";

const API = import.meta.env.VITE_API_URL || "https://apperal-clothing-app-production.up.railway.app";
import FabricGroupManager from "./FabricGroupManager";
import CreateFabricMode from "./CreateFabricMode";
import ImportFabricMode from "./ImportFabricMode";
import EditFabricMode from "./EditFabricMode";
import ConfirmDialog from "../../components/ConfirmDialog";
import "./FabricOnboarding.css";

const MODES = [
  { key: "create", label: "Create New", icon: "M12 4v16m8-8H4" },
  { key: "import", label: "Import Existing", icon: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" },
  { key: "edit", label: "Edit Fabric", icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" },
];

export default function FabricOnboardingPage() {
  const location = useLocation();
  const { state, setFabrics } = useAdmin();
  
  const initialMode = location.state?.editFabricId ? "edit" : "create";
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);
  const [preselectedEditId, setPreselectedEditId] = useState(location.state?.editFabricId || null);

  useEffect(() => {
    if (location.state?.editFabricId) {
      setMode("edit");
      setPreselectedEditId(location.state.editFabricId);
    }
  }, [location.state?.editFabricId]);

  const selectedGroup = state.fabricGroups.find((g) => g.id === selectedGroupId);

  const handleModeSwitch = (newMode) => {
    if (hasUnsaved && newMode !== mode) {
      setPendingMode(newMode);
    } else {
      // Clear preselectedEditId when leaving edit mode to prevent stale state
      if (mode === "edit" && newMode !== "edit") setPreselectedEditId(null);
      setMode(newMode);
    }
  };


  // Normalize server fabric response to frontend field names
  const normalizeFabric = (f) => ({
    ...f,
    fabricId: f.fabricId || f.code || "",
    fabricName: f.fabricName || f.name || "",
    material: f.material || f.type || "",
    status: f.status || (f.isActive === false ? "inactive" : "active"),
    image: f.image || f.imageUrl || f.asset?.url || null,
  });

  useEffect(() => {
    const fetchFabrics = async () => {
      setLoading(true);
      try {
        const getToken = () => import.meta.env.VITE_AUTH_TOKEN;
        const res = await axios.get(`${API}/api/materials/fabrics?limit=100`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-tenant-slug": "test-tenant"
          }
        });
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setFabrics(data.map(normalizeFabric));
        }
      } catch (err) {
        console.error("Failed to fetch fabrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFabrics();
  }, [setFabrics]);

  const confirmModeSwitch = () => {
    // Clear preselectedEditId when confirming mode switch away from edit
    if (pendingMode !== "edit") setPreselectedEditId(null);
    setMode(pendingMode);
    setPendingMode(null);
    setHasUnsaved(false);
  };

  return (
    <div className="fo-page">
      <div className="admin-page-header">
        <div>
          <h2>Fabric Onboarding</h2>
          <p>Create, import, and manage fabric records</p>
        </div>
        <div className="fo-fabric-count">
          <span className="fo-count-value">{state.fabrics.length}</span>
          <span className="fo-count-label">Total Fabrics</span>
        </div>
      </div>

      {/* Fabric Group Manager — common to all modes */}
      <FabricGroupManager
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
      />

      {/* Mode Tabs */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="fo-mode-tabs">
          {MODES.map((m) => (
            <button
              key={m.key}
              className={`fo-mode-btn ${mode === m.key ? "active" : ""}`}
              onClick={() => handleModeSwitch(m.key)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={m.icon} />
              </svg>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Content */}
      {mode === "create" && (
        <CreateFabricMode
          groupId={selectedGroupId}
          groupName={selectedGroup?.groupName}
          onDirty={setHasUnsaved}
          onEditRequest={(id) => {
            setPreselectedEditId(id);
            handleModeSwitch("edit");
          }}
        />
      )}

      {mode === "import" && (
        <ImportFabricMode
          groupId={selectedGroupId}
          groupName={selectedGroup?.groupName}
        />
      )}

      {mode === "edit" && (
        <EditFabricMode
          groupId={selectedGroupId}
          groupName={selectedGroup?.groupName}
          onDirty={setHasUnsaved}
          preselectedEditId={preselectedEditId}
        />
      )}

      {/* Unsaved changes warning */}
      <ConfirmDialog
        open={!!pendingMode}
        title="Unsaved Changes"
        message="You have unsaved changes. Switching modes will discard them."
        confirmLabel="Discard"
        confirmVariant="danger"
        onConfirm={confirmModeSwitch}
        onCancel={() => setPendingMode(null)}
      />
    </div>
  );
}
