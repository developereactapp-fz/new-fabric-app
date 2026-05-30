import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../store/adminStore";
import { adminService } from "../../../services/adminService";
import PageHeader from "../../components/PageHeader";
import FormGroup from "../../components/FormGroup";
import { getPublicAssetUrl } from "../../utils/assetUtils";
import "./GroupBuilder.css";

export default function GroupBuilderPage() {
  const { state, dispatch, actions } = useAdmin();
  const navigate = useNavigate();

  // Step selections state
  const [targetCategories, setTargetCategories] = useState([]); // Array of checked category IDs
  const [selectedSourceCategoryId, setSelectedSourceCategoryId] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedComponentValueId, setSelectedComponentValueId] = useState("");
  
  // Metadata and fabric selections state
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  
  // Data loading states
  const [productTree, setProductTree] = useState(null);
  const [loadingTree, setLoadingTree] = useState(false);
  const [activeMappings, setActiveMappings] = useState([]);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch catalog categories, products and fabrics on mount
  useEffect(() => {
    if (actions.fetchCatalogCategories) actions.fetchCatalogCategories();
    if (actions.fetchCatalogProducts) actions.fetchCatalogProducts();
    
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
          console.error("Failed to fetch fabrics", err);
        }
      };
      fetchFabrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Categories list with fallback for safety
  const categoriesList = useMemo(() => {
    return state.catalogCategories && state.catalogCategories.length > 0 
      ? state.catalogCategories 
      : [];
  }, [state.catalogCategories]);

  // Fetch product tree when source category selection changes
  useEffect(() => {
    if (!selectedSourceCategoryId || (state.catalogProducts || []).length === 0) {
      setProductTree(null);
      setSelectedComponentId("");
      setSelectedComponentValueId("");
      return;
    }
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const product = (state.catalogProducts || []).find(
          (p) => p.categoryId === selectedSourceCategoryId
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
    setSelectedComponentValueId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSourceCategoryId, state.catalogProducts.length]);

  // Available components (parts) from product tree
  const availableComponents = useMemo(() => {
    if (!productTree || !productTree.parts) return [];
    return productTree.parts.filter((part) => part.isActive !== false);
  }, [productTree]);

  // Reset component value when component changes
  const handleComponentChange = (compId) => {
    setSelectedComponentId(compId);
    setSelectedComponentValueId("");
  };

  // Selected Part and its Component Values (types)
  const selectedPart = useMemo(() => {
    if (!productTree || !selectedComponentId) return null;
    return availableComponents.find((p) => p.id === selectedComponentId);
  }, [productTree, selectedComponentId, availableComponents]);

  const availableComponentValues = useMemo(() => {
    if (!selectedPart || !selectedPart.types) return [];
    return selectedPart.types.filter((t) => t.isActive !== false);
  }, [selectedPart]);

  // Fetch mappings when component value selection changes
  useEffect(() => {
    if (!selectedComponentValueId) {
      setActiveMappings([]);
      return;
    }
    const fetchMappings = async () => {
      setLoadingMappings(true);
      try {
        const res = await adminService.getMappingByPart(selectedComponentValueId);
        const data = res.data?.data || res.data || {};
        setActiveMappings(data.availability || []);
      } catch (err) {
        console.error("Failed to load mappings:", err);
        toast.error("Failed to load fabric mappings for selected value.");
        setActiveMappings([]);
      } finally {
        setLoadingMappings(false);
      }
    };
    fetchMappings();
  }, [selectedComponentValueId]);

  // Compute available fabrics mapped to this component value
  const availableFabrics = useMemo(() => {
    if (!selectedComponentValueId || activeMappings.length === 0) return [];
    
    return (state.fabrics || [])
      .filter((fabric) => {
        const mapping = activeMappings.find((m) => m.fabricId === fabric.id);
        return mapping && mapping.isChecked;
      })
      .map((fabric) => {
        const fabricImage = getPublicAssetUrl(fabric.assetId || fabric.asset?.id) || fabric.image || fabric.imageUrl || fabric.asset?.url || null;
        return {
          fabricId: fabric.id,
          fabricCode: fabric.fabricId || "Unknown ID",
          fabricName: fabric.fabricName || "Unknown Fabric",
          mappedImage: fabricImage,
        };
      });
  }, [selectedComponentValueId, activeMappings, state.fabrics]);

  // Step labels derived dynamically
  const currentComponentName = selectedPart?.name || "Component";
  const currentTypeName = useMemo(() => {
    const val = availableComponentValues.find(v => v.id === selectedComponentValueId);
    return val ? val.name : "";
  }, [availableComponentValues, selectedComponentValueId]);

  const handleTargetCategoryChange = (catId) => {
    if (targetCategories.includes(catId)) {
      setTargetCategories(targetCategories.filter(c => c !== catId));
    } else {
      setTargetCategories([...targetCategories, catId]);
    }
  };

  const handleToggleFabricSelection = (fabId) => {
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

  const handleSaveGroup = async (createAnother = false) => {
    if (targetCategories.length === 0) {
      toast.error("Validation Error: Please select at least one Target Category (Step 1).");
      return;
    }
    if (!selectedSourceCategoryId || !selectedComponentId || !selectedComponentValueId) {
      toast.error("Validation Error: Please complete Source Mapping selection (Steps 2, 3, 4).");
      return;
    }
    if (selectedFabrics.length === 0) {
      toast.error("Validation Error: Please select at least one fabric for the group (Step 5).");
      return;
    }
    if (!groupId.trim()) {
      toast.error("Validation Error: Please enter a Group ID (Step 6).");
      return;
    }
    if (!groupName.trim()) {
      toast.error("Validation Error: Please enter a Group Name (Step 6).");
      return;
    }

    const selectedFabricObjects = availableFabrics.filter(f => selectedFabrics.includes(f.fabricId));
    const missingImages = selectedFabricObjects.filter(f => !f.mappedImage);

    if (missingImages.length > 0) {
      toast.error(`Validation Error: ${missingImages.length} selected fabric(s) are missing images. Mapped images are mandatory for group items.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        groupId: groupId.trim(),
        groupName: groupName.trim(),
        name: groupName.trim(),
        categoryIds: targetCategories,
        items: selectedFabricObjects,
        status: "active"
      };

      let createdGroup;
      if (actions.addBuilderGroup) {
        const res = await actions.addBuilderGroup(payload);
        createdGroup = res?.data || res;
      } else {
        const res = await adminService.createGroup({
          name: groupName.trim(),
          categoryIds: targetCategories
        });
        createdGroup = res.data?.data || res.data;
      }

      const finalGroupId = createdGroup?.id || groupId.trim();

      // Update group items
      await adminService.updateGroupItems(finalGroupId, selectedFabrics);

      // Refresh groups list in admin store
      const grpRes = await adminService.getGroups();
      dispatch({ type: "SET_GROUPS", payload: grpRes.data?.data || grpRes.data || [] });

      toast.success("Fabric Group saved successfully!");

      if (createAnother) {
        setGroupId("");
        setGroupName("");
        setSelectedFabrics([]);
      } else {
        navigate("/admin/fabric-detail");
      }
    } catch (err) {
      console.error("Failed to save fabric group:", err);
      toast.error("Failed to save fabric group. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setGroupId("");
    setGroupName("");
    setTargetCategories([]);
    setSelectedSourceCategoryId("");
    setSelectedComponentId("");
    setSelectedComponentValueId("");
    setSelectedFabrics([]);
    toast.info("Form selection reset.");
  };

  // Checked fabrics detail for preview list
  const checkedFabricsList = useMemo(() => {
    return availableFabrics.filter(f => selectedFabrics.includes(f.fabricId));
  }, [availableFabrics, selectedFabrics]);

  // Determine which steps are active (unlock one by one)
  const step2Active = targetCategories.length > 0;
  const step3Active = step2Active && !!selectedSourceCategoryId;
  const step4Active = step3Active && !!selectedComponentId;
  const step5Active = step4Active && !!selectedComponentValueId;
  const step6Active = step5Active;
  const step7Active = step5Active;
  const step8Active = step5Active;
  const step10Active = step5Active;

  return (
    <div className="group-builder-page">
      <PageHeader
        title="Group Builder (Context-Driven)"
        subtitle="Configure, validate, and save reusable fabric groups mapped from specific component values."
      />

      <div className="builder-layout">
        {/* Left Column: Form & Steps */}
        <div className="builder-sidebar">
          {/* STEP 1: Target Categories */}
          <div className="step-card">
            <div className="step-badge">STEP 1</div>
            <h3>Target Category</h3>
            <p className="step-helper">Apply Group To Categories</p>
            {categoriesList.length === 0 ? (
              <p className="loading-helper">Loading catalog categories...</p>
            ) : (
              <div className="target-categories-list">
                {categoriesList.map((cat) => (
                  <label key={cat.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={targetCategories.includes(cat.id)}
                      onChange={() => handleTargetCategoryChange(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2: Source Category Selection */}
          {step2Active && (
            <div className="step-card">
              <div className="step-badge">STEP 2</div>
              <h3>Source Category</h3>
              <p className="step-helper">Select where the source fabric data comes from</p>
              <FormGroup label="Source Category">
                <select
                  className="admin-select"
                  value={selectedSourceCategoryId}
                  onChange={(e) => setSelectedSourceCategoryId(e.target.value)}
                >
                  <option value="">-- Select Source Category --</option>
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>
          )}

          {/* STEP 3: Component Selection */}
          {step3Active && (
            <div className="step-card">
              <div className="step-badge">STEP 3</div>
              <h3>Select Component</h3>
              <p className="step-helper">Select the catalog component</p>
              {loadingTree ? (
                <p className="loading-helper">Loading components...</p>
              ) : (
                <FormGroup label="Component">
                  <select
                    className="admin-select"
                    value={selectedComponentId}
                    onChange={(e) => handleComponentChange(e.target.value)}
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

          {/* STEP 4: Component Type Selection */}
          {step4Active && (
            <div className="step-card">
              <div className="step-badge">STEP 4</div>
              <h3>Select Component Type</h3>
              <p className="step-helper">Select specific type for {currentComponentName}</p>
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

          {/* STEP 6: Group Details */}
          {step6Active && (
            <div className="step-card">
              <div className="step-badge">STEP 6</div>
              <h3>Group Details</h3>
              <p className="step-helper">Metadata identifiers for the new group</p>
              <FormGroup label="Group ID" required>
                <input
                  type="text"
                  className="admin-input"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="e.g. GRP-LINEN-COLLAR"
                />
              </FormGroup>
              <FormGroup label="Group Name" required>
                <input
                  type="text"
                  className="admin-input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Linen Collar Options"
                />
              </FormGroup>
            </div>
          )}

          {/* STEP 10: Save Operations */}
          {step10Active && (
            <div className="step-card action-card">
              <div className="step-badge">STEP 10</div>
              <h3>Persist Group</h3>
              <div className="action-buttons-grid">
                <button
                  className="admin-btn primary"
                  onClick={() => handleSaveGroup(false)}
                  disabled={saving || loadingMappings}
                >
                  {saving ? "Saving Group..." : "Save Group"}
                </button>
                <button
                  className="admin-btn secondary"
                  onClick={() => handleSaveGroup(true)}
                  disabled={saving || loadingMappings}
                >
                  Save & Create Another
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

        {/* Right Column: Dynamic Load, Preview, Validation */}
        <div className="builder-main">
          {/* STEP 5: Load Available Items Checklist */}
          {step5Active ? (
            <div className="step-card main-step-card">
              <div className="step-badge">STEP 5</div>
              <div className="header-with-action">
                <div>
                  <h3>Available Items (Auto Generated)</h3>
                  <p className="step-helper">Choose fabrics to include in the group</p>
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
                  <span>Fetching mapped fabric mappings...</span>
                </div>
              ) : availableFabrics.length === 0 ? (
                <div className="builder-empty-state-prompt">
                  No fabrics found with active mappings for the selected component value.
                </div>
              ) : (
                <div className="checklist-container">
                  {availableFabrics.map((fabric) => {
                    const isChecked = selectedFabrics.includes(fabric.fabricId);
                    const displaySuffix = currentTypeName ? ` → ${currentTypeName} ${currentComponentName}` : "";
                    return (
                      <label key={fabric.fabricId} className={`checklist-item-label ${isChecked ? "checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFabricSelection(fabric.fabricId)}
                        />
                        <span className="checklist-text">
                          <strong className="fabric-code-tag">{fabric.fabricCode}</strong> – {fabric.fabricName}{displaySuffix}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="step-card placeholder-main-card">
              <h3>Configuration Needed</h3>
              <p className="step-helper">Complete the selections on the left to load options</p>
              <div className="builder-empty-state-prompt">
                Please complete Target Category (Step 1) and Source Mapping (Steps 2, 3, 4) to load the available fabrics list, live preview, and image validation check.
              </div>
            </div>
          )}

          {/* STEP 7 & 8: Preview & Image Validation */}
          {step5Active && (
            <div className="grid-two-columns">
              {/* STEP 7: Preview Group */}
              {step7Active && (
                <div className="step-card preview-card">
                  <div className="step-badge">STEP 7</div>
                  <h3>Preview Group</h3>
                  <p className="step-helper">Live preview of selected group structure</p>

                  <div className="preview-content-box">
                    {currentTypeName ? (
                      <h4 className="preview-component-header">
                        {currentTypeName} {currentComponentName}
                      </h4>
                    ) : (
                      <div className="preview-empty-text">No Component Value Selected</div>
                    )}

                    {checkedFabricsList.length > 0 ? (
                      <div className="preview-items-list">
                        <span className="preview-label-text">Available Options:</span>
                        <ul>
                          {checkedFabricsList.map((f) => (
                            <li key={f.fabricId} className="preview-item-row">
                              <span className="arrow-bullet">→</span> {f.fabricCode} – {f.fabricName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="preview-empty-text">No items added to preview.</div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 8: Image Validation */}
              {step8Active && (
                <div className="step-card validation-card">
                  <div className="step-badge">STEP 8</div>
                  <h3>Image Validation</h3>
                  <p className="step-helper">Mapped image availability verification</p>

                  <div className="validation-content-box">
                    {availableFabrics.length > 0 ? (
                      <div className="validation-list">
                        {availableFabrics.map((fabric) => {
                          const isSelected = selectedFabrics.includes(fabric.fabricId);
                          const hasImage = !!fabric.mappedImage;
                          return (
                            <div
                              key={fabric.fabricId}
                              className={`validation-row-item ${isSelected ? "selected-validation" : ""} ${!hasImage && isSelected ? "validation-error" : ""}`}
                            >
                              <div className="validation-fabric-info">
                                <span className="validation-code">{fabric.fabricCode}</span>
                                <span className="validation-separator">–</span>
                                <span className="validation-name">{fabric.fabricName}</span>
                              </div>
                              <div className="validation-status-badge">
                                {hasImage ? (
                                  <span className="status-success">✔ Image Available</span>
                                ) : (
                                  <span className="status-danger">❌ Missing Image</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="preview-empty-text">No items loaded for validation.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
