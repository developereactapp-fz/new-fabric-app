import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { adminService } from "../../services/adminService";

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
};

// ─── Helpers ─────────────────────────────────────────────────────
let _nextId = Date.now();
const genId = () => String(_nextId++);

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
        if (grpRes.status === "fulfilled") dispatch({ type: A.SET_GROUPS, payload: grpRes.value.data?.data || grpRes.value.data || [] });
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

  // -- Sub-Categories --
  const addSubCategory = useCallback((compId, name, type = "independent", parentRef = null, order = 1) => {
    const sub = { id: genId(), name, type, parentRef, order, status: "active" };
    dispatch({ type: A.ADD_SUBCATEGORY, payload: { compId, sub } });
  }, []);

  const editSubCategory = useCallback((compId, subId, updates) => {
    dispatch({ type: A.EDIT_SUBCATEGORY, payload: { compId, subId, updates } });
  }, []);

  const deleteSubCategory = useCallback((compId, subId) => {
    dispatch({ type: A.DELETE_SUBCATEGORY, payload: { compId, subId } });
  }, []);

  const addSubCategoryValue = useCallback((subId, parentValueId, valueName, isDefault = false) => {
    const val = { id: genId(), parentValueId, valueName, isDefault, status: "active" };
    dispatch({ type: A.ADD_SUBCAT_VALUE, payload: { subId, val } });
  }, []);

  const editSubCategoryValue = useCallback((subId, valId, updates) => {
    dispatch({ type: A.EDIT_SUBCAT_VALUE, payload: { subId, valId, updates } });
  }, []);

  const deleteSubCategoryValue = useCallback((subId, valId) => {
    dispatch({ type: A.DELETE_SUBCAT_VALUE, payload: { subId, valId } });
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
    try {
      const res = await adminService.createGroup(groupData);
      dispatch({ type: A.ADD_FABRIC_GROUP, payload: res.data?.data || res.data || groupData });
    } catch { dispatch({ type: A.ADD_FABRIC_GROUP, payload: groupData }); }
  }, []);

  const editFabricGroup = useCallback(async (id, updates) => {
    try { await adminService.updateGroup(id, updates); } catch { /* silent */ }
    dispatch({ type: A.EDIT_FABRIC_GROUP, payload: { id, updates } });
  }, []);

  const deleteFabricGroup = useCallback(async (id) => {
    try { await adminService.deleteGroup(id); } catch { /* silent */ }
    dispatch({ type: A.DELETE_FABRIC_GROUP, payload: id });
  }, []);

  const toggleFabricGroup = useCallback((id) => {
    dispatch({ type: A.TOGGLE_FABRIC_GROUP, payload: id });
  }, []);

  // -- Fabric Group Mappings --
  const addFabricGroupMapping = useCallback((fabricId, groupId) => {
    dispatch({ type: A.ADD_FG_MAPPING, payload: { fabricId, groupId } });
  }, []);

  const removeFabricGroupMapping = useCallback((fabricId, groupId) => {
    dispatch({ type: A.REMOVE_FG_MAPPING, payload: { fabricId, groupId } });
  }, []);

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
    addFabric, editFabric, deleteFabric, setFabrics, toggleStatus,
    addFabricGroup, editFabricGroup, deleteFabricGroup, toggleFabricGroup,
    addFabricGroupMapping, removeFabricGroupMapping,
    addBuilderGroup,
    addAttributeValue, editAttributeValue, deleteAttributeValue, importAttributeValues,
    bulkSaveFabricMappings,
  };

  // Spread actions at top level for pages that destructure directly from useAdmin()
  return (
    <AdminContext.Provider value={{ state, dispatch, actions, ...actions }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export { A as ACTIONS };
export default AdminContext;
