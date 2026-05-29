import { useState, useMemo, useCallback, useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import { adminService } from "../../../services/adminService";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ActionBar from "../../components/ActionBar";
import ShirtComponentSection from "./ShirtComponentSection";
import Toast from "../../components/Toast";
import ValidationBanner from "../../components/ValidationBanner";
import { getPublicAssetUrl } from "../../utils/assetUtils";
import "./CustomShirt.css";

/**
 * CustomShirtPage
 * ───────────────
 * Category-specific mapping page dynamically loading parts and partTypes.
 * Supports Collar & Cuff contrast.
 * Synchronized with the database catalog APIs.
 */
export default function CustomShirtPage() {
  const {
    state,
    setFabrics,
    fetchAllGroupMappings,
    fetchCatalogCategories,
    fetchCatalogProducts,
  } = useAdmin();

  // ── Selection state ──
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedFabricId, setSelectedFabricId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Product Tree State ──
  const [productTree, setProductTree] = useState(null);
  const [loadingTree, setLoadingTree] = useState(true);

  // ── Mapping state: { [sectionKey]: { [optionKey]: { checked, image, isDefault, isUploading } } } ──
  const [mappingState, setMappingState] = useState({});

  // ── Contrast toggles ──
  const [contrastState, setContrastState] = useState({});

  // ── Contrast fabrics state: { [sectionKey]: [{ id, fabricId, fabricName }] } ──
  const [contrastFabrics, setContrastFabrics] = useState({});

  // ── Toast ──
  const [toast, setToast] = useState(null);

  // Track product creation to avoid duplicate triggers
  const [creatingProductFor, setCreatingProductFor] = useState(null);

  // Fetch fabrics, categories & products on mount
  useEffect(() => {
    fetchCatalogCategories();
    fetchCatalogProducts();
    const fetchFabrics = async () => {
      try {
        const res = await adminService.getFabrics({ limit: 100 });
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setFabrics(data.map((f) => ({
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
  }, [setFabrics, fetchCatalogCategories, fetchCatalogProducts]);

  // Fetch group-fabric mappings once groups are loaded
  useEffect(() => {
    if (state.fabricGroups.length > 0) {
      fetchAllGroupMappings(state.fabricGroups);
    }
  }, [state.fabricGroups, fetchAllGroupMappings]);

  // ── Find "Custom Shirt" category initially ──
  const shirtCategory = useMemo(
    () => (state.catalogCategories || []).find(
      (c) => c?.name?.toLowerCase().includes("custom shirt") || c?.name?.toLowerCase().includes("shirt")
    ) || state.catalogCategories[0] || null,
    [state.catalogCategories]
  );

  // Initialize selectedCategoryId once shirtCategory is loaded
  useEffect(() => {
    if (shirtCategory && !selectedCategoryId) {
      setSelectedCategoryId(shirtCategory.id);
    }
  }, [shirtCategory, selectedCategoryId]);

  // Find the corresponding product for the selected category
  const currentProduct = useMemo(() => {
    if (!selectedCategoryId || !state.catalogProducts) return null;
    return state.catalogProducts.find((p) => p.categoryId === selectedCategoryId) || null;
  }, [selectedCategoryId, state.catalogProducts]);

  // Auto-create a default product if a category is selected but has no products
  useEffect(() => {
    if (selectedCategoryId && state.catalogCategories.length > 0 && creatingProductFor !== selectedCategoryId) {
      const categoryProducts = (state.catalogProducts || []).filter(
        (p) => p.categoryId === selectedCategoryId
      );
      if (categoryProducts.length === 0) {
        const cat = state.catalogCategories.find((c) => c.id === selectedCategoryId);
        if (cat) {
          setCreatingProductFor(selectedCategoryId);
          const name = `Default ${cat.name}`;
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          adminService.createProduct({
            name,
            slug,
            description: `Default product for ${cat.name}`,
            isActive: true,
            basePrice: 0,
            currency: "INR",
            categoryId: selectedCategoryId
          }).then(() => {
            fetchCatalogProducts();
          }).catch((err) => {
            console.error("Failed to auto-create default product", err);
          });
        }
      }
    }
  }, [selectedCategoryId, state.catalogProducts, state.catalogCategories, fetchCatalogProducts, creatingProductFor]);

  // Fetch product tree dynamically whenever the active product changes
  useEffect(() => {
    if (!currentProduct) {
      setProductTree(null);
      setLoadingTree(false);
      return;
    }
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const res = await adminService.getProductTree(currentProduct.id);
        setProductTree(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to load product tree for category product", err);
        setProductTree(null);
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
  }, [currentProduct]);

  // ── Groups for selected category ──
  const categoryGroups = useMemo(() => {
    if (!selectedCategoryId) return [];
    return state.fabricGroups.filter(
      (g) =>
        g.isActive !== false &&
        (g.categories?.some((c) => c.id === selectedCategoryId) ||
         g.categoryIds?.includes(selectedCategoryId) ||
         !g.categories ||
         g.categories.length === 0)
    );
  }, [state.fabricGroups, selectedCategoryId]);

  // ── Fabrics in selected group ──
  const groupFabrics = useMemo(() => {
    if (!selectedGroupId) return [];
    const fabricIds = state.fabricGroupMappings
      .filter((m) => m.groupId === selectedGroupId)
      .map((m) => m.fabricId);
    return state.fabrics.filter(
      (f) => (fabricIds.includes(f.id) || fabricIds.includes(f.fabricId)) && f.status === "active"
    );
  }, [state.fabrics, state.fabricGroupMappings, selectedGroupId]);

  const selectedFabric = useMemo(
    () => state.fabrics.find((f) => f.id === selectedFabricId) || null,
    [state.fabrics, selectedFabricId]
  );

  // ── Dynamic Shirt Components from Product Tree ──
  const dynamicShirtComponents = useMemo(() => {
    if (!productTree || !productTree.parts) return [];
    return productTree.parts
      .filter((part) => part.isActive !== false)
      .map((part) => {
        const hasContrast = ["collar", "cuff"].includes(part.slug?.toLowerCase() || part.name?.toLowerCase());
        return {
          key: part.slug || part.id,
          id: part.id,
          title: part.name,
          hasContrast,
          options: (part.types || [])
            .filter((t) => t.isActive !== false)
            .map((t) => ({
              key: t.id,
              label: t.name,
              image: getPublicAssetUrl(t.assetId || t.asset?.id) || t.imageUrl || t.asset?.url || "",
              isDefault: t.isDefault,
            })),
        };
      });
  }, [productTree]);

  // ── Initialize mapping state from Server ──
  const handleLoad = useCallback(async () => {
    if (!selectedFabricId || !selectedCategoryId || !productTree) return;
    setLoading(true);
    setLoaded(false);
    setMappingState({});

    const initContrast = {};
    const initContrastFabrics = {};
    dynamicShirtComponents.forEach((section) => {
      if (section.hasContrast) {
        initContrast[section.key] = false;
        initContrastFabrics[section.key] = [];
      }
    });

    setContrastState(initContrast);
    setContrastFabrics(initContrastFabrics);

    try {
      const mappingRes = await adminService.getMapping(selectedFabricId);
      const mappingData = mappingRes.data?.data || mappingRes.data || {};
      const availabilityList = mappingData.availability || [];
      const contrastList = mappingData.contrast || [];

      const newState = {};
      const newContrastState = { ...initContrast };
      const newContrastFabrics = { ...initContrastFabrics };

      // Map to cache group fabric detail fetches
      const groupCache = {};

      for (const section of dynamicShirtComponents) {
        newState[section.key] = {};
        for (const opt of section.options) {
          const partTypeId = opt.key;

          let checked = false;
          let image = opt.image || "";
          let isDefault = opt.isDefault || false;
          let enableContrast = false;
          let contrastGroupId = "";

          if (partTypeId) {
            const availMatch = availabilityList.find(m => m.partTypeId === partTypeId && m.isChecked);
            checked = !!availMatch;

            const contrastMatch = contrastList.find(m => m.partTypeId === partTypeId);
            enableContrast = !!contrastMatch?.enableContrast;
            contrastGroupId = contrastMatch?.contrastGroupId || "";

            if (enableContrast && section.hasContrast) {
              newContrastState[section.key] = true;
              
              if (contrastGroupId) {
                if (!groupCache[contrastGroupId]) {
                  try {
                    const groupRes = await adminService.getGroup(contrastGroupId);
                    const groupData = groupRes.data?.data || groupRes.data || {};
                    const items = groupData.items || groupData.fabrics || groupData.fabricIds
                      || groupData.groupItems || groupData.fabricList || groupData.members || [];
                    const fabricsList = [];
                    for (const item of items) {
                      const fId = typeof item === 'string' ? item : (item.fabricId || item.id);
                      const fabric = state.fabrics.find(f => f.id === fId);
                      if (fabric && fabric.id !== selectedFabricId) {
                        fabricsList.push({
                          id: fabric.id,
                          fabricId: fabric.fabricId,
                          fabricName: fabric.fabricName
                        });
                      }
                    }
                    groupCache[contrastGroupId] = fabricsList;
                  } catch (err) {
                    console.error("Failed to load contrast group fabrics:", err);
                    groupCache[contrastGroupId] = [];
                  }
                }
                
                const fabricsList = groupCache[contrastGroupId];
                fabricsList.forEach(fabric => {
                  if (!newContrastFabrics[section.key].some(f => f.id === fabric.id)) {
                    newContrastFabrics[section.key].push(fabric);
                  }
                });
              }
            }
          }

          newState[section.key][opt.key] = {
            checked,
            image,
            isDefault,
            enableContrast,
            contrastGroupId,
            isUploading: false,
          };
        }
      }

      setMappingState(newState);
      setContrastState(newContrastState);
      setContrastFabrics(newContrastFabrics);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to load fabric mappings:", err);
      setToast("Failed to load fabric mappings.");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [selectedFabricId, selectedCategoryId, productTree, dynamicShirtComponents, state.fabrics]);

  // Reset on fabric / group selection changes
  useEffect(() => {
    setLoaded(false);
    setMappingState({});
    const initContrast = {};
    const initContrastFabrics = {};
    dynamicShirtComponents.forEach((section) => {
      if (section.hasContrast) {
        initContrast[section.key] = false;
        initContrastFabrics[section.key] = [];
      }
    });
    setContrastState(initContrast);
    setContrastFabrics(initContrastFabrics);
  }, [selectedGroupId, selectedFabricId, dynamicShirtComponents]);

  // ── Option check / uncheck ──
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

  // ── Add contrast fabric by Fabric ID (fabric code) ──
  const handleAddContrastFabric = useCallback((sectionKey, fabricCode) => {
    const fabric = state.fabrics.find(f => f.fabricId.toLowerCase() === fabricCode.toLowerCase());
    if (!fabric) {
      setToast(`Fabric code "${fabricCode}" not found.`);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (fabric.id === selectedFabricId) {
      setToast("Same fabric inside group = auto-disabled (Default fabric cannot be duplicated)");
      setTimeout(() => setToast(null), 3500);
      return;
    }

    setContrastFabrics((prev) => {
      const list = prev[sectionKey] || [];
      if (list.some(f => f.id === fabric.id)) {
        setToast("Fabric already added to contrast group.");
        setTimeout(() => setToast(null), 3000);
        return prev;
      }
      return {
        ...prev,
        [sectionKey]: [...list, { id: fabric.id, fabricId: fabric.fabricId, fabricName: fabric.fabricName }],
      };
    });
  }, [state.fabrics, selectedFabricId]);

  // ── Remove contrast fabric ──
  const handleRemoveContrastFabric = useCallback((sectionKey, fabricId) => {
    setContrastFabrics((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter(f => f.id !== fabricId),
    }));
  }, []);

  // ── Immediate uploader for base option images ──
  const handleImageUpload = useCallback(async (sectionKey, optionKey, file) => {
    const partTypeId = optionKey;
    if (!partTypeId) return;

    setMappingState((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [optionKey]: {
          ...(prev[sectionKey]?.[optionKey] || {}),
          isUploading: true,
        },
      },
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "PRODUCT");

      const assetRes = await adminService.uploadAsset(formData);
      const assetData = assetRes.data?.data || assetRes.data;

      if (!assetData?.id) {
        throw new Error("Asset upload response missing ID");
      }

      // Update globally on catalog part type
      await adminService.updatePartType(partTypeId, { assetId: assetData.id });

      const imageUrl = getPublicAssetUrl(assetData.id || assetData.asset?.id) || assetData.url || assetData.asset?.url || "";
      setMappingState((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [optionKey]: {
            ...(prev[sectionKey]?.[optionKey] || {}),
            image: imageUrl,
            isUploading: false,
            checked: true, // Auto check
          },
        },
      }));

      setToast("Image uploaded and linked successfully!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Failed to upload image:", err);
      setMappingState((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [optionKey]: {
            ...(prev[sectionKey]?.[optionKey] || {}),
            isUploading: false,
          },
        },
      }));
      setToast("Failed to upload image.");
      setTimeout(() => setToast(null), 4000);
    }
  }, []);

  // ── Immediate uploader for contrast fabric option images ──
  const handleContrastImageUpload = useCallback(async (optionKey, contrastFabricId, file) => {
    let sectionKey = "collar";
    for (const section of dynamicShirtComponents) {
      if (section.options.some(opt => opt.key === optionKey)) {
        sectionKey = section.key;
        break;
      }
    }

    setMappingState((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [optionKey]: {
          ...(prev[sectionKey]?.[optionKey] || {}),
          isUploading: true,
        },
      },
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "PRODUCT");

      const assetRes = await adminService.uploadAsset(formData);
      const assetData = assetRes.data?.data || assetRes.data;
      const imageUrl = getPublicAssetUrl(assetData.id || assetData.asset?.id) || assetData.url || assetData.asset?.url || "";

      await adminService.updatePartType(optionKey, { assetId: assetData.id });

      setMappingState((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [optionKey]: {
            ...(prev[sectionKey]?.[optionKey] || {}),
            image: imageUrl,
            isUploading: false,
          },
        },
      }));
      setToast("Image uploaded successfully!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      setMappingState((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [optionKey]: {
            ...(prev[sectionKey]?.[optionKey] || {}),
            isUploading: false,
          },
        },
      }));
      setToast("Failed to upload contrast image.");
      setTimeout(() => setToast(null), 3000);
    }
  }, [dynamicShirtComponents]);

  // ── Get list of checked options for contrast display ──
  const getCheckedOptions = (sectionKey) => {
    const sectionMap = mappingState[sectionKey] || {};
    const section = dynamicShirtComponents.find((s) => s.key === sectionKey);
    return section?.options
      .filter((opt) => sectionMap[opt.key]?.checked)
      .map((opt) => ({
        key: opt.key,
        label: opt.label,
        image: sectionMap[opt.key]?.image || "",
      })) || [];
  };

  // ── Progress / Stats ──
  const progress = useMemo(() => {
    let totalSections = dynamicShirtComponents.length;
    let completeSections = 0;
    let totalChecked = 0;
    let totalImages = 0;
    let totalMissing = 0;

    dynamicShirtComponents.forEach((section) => {
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
  }, [mappingState, dynamicShirtComponents]);

  const progressPercent = progress.totalSections > 0
    ? Math.round((progress.completeSections / progress.totalSections) * 100)
    : 0;

  // ── Validation ──
  const validationIssues = useMemo(() => {
    if (!loaded) return [];
    const issues = [];
    dynamicShirtComponents.forEach((section) => {
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
  }, [loaded, mappingState, dynamicShirtComponents]);

  const isAnyUploading = useMemo(() => {
    return Object.values(mappingState).some((sectionMap) =>
      Object.values(sectionMap).some((v) => v.isUploading)
    );
  }, [mappingState]);

  // ── Save Mapping ──
  const handleSave = useCallback(async (mapAnother = false) => {
    if (validationIssues.length > 0) return;

    setIsSaving(true);
    try {
      // 1. Create or update contrast fabric groups
      const contrastGroupIds = {};

      for (const section of dynamicShirtComponents) {
        const enabled = !!contrastState[section.key];
        if (enabled && selectedFabric) {
          const expectedGroupName = `Contrast - ${selectedFabric.fabricName} - ${section.title}`;
          let group = state.fabricGroups.find((g) => g.groupName === expectedGroupName);
          let groupId;

          if (group) {
            groupId = group.id;
          } else {
            const groupRes = await adminService.createGroup({
              name: expectedGroupName,
              categoryIds: [selectedCategoryId],
            });
            const createdGroup = groupRes.data?.data || groupRes.data;
            groupId = createdGroup.id;
          }

          const additionalFabrics = contrastFabrics[section.key] || [];
          const fabricIds = [selectedFabricId, ...additionalFabrics.map((f) => f.id)];
          await adminService.updateGroupItems(groupId, fabricIds);
          contrastGroupIds[section.key] = groupId;
        }
      }

      // 2. Update default settings on Catalog Part Types if changed
      const partTypePromises = [];
      dynamicShirtComponents.forEach((section) => {
        const sectionMap = mappingState[section.key] || {};
        section.options.forEach((opt) => {
          const partTypeId = opt.key;
          const val = sectionMap[opt.key] || {};
          if (val.isDefault !== opt.isDefault) {
            partTypePromises.push(adminService.updatePartType(partTypeId, { isDefault: !!val.isDefault }));
          }
        });
      });

      if (partTypePromises.length > 0) {
        await Promise.all(partTypePromises);
      }

      // 3. Save customization mappings to the database
      const mappingPromises = [];
      dynamicShirtComponents.forEach((section) => {
        const sectionMap = mappingState[section.key] || {};
        const enableContrast = !!contrastState[section.key];
        const contrastGroupId = contrastGroupIds[section.key] || null;

        section.options.forEach((opt) => {
          const partTypeId = opt.key;
          const val = sectionMap[opt.key] || {};
          mappingPromises.push(adminService.createMapping({
            fabricId: selectedFabricId,
            partTypeId,
            isChecked: !!val.checked,
            enableContrast,
            contrastGroupId,
          }));
        });
      });

      await Promise.all(mappingPromises);

      setToast("Custom Shirt mapping saved!");
      setTimeout(() => setToast(null), 3000);

      if (mapAnother) {
        setSelectedFabricId("");
        setLoaded(false);
        setMappingState({});
        const initContrast = {};
        const initContrastFabrics = {};
        dynamicShirtComponents.forEach((section) => {
          if (section.hasContrast) {
            initContrast[section.key] = false;
            initContrastFabrics[section.key] = [];
          }
        });
        setContrastState(initContrast);
        setContrastFabrics(initContrastFabrics);
      } else {
        await handleLoad();
      }
    } catch (err) {
      console.error("Failed to save mappings", err);
      setToast("Failed to save mappings. Please try again.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsSaving(false);
    }
  }, [
    validationIssues,
    mappingState,
    contrastState,
    contrastFabrics,
    selectedFabric,
    selectedFabricId,
    selectedCategoryId,
    dynamicShirtComponents,
    state.fabricGroups,
    handleLoad,
  ]);

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
          <select
            className="admin-select"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedGroupId("");
              setSelectedFabricId("");
              setLoaded(false);
            }}
          >
            <option value="">Select Category</option>
            {(state.catalogCategories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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
          <button className="admin-btn admin-btn-primary" onClick={handleLoad} disabled={loading || loadingTree}>
            {loading ? "Loading Mappings..." : "Load Shirt Components"}
          </button>
        </div>
      )}

      {/* Fabric Info Strip */}
      {loaded && selectedFabric && (
        <div className="csf-fabric-strip">
          {(() => {
            const fabricImage = getPublicAssetUrl(selectedFabric.assetId || selectedFabric.asset?.id) || selectedFabric.image || selectedFabric.imageUrl || selectedFabric.asset?.url || null;
            return fabricImage ? (
              <img src={fabricImage} alt={selectedFabric.fabricName} className="csf-fabric-thumb" />
            ) : (
              <div className="csf-fabric-thumb" />
            );
          })()}
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
      {loadingTree ? (
        <div className="csf-empty">
          <p>⏳ Loading product specifications...</p>
        </div>
      ) : loaded ? (
        dynamicShirtComponents.map((section, idx) => (
          <ShirtComponentSection
            key={section.key}
            index={idx + 1}
            title={section.title}
            options={section.options}
            mappings={mappingState[section.key] || {}}
            onChange={(optionKey, updates) => handleOptionChange(section.key, optionKey, updates)}
            onImageUpload={(optionKey, file) => handleImageUpload(section.key, optionKey, file)}
            onSetDefault={(optionKey) => handleSetDefault(section.key, optionKey)}
            hasContrast={!!section.hasContrast}
            contrastEnabled={contrastState[section.key] || false}
            onContrastToggle={() => handleContrastToggle(section.key)}
            defaultFabric={selectedFabric ? { fabricId: selectedFabric.fabricId, fabricName: selectedFabric.fabricName, id: selectedFabric.id } : null}
            checkedOptions={getCheckedOptions(section.key)}
            contrastFabrics={contrastFabrics[section.key] || []}
            onAddContrastFabric={(fabricCode) => handleAddContrastFabric(section.key, fabricCode)}
            onRemoveContrastFabric={(fabricId) => handleRemoveContrastFabric(section.key, fabricId)}
            onContrastOptionChange={() => {}}
            onContrastImageUpload={handleContrastImageUpload}
            allFabrics={state.fabrics}
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
                const initContrast = {};
                const initContrastFabrics = {};
                dynamicShirtComponents.forEach((section) => {
                  if (section.hasContrast) {
                    initContrast[section.key] = false;
                    initContrastFabrics[section.key] = [];
                  }
                });
                setContrastState(initContrast);
                setContrastFabrics(initContrastFabrics);
              }}
              disabled={isSaving || isAnyUploading}
            >
              Cancel
            </button>
            <button
              className="admin-btn"
              onClick={() => handleSave(true)}
              disabled={(validationIssues.length > 0 && progress.totalChecked > 0) || isSaving || isAnyUploading}
              style={validationIssues.length === 0 ? { borderColor: "#6366f1", color: "#6366f1" } : {}}
            >
              Save & Map Another
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => handleSave(false)}
              disabled={(validationIssues.length > 0 && progress.totalChecked > 0) || isSaving || isAnyUploading}
            >
              {isSaving ? "Saving Mappings..." : "Save Mapping"}
            </button>
          </div>
        </ActionBar>
      )}

      {/* Toast */}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
