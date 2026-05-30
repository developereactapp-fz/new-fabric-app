import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import { adminService } from "../../../services/adminService";
import PageHeader from "../../components/PageHeader";
import FormGroup from "../../components/FormGroup";
import { getPublicAssetUrl } from "../../utils/assetUtils";
import "./ContrastMapper.css";

export default function ContrastMapperPage() {
  const { state, dispatch, actions } = useAdmin();
  const navigate = useNavigate();

  // Wizard selections state
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedSubComponentTypeId, setSelectedSubComponentTypeId] = useState("");
  const [selectedComponentValueId, setSelectedComponentValueId] = useState("");
  
  // Fabric mappings and group state
  const [selectedFabrics, setSelectedFabrics] = useState([]); // Array of fabric IDs checked in Step 5
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isGroupMapped, setIsGroupMapped] = useState(false);
  
  // Loading and helper state
  const [productTree, setProductTree] = useState(null);
  const [loadingTree, setLoadingTree] = useState(false);
  const [activeMappings, setActiveMappings] = useState([]);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [autoDetectedDefaultFabric, setAutoDetectedDefaultFabric] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch catalog categories, products, fabrics, and groups on mount
  useEffect(() => {
    if (actions.fetchCatalogCategories) actions.fetchCatalogCategories();
    if (actions.fetchCatalogProducts) actions.fetchCatalogProducts();
    
    const fetchGroups = async () => {
      try {
        const grpRes = await adminService.getGroups();
        const rawGroups = grpRes.data?.data || grpRes.data || [];
        const normalizedGroups = rawGroups.map(g => ({
          ...g,
          groupName: g.groupName || g.name || "",
          isActive: g.isActive !== undefined ? g.isActive : true,
        }));
        dispatch({ type: "SET_GROUPS", payload: normalizedGroups });
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }
    };
    fetchGroups();

    if (!state.fabrics || state.fabrics.length === 0) {
      const fetchFabrics = async () => {
        try {
          const res = await adminService.getFabrics({ limit: 100 });
          const data = res.data?.data || res.data;
          if (Array.isArray(data)) {
            actions.setFabrics(data.map((f) => ({
              ...f,
              fabricId: f.fabricId || f.code || "",
              fabricName: f.fabricName || f.name || "",
              material: f.material || f.type || "",
              status: f.status || (f.isActive === false ? "inactive" : "active"),
              image: getPublicAssetUrl(f.assetId || f.asset?.id) || f.image || f.imageUrl || f.asset?.url || null,
            })));
          }
        } catch (err) {
          console.error("Failed to fetch fabrics:", err);
        }
      };
      fetchFabrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter categories to only display Custom Shirt and Custom Tuxedo Shirt as targets
  const categoriesList = useMemo(() => {
    const list = state.catalogCategories || [];
    return list.filter(cat => 
      cat.name === "Custom Shirt" || 
      cat.name === "Custom Tuxedo Shirt" || 
      cat.slug === "custom-shirt" || 
      cat.slug === "custom-tuxedo-shirt"
    );
  }, [state.catalogCategories]);

  // Load product tree when category changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setProductTree(null);
      setSelectedComponentId("");
      setSelectedSubComponentTypeId("");
      setSelectedComponentValueId("");
      return;
    }
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const product = (state.catalogProducts || []).find(
          (p) => p.categoryId === selectedCategoryId
        );
        if (product) {
          const res = await adminService.getProductTree(product.id);
          setProductTree(res.data?.data || res.data);
        } else {
          setProductTree(null);
        }
      } catch (err) {
        console.error("Failed to fetch product tree:", err);
        setProductTree(null);
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
    setSelectedComponentId("");
    setSelectedSubComponentTypeId("");
    setSelectedComponentValueId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, state.catalogProducts.length]);

  // Available components (Collar, Cuff, Placket) from tree
  const availableComponents = useMemo(() => {
    if (!productTree || !productTree.parts) return [];
    return productTree.parts.filter(
      (part) => 
        part.isActive !== false &&
        (part.name === "Collar" || part.name === "Cuff" || part.name === "Placket")
    );
  }, [productTree]);

  // Load component values and subcategories when component changes
  useEffect(() => {
    if (selectedComponentId) {
      if (actions.fetchSubCategories) {
        actions.fetchSubCategories(selectedComponentId);
      }
    }
    setSelectedSubComponentTypeId("");
    setSelectedComponentValueId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  // Sourced subcategories with fallback values
  const subComponentTypes = useMemo(() => {
    const fetchedSubs = state.subCategories?.[selectedComponentId] || [];
    const defaultSubs = [
      { id: "contrast", name: "Contrast" },
      { id: "color", name: "Color" }
    ];
    // Merge fetched and defaults
    const merged = [...defaultSubs];
    fetchedSubs.forEach(s => {
      if (!merged.some(m => m.name.toLowerCase() === s.name.toLowerCase())) {
        merged.push({ id: s.id, name: s.name });
      }
    });
    return merged;
  }, [selectedComponentId, state.subCategories]);

  // Selected Part details
  const selectedPart = useMemo(() => {
    if (!productTree || !selectedComponentId) return null;
    return availableComponents.find((p) => p.id === selectedComponentId);
  }, [productTree, selectedComponentId, availableComponents]);

  // Available component values (Classic, Classic Widespread, Cutaway, Club, etc.)
  const availableComponentValues = useMemo(() => {
    if (!selectedPart || !selectedPart.types) return [];
    return selectedPart.types.filter((t) => t.isActive !== false);
  }, [selectedPart]);

  // Load mappings and auto-detect default fabric when component value changes
  useEffect(() => {
    if (!selectedComponentValueId) {
      setActiveMappings([]);
      setAutoDetectedDefaultFabric(null);
      return;
    }

    const fetchMappings = async () => {
      setLoadingMappings(true);
      try {
        const res = await adminService.getMappingByPart(selectedComponentValueId);
        const data = res.data?.data || res.data || {};
        const availability = data.availability || [];
        setActiveMappings(availability);

        // Auto-detect default fabric
        // First check mapping entries from server for isDefault
        let defaultEntry = availability.find(m => m.isDefault === true || (m.isChecked && m.isDefault));
        let foundDefault = null;

        if (defaultEntry) {
          foundDefault = state.fabrics.find(f => f.id === defaultEntry.fabricId);
        }

        // Fallback: If no explicit isDefault on mappings, search active mappings first checked fabric
        if (!foundDefault && availability.length > 0) {
          const checkedEntry = availability.find(m => m.isChecked);
          if (checkedEntry) {
            foundDefault = state.fabrics.find(f => f.id === checkedEntry.fabricId);
          }
        }

        // Final Fallback: Set first active fabric in local state if database has no mappings yet
        if (!foundDefault && state.fabrics.length > 0) {
          foundDefault = state.fabrics.find(f => f.fabricId === "FAB001" || f.code === "FAB001") ||
                         state.fabrics.find(f => f.fabricId === "FAB003" || f.code === "FAB003") ||
                         state.fabrics[0];
        }

        setAutoDetectedDefaultFabric(foundDefault);
      } catch (err) {
        console.error("Failed to load mappings:", err);
        toast.error("Failed to load mappings for the selected component type.");
        setActiveMappings([]);
        setAutoDetectedDefaultFabric(null);
      } finally {
        setLoadingMappings(false);
      }
    };
    fetchMappings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentValueId, state.fabrics]);

  // Available fabrics mapped to this component value
  const availableFabrics = useMemo(() => {
    if (!selectedComponentValueId) return [];

    // Filter fabrics. If backend returns mappings, filter by isChecked.
    // Otherwise, fallback to showing all active fabrics in store for demonstration/testing.
    if (activeMappings.length > 0) {
      return (state.fabrics || [])
        .filter((fabric) => {
          const mapping = activeMappings.find((m) => m.fabricId === fabric.id);
          return mapping && mapping.isChecked;
        })
        .map((fabric) => {
          const fabricImage = getPublicAssetUrl(fabric.assetId || fabric.asset?.id) || fabric.image || fabric.imageUrl || fabric.asset?.url || null;
          return {
            fabricId: fabric.id,
            fabricCode: fabric.fabricId || fabric.code || "Unknown ID",
            fabricName: fabric.fabricName || fabric.name || "Unknown Fabric",
            mappedImage: fabricImage,
          };
        });
    }

    // Fallback Mock checklist from fabrics list
    if (state.fabrics.length > 0) {
      return state.fabrics.map((fabric) => {
        const fabricImage = getPublicAssetUrl(fabric.assetId || fabric.asset?.id) || fabric.image || fabric.imageUrl || fabric.asset?.url || null;
        return {
          fabricId: fabric.id,
          fabricCode: fabric.fabricId || fabric.code || "Unknown ID",
          fabricName: fabric.fabricName || fabric.name || "Unknown Fabric",
          mappedImage: fabricImage,
        };
      });
    }

    return [];
  }, [selectedComponentValueId, activeMappings, state.fabrics]);

  // Pre-select all available fabrics when loaded
  useEffect(() => {
    if (availableFabrics.length > 0) {
      setSelectedFabrics(availableFabrics.map(f => f.fabricId));
    } else {
      setSelectedFabrics([]);
    }
    setIsGroupMapped(false);
  }, [availableFabrics]);

  const handleToggleFabric = (fabId) => {
    if (selectedFabrics.includes(fabId)) {
      setSelectedFabrics(selectedFabrics.filter(id => id !== fabId));
    } else {
      setSelectedFabrics([...selectedFabrics, fabId]);
    }
  };

  const handleSelectAllFabrics = () => {
    if (selectedFabrics.length === availableFabrics.length) {
      setSelectedFabrics([]);
    } else {
      setSelectedFabrics(availableFabrics.map(f => f.fabricId));
    }
  };

  // Find fabrics in selected Group
  const groupFabrics = useMemo(() => {
    if (!selectedGroupId) return [];
    const group = (state.builderGroups || []).find(g => g.id === selectedGroupId);
    if (!group) return [];

    const items = group.items || [];
    if (items.length === 0) {
      // Find mappings in state
      const mappings = state.fabricGroupMappings.filter(m => m.groupId === selectedGroupId);
      return mappings.map(m => {
        const fabric = state.fabrics.find(f => f.id === m.fabricId);
        if (!fabric) return null;
        const fabricImage = getPublicAssetUrl(fabric.assetId || fabric.asset?.id) || fabric.image || fabric.imageUrl || fabric.asset?.url || null;
        return {
          fabricId: fabric.id,
          fabricCode: fabric.fabricId || fabric.code || "Unknown ID",
          fabricName: fabric.fabricName || fabric.name || "Unknown Fabric",
          mappedImage: fabricImage
        };
      }).filter(Boolean);
    }

    return items.map(item => {
      const fabric = state.fabrics.find(f => f.id === item.fabricId || f.id === item.id);
      const fabricImage = fabric ? (getPublicAssetUrl(fabric.assetId || fabric.asset?.id) || fabric.image || fabric.imageUrl || fabric.asset?.url) : item.mappedImage;
      return {
        fabricId: item.fabricId || item.id,
        fabricCode: item.fabricCode || item.code || (fabric ? fabric.fabricId : "Unknown"),
        fabricName: item.fabricName || item.name || (fabric ? fabric.fabricName : "Unknown"),
        mappedImage: fabricImage
      };
    });
  }, [selectedGroupId, state.builderGroups, state.fabricGroupMappings, state.fabrics]);

  // Apply Mapping - triggers auto cleanup
  const previewData = useMemo(() => {
    if (!isGroupMapped || !selectedGroupId) return null;

    // Filter group fabrics by removing the default fabric to prevent self-contrasting
    const cleanedContrastFabrics = groupFabrics.filter(
      (f) => !autoDetectedDefaultFabric || f.fabricId !== autoDetectedDefaultFabric.id
    );

    // Keep track of which fabrics were cleaned out
    const cleanedOut = groupFabrics.filter(
      (f) => autoDetectedDefaultFabric && f.fabricId === autoDetectedDefaultFabric.id
    );

    return {
      defaultFabric: autoDetectedDefaultFabric,
      contrastFabrics: cleanedContrastFabrics,
      cleanedOutFabrics: cleanedOut
    };
  }, [isGroupMapped, selectedGroupId, groupFabrics, autoDetectedDefaultFabric]);

  // Validations
  const validations = useMemo(() => {
    if (!previewData) return null;

    const defaultPresent = !!previewData.defaultFabric;
    
    // Check duplicates: is the default fabric present in the contrast option list?
    const hasDuplicate = previewData.defaultFabric && 
      previewData.contrastFabrics.some(f => f.fabricId === previewData.defaultFabric.id);

    // Check images: does the default fabric have an image, and do all contrast fabrics have images?
    const defaultHasImage = previewData.defaultFabric ? !!(getPublicAssetUrl(previewData.defaultFabric.assetId || previewData.defaultFabric.asset?.id) || previewData.defaultFabric.image || previewData.defaultFabric.imageUrl || previewData.defaultFabric.asset?.url) : false;
    const allContrastHaveImages = previewData.contrastFabrics.every(f => !!f.mappedImage);
    const imagesValid = defaultHasImage && allContrastHaveImages;

    return {
      defaultPresent,
      noDuplicate: !hasDuplicate,
      imagesValid,
      allValid: defaultPresent && !hasDuplicate && imagesValid
    };
  }, [previewData]);

  const handleApplyMapping = () => {
    if (selectedFabrics.length === 0) {
      toast.error("Please select at least one fabric mapping in Step 5.");
      return;
    }
    if (!selectedGroupId) {
      toast.error("Please select a group in Step 6.");
      return;
    }
    setIsGroupMapped(true);
    toast.success("Applied group mapping with Auto-Cleanup logic!");
  };

  const handleSaveContrastMapping = async (createAnother = false) => {
    if (!validations || !validations.allValid) {
      toast.error("Validation Error: Please resolve all validation errors before saving.");
      return;
    }

    setSaving(true);
    try {
      // Parallel API calls to save mappings for each selected fabric
      await Promise.all(
        selectedFabrics.map(fabId => 
          adminService.createMapping({
            fabricId: fabId,
            partTypeId: selectedComponentValueId,
            isChecked: true,
            enableContrast: true,
            contrastGroupId: selectedGroupId
          })
        )
      );

      toast.success("Contrast mappings saved successfully!");

      if (createAnother) {
        // Reset selections from step 6 onwards
        setSelectedGroupId("");
        setIsGroupMapped(false);
        if (availableFabrics.length > 0) {
          setSelectedFabrics(availableFabrics.map(f => f.fabricId));
        }
      } else {
        navigate("/admin/fabric-detail");
      }
    } catch (err) {
      console.error("Failed to save contrast mappings:", err);
      toast.error("Failed to save mappings. Please check your network connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedCategoryId("");
    setSelectedComponentId("");
    setSelectedSubComponentTypeId("");
    setSelectedComponentValueId("");
    setSelectedGroupId("");
    setIsGroupMapped(false);
    toast.info("Contrast Mapper selection reset.");
  };

  // Step disclosure flags (sequential unlocking)
  const step2Active = !!selectedCategoryId;
  const step3Active = step2Active && !!selectedComponentId;
  const step4Active = step3Active && !!selectedSubComponentTypeId;
  const step5Active = step4Active && !!selectedComponentValueId;
  
  const step6Active = step5Active;
  const step7Active = step6Active && !!selectedGroupId;
  const step8Active = step7Active && isGroupMapped;
  const step9Active = step8Active;
  const step10Active = step8Active;

  // Selected names for helper display
  const currentCategoryName = useMemo(() => {
    return categoriesList.find(c => c.id === selectedCategoryId)?.name || "Category";
  }, [categoriesList, selectedCategoryId]);

  const currentComponentName = selectedPart?.name || "Component";
  
  const currentSubTypeName = useMemo(() => {
    return subComponentTypes.find(t => t.id === selectedSubComponentTypeId)?.name || "";
  }, [subComponentTypes, selectedSubComponentTypeId]);

  const currentTypeName = useMemo(() => {
    return availableComponentValues.find(v => v.id === selectedComponentValueId)?.name || "";
  }, [availableComponentValues, selectedComponentValueId]);

  return (
    <div className="contrast-mapper-page">
      <PageHeader
        title="Contrast Group Mapper"
        subtitle="Configure, validate, and apply reusable fabric groups as contrast choices for specific component types."
      />

      <div className="mapper-layout">
        {/* Left Column: Form Controls */}
        <div className="mapper-sidebar">
          {/* STEP 1: Select Category */}
          <div className="step-card">
            <div className="step-badge">STEP 1</div>
            <h3>Select Category</h3>
            <p className="step-helper">Choose the target garment category</p>
            <FormGroup label="Category">
              <select
                className="admin-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormGroup>
          </div>

          {/* STEP 2: Select Component */}
          {step2Active && (
            <div className="step-card">
              <div className="step-badge">STEP 2</div>
              <h3>Select Component</h3>
              <p className="step-helper">Select component from {currentCategoryName} options</p>
              {loadingTree ? (
                <p className="loading-helper">Loading components...</p>
              ) : (
                <FormGroup label="Component">
                  <select
                    className="admin-select"
                    value={selectedComponentId}
                    onChange={(e) => setSelectedComponentId(e.target.value)}
                  >
                    <option value="">-- Select Component --</option>
                    {availableComponents.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
              )}
            </div>
          )}

          {/* STEP 3: Select Sub-Component Type */}
          {step3Active && (
            <div className="step-card">
              <div className="step-badge">STEP 3</div>
              <h3>Select Sub-Component Type</h3>
              <p className="step-helper">Define customization layer type for {currentComponentName}</p>
              <FormGroup label="Sub Type">
                <select
                  className="admin-select"
                  value={selectedSubComponentTypeId}
                  onChange={(e) => setSelectedSubComponentTypeId(e.target.value)}
                >
                  <option value="">-- Select Sub-component Type --</option>
                  {subComponentTypes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>
          )}

          {/* STEP 4: Select Component Type */}
          {step4Active && (
            <div className="step-card">
              <div className="step-badge">STEP 4</div>
              <h3>Select Component Type</h3>
              <p className="step-helper">Select type layout (e.g. Classic {currentComponentName})</p>
              <FormGroup label={`${currentComponentName} Type`}>
                <select
                  className="admin-select"
                  value={selectedComponentValueId}
                  onChange={(e) => setSelectedComponentValueId(e.target.value)}
                >
                  <option value="">-- Select Component Type --</option>
                  {availableComponentValues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>
          )}

          {/* STEP 6: Select Group */}
          {step6Active && (
            <div className="step-card">
              <div className="step-badge">STEP 6</div>
              <h3>Select Group</h3>
              <p className="step-helper">Choose contrast group from Group Builder</p>
              <FormGroup label="Contrast Group">
                <select
                  className="admin-select"
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                >
                  <option value="">-- Select Contrast Group --</option>
                  {(state.builderGroups || []).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.groupName || g.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>
          )}

          {/* STEP 10: Save */}
          {step10Active && (
            <div className="step-card action-card">
              <div className="step-badge">STEP 10</div>
              <h3>Save Mapping</h3>
              <p className="step-helper">Persist mapped structures</p>
              <div className="action-buttons-grid">
                <button
                  className="admin-btn primary"
                  onClick={() => handleSaveContrastMapping(false)}
                  disabled={saving}
                >
                  {saving ? "Saving Mapping..." : "Save Mapping"}
                </button>
                <button
                  className="admin-btn secondary"
                  onClick={() => handleSaveContrastMapping(true)}
                  disabled={saving}
                >
                  Save & Map Another
                </button>
                <button
                  className="admin-btn danger"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Checklist, Previews, Validations */}
        <div className="mapper-main">
          {/* STEP 5: Load Available Items Checklist */}
          {step5Active ? (
            <div className="step-card main-step-card">
              <div className="step-badge">STEP 5</div>
              <div className="header-with-action">
                <div>
                  <h3>Available Items (Auto Derived)</h3>
                  <p className="step-helper">Select fabric mappings to apply this group to</p>
                </div>
                {availableFabrics.length > 0 && (
                  <label className="select-all-label">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.length === availableFabrics.length}
                      onChange={handleSelectAllFabrics}
                    />
                    <span>Select All</span>
                  </label>
                )}
              </div>

              {loadingMappings ? (
                <div className="builder-loading-state">
                  <span className="spinner"></span>
                  <span>Fetching active fabric mappings...</span>
                </div>
              ) : availableFabrics.length === 0 ? (
                <div className="builder-empty-state-prompt">
                  No active mappings found for the selected component value.
                </div>
              ) : (
                <div className="checklist-container">
                  {availableFabrics.map((fabric) => {
                    const isChecked = selectedFabrics.includes(fabric.fabricId);
                    const isDefault = autoDetectedDefaultFabric && autoDetectedDefaultFabric.id === fabric.fabricId;
                    const suffix = isDefault ? " (Default)" : "";
                    
                    return (
                      <label key={fabric.fabricId} className={`checklist-item-label ${isChecked ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFabric(fabric.fabricId)}
                        />
                        <span className="checklist-text">
                          <strong className="fabric-code-tag">{fabric.fabricCode}</strong> – {fabric.fabricName} → {currentTypeName} {currentComponentName}{suffix}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Auto-detected Default Fabric Section */}
              <div className="auto-default-display-box" style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "14px", margin: "0 0 10px 0", color: "#475569" }}>DEFAULT DETECTION (AUTO)</h4>
                {autoDetectedDefaultFabric ? (
                  <div className="default-fabric-pill">
                    <span className="pill-dot"></span>
                    <span className="pill-label">Default Fabric:</span>
                    <strong className="pill-code">{autoDetectedDefaultFabric.fabricId || autoDetectedDefaultFabric.code}</strong>
                    <span className="pill-name">– {autoDetectedDefaultFabric.fabricName || autoDetectedDefaultFabric.name}</span>
                  </div>
                ) : (
                  <div className="pill-error">
                    ⚠️ No default fabric mapped for this component yet in the customization mappings.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="step-card placeholder-main-card">
              <h3>Configuration Needed</h3>
              <p className="step-helper">Complete wizard steps 1–4 to configure contrast mappings</p>
              <div className="builder-empty-state-prompt">
                Please complete Category (Step 1), Component (Step 2), Sub-Type (Step 3), and Component Type (Step 4) to load availability mappings, apply group mappings, and validate.
              </div>
            </div>
          )}

          {/* STEP 7: Apply Mapping */}
          {step6Active && !isGroupMapped && (
            <div className="step-card apply-action-card" style={{ background: "#eff6ff", border: "1px dashed #3b82f6" }}>
              <div className="step-badge">STEP 7</div>
              <h3>Apply Group Mapping</h3>
              <p className="step-helper">Map the selected group and trigger auto-cleanup filters</p>
              <button className="admin-btn primary" onClick={handleApplyMapping} style={{ width: "auto", minWidth: "250px" }}>
                Map Group to Selected Items
              </button>
            </div>
          )}

          {/* STEP 8 & 9: Preview & Validation (Disclosed side-by-side) */}
          {step8Active && previewData && (
            <div className="grid-two-columns">
              {/* STEP 8: Preview */}
              <div className="step-card preview-card">
                <div className="step-badge">STEP 8</div>
                <h3>Preview Result</h3>
                <p className="step-helper">Resulting contrast structures after cleanup filters</p>

                <div className="preview-content-box">
                  <h4 className="preview-component-header">
                    {currentTypeName} {currentComponentName}
                  </h4>
                  
                  {previewData.defaultFabric && (
                    <div className="preview-default-slot" style={{ marginBottom: "16px", padding: "8px 12px", background: "#f8fafc", borderRadius: "6px", borderLeft: "4px solid #3b82f6" }}>
                      <span className="preview-label-text" style={{ fontSize: "11px", color: "#64748b" }}>Default:</span>
                      <div style={{ fontSize: "13px", fontWeight: "600", marginTop: "2px" }}>
                        → {previewData.defaultFabric.fabricId || previewData.defaultFabric.code} – {previewData.defaultFabric.fabricName || previewData.defaultFabric.name}
                      </div>
                    </div>
                  )}

                  <div className="preview-contrast-slot">
                    <span className="preview-label-text">Contrast Options:</span>
                    {previewData.contrastFabrics.length === 0 ? (
                      <div className="preview-empty-text">No contrast options in group.</div>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                        {previewData.contrastFabrics.map((f) => (
                          <li key={f.fabricId} className="preview-item-row" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", padding: "4px 0" }}>
                            <span className="arrow-bullet" style={{ color: "#10b981" }}>→</span> 
                            <span>{f.fabricCode} – {f.fabricName}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {previewData.cleanedOutFabrics.length > 0 && (
                    <div className="cleanup-log-notice" style={{ marginTop: "12px", padding: "8px 10px", background: "#fffbeb", borderRadius: "6px", border: "1px solid #fef3c7", fontSize: "12px", color: "#b45309" }}>
                      🧹 Auto-Cleanup Log: <strong>{previewData.cleanedOutFabrics.map(f => f.fabricCode).join(", ")}</strong> was removed from contrast choices list because it is the default fabric slot.
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 9: Validation */}
              <div className="step-card validation-card">
                <div className="step-badge">STEP 9</div>
                <h3>Validation</h3>
                <p className="step-helper">Asset and integrity mapping checks</p>

                <div className="validation-content-box" style={{ background: "white" }}>
                  <div className="validation-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    
                    {/* Default Present */}
                    <div className="validation-row-item" style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", border: "1px solid #f1f5f9", borderRadius: "8px" }}>
                      <span>Default Present</span>
                      <span>
                        {validations.defaultPresent ? (
                          <span style={{ color: "#10b981", fontWeight: "600" }}>✔ Present</span>
                        ) : (
                          <span style={{ color: "#ef4444", fontWeight: "600" }}>❌ Missing</span>
                        )}
                      </span>
                    </div>

                    {/* No Duplicate Fabric */}
                    <div className="validation-row-item" style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", border: "1px solid #f1f5f9", borderRadius: "8px" }}>
                      <span>No Duplicate Fabric</span>
                      <span>
                        {validations.noDuplicate ? (
                          <span style={{ color: "#10b981", fontWeight: "600" }}>✔ Clean</span>
                        ) : (
                          <span style={{ color: "#ef4444", fontWeight: "600" }}>❌ Duplicates Found</span>
                        )}
                      </span>
                    </div>

                    {/* All Items Have Images */}
                    <div className="validation-row-item" style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", border: "1px solid #f1f5f9", borderRadius: "8px" }}>
                      <span>All Items Have Images</span>
                      <span>
                        {validations.imagesValid ? (
                          <span style={{ color: "#10b981", fontWeight: "600" }}>✔ Complete</span>
                        ) : (
                          <span style={{ color: "#ef4444", fontWeight: "600" }}>❌ Missing Images</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="overall-validation-status" style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: validations.allValid ? "#ecfdf5" : "#fef2f2", border: `1px solid ${validations.allValid ? "#10b981" : "#ef4444"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {validations.allValid ? (
                      <span style={{ color: "#065f46", fontWeight: "700" }}>✔ Validated & Ready to Save</span>
                    ) : (
                      <span style={{ color: "#991b1b", fontWeight: "700" }}>❌ Fix Validation Errors</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
