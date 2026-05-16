import { useState, useMemo, useCallback, useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import SHIRT_COMPONENTS, { initialContrastState } from "./shirtConfig";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ActionBar from "../../components/ActionBar";
import ShirtComponentSection from "./ShirtComponentSection";
import Toast from "../../components/Toast";
import ValidationBanner from "../../components/ValidationBanner";
import "./CustomShirt.css";

/**
 * CustomShirtPage
 * ───────────────
 * Category-specific mapping page hardcoded for "Custom Shirt".
 * 8 component sections with contrast support for Collar & Cuff.
 */
export default function CustomShirtPage() {
  const { state, bulkSaveFabricMappings } = useAdmin();

  // ── Selection state ──
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedFabricId, setSelectedFabricId] = useState("");
  const [loaded, setLoaded] = useState(false);

  // ── Mapping state: { [sectionKey]: { [optionKey]: { checked, image, isDefault } } } ──
  const [mappingState, setMappingState] = useState({});

  // ── Contrast toggles ──
  const [contrastState, setContrastState] = useState(initialContrastState);

  // ── Toast ──
  const [toast, setToast] = useState(null);

  // ── Find "Custom Shirt" category ──
  const shirtCategory = useMemo(
    () => state.categories.find(
      (c) => c.name.toLowerCase().includes("custom shirt") || c.name.toLowerCase().includes("shirt")
    ) || state.categories[0] || null,
    [state.categories]
  );

  const categoryId = shirtCategory?.id || "";

  // ── Groups for this category ──
  const categoryGroups = useMemo(() => {
    if (!categoryId) return [];
    return state.fabricGroups.filter(
      (g) => g.categoryId === categoryId && g.status === "active"
    );
  }, [state.fabricGroups, categoryId]);

  // ── Fabrics in selected group ──
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

  // ── Initialize mapping state ──
  const handleLoad = useCallback(() => {
    if (!selectedFabricId || !categoryId) return;

    const existing = state.fabricMappings.filter(
      (m) => m.fabricId === selectedFabricId && m.categoryId === categoryId
    );

    const newState = {};
    SHIRT_COMPONENTS.forEach((section) => {
      newState[section.key] = {};
      section.options.forEach((opt) => {
        const match = existing.find(
          (m) => m.componentValueId === opt.key || m.componentValueId === `${section.key}_${opt.key}`
        );
        newState[section.key][opt.key] = {
          checked: !!match,
          image: match?.image || "",
          isDefault: !!match?.isDefault,
        };
      });
    });

    setMappingState(newState);
    setLoaded(true);
  }, [selectedFabricId, categoryId, state.fabricMappings]);

  // ── Reset on selection change ──
  useEffect(() => {
    setLoaded(false);
    setMappingState({});
    setContrastState(initialContrastState());
  }, [selectedGroupId, selectedFabricId]);

  // ── Option change handler ──
  const handleOptionChange = useCallback((sectionKey, optionKey, updates) => {
    setMappingState((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [optionKey]: { ...(prev[sectionKey]?.[optionKey] || {}), ...updates },
      },
    }));
  }, []);

  // ── Set default for a section ──
  const handleSetDefault = useCallback((sectionKey, optionKey) => {
    setMappingState((prev) => {
      const sectionState = { ...prev[sectionKey] };
      Object.keys(sectionState).forEach((key) => {
        sectionState[key] = { ...sectionState[key], isDefault: key === optionKey };
      });
      return { ...prev, [sectionKey]: sectionState };
    });
  }, []);

  // ── Contrast toggle ──
  const handleContrastToggle = useCallback((sectionKey) => {
    setContrastState((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  }, []);

  // ── Progress / Stats ──
  const progress = useMemo(() => {
    let totalSections = SHIRT_COMPONENTS.length;
    let completeSections = 0;
    let totalChecked = 0;
    let totalImages = 0;
    let totalMissing = 0;

    SHIRT_COMPONENTS.forEach((section) => {
      const sectionMap = mappingState[section.key] || {};
      const checked = Object.values(sectionMap).filter((v) => v.checked);
      const withImages = checked.filter((v) => v.image);
      const hasDefault = checked.some((v) => v.isDefault);

      totalChecked += checked.length;
      totalImages += withImages.length;
      totalMissing += checked.length - withImages.length;

      if (checked.length > 0 && withImages.length === checked.length && hasDefault) {
        completeSections++;
      }
    });

    return { totalSections, completeSections, totalChecked, totalImages, totalMissing };
  }, [mappingState]);

  const progressPercent = progress.totalSections > 0
    ? Math.round((progress.completeSections / progress.totalSections) * 100)
    : 0;

  // ── Validation ──
  const validationIssues = useMemo(() => {
    if (!loaded) return [];
    const issues = [];
    SHIRT_COMPONENTS.forEach((section) => {
      const sectionMap = mappingState[section.key] || {};
      const checked = Object.entries(sectionMap).filter(([, v]) => v.checked);
      if (checked.length === 0) return;

      const missing = checked.filter(([, v]) => !v.image);
      if (missing.length > 0) {
        issues.push(`${section.title}: ${missing.length} option(s) missing images`);
      }
      if (!checked.some(([, v]) => v.isDefault)) {
        issues.push(`${section.title}: No default value selected`);
      }
    });
    return issues;
  }, [loaded, mappingState]);

  // ── Save ──
  const handleSave = useCallback((mapAnother = false) => {
    if (validationIssues.length > 0) return;

    const mappings = [];
    SHIRT_COMPONENTS.forEach((section) => {
      const sectionMap = mappingState[section.key] || {};
      Object.entries(sectionMap).forEach(([optionKey, val]) => {
        if (val.checked) {
          mappings.push({
            componentId: section.key,
            componentValueId: optionKey,
            fabricGroupId: selectedGroupId,
            image: val.image || "",
            isAvailable: true,
            isDefault: !!val.isDefault,
            status: "active",
          });
        }
      });
    });

    // Include contrast state
    Object.entries(contrastState).forEach(([key, enabled]) => {
      if (enabled) {
        mappings.push({
          componentId: `${key}_contrast`,
          componentValueId: "enabled",
          fabricGroupId: selectedGroupId,
          image: "",
          isAvailable: true,
          isDefault: false,
          status: "active",
        });
      }
    });

    bulkSaveFabricMappings(selectedFabricId, categoryId, mappings);
    setToast("Custom Shirt mapping saved!");
    setTimeout(() => setToast(null), 3000);

    if (mapAnother) {
      setSelectedFabricId("");
      setLoaded(false);
      setMappingState({});
      setContrastState(initialContrastState());
    }
  }, [validationIssues, mappingState, contrastState, selectedGroupId, selectedFabricId, categoryId, bulkSaveFabricMappings]);

  return (
    <div className="csf-page">
      {/* Header */}
      <PageHeader
        title={
          <>
            <span className="csf-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.66 3.3l1.82 2.56a4 4 0 002.83 1.65V22h10V9.97a4 4 0 002.83-1.65l1.82-2.56a2 2 0 00-1.66-3.3z" />
              </svg>
            </span>
            Custom Shirt Form
          </>
        }
        subtitle="Map shirt-specific components to a selected fabric"
        className="csf-header"
      />

      {/* Global Selection Bar */}
      <div className="csf-global-bar">
        <div className="csf-global-group">
          <span className="csf-global-label">Category</span>
          <select className="admin-select" value={categoryId} disabled>
            <option value={categoryId}>
              {shirtCategory ? shirtCategory.name : "Custom Shirt"}
            </option>
          </select>
        </div>

        <div className="csf-global-group">
          <span className="csf-global-label">Fabric Group</span>
          <select
            className="admin-select"
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value);
              setSelectedFabricId("");
            }}
          >
            <option value="">Select Group</option>
            {categoryGroups.map((g) => (
              <option key={g.id} value={g.id}>{g.groupName}</option>
            ))}
          </select>
        </div>

        <div className="csf-global-group">
          <span className="csf-global-label">Fabric</span>
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
      </div>

      {/* Load Button */}
      {selectedFabricId && !loaded && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button className="admin-btn admin-btn-primary" onClick={handleLoad}>
            Load Shirt Components
          </button>
        </div>
      )}

      {/* Fabric Info Strip */}
      {loaded && selectedFabric && (
        <div className="csf-fabric-strip">
          {selectedFabric.image ? (
            <img src={selectedFabric.image} alt={selectedFabric.fabricName} className="csf-fabric-thumb" />
          ) : (
            <div className="csf-fabric-thumb" />
          )}
          <div>
            <h3 className="csf-fabric-name">{selectedFabric.fabricName}</h3>
            <p className="csf-fabric-id">{selectedFabric.fabricId}</p>
          </div>
          <span className="csf-default-tag">Default Fabric</span>
        </div>
      )}

      {/* Progress Bar */}
      {loaded && (
        <div className="csf-progress">
          <div className="csf-progress-bar">
            <div
              className="csf-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="csf-progress-text">
            {progress.completeSections}/{progress.totalSections} sections complete
          </span>
        </div>
      )}

      {/* Validation Banner */}
      {loaded && validationIssues.length > 0 && progress.totalChecked > 0 && (
        <ValidationBanner issues={validationIssues} title="Fix before saving" />
      )}

      {/* Component Sections */}
      {loaded ? (
        SHIRT_COMPONENTS.map((section, idx) => (
          <ShirtComponentSection
            key={section.key}
            index={idx + 1}
            title={section.title}
            options={section.options}
            mappings={mappingState[section.key] || {}}
            onChange={(optionKey, updates) => handleOptionChange(section.key, optionKey, updates)}
            onSetDefault={(optionKey) => handleSetDefault(section.key, optionKey)}
            hasContrast={!!section.hasContrast}
            contrastEnabled={contrastState[section.key] || false}
            onContrastToggle={() => handleContrastToggle(section.key)}
            defaultFabric={selectedFabric ? { fabricId: selectedFabric.fabricId, fabricName: selectedFabric.fabricName } : null}
            startExpanded={idx === 0}
          />
        ))
      ) : (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.66 3.3l1.82 2.56a4 4 0 002.83 1.65V22h10V9.97a4 4 0 002.83-1.65l1.82-2.56a2 2 0 00-1.66-3.3z" />
            </svg>
          }
          heading="Select a Fabric to Begin"
          message='Choose a Fabric Group and Fabric above, then click "Load Shirt Components" to start configuring the custom shirt mapping.'
        />
      )}

      {/* Sticky Action Bar */}
      {loaded && (
        <ActionBar className="csf-action-bar" sticky>
          <div className="csf-action-left">
            <span className="csf-action-stats">
              <strong>{progress.totalChecked}</strong> options ·{" "}
              <strong>{progress.totalImages}</strong> images ·{" "}
              <strong>{progress.completeSections}</strong>/{progress.totalSections} sections
            </span>
          </div>
          <div className="csf-action-right">
            <button
              className="admin-btn"
              onClick={() => {
                if (progress.totalChecked > 0 && !window.confirm("Discard unsaved changes?")) return;
                setLoaded(false);
                setMappingState({});
                setContrastState(initialContrastState());
              }}
            >
              Cancel
            </button>
            <button
              className="admin-btn"
              onClick={() => handleSave(true)}
              disabled={validationIssues.length > 0 && progress.totalChecked > 0}
              style={validationIssues.length === 0 ? { borderColor: "#6366f1", color: "#6366f1" } : {}}
            >
              Save & Map Another
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => handleSave(false)}
              disabled={validationIssues.length > 0 && progress.totalChecked > 0}
            >
              Save Mapping
            </button>
          </div>
        </ActionBar>
      )}

      {/* Toast */}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
