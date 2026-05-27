import { useState, useMemo, useCallback, useEffect } from "react";
import { useAdmin } from "../../store/adminStore";
import { adminService } from "../../../services/adminService";
import SHIRT_COMPONENTS, { initialContrastState } from "./shirtConfig";
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
 * Category-specific mapping page hardcoded for "Custom Shirt".
 * 8 component sections with contrast support for Collar & Cuff.
 * Synchronized with the database catalog APIs.
 */
export default function CustomShirtPage() {
  const { state, setFabrics, fetchAllGroupMappings, fetchCatalogCategories } = useAdmin();

  // ── Selection state ──
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
  const [contrastState, setContrastState] = useState(initialContrastState());

  // ── Contrast fabrics state: { [sectionKey]: [{ id, fabricId, fabricName }] } ──
  const [contrastFabrics, setContrastFabrics] = useState({ collar: [], cuff: [] });

  // ── Toast ──
  const [toast, setToast] = useState(null);

  // Fetch fabrics & categories on mount
  useEffect(() => {
    fetchCatalogCategories();
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
            image: f.image || f.imageUrl || f.asset?.url || null,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch fabrics", err);
      }
    };
    fetchFabrics();
  }, [setFabrics, fetchCatalogCategories]);

  // Fetch group-fabric mappings once groups are loaded
  useEffect(() => {
    if (state.fabricGroups.length > 0) {
      fetchAllGroupMappings(state.fabricGroups);
    }
  }, [state.fabricGroups, fetchAllGroupMappings]);

  // Fetch product tree on mount
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await adminService.getProductTree("s91724-5554-00-uuid");
        setProductTree(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to load Custom Shirt product tree", err);
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
  }, []);

  // ── Find "Custom Shirt" category ──
  const shirtCategory = useMemo(
    () => (state.catalogCategories || []).find(
      (c) => c?.name?.toLowerCase().includes("custom shirt") || c?.name?.toLowerCase().includes("shirt")
    ) || state.catalogCategories[0] || null,
    [state.catalogCategories]
  );



  const categoryId = shirtCategory?.id || "";

  // ── Groups for this category ──
  const categoryGroups = useMemo(() => {
    if (!categoryId) return [];
    return state.fabricGroups.filter(
      (g) =>
        g.isActive !== false &&
        (g.categories?.some((c) => c.id === categoryId) ||
         g.categoryIds?.includes(categoryId) ||
         !g.categories ||
         g.categories.length === 0)
    );
  }, [state.fabricGroups, categoryId]);

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

  // ── Resolve Option Keys to database partTypeId ──
  const resolvedOptionsMap = useMemo(() => {
    if (!productTree) return { map: {}, reverseMap: {} };

    const map = {}; // { [sectionKey]: { [optionKey]: { partTypeId, image, isDefault } } }
    const reverseMap = {}; // { [partTypeId]: { sectionKey, optionKey } }

    const existingParts = productTree.parts || [];

    const DESIRED_STRUCTURE = {
      "collar": "Collar",
      "cuff": "Cuff",
      "placket": "Placket",
      "back_details": "Back Details",
      "chest_pocket": "Chest Pocket",
      "sleeve": "Sleeve",
      "hem": "Hem",
      "button": "Accessories — Button"
    };

    const NAME_MAP = {
      "classic": ["Classic"],
      "classic_widespread": ["Classic Widespread"],
      "curved": ["Curved", "Curved Cutaway"],
      "cutaway": ["Cutaway"],
      "high_widespread": ["High Widespread"],
      "point": ["Point"],
      "button_down": ["Button Down"],
      "band": ["Band"],
      "wing_tip": ["Wing Tip"],
      "club": ["Club"],
      "single_round": ["Single Round", "Single Cuff One Button", "Single Round Adjustable"],
      "single_eclipse": ["Single Eclipse", "Single Cuff Elipse"],
      "single_chisel": ["Single Chisel", "Single Chisel Adjustable"],
      "single_square": ["Single Square"],
      "double_cuff_round": ["Double Cuff Round"],
      "double_cuff_square": ["Double Cuff Square"],
      "double_cuff_chisel": ["Double Cuff Chisel"],
      "turnback_cuff": ["Turnback Cuff"],
      "plain": ["Plain", "Plain - Hem Standard", "Plain - Hem Curved"],
      "hidden_button": ["Hidden Button", "Hidden Button - Hem Standard", "Hidden Button - Hem Curved"],
      "half_hidden_button": ["Half Hidden Button"],
      "stitched_on": ["Stitched-On", "Stitched-On - Hem Standard", "Stitched-On - Hem Curved"],
      "plain_bib": ["Plain Bib"],
      "pleated_bib": ["Pleated Bib"],
      "rear_side_pleats": ["Rear Side Pleats"],
      "center_box_pleats": ["Center Box Pleats"],
      "box_pleat": ["Box Pleat"],
      "no_back_pleats": ["No Back Pleats"],
      "dart_pleats": ["Dart Pleats"],
      "no_pocket": ["No Pocket"],
      "patch_pocket": ["Patch Pocket", "Single Patch"],
      "regular_pocket": ["Regular Pocket"],
      "regular_flap_pocket": ["Regular Flap Pocket"],
      "long_sleeve": ["Long Sleeve"],
      "short_sleeve": ["Short Sleeve"],
      "straight": ["Straight"],
      "gusset": ["Gusset"],
      "tie": ["Tie"],
      "bow": ["Bow"]

    };

    SHIRT_COMPONENTS.forEach((section) => {
      const dbPartName = DESIRED_STRUCTURE[section.key];
      const dbPart = existingParts.find(p => p.name.toLowerCase() === dbPartName.toLowerCase());

      map[section.key] = {};

      section.options.forEach((opt) => {
        let matchedType = null;
        if (dbPart) {
          const aliases = NAME_MAP[opt.key] || [opt.key];
          for (const alias of aliases) {
            matchedType = (dbPart.types || []).find(t => t.name.toLowerCase() === alias.toLowerCase());
            if (matchedType) break;
          }
        }

        if (matchedType) {
          map[section.key][opt.key] = {
            partTypeId: matchedType.id,
            image: matchedType.asset?.url || matchedType.imageUrl || "",
            isDefault: matchedType.isDefault,
          };
          reverseMap[matchedType.id] = { sectionKey: section.key, optionKey: opt.key };
        } else {
          map[section.key][opt.key] = {
            partTypeId: null,
            image: "",
            isDefault: false,
          };
        }
      });
    });

    return { map, reverseMap };
  }, [productTree]);

  // ── Initialize mapping state from Server ──
  const handleLoad = useCallback(async () => {
    if (!selectedFabricId || !categoryId || !resolvedOptionsMap.reverseMap) return;
    setLoading(true);
    setLoaded(false);
    setMappingState({});
    setContrastState(initialContrastState());
    setContrastFabrics({ collar: [], cuff: [] });

    try {
      const mappingRes = await adminService.getMapping(selectedFabricId);
      const mappingData = mappingRes.data?.data || mappingRes.data || {};
      const availabilityList = mappingData.availability || [];
      const contrastList = mappingData.contrast || [];

      const newState = {};
      const newContrastState = initialContrastState();
      const newContrastFabrics = { collar: [], cuff: [] };

      // Map to cache group fabric detail fetches
      const groupCache = {};

      for (const section of SHIRT_COMPONENTS) {
        newState[section.key] = {};
        for (const opt of section.options) {
          const resolved = resolvedOptionsMap.map[section.key]?.[opt.key];
          const partTypeId = resolved?.partTypeId;

          let checked = false;
          let image = resolved?.image || "";
          let isDefault = resolved?.isDefault || false;
          let enableContrast = false;
          let contrastGroupId = "";

          if (partTypeId) {
            const availMatch = availabilityList.find(m => m.partTypeId === partTypeId && m.isChecked);
            checked = !!availMatch;

            const contrastMatch = contrastList.find(m => m.partTypeId === partTypeId);
            enableContrast = !!contrastMatch?.enableContrast;
            contrastGroupId = contrastMatch?.contrastGroupId || "";

            if (enableContrast) {
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
  }, [selectedFabricId, categoryId, resolvedOptionsMap, state.fabrics]);

  // Reset on fabric / group selection changes
  useEffect(() => {
    setLoaded(false);
    setMappingState({});
    setContrastState(initialContrastState());
    setContrastFabrics({ collar: [], cuff: [] });
  }, [selectedGroupId, selectedFabricId]);

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
    const resolved = resolvedOptionsMap.map[sectionKey]?.[optionKey];
    const partTypeId = resolved?.partTypeId;
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

      const imageUrl = assetData.url || assetData.asset?.url || "";
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
  }, [resolvedOptionsMap]);

  // ── Immediate uploader for contrast fabric option images ──
  const handleContrastImageUpload = useCallback(async (optionKey, contrastFabricId, file) => {
    // Find sectionKey from resolved map
    const resolved = resolvedOptionsMap.reverseMap[resolvedOptionsMap.map.collar?.[optionKey]?.partTypeId || resolvedOptionsMap.map.cuff?.[optionKey]?.partTypeId];
    const sectionKey = resolved?.sectionKey || "collar";

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
      const imageUrl = assetData.url || assetData.asset?.url || "";

      const partTypeId = resolvedOptionsMap.map[sectionKey]?.[optionKey]?.partTypeId;
      if (partTypeId) {
        await adminService.updatePartType(partTypeId, { assetId: assetData.id });
      }

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
  }, [resolvedOptionsMap]);

  // ── Get list of checked options for contrast display ──
  const getCheckedOptions = (sectionKey) => {
    const sectionMap = mappingState[sectionKey] || {};
    return SHIRT_COMPONENTS.find((s) => s.key === sectionKey)?.options
      .filter((opt) => sectionMap[opt.key]?.checked)
      .map((opt) => ({
        key: opt.key,
        label: opt.label,
        image: sectionMap[opt.key]?.image || "",
      })) || [];
  };

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

      for (const section of SHIRT_COMPONENTS) {
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
              categoryIds: [categoryId],
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
      SHIRT_COMPONENTS.forEach((section) => {
        const sectionMap = mappingState[section.key] || {};
        section.options.forEach((opt) => {
          const resolved = resolvedOptionsMap.map[section.key]?.[opt.key];
          const partTypeId = resolved?.partTypeId;
          if (partTypeId) {
            const val = sectionMap[opt.key] || {};
            if (val.isDefault !== resolved.isDefault) {
              partTypePromises.push(adminService.updatePartType(partTypeId, { isDefault: !!val.isDefault }));
            }
          }
        });
      });

      if (partTypePromises.length > 0) {
        await Promise.all(partTypePromises);
      }

      // 3. Save customization mappings to the database
      const mappingPromises = [];
      SHIRT_COMPONENTS.forEach((section) => {
        const sectionMap = mappingState[section.key] || {};
        const enableContrast = !!contrastState[section.key];
        const contrastGroupId = contrastGroupIds[section.key] || null;

        section.options.forEach((opt) => {
          const resolved = resolvedOptionsMap.map[section.key]?.[opt.key];
          const partTypeId = resolved?.partTypeId;
          if (partTypeId) {
            const val = sectionMap[opt.key] || {};
            mappingPromises.push(adminService.createMapping({
              fabricId: selectedFabricId,
              partTypeId,
              isChecked: !!val.checked,
              enableContrast,
              contrastGroupId,
            }));
          }
        });
      });

      await Promise.all(mappingPromises);

      setToast("Custom Shirt mapping saved!");
      setTimeout(() => setToast(null), 3000);

      if (mapAnother) {
        setSelectedFabricId("");
        setLoaded(false);
        setMappingState({});
        setContrastState(initialContrastState());
        setContrastFabrics({ collar: [], cuff: [] });
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
    categoryId,
    resolvedOptionsMap,
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
        SHIRT_COMPONENTS.map((section, idx) => (
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
                setContrastState(initialContrastState());
                setContrastFabrics({ collar: [], cuff: [] });
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
