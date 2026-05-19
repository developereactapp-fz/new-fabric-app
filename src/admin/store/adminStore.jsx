/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { adminService } from "../../services/adminService";

const genId = () => Math.random().toString(36).substr(2, 9);

// ─── Initial State ───────────────────────────────────────────────
const defaultInitialState = {
  isLoading: false,
  error: null,
  attributes: {},
  categories: [],
  components: {},
  componentValues: {},
  subCategories: {},
  subCategoryValues: {},
  fabrics: [],
  fabricGroups: [],
  fabricGroupMappings: [],
  fabricMappings: [],
  builderGroups: [],
  contrastMappings: [],
  contrastMappingItems: [],
  catalogCategories: [],
  catalogProducts: [],
  catalogParts: [],
  catalogPartTypes: [],
  catalogPartOptions: [],
};

// ─── Action Types ────────────────────────────────────────────────
const A = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_FABRIC_PARTS: "SET_FABRIC_PARTS",
  SET_GROUPS: "SET_GROUPS",
  SET_FABRICS: "SET_FABRICS",
  SET_MAPPINGS: "SET_MAPPINGS",
  SET_ATTRIBUTES: "SET_ATTRIBUTES",
  // Category
  ADD_CATEGORY: "ADD_CATEGORY",
  EDIT_CATEGORY: "EDIT_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",
  // Component (fabric part)
  ADD_COMPONENT: "ADD_COMPONENT",
  EDIT_COMPONENT: "EDIT_COMPONENT",
  DELETE_COMPONENT: "DELETE_COMPONENT",
  // Component values
  ADD_COMP_VALUE: "ADD_COMP_VALUE",
  EDIT_COMP_VALUE: "EDIT_COMP_VALUE",
  DELETE_COMP_VALUE: "DELETE_COMP_VALUE",
  SET_DEFAULT_VALUE: "SET_DEFAULT_VALUE",
  // Sub-categories
  SET_SUBCATEGORIES: "SET_SUBCATEGORIES",
  SET_SUBCATEGORY_VALUES: "SET_SUBCATEGORY_VALUES",
  ADD_SUBCATEGORY: "ADD_SUBCATEGORY",
  EDIT_SUBCATEGORY: "EDIT_SUBCATEGORY",
  DELETE_SUBCATEGORY: "DELETE_SUBCATEGORY",
  ADD_SUBCAT_VALUE: "ADD_SUBCAT_VALUE",
  EDIT_SUBCAT_VALUE: "EDIT_SUBCAT_VALUE",
  DELETE_SUBCAT_VALUE: "DELETE_SUBCAT_VALUE",
  // Fabrics
  ADD_FABRIC: "ADD_FABRIC",
  EDIT_FABRIC: "EDIT_FABRIC",
  DELETE_FABRIC: "DELETE_FABRIC",
  TOGGLE_STATUS: "TOGGLE_STATUS",
  // Fabric groups
  ADD_FABRIC_GROUP: "ADD_FABRIC_GROUP",
  EDIT_FABRIC_GROUP: "EDIT_FABRIC_GROUP",
  DELETE_FABRIC_GROUP: "DELETE_FABRIC_GROUP",
  TOGGLE_FABRIC_GROUP: "TOGGLE_FABRIC_GROUP",
  // Fabric group mappings
  SET_GROUP_MAPPINGS: "SET_GROUP_MAPPINGS",
  ADD_FG_MAPPING: "ADD_FG_MAPPING",
  REMOVE_FG_MAPPING: "REMOVE_FG_MAPPING",
  // Builder groups
  ADD_BUILDER_GROUP: "ADD_BUILDER_GROUP",
  // Attributes
  ADD_ATTR_VALUE: "ADD_ATTR_VALUE",
  EDIT_ATTR_VALUE: "EDIT_ATTR_VALUE",
  DELETE_ATTR_VALUE: "DELETE_ATTR_VALUE",
  IMPORT_ATTR_VALUES: "IMPORT_ATTR_VALUES",
  SET_ATTRIBUTE_VALUES: "SET_ATTRIBUTE_VALUES",
  // Mappings
  BULK_SAVE_MAPPINGS: "BULK_SAVE_MAPPINGS",
  // Catalog
  SET_CATALOG_CATEGORIES: "SET_CATALOG_CATEGORIES",
  ADD_CATALOG_CATEGORY: "ADD_CATALOG_CATEGORY",
  EDIT_CATALOG_CATEGORY: "EDIT_CATALOG_CATEGORY",
  DELETE_CATALOG_CATEGORY: "DELETE_CATALOG_CATEGORY",
  SET_CATALOG_PRODUCTS: "SET_CATALOG_PRODUCTS",
  SET_CATALOG_PARTS: "SET_CATALOG_PARTS",
  SET_CATALOG_PART_TYPES: "SET_CATALOG_PART_TYPES",
  SET_CATALOG_PART_OPTIONS: "SET_CATALOG_PART_OPTIONS",
  ADD_CATALOG_PRODUCT: "ADD_CATALOG_PRODUCT",
  EDIT_CATALOG_PRODUCT: "EDIT_CATALOG_PRODUCT",
  DELETE_CATALOG_PRODUCT: "DELETE_CATALOG_PRODUCT",
  ADD_CATALOG_PART: "ADD_CATALOG_PART",
  EDIT_CATALOG_PART: "EDIT_CATALOG_PART",
  DELETE_CATALOG_PART: "DELETE_CATALOG_PART",
  ADD_CATALOG_TYPE: "ADD_CATALOG_TYPE",
  EDIT_CATALOG_TYPE: "EDIT_CATALOG_TYPE",
  DELETE_CATALOG_TYPE: "DELETE_CATALOG_TYPE",
  ADD_CATALOG_OPTION: "ADD_CATALOG_OPTION",
  EDIT_CATALOG_OPTION: "EDIT_CATALOG_OPTION",
  DELETE_CATALOG_OPTION: "DELETE_CATALOG_OPTION",
};

