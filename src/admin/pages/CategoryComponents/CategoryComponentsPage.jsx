import { useState, useMemo, useCallback, useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import ComponentMappingSection from "./ComponentMappingSection";
import "./CategoryComponents.css";

/**
 * CategoryComponentsPage
 * ──────────────────────
 * Generic mapping page: Category → Group → Fabric → Component Values
 * Maps component values to a fabric with checkboxes, images, and defaults.
 */
export default function CategoryComponentsPage() {
  const { state, bulkSaveFabricMappings } = useAdmin();

  // ── Selection state ──
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedFabricId, setSelectedFabricId] = useState("");
  const [loaded, setLoaded] = useState(false);

  // ── Mapping state: { [componentId]: { [valueId]: { checked, image, isDefault } } } ──
  const [mappingState, setMappingState] = useState({});

  // ── Toast ──
  const [toast, setToast] = useState(null);

  // ── Derived data ──
  const activeCategories = useMemo(
    () => state.categories.filter((c) => c.status === "active"),
    [state.categories]
  );

  const categoryGroups = useMemo(() => {
    if (!selectedCategoryId) return [];
    return state.fabricGroups.filter(
      (g) => g.categoryId === selectedCategoryId && g.status === "active"
    );
  }, [state.fabricGroups, selectedCategoryId]);

  const groupFabrics = useMemo(() => {
    if (!selectedGroupId) return [];
    const fabricIds = state.fabricGroupMappings
      .filter((m) => m.groupId === selectedGroupId)
      .map((m) => m.fabricId);
    return state.fabrics.filter(
      (f) => fabricIds.includes(f.id) && f.status === "active"
    );
  }, [state.fabrics, state.fabricGroupMappings, selectedGroupId]);

  const selectedFabric = useMemo(
    () => state.fabrics.find((f) => f.id === selectedFabricId) || null,
    [state.fabrics, selectedFabricId]
  );

  const categoryComponents = useMemo(() => {
    if (!selectedCategoryId) return [];
    return (state.components[selectedCategoryId] || []).filter(
      (c) => c.status === "active"
    );
  }, [state.components, selectedCategoryId]);

  // ── Load existing mappings when fabric is selected ──
  const handleLoad = useCallback(() => {
    if (!selectedFabricId || !selectedCategoryId) return;

    const existing = state.fabricMappings.filter(
      (m) => m.fabricId === selectedFabricId && m.categoryId === selectedCategoryId
    );

    const newState = {};
    categoryComponents.forEach((comp) => {
      newState[comp.id] = {};
      const compValues = (state.componentValues[comp.id] || []).filter(
        (v) => v.status === "active"
      );
      compValues.forEach((val) => {
        const match = existing.find(
          (m) => m.componentId === comp.id && m.componentValueId === val.id
        );
        newState[comp.id][val.id] = {
          checked: !!match,
          image: match?.image || "",
          isDefault: !!match?.isDefault,
        };
      });
    });

    setMappingState(newState);
    setLoaded(true);
  }, [selectedFabricId, selectedCategoryId, categoryComponents, state.componentValues, state.fabricMappings]);

  // ── Reset when selections change ──
  useEffect(() => {
    setLoaded(false);
    setMappingState({});
  }, [selectedCategoryId, selectedGroupId, selectedFabricId]);

  // ── Handlers ──
  const handleOptionChange = useCallback((componentId, valueId, updates) => {
    setMappingState((prev) => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        [valueId]: { ...(prev[componentId]?.[valueId] || {}), ...updates },
      },
    }));
  }, []);

  const handleSetDefault = useCallback((componentId, valueId) => {
    setMappingState((prev) => {
      const compState = { ...prev[componentId] };
      Object.keys(compState).forEach((vid) => {
        compState[vid] = { ...compState[vid], isDefault: vid === valueId };
      });
      return { ...prev, [componentId]: compState };
    });
  }, []);

  // ── Validation ──
  const validationIssues = useMemo(() => {
    if (!loaded) return [];
    const issues = [];
    categoryComponents.forEach((comp) => {
      const compMap = mappingState[comp.id] || {};
      const checkedValues = Object.entries(compMap).filter(([, v]) => v.checked);
      if (checkedValues.length === 0) return;

      const missingImgs = checkedValues.filter(([, v]) => !v.image);
      if (missingImgs.length > 0) {
        issues.push(`${comp.name}: ${missingImgs.length} option(s) missing images`);
      }
      const hasDefault = checkedValues.some(([, v]) => v.isDefault);
      if (!hasDefault) {
        issues.push(`${comp.name}: No default value selected`);
      }
    });
    return issues;
  }, [loaded, mappingState, categoryComponents]);

  // ── Stats ──
  const stats = useMemo(() => {
    let totalChecked = 0;
    let totalImages = 0;
    categoryComponents.forEach((comp) => {
      const compMap = mappingState[comp.id] || {};
      Object.values(compMap).forEach((v) => {
        if (v.checked) {
          totalChecked++;
          if (v.image) totalImages++;
        }
      });
    });
    return { totalChecked, totalImages };
  }, [mappingState, categoryComponents]);

  // ── Save ──
  const handleSave = useCallback(() => {
    if (validationIssues.length > 0) return;

    const mappings = [];
    categoryComponents.forEach((comp) => {
      const compMap = mappingState[comp.id] || {};
      Object.entries(compMap).forEach(([valueId, val]) => {
        if (val.checked) {
          mappings.push({
            componentId: comp.id,
            componentValueId: valueId,
            fabricGroupId: selectedGroupId,
            image: val.image || "",
            isAvailable: true,
            isDefault: !!val.isDefault,
            status: "active",
          });
        }
      });
    });

    bulkSaveFabricMappings(selectedFabricId, selectedCategoryId, mappings);
    setToast("Mappings saved successfully!");
    setTimeout(() => setToast(null), 3000);
  }, [validationIssues, categoryComponents, mappingState, selectedGroupId, selectedFabricId, selectedCategoryId, bulkSaveFabricMappings]);

  return (
    <div className="cc-page">
      {/* Header */}
      <div className="cc-header">
        <div>
          <h1>Category-wise Components</h1>
          <p className="cc-header-sub">
            Map component values to fabrics for a selected category
          </p>
        </div>
      </div>

      {/* Global Selector Bar */}
      <div className="cc-selector-bar">
        <div className="cc-selector-group">
          <span className="cc-selector-label">Category</span>
          <select
            className="admin-select"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedGroupId("");
              setSelectedFabricId("");
            }}
          >
            <option value="">Select Category</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="cc-selector-group">
          <span className="cc-selector-label">Fabric Group</span>
          <select
            className="admin-select"
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value);
              setSelectedFabricId("");
            }}
            disabled={!selectedCategoryId}
          >
            <option value="">Select Group</option>
            {categoryGroups.map((g) => (
              <option key={g.id} value={g.id}>{g.groupName}</option>
            ))}
          </select>
        </div>

        <div className="cc-selector-group">
          <span className="cc-selector-label">Fabric</span>
          <select
            className="admin-select"
            value={selectedFabricId}
            onChange={(e) => setSelectedFabricId(e.target.value)}
            disabled={!selectedGroupId}
          >
            <option value="">Select Fabric</option>
            {groupFabrics.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fabricId} – {f.fabricName}
              </option>
            ))}
          </select>
        </div>

        <button
          className="admin-btn admin-btn-primary cc-load-btn"
          onClick={handleLoad}
          disabled={!selectedFabricId}
        >
          Load Components
        </button>
      </div>

      {/* Fabric Preview Strip */}
      {loaded && selectedFabric && (
        <div className="cc-fabric-strip">
          {selectedFabric.image ? (
            <img src={selectedFabric.image} alt={selectedFabric.fabricName} className="cc-fabric-thumb" />
          ) : (
            <div className="cc-fabric-thumb" />
          )}
          <div className="cc-fabric-info">
            <h3 className="cc-fabric-name">{selectedFabric.fabricId} – {selectedFabric.fabricName}</h3>
            <p className="cc-fabric-meta">
              {selectedFabric.color} · {selectedFabric.material}
              {selectedFabric.pattern ? ` · ${selectedFabric.pattern}` : ""}
            </p>
          </div>
          <span className={`cc-fabric-badge ${selectedFabric.status === "active" ? "" : "inactive"}`}>
            {selectedFabric.status === "active" ? "● Active" : "○ Inactive"}
          </span>
        </div>
      )}

      {/* Validation Banner */}
      {loaded && validationIssues.length > 0 && stats.totalChecked > 0 && (
        <div className="cc-validation">
          <span className="cc-validation-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <div>
            <strong>Validation Issues</strong>
            <ul>
              {validationIssues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Component Sections */}
      {loaded ? (
        categoryComponents.length > 0 ? (
          categoryComponents.map((comp, idx) => (
            <ComponentMappingSection
              key={comp.id}
              component={comp}
              values={state.componentValues[comp.id] || []}
              mappings={mappingState[comp.id] || {}}
              onChange={(valueId, updates) => handleOptionChange(comp.id, valueId, updates)}
              onSetDefault={(valueId) => handleSetDefault(comp.id, valueId)}
              startExpanded={idx === 0}
            />
          ))
        ) : (
          <div className="cc-empty-components">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
            <h3>No Components Configured</h3>
            <p>
              This category has no components. Add components via the{" "}
              <strong>Category & Components</strong> configurator first.
            </p>
          </div>
        )
      ) : (
        <div className="cc-empty-components">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h3>Select a Fabric to Begin</h3>
          <p>
            Choose a Category, Fabric Group, and Fabric above, then click
            "Load Components" to start mapping.
          </p>
        </div>
      )}

      {/* Sticky Action Bar */}
      {loaded && categoryComponents.length > 0 && (
        <div className="cc-action-bar">
          <div className="cc-action-left">
            <span className="cc-action-stats">
              <strong>{stats.totalChecked}</strong> options selected ·{" "}
              <strong>{stats.totalImages}</strong> images uploaded
            </span>
          </div>
          <div className="cc-action-right">
            <button
              className="admin-btn"
              onClick={() => {
                setLoaded(false);
                setMappingState({});
              }}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
              disabled={validationIssues.length > 0 && stats.totalChecked > 0}
            >
              Save Mapping
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="cc-toast success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