// ─── Reducer ─────────────────────────────────────────────────────
function adminReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    // Global
    case A.SET_LOADING: return { ...state, isLoading: payload };
    case A.SET_ERROR: return { ...state, error: payload };

    // Bulk setters
    case A.SET_CATEGORIES: return { ...state, categories: payload };
    case A.SET_FABRIC_PARTS: return { ...state, fabricPartsFlat: payload };
    case A.SET_GROUPS: return { ...state, fabricGroups: payload, builderGroups: payload };
    case A.SET_FABRICS: return { ...state, fabrics: payload };
    case A.SET_MAPPINGS: return { ...state, fabricMappings: payload };
    case A.SET_ATTRIBUTES: return { ...state, attributes: payload };

    // Catalog setters
    case A.SET_CATALOG_CATEGORIES: return { ...state, catalogCategories: payload };
    case A.SET_CATALOG_PRODUCTS: return { ...state, catalogProducts: payload };
    case A.SET_CATALOG_PARTS: return { ...state, catalogParts: payload };
    case A.SET_CATALOG_PART_TYPES: return { ...state, catalogPartTypes: payload };
    case A.SET_CATALOG_PART_OPTIONS: return { ...state, catalogPartOptions: payload };

    case A.ADD_CATALOG_CATEGORY: return { ...state, catalogCategories: [...state.catalogCategories, payload] };
    case A.EDIT_CATALOG_CATEGORY:
      return { ...state, catalogCategories: state.catalogCategories.map(c => c.id === payload.id ? { ...c, ...payload.updates } : c) };
    case A.DELETE_CATALOG_CATEGORY:
      return { ...state, catalogCategories: state.catalogCategories.filter(c => c.id !== payload) };

    case A.ADD_CATALOG_PRODUCT: return { ...state, catalogProducts: [...state.catalogProducts, payload] };
    case A.EDIT_CATALOG_PRODUCT:
      return { ...state, catalogProducts: state.catalogProducts.map(p => p.id === payload.id ? { ...p, ...payload.updates } : p) };
    case A.DELETE_CATALOG_PRODUCT:
      return { ...state, catalogProducts: state.catalogProducts.filter(p => p.id !== payload) };

    case A.ADD_CATALOG_PART: return { ...state, catalogParts: [...state.catalogParts, payload] };
    case A.EDIT_CATALOG_PART:
      return { ...state, catalogParts: state.catalogParts.map(p => p.id === payload.id ? { ...p, ...payload.updates } : p) };
    case A.DELETE_CATALOG_PART:
      return { ...state, catalogParts: state.catalogParts.filter(p => p.id !== payload) };

    case A.ADD_CATALOG_TYPE: return { ...state, catalogPartTypes: [...state.catalogPartTypes, payload] };
    case A.EDIT_CATALOG_TYPE:
      return { ...state, catalogPartTypes: state.catalogPartTypes.map(t => t.id === payload.id ? { ...t, ...payload.updates } : t) };
    case A.DELETE_CATALOG_TYPE:
      return { ...state, catalogPartTypes: state.catalogPartTypes.filter(t => t.id !== payload) };

    case A.ADD_CATALOG_OPTION: return { ...state, catalogPartOptions: [...state.catalogPartOptions, payload] };
    case A.EDIT_CATALOG_OPTION:
      return { ...state, catalogPartOptions: state.catalogPartOptions.map(o => o.id === payload.id ? { ...o, ...payload.updates } : o) };
    case A.DELETE_CATALOG_OPTION:
      return { ...state, catalogPartOptions: state.catalogPartOptions.filter(o => o.id !== payload) };

    // ── Categories ──
    case A.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, payload] };
    case A.EDIT_CATEGORY:
      return { ...state, categories: state.categories.map(c => c.id === payload.id ? { ...c, ...payload.updates } : c) };
    case A.DELETE_CATEGORY: {
      const newComps = { ...state.components };
      delete newComps[payload];
      return { ...state, categories: state.categories.filter(c => c.id !== payload), components: newComps };
    }

    // ── Components ──
    case A.ADD_COMPONENT: {
      const list = state.components[payload.categoryId] || [];
      return { ...state, components: { ...state.components, [payload.categoryId]: [...list, payload.comp] } };
    }
    case A.EDIT_COMPONENT: {
      const list = (state.components[payload.categoryId] || []).map(c => c.id === payload.compId ? { ...c, ...payload.updates } : c);
      return { ...state, components: { ...state.components, [payload.categoryId]: list } };
    }
    case A.DELETE_COMPONENT: {
      const list = (state.components[payload.categoryId] || []).filter(c => c.id !== payload.compId);
      const newCV = { ...state.componentValues }; delete newCV[payload.compId];
      return { ...state, components: { ...state.components, [payload.categoryId]: list }, componentValues: newCV };
    }

    // ── Component Values ──
    case A.ADD_COMP_VALUE: {
      const vals = state.componentValues[payload.compId] || [];
      return { ...state, componentValues: { ...state.componentValues, [payload.compId]: [...vals, payload.val] } };
    }
    case A.EDIT_COMP_VALUE: {
      const vals = (state.componentValues[payload.compId] || []).map(v => v.id === payload.valId ? { ...v, ...payload.updates } : v);
      return { ...state, componentValues: { ...state.componentValues, [payload.compId]: vals } };
    }
    case A.DELETE_COMP_VALUE: {
      const vals = (state.componentValues[payload.compId] || []).filter(v => v.id !== payload.valId);
      return { ...state, componentValues: { ...state.componentValues, [payload.compId]: vals } };
    }
    case A.SET_DEFAULT_VALUE: {
      const vals = (state.componentValues[payload.compId] || []).map(v => ({ ...v, isDefault: v.id === payload.valId }));
      return { ...state, componentValues: { ...state.componentValues, [payload.compId]: vals } };
    }

    // ── Sub-Categories ──
    case A.SET_SUBCATEGORIES:
      return { ...state, subCategories: { ...state.subCategories, [payload.compId]: payload.subs } };
    case A.SET_SUBCATEGORY_VALUES:
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [payload.subId]: payload.vals } };
    case A.ADD_SUBCATEGORY: {
      const subs = state.subCategories[payload.compId] || [];
      return { ...state, subCategories: { ...state.subCategories, [payload.compId]: [...subs, payload.sub] } };
    }
    case A.EDIT_SUBCATEGORY: {
      const subs = (state.subCategories[payload.compId] || []).map(s => s.id === payload.subId ? { ...s, ...payload.updates } : s);
      return { ...state, subCategories: { ...state.subCategories, [payload.compId]: subs } };
    }
    case A.DELETE_SUBCATEGORY: {
      const subs = (state.subCategories[payload.compId] || []).filter(s => s.id !== payload.subId);
      const newSV = { ...state.subCategoryValues }; delete newSV[payload.subId];
      return { ...state, subCategories: { ...state.subCategories, [payload.compId]: subs }, subCategoryValues: newSV };
    }
    case A.ADD_SUBCAT_VALUE: {
      const vals = state.subCategoryValues[payload.subId] || [];
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [payload.subId]: [...vals, payload.val] } };
    }
    case A.EDIT_SUBCAT_VALUE: {
      const vals = (state.subCategoryValues[payload.subId] || []).map(v => v.id === payload.valId ? { ...v, ...payload.updates } : v);
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [payload.subId]: vals } };
    }
    case A.DELETE_SUBCAT_VALUE: {
      const vals = (state.subCategoryValues[payload.subId] || []).filter(v => v.id !== payload.valId);
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [payload.subId]: vals } };
    }

    // ── Fabrics ──
    case A.ADD_FABRIC:
      return { ...state, fabrics: [...state.fabrics, { id: payload.id || genId(), ...payload }] };
    case A.EDIT_FABRIC:
      return { ...state, fabrics: state.fabrics.map(f => f.id === payload.id ? { ...f, ...payload.updates } : f) };
    case A.DELETE_FABRIC:
      return { ...state, fabrics: state.fabrics.filter(f => f.id !== payload) };
    case A.TOGGLE_STATUS: {
      const { collection, itemId } = payload;
      if (collection === "fabrics") {
        return { ...state, fabrics: state.fabrics.map(f => f.id === itemId ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f) };
      }
      return state;
    }

    // ── Fabric Groups ──
    case A.ADD_FABRIC_GROUP:
      return { ...state, fabricGroups: [...state.fabricGroups, { id: genId(), isActive: true, ...payload }] };
    case A.EDIT_FABRIC_GROUP:
      return { ...state, fabricGroups: state.fabricGroups.map(g => g.id === payload.id ? { ...g, ...payload.updates } : g) };
    case A.DELETE_FABRIC_GROUP:
      return { ...state, fabricGroups: state.fabricGroups.filter(g => g.id !== payload), fabricGroupMappings: state.fabricGroupMappings.filter(m => m.groupId !== payload) };
    case A.TOGGLE_FABRIC_GROUP:
      return { ...state, fabricGroups: state.fabricGroups.map(g => g.id === payload ? { ...g, isActive: !g.isActive } : g) };

    // ── Fabric Group Mappings ──
    case A.SET_GROUP_MAPPINGS:
      return { ...state, fabricGroupMappings: payload };
    case A.ADD_FG_MAPPING:
      return { ...state, fabricGroupMappings: [...state.fabricGroupMappings, { id: genId(), ...payload }] };
    case A.REMOVE_FG_MAPPING:
      return { ...state, fabricGroupMappings: state.fabricGroupMappings.filter(m => !(m.fabricId === payload.fabricId && m.groupId === payload.groupId)) };

    // ── Builder Groups ──
    case A.ADD_BUILDER_GROUP:
      return { ...state, builderGroups: [...state.builderGroups, { id: genId(), ...payload }] };

    // ── Attributes ──
    case A.ADD_ATTR_VALUE: {
      const cat = payload.category;
      const catAttrs = { ...(state.attributes[cat] || {}) };
      const attrList = catAttrs[payload.attrName] || [];
      catAttrs[payload.attrName] = [...attrList, { id: genId(), value: payload.value, status: "active" }];
      return { ...state, attributes: { ...state.attributes, [cat]: catAttrs } };
    }
    case A.EDIT_ATTR_VALUE: {
      const cat = payload.category;
      const catAttrs = { ...(state.attributes[cat] || {}) };
      catAttrs[payload.attrName] = (catAttrs[payload.attrName] || []).map(v => v.id === payload.valId ? { ...v, ...payload.updates } : v);
      return { ...state, attributes: { ...state.attributes, [cat]: catAttrs } };
    }
    case A.DELETE_ATTR_VALUE: {
      const cat = payload.category;
      const catAttrs = { ...(state.attributes[cat] || {}) };
      catAttrs[payload.attrName] = (catAttrs[payload.attrName] || []).filter(v => v.id !== payload.valId);
      return { ...state, attributes: { ...state.attributes, [cat]: catAttrs } };
    }
    case A.SET_ATTRIBUTE_VALUES: {
      const { category: svCat, attribute: svAttr, values: svVals } = payload;
      const catA = { ...(state.attributes[svCat] || {}) };
      catA[svAttr] = svVals;
      return { ...state, attributes: { ...state.attributes, [svCat]: catA } };
    }
    case A.IMPORT_ATTR_VALUES: {
      const newAttrs = { ...state.attributes };
      const { category, attrName, values } = payload;
      const catAttrs = { ...(newAttrs[category] || {}) };
      const existing = catAttrs[attrName] || [];
      const existingVals = existing.map(v => v.value);
      const toAdd = values.filter(v => !existingVals.includes(v)).map(v => ({ id: genId(), value: v, status: "active" }));
      catAttrs[attrName] = [...existing, ...toAdd];
      newAttrs[category] = catAttrs;
      return { ...state, attributes: newAttrs };
    }

    // ── Fabric Mappings ──
    case A.BULK_SAVE_MAPPINGS:
      return { ...state, fabricMappings: [...state.fabricMappings, ...payload] };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, defaultInitialState);

  // ── Initialize data on mount ──
  useEffect(() => {
    const init = async () => {
      dispatch({ type: A.SET_LOADING, payload: true });
      try {
        const [catRes, grpRes, partsRes] = await Promise.allSettled([
          adminService.getCategories(),
          adminService.getGroups(),
          adminService.getFabricParts(),
        ]);
        if (catRes.status === "fulfilled") dispatch({ type: A.SET_CATEGORIES, payload: catRes.value.data?.data || catRes.value.data || [] });
        if (grpRes.status === "fulfilled") {
          const rawGroups = grpRes.value.data?.data || grpRes.value.data || [];
          const normalizedGroups = rawGroups.map(g => ({
            ...g,
            groupName: g.groupName || g.name || "",
            isActive: g.isActive !== undefined ? g.isActive : true,
          }));
          dispatch({ type: A.SET_GROUPS, payload: normalizedGroups });
        }
        if (partsRes.status === "fulfilled") dispatch({ type: A.SET_FABRIC_PARTS, payload: partsRes.value.data?.data || partsRes.value.data || [] });
      } catch (err) {
        console.error("Init fetch failed:", err);
        dispatch({ type: A.SET_ERROR, payload: err.message });
      } finally {
        dispatch({ type: A.SET_LOADING, payload: false });
      }
    };
    init();
  }, []);

  // ─── Actions (async with local fallback) ─────────────────────

  // -- Categories --
  const addCategory = useCallback(async (name, status = "active") => {
    dispatch({ type: A.SET_LOADING, payload: true });
    try {
      const res = await adminService.createCategory({ name, status });
      dispatch({ type: A.ADD_CATEGORY, payload: res.data?.data || res.data });
    } catch { dispatch({ type: A.ADD_CATEGORY, payload: { id: genId(), name, status } }); }
    finally { dispatch({ type: A.SET_LOADING, payload: false }); }
  }, []);

  const editCategory = useCallback(async (id, updates) => {
    try { await adminService.updateCategory(id, updates); } catch { /* silent */ }
    dispatch({ type: A.EDIT_CATEGORY, payload: { id, updates } });
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try { await adminService.deleteCategory(id); } catch { /* silent */ }
    dispatch({ type: A.DELETE_CATEGORY, payload: id });
  }, []);

  // -- Components (Fabric Parts) --
  const addComponent = useCallback(async (categoryId, name) => {
    const comp = { id: genId(), categoryId, name, status: "active" };
    try {
      const res = await adminService.createFabricPart({ categoryId, name });
      dispatch({ type: A.ADD_COMPONENT, payload: { categoryId, comp: res.data?.data || res.data || comp } });
    } catch { dispatch({ type: A.ADD_COMPONENT, payload: { categoryId, comp } }); }
  }, []);

  const editComponent = useCallback(async (categoryId, compId, updates) => {
    try { await adminService.updateFabricPart(compId, updates); } catch { /* silent */ }
    dispatch({ type: A.EDIT_COMPONENT, payload: { categoryId, compId, updates } });
  }, []);

  const updateComponent = editComponent; // alias used by ComponentsPanelPage

  const deleteComponent = useCallback(async (categoryId, compId) => {
    try { await adminService.deleteFabricPart(compId); } catch { /* silent */ }
    dispatch({ type: A.DELETE_COMPONENT, payload: { categoryId, compId } });
  }, []);

  // -- Component Values --
  const addComponentValue = useCallback((compId, valueName, isDefault = false) => {
    const val = { id: genId(), valueName, isDefault, status: "active" };
    dispatch({ type: A.ADD_COMP_VALUE, payload: { compId, val } });
  }, []);

  const editComponentValue = useCallback((compId, valId, updates) => {
    dispatch({ type: A.EDIT_COMP_VALUE, payload: { compId, valId, updates } });
  }, []);

  const deleteComponentValue = useCallback((compId, valId) => {
    dispatch({ type: A.DELETE_COMP_VALUE, payload: { compId, valId } });
  }, []);

  const setDefaultValue = useCallback((compId, valId) => {
    dispatch({ type: A.SET_DEFAULT_VALUE, payload: { compId, valId } });
  }, []);

  // Helper normalizers for sub-categories
  const normalizeSubCategory = (s) => ({
    ...s,
    type: s.type ? s.type.toLowerCase() : "independent",
    isActive: s.isActive !== undefined ? s.isActive : (s.status === "active" || s.status !== "inactive")
  });

  const normalizeSubValue = (v) => ({
    ...v,
    valueName: v.valueName || v.name || "",
    isActive: v.isActive !== undefined ? v.isActive : (v.status === "active" || v.status !== "inactive")
  });

  // -- Sub-Categories --
  const fetchSubCategories = useCallback(async (partId) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    try {
      const res = await adminService.getSubCategories(partId);
      const subs = (res.data?.data || res.data || []).map(normalizeSubCategory);
      dispatch({ type: A.SET_SUBCATEGORIES, payload: { compId: partId, subs } });
    } catch (err) {
      console.error("Failed to fetch sub-categories", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const fetchSubCategoryValues = useCallback(async (subCategoryId, parentValueId = null) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    try {
      const params = parentValueId ? { parentValueId } : undefined;
      const res = await adminService.getSubCategoryValues(subCategoryId, params);
      const vals = (res.data?.data || res.data || []).map(normalizeSubValue);
      dispatch({ type: A.SET_SUBCATEGORY_VALUES, payload: { subId: subCategoryId, vals } });
    } catch (err) {
      console.error("Failed to fetch sub-category values", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const addSubCategory = useCallback(async (compId, name, type = "independent", parentRef = null) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const data = {
      name,
      slug,
      type: type ? type.toUpperCase() : "INDEPENDENT",
      dependsOn: type === "dependent" ? (parentRef ? "sub-category-id" : "parent") : "parent",
      dependsOnEntityId: parentRef || null,
      sortOrder: 0
    };
    try {
      const res = await adminService.createSubCategory(compId, data);
      const sub = normalizeSubCategory(res.data?.data || res.data);
      dispatch({ type: A.ADD_SUBCATEGORY, payload: { compId, sub } });
    } catch (err) {
      console.error("Failed to add sub-category", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const editSubCategory = useCallback(async (compId, subId, updates) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    const apiUpdates = { ...updates };
    if (updates.type) {
      apiUpdates.type = updates.type.toUpperCase();
    }
    try {
      const res = await adminService.updateSubCategory(subId, apiUpdates);
      const sub = normalizeSubCategory(res.data?.data || res.data || { ...updates, id: subId });
      dispatch({ type: A.EDIT_SUBCATEGORY, payload: { compId, subId, updates: sub } });
    } catch (err) {
      console.error("Failed to edit sub-category", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const deleteSubCategory = useCallback(async (compId, subId) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    try {
      await adminService.deleteSubCategory(subId);
      dispatch({ type: A.DELETE_SUBCATEGORY, payload: { compId, subId } });
    } catch (err) {
      console.error("Failed to delete sub-category", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const addSubCategoryValue = useCallback(async (subId, parentValueId, valueName, isDefault = false) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    const slug = valueName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const data = {
      name: valueName,
      value: slug,
      slug,
      isDefault,
      parentValueId,
      sortOrder: 0
    };
    try {
      const res = await adminService.createSubCategoryValue(subId, data);
      const val = normalizeSubValue(res.data?.data || res.data);
      dispatch({ type: A.ADD_SUBCAT_VALUE, payload: { subId, val } });
    } catch (err) {
      console.error("Failed to add sub-category value", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const editSubCategoryValue = useCallback(async (subId, valId, updates) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    const apiUpdates = { ...updates };
    if (updates.valueName) {
      apiUpdates.name = updates.valueName;
    }
    try {
      const res = await adminService.updateSubCategoryValue(valId, apiUpdates);
      const updated = normalizeSubValue(res.data?.data || res.data || { ...updates, id: valId });
      dispatch({ type: A.EDIT_SUBCAT_VALUE, payload: { subId, valId, updates: updated } });
    } catch (err) {
      console.error("Failed to edit sub-category value", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  const deleteSubCategoryValue = useCallback(async (subId, valId) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    try {
      await adminService.deleteSubCategoryValue(valId);
      dispatch({ type: A.DELETE_SUBCAT_VALUE, payload: { subId, valId } });
    } catch (err) {
      console.error("Failed to delete sub-category value", err);
    } finally {
      dispatch({ type: A.SET_LOADING, payload: false });
    }
  }, []);

  // -- Fabrics --
  const addFabric = useCallback((fabricData) => {
    dispatch({ type: A.ADD_FABRIC, payload: fabricData });
  }, []);

  const editFabric = useCallback(async (id, updates) => {
    try { await adminService.updateFabric(id, updates); } catch { /* silent */ }
    dispatch({ type: A.EDIT_FABRIC, payload: { id, updates } });
  }, []);

  const deleteFabric = useCallback((id) => {
    dispatch({ type: A.DELETE_FABRIC, payload: id });
  }, []);

  const setFabrics = useCallback((fabrics) => {
    dispatch({ type: A.SET_FABRICS, payload: fabrics });
  }, []);

  const toggleStatus = useCallback((collection, itemId) => {
    dispatch({ type: A.TOGGLE_STATUS, payload: { collection, itemId } });
  }, []);

  // -- Fabric Groups --
  const addFabricGroup = useCallback(async (groupData) => {
    // API expects { name, categoryIds }, frontend uses { groupName }
    const apiPayload = {
      name: groupData.groupName || groupData.name,
      categoryIds: groupData.categoryIds || [],
    };
    try {
      const res = await adminService.createGroup(apiPayload);
      const serverGroup = res.data?.data || res.data || {};
      // Normalize server response: map `name` back to `groupName` for frontend
      const normalized = {
        ...serverGroup,
        groupName: serverGroup.groupName || serverGroup.name || apiPayload.name,
        isActive: serverGroup.isActive !== undefined ? serverGroup.isActive : true,
      };
      dispatch({ type: A.ADD_FABRIC_GROUP, payload: normalized });
    } catch (err) {
      console.error('Failed to create group on server', err);
      dispatch({ type: A.ADD_FABRIC_GROUP, payload: { ...groupData, isActive: true } });
    }
  }, []);

  const editFabricGroup = useCallback(async (id, updates) => {
    // Map frontend field to API field
    const apiUpdates = { ...updates };
    if (apiUpdates.groupName) {
      apiUpdates.name = apiUpdates.groupName;
      delete apiUpdates.groupName;
    }
    try { await adminService.updateGroup(id, apiUpdates); } catch { /* silent */ }
    dispatch({ type: A.EDIT_FABRIC_GROUP, payload: { id, updates } });
  }, []);

  const deleteFabricGroup = useCallback(async (id) => {
    try { await adminService.deleteGroup(id); } catch { /* silent */ }
    dispatch({ type: A.DELETE_FABRIC_GROUP, payload: id });
  }, []);

  const toggleFabricGroup = useCallback(async (id) => {
    // Find current state to toggle
    const group = state.fabricGroups.find(g => g.id === id);
    const newIsActive = group ? !group.isActive : true;
    dispatch({ type: A.TOGGLE_FABRIC_GROUP, payload: id });
    try {
      await adminService.toggleGroup(id, newIsActive);
    } catch (err) {
      console.error('Failed to toggle group on server', err);
      // Revert on failure
      dispatch({ type: A.TOGGLE_FABRIC_GROUP, payload: id });
    }
  }, [state.fabricGroups]);

  // -- Fabric Group Mappings --
  // Extract item/fabric IDs from a group detail response
  const extractItemsFromGroup = (groupData) => {
    // Try every likely field name the backend might use
    const items = groupData.items || groupData.fabrics || groupData.fabricIds
      || groupData.groupItems || groupData.fabricList || groupData.members || [];
    return (Array.isArray(items) ? items : []).map(item =>
      typeof item === 'string' ? item : (item.fabricId || item.id)
    );
  };

  const fetchAllGroupMappings = useCallback(async (groups) => {
    try {
      const results = await Promise.allSettled(
        groups.map(g => adminService.getGroup(g.id))
      );
      const allMappings = [];
      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          const rawResponse = result.value.data;
          const groupDetail = rawResponse?.data || rawResponse || {};
          const fabricIds = extractItemsFromGroup(groupDetail);
          fabricIds.forEach(fabricId => {
            allMappings.push({
              id: genId(),
              fabricId,
              groupId: groups[idx].id,
            });
          });
        }
      });
      dispatch({ type: A.SET_GROUP_MAPPINGS, payload: allMappings });
    } catch (err) {
      console.error('Failed to fetch all group mappings', err);
    }
  }, []);

  const addFabricGroupMapping = useCallback(async (fabricId, groupId) => {
    dispatch({ type: A.ADD_FG_MAPPING, payload: { fabricId, groupId } });
    try {
      // Build the full item list from local state + the new one
      const currentMappedIds = state.fabricGroupMappings
        .filter(m => m.groupId === groupId)
        .map(m => m.fabricId);
      if (!currentMappedIds.includes(fabricId)) {
        currentMappedIds.push(fabricId);
      }
      await adminService.updateGroupItems(groupId, currentMappedIds);
    } catch (err) {
      console.error('Failed to add fabric to group on server', err);
    }
  }, [state.fabricGroupMappings]);

  const removeFabricGroupMapping = useCallback(async (fabricId, groupId) => {
    dispatch({ type: A.REMOVE_FG_MAPPING, payload: { fabricId, groupId } });
    try {
      const updatedIds = state.fabricGroupMappings
        .filter(m => m.groupId === groupId && m.fabricId !== fabricId)
        .map(m => m.fabricId);
      await adminService.updateGroupItems(groupId, updatedIds);
    } catch (err) {
      console.error('Failed to remove fabric from group on server', err);
    }
  }, [state.fabricGroupMappings]);

  // -- Builder Groups --
  const addBuilderGroup = useCallback(async (groupData) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    try {
      const res = await adminService.createGroup(groupData);
      const grpRes = await adminService.getGroups();
      dispatch({ type: A.SET_GROUPS, payload: grpRes.data?.data || grpRes.data || [] });
      return res.data;
    } catch { dispatch({ type: A.ADD_BUILDER_GROUP, payload: groupData }); }
    finally { dispatch({ type: A.SET_LOADING, payload: false }); }
  }, []);

  // -- Attributes --
  const addAttributeValue = useCallback(async (category, attrName, value) => {
    try { await adminService.createAttribute({ category: attrName, value, isActive: true }); } catch { /* silent */ }
    dispatch({ type: A.ADD_ATTR_VALUE, payload: { category, attrName, value } });
  }, []);

  const editAttributeValue = useCallback((category, attrName, valId, updates) => {
    dispatch({ type: A.EDIT_ATTR_VALUE, payload: { category, attrName, valId, updates } });
  }, []);

  const deleteAttributeValue = useCallback((category, attrName, valId) => {
    dispatch({ type: A.DELETE_ATTR_VALUE, payload: { category, attrName, valId } });
  }, []);

  const importAttributeValues = useCallback((category, attrName, values) => {
    dispatch({ type: A.IMPORT_ATTR_VALUES, payload: { category, attrName, values } });
  }, []);

  // -- Catalog --
  const fetchCatalogCategories = useCallback(async () => {
    try {
      const res = await adminService.getCatalogCategories();
      dispatch({ type: A.SET_CATALOG_CATEGORIES, payload: res.data?.data || res.data || [] });
    } catch (err) { console.error("Failed to fetch catalog categories", err); }
  }, []);

  const addCatalogCategory = useCallback(async (data) => {
    try {
      const res = await adminService.createCatalogCategory(data);
      dispatch({ type: A.ADD_CATALOG_CATEGORY, payload: res.data?.data || res.data || data });
    } catch (err) { console.error("Failed to add catalog category", err); }
  }, []);

  const editCatalogCategory = useCallback(async (id, updates) => {
    try {
      await adminService.updateCatalogCategory(id, updates);
      dispatch({ type: A.EDIT_CATALOG_CATEGORY, payload: { id, updates } });
    } catch (err) { console.error("Failed to edit catalog category", err); }
  }, []);

  const deleteCatalogCategory = useCallback(async (id) => {
    try {
      await adminService.deleteCatalogCategory(id);
      dispatch({ type: A.DELETE_CATALOG_CATEGORY, payload: id });
    } catch (err) { console.error("Failed to delete catalog category", err); }
  }, []);

  const fetchCatalogProducts = useCallback(async () => {
    try {
      const res = await adminService.getProducts();
      dispatch({ type: A.SET_CATALOG_PRODUCTS, payload: res.data?.data || res.data || [] });
    } catch (err) { console.error("Failed to fetch catalog products", err); }
  }, []);

  const addCatalogProduct = useCallback(async (data) => {
    try {
      const res = await adminService.createProduct(data);
      dispatch({ type: A.ADD_CATALOG_PRODUCT, payload: res.data?.data || res.data || data });
    } catch (err) { console.error("Failed to add catalog product", err); }
  }, []);

  const editCatalogProduct = useCallback(async (id, updates) => {
    try {
      await adminService.updateProduct(id, updates);
      dispatch({ type: A.EDIT_CATALOG_PRODUCT, payload: { id, updates } });
    } catch (err) { console.error("Failed to edit catalog product", err); }
  }, []);

  const deleteCatalogProduct = useCallback(async (id) => {
    try {
      await adminService.deleteProduct(id);
      dispatch({ type: A.DELETE_CATALOG_PRODUCT, payload: id });
    } catch (err) { console.error("Failed to delete catalog product", err); }
  }, []);

  const fetchCatalogParts = useCallback(async (params) => {
    try {
      const res = await adminService.getParts(params);
      dispatch({ type: A.SET_CATALOG_PARTS, payload: res.data?.data || res.data || [] });
    } catch (err) { console.error("Failed to fetch catalog parts", err); }
  }, []);

  const addCatalogPart = useCallback(async (data) => {
    try {
      const res = await adminService.createPart(data);
      dispatch({ type: A.ADD_CATALOG_PART, payload: res.data?.data || res.data || data });
    } catch (err) { console.error("Failed to add catalog part", err); }
  }, []);

  const editCatalogPart = useCallback(async (id, updates) => {
    try {
      await adminService.updatePart(id, updates);
      dispatch({ type: A.EDIT_CATALOG_PART, payload: { id, updates } });
    } catch (err) { console.error("Failed to edit catalog part", err); }
  }, []);

  const deleteCatalogPart = useCallback(async (id) => {
    try {
      await adminService.deletePart(id);
      dispatch({ type: A.DELETE_CATALOG_PART, payload: id });
    } catch (err) { console.error("Failed to delete catalog part", err); }
  }, []);

  const fetchProductParts = useCallback(async (productId) => {
    try {
      const res = await adminService.getProductParts(productId);
      dispatch({ type: A.SET_CATALOG_PARTS, payload: res.data?.data || res.data || [] });
    } catch (err) { console.error("Failed to fetch product parts", err); }
  }, []);

  const addProductPart = useCallback(async (productId, data) => {
    try {
      const res = await adminService.createProductPart(productId, data);
      dispatch({ type: A.ADD_CATALOG_PART, payload: res.data?.data || res.data || data });
    } catch (err) { console.error("Failed to add product part", err); }
  }, []);

  const fetchPartTypes = useCallback(async (partId) => {
    try {
      const res = await adminService.getPartTypes(partId);
      dispatch({ type: A.SET_CATALOG_PART_TYPES, payload: res.data?.data || res.data || [] });
    } catch (err) { console.error("Failed to fetch part types", err); }
  }, []);

  const fetchPartOptions = useCallback(async (partTypeId) => {
    try {
      const res = await adminService.getPartOptions(partTypeId);
      dispatch({ type: A.SET_CATALOG_PART_OPTIONS, payload: res.data?.data || res.data || [] });
    } catch (err) { console.error("Failed to fetch part options", err); }
  }, []);

  const addCatalogType = useCallback(async (partId, data) => {
    try {
      const res = await adminService.createPartType(partId, data);
      dispatch({ type: A.ADD_CATALOG_TYPE, payload: res.data?.data || res.data || data });
    } catch (err) { console.error("Failed to add catalog type", err); }
  }, []);

  const editCatalogType = useCallback(async (id, updates) => {
    try {
      await adminService.updatePartType(id, updates);
      dispatch({ type: A.EDIT_CATALOG_TYPE, payload: { id, updates } });
    } catch (err) { console.error("Failed to edit catalog type", err); }
  }, []);

  const deleteCatalogType = useCallback(async (id) => {
    try {
      await adminService.deletePartType(id);
      dispatch({ type: A.DELETE_CATALOG_TYPE, payload: id });
    } catch (err) { console.error("Failed to delete catalog type", err); }
  }, []);

  const addCatalogOption = useCallback(async (typeId, data) => {
    try {
      const res = await adminService.createPartOption(typeId, data);
      dispatch({ type: A.ADD_CATALOG_OPTION, payload: res.data?.data || res.data || data });
    } catch (err) { console.error("Failed to add catalog option", err); }
  }, []);

  const editCatalogOption = useCallback(async (id, updates) => {
    try {
      await adminService.updatePartOption(id, updates);
      dispatch({ type: A.EDIT_CATALOG_OPTION, payload: { id, updates } });
    } catch (err) { console.error("Failed to edit catalog option", err); }
  }, []);

  const deleteCatalogOption = useCallback(async (id) => {
    try {
      await adminService.deletePartOption(id);
      dispatch({ type: A.DELETE_CATALOG_OPTION, payload: id });
    } catch (err) { console.error("Failed to delete catalog option", err); }
  }, []);

  // -- Fabric Mappings --
  const bulkSaveFabricMappings = useCallback((mappings) => {
    dispatch({ type: A.BULK_SAVE_MAPPINGS, payload: mappings });
  }, []);

  // ─── Build context value ───────────────────────────────────────
  const actions = {
    addCategory, editCategory, deleteCategory,
    addComponent, editComponent, updateComponent, deleteComponent,
    addComponentValue, editComponentValue, deleteComponentValue, setDefaultValue,
    addSubCategory, editSubCategory, deleteSubCategory,
    addSubCategoryValue, editSubCategoryValue, deleteSubCategoryValue,
    fetchSubCategories, fetchSubCategoryValues,
    addFabric, editFabric, deleteFabric, setFabrics, toggleStatus,
    addFabricGroup, editFabricGroup, deleteFabricGroup, toggleFabricGroup,
    addFabricGroupMapping, removeFabricGroupMapping,
    fetchAllGroupMappings,
    addBuilderGroup,
    addAttributeValue, editAttributeValue, deleteAttributeValue, importAttributeValues,
    bulkSaveFabricMappings,
    fetchCatalogCategories, addCatalogCategory, editCatalogCategory, deleteCatalogCategory,
    fetchCatalogProducts, addCatalogProduct, editCatalogProduct, deleteCatalogProduct,
    fetchCatalogParts, fetchProductParts, addProductPart, addCatalogPart, editCatalogPart, deleteCatalogPart,
    fetchPartTypes, addCatalogType, editCatalogType, deleteCatalogType,
    fetchPartOptions, addCatalogOption, editCatalogOption, deleteCatalogOption,
  };

  // Spread actions at top level for pages that destructure directly from useAdmin()
  return (
    <AdminContext.Provider value={{ state, dispatch, actions, ...actions }}>
      {children}
    </AdminContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export { A as ACTIONS };
// eslint-disable-next-line react-refresh/only-export-components
export default AdminContext;
