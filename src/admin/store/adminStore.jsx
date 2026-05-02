import { createContext, useContext, useReducer, useCallback, useEffect } from "react";

// ─── Initial State ───────────────────────────────────────────────
const defaultInitialState = {
  // Master attribute values keyed by category → attribute → [values]
  // e.g. { "Custom Shirt": { Color: [{ id, value, status }], Material: [...] } }
  attributes: {},

  // Categories: [{ id, name, status, createdAt, updatedAt }]
  categories: [],

  // Components keyed by categoryId: { [categoryId]: [{ id, categoryId, name, status }] }
  components: {},

  // Component values keyed by componentId: { [componentId]: [{ id, componentId, valueName, isDefault, status }] }
  componentValues: {},

  // Sub-categories keyed by componentId
  subCategories: {},

  // Sub-category values keyed by subCategoryId
  subCategoryValues: {},

  // Fabrics: [{ id, fabricId, fabricName, description, color, material, subMaterial, pattern, weavePattern, season, gsm, feature1, feature2, feature3, image, status, availability, createdAt }]
  fabrics: [],

  // Fabric groups: [{ id, groupName, categoryId, status, isActive }]
  fabricGroups: [],

  // Fabric-to-group mapping: [{ fabricId, groupId }]
  fabricGroupMappings: [],

  // Fabric component mappings: [{ id, fabricId, categoryId, fabricGroupId, componentId, componentValueId, image, isAvailable, isDefault, status }]
  fabricMappings: [],

  // Group builder groups: [{ id, groupId, groupName, targetCategories, sourceCategory, componentId, componentValueId, items: [], status }]
  builderGroups: [],

  // Contrast mappings
  contrastMappings: [],
  contrastMappingItems: [],
  contrastMappingItems: [],
};

const getInitialState = () => {
  try {
    const saved = localStorage.getItem("adminStoreState");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all arrays/objects exist in case of old state format
      return { ...defaultInitialState, ...parsed };
    }
  } catch (err) {
    console.error("Failed to load state from localStorage:", err);
  }
  return defaultInitialState;
};

// ─── Action Types ────────────────────────────────────────────────
const ACTIONS = {
  // Attributes
  SET_ATTRIBUTES: "SET_ATTRIBUTES",
  ADD_ATTRIBUTE_VALUE: "ADD_ATTRIBUTE_VALUE",
  EDIT_ATTRIBUTE_VALUE: "EDIT_ATTRIBUTE_VALUE",
  DELETE_ATTRIBUTE_VALUE: "DELETE_ATTRIBUTE_VALUE",
  IMPORT_ATTRIBUTE_VALUES: "IMPORT_ATTRIBUTE_VALUES",

  // Categories
  ADD_CATEGORY: "ADD_CATEGORY",
  EDIT_CATEGORY: "EDIT_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",

  // Components
  ADD_COMPONENT: "ADD_COMPONENT",
  EDIT_COMPONENT: "EDIT_COMPONENT",
  DELETE_COMPONENT: "DELETE_COMPONENT",

  // Component Values
  ADD_COMPONENT_VALUE: "ADD_COMPONENT_VALUE",
  EDIT_COMPONENT_VALUE: "EDIT_COMPONENT_VALUE",
  DELETE_COMPONENT_VALUE: "DELETE_COMPONENT_VALUE",
  SET_DEFAULT_VALUE: "SET_DEFAULT_VALUE",

  // Sub Categories
  ADD_SUB_CATEGORY: "ADD_SUB_CATEGORY",
  EDIT_SUB_CATEGORY: "EDIT_SUB_CATEGORY",
  DELETE_SUB_CATEGORY: "DELETE_SUB_CATEGORY",

  // Sub Category Values
  ADD_SUB_CATEGORY_VALUE: "ADD_SUB_CATEGORY_VALUE",
  EDIT_SUB_CATEGORY_VALUE: "EDIT_SUB_CATEGORY_VALUE",
  DELETE_SUB_CATEGORY_VALUE: "DELETE_SUB_CATEGORY_VALUE",

  // Fabrics
  SET_FABRICS: "SET_FABRICS",
  ADD_FABRIC: "ADD_FABRIC",
  EDIT_FABRIC: "EDIT_FABRIC",
  DELETE_FABRIC: "DELETE_FABRIC",
  IMPORT_FABRICS: "IMPORT_FABRICS",

  // Fabric Groups
  ADD_FABRIC_GROUP: "ADD_FABRIC_GROUP",
  EDIT_FABRIC_GROUP: "EDIT_FABRIC_GROUP",
  DELETE_FABRIC_GROUP: "DELETE_FABRIC_GROUP",
  TOGGLE_FABRIC_GROUP: "TOGGLE_FABRIC_GROUP",

  // Fabric Group Mappings
  ADD_FABRIC_GROUP_MAPPING: "ADD_FABRIC_GROUP_MAPPING",
  REMOVE_FABRIC_GROUP_MAPPING: "REMOVE_FABRIC_GROUP_MAPPING",

  // Fabric Mappings
  ADD_FABRIC_MAPPING: "ADD_FABRIC_MAPPING",
  EDIT_FABRIC_MAPPING: "EDIT_FABRIC_MAPPING",
  DELETE_FABRIC_MAPPING: "DELETE_FABRIC_MAPPING",
  BULK_SAVE_FABRIC_MAPPINGS: "BULK_SAVE_FABRIC_MAPPINGS",

  // Builder Groups
  ADD_BUILDER_GROUP: "ADD_BUILDER_GROUP",
  EDIT_BUILDER_GROUP: "EDIT_BUILDER_GROUP",
  DELETE_BUILDER_GROUP: "DELETE_BUILDER_GROUP",

  // Contrast
  ADD_CONTRAST_MAPPING: "ADD_CONTRAST_MAPPING",
  EDIT_CONTRAST_MAPPING: "EDIT_CONTRAST_MAPPING",
  DELETE_CONTRAST_MAPPING: "DELETE_CONTRAST_MAPPING",

  // Global
  TOGGLE_STATUS: "TOGGLE_STATUS",
};

// ─── Helpers ─────────────────────────────────────────────────────
let _nextId = Date.now();
const genId = () => String(_nextId++);

// ─── Reducer ─────────────────────────────────────────────────────
function adminReducer(state, action) {
  switch (action.type) {
    // ── Attributes ──
    case ACTIONS.SET_ATTRIBUTES:
      return { ...state, attributes: action.payload };

    case ACTIONS.ADD_ATTRIBUTE_VALUE: {
      const { category, attribute, value } = action.payload;
      const catAttrs = { ...(state.attributes[category] || {}) };
      const existing = catAttrs[attribute] || [];
      catAttrs[attribute] = [...existing, { id: genId(), value, status: "active" }];
      return { ...state, attributes: { ...state.attributes, [category]: catAttrs } };
    }

    case ACTIONS.EDIT_ATTRIBUTE_VALUE: {
      const { category, attribute, id, updates } = action.payload;
      const catAttrs = { ...(state.attributes[category] || {}) };
      catAttrs[attribute] = (catAttrs[attribute] || []).map((v) =>
        v.id === id ? { ...v, ...updates } : v
      );
      return { ...state, attributes: { ...state.attributes, [category]: catAttrs } };
    }

    case ACTIONS.DELETE_ATTRIBUTE_VALUE: {
      const { category, attribute, id } = action.payload;
      const catAttrs = { ...(state.attributes[category] || {}) };
      catAttrs[attribute] = (catAttrs[attribute] || []).filter((v) => v.id !== id);
      return { ...state, attributes: { ...state.attributes, [category]: catAttrs } };
    }

    case ACTIONS.IMPORT_ATTRIBUTE_VALUES: {
      const { category, attributeMap } = action.payload;
      const catAttrs = { ...(state.attributes[category] || {}) };
      Object.entries(attributeMap).forEach(([attr, values]) => {
        const existing = catAttrs[attr] || [];
        const existingLower = existing.map((v) => v.value.toLowerCase());
        const newVals = values
          .filter((v) => v && !existingLower.includes(v.toLowerCase()))
          .map((v) => ({ id: genId(), value: v, status: "active" }));
        catAttrs[attr] = [...existing, ...newVals];
      });
      return { ...state, attributes: { ...state.attributes, [category]: catAttrs } };
    }

    // ── Categories ──
    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [
          ...state.categories,
          { id: genId(), name: action.payload.name, status: action.payload.status || "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ],
      };

    case ACTIONS.EDIT_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates, updatedAt: new Date().toISOString() } : c
        ),
      };

    case ACTIONS.DELETE_CATEGORY:
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload.id) };

    // ── Components ──
    case ACTIONS.ADD_COMPONENT: {
      const { categoryId, name } = action.payload;
      const catComps = [...(state.components[categoryId] || [])];
      catComps.push({ id: genId(), categoryId, name, status: "active", createdAt: new Date().toISOString() });
      return { ...state, components: { ...state.components, [categoryId]: catComps } };
    }

    case ACTIONS.EDIT_COMPONENT: {
      const { categoryId, id, updates } = action.payload;
      const catComps = (state.components[categoryId] || []).map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      return { ...state, components: { ...state.components, [categoryId]: catComps } };
    }

    case ACTIONS.DELETE_COMPONENT: {
      const { categoryId, id } = action.payload;
      const catComps = (state.components[categoryId] || []).filter((c) => c.id !== id);
      return { ...state, components: { ...state.components, [categoryId]: catComps } };
    }

    // ── Component Values ──
    case ACTIONS.ADD_COMPONENT_VALUE: {
      const { componentId, valueName, isDefault } = action.payload;
      const vals = [...(state.componentValues[componentId] || [])];
      // If setting as default, un-default others
      const updated = isDefault ? vals.map((v) => ({ ...v, isDefault: false })) : vals;
      updated.push({ id: genId(), componentId, valueName, isDefault: !!isDefault, status: "active" });
      return { ...state, componentValues: { ...state.componentValues, [componentId]: updated } };
    }

    case ACTIONS.EDIT_COMPONENT_VALUE: {
      const { componentId, id, updates } = action.payload;
      const vals = (state.componentValues[componentId] || []).map((v) =>
        v.id === id ? { ...v, ...updates } : v
      );
      return { ...state, componentValues: { ...state.componentValues, [componentId]: vals } };
    }

    case ACTIONS.DELETE_COMPONENT_VALUE: {
      const { componentId, id } = action.payload;
      const vals = (state.componentValues[componentId] || []).filter((v) => v.id !== id);
      return { ...state, componentValues: { ...state.componentValues, [componentId]: vals } };
    }

    case ACTIONS.SET_DEFAULT_VALUE: {
      const { componentId, id } = action.payload;
      const vals = (state.componentValues[componentId] || []).map((v) => ({
        ...v,
        isDefault: v.id === id,
      }));
      return { ...state, componentValues: { ...state.componentValues, [componentId]: vals } };
    }

    // ── Sub Categories ──
    case ACTIONS.ADD_SUB_CATEGORY: {
      const { componentId, name, type, dependsOn, level } = action.payload;
      const subs = [...(state.subCategories[componentId] || [])];
      subs.push({ id: genId(), componentId, name, type: type || "independent", dependsOn: dependsOn || null, level: level || 1, status: "active" });
      return { ...state, subCategories: { ...state.subCategories, [componentId]: subs } };
    }

    case ACTIONS.EDIT_SUB_CATEGORY: {
      const { componentId, id, updates } = action.payload;
      const subs = (state.subCategories[componentId] || []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      );
      return { ...state, subCategories: { ...state.subCategories, [componentId]: subs } };
    }

    case ACTIONS.DELETE_SUB_CATEGORY: {
      const { componentId, id } = action.payload;
      const subs = (state.subCategories[componentId] || []).filter((s) => s.id !== id);
      return { ...state, subCategories: { ...state.subCategories, [componentId]: subs } };
    }

    // ── Sub Category Values ──
    case ACTIONS.ADD_SUB_CATEGORY_VALUE: {
      const { subCategoryId, parentValueId, valueName, isDefault } = action.payload;
      const vals = [...(state.subCategoryValues[subCategoryId] || [])];
      const key = parentValueId || "__global__";
      vals.push({ id: genId(), subCategoryId, parentValueId: parentValueId || null, valueName, isDefault: !!isDefault, status: "active", _groupKey: key });
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [subCategoryId]: vals } };
    }

    case ACTIONS.EDIT_SUB_CATEGORY_VALUE: {
      const { subCategoryId, id, updates } = action.payload;
      const vals = (state.subCategoryValues[subCategoryId] || []).map((v) =>
        v.id === id ? { ...v, ...updates } : v
      );
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [subCategoryId]: vals } };
    }

    case ACTIONS.DELETE_SUB_CATEGORY_VALUE: {
      const { subCategoryId, id } = action.payload;
      const vals = (state.subCategoryValues[subCategoryId] || []).filter((v) => v.id !== id);
      return { ...state, subCategoryValues: { ...state.subCategoryValues, [subCategoryId]: vals } };
    }

    // ── Fabrics ──
    case ACTIONS.SET_FABRICS:
      return { ...state, fabrics: action.payload };

    case ACTIONS.ADD_FABRIC:
      return {
        ...state,
        fabrics: [
          ...state.fabrics,
          { id: action.payload.id || genId(), ...action.payload, createdAt: action.payload.createdAt || new Date().toISOString(), updatedAt: action.payload.updatedAt || new Date().toISOString() },
        ],
      };

    case ACTIONS.EDIT_FABRIC:
      return {
        ...state,
        fabrics: state.fabrics.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload.updates, updatedAt: new Date().toISOString() } : f
        ),
      };

    case ACTIONS.DELETE_FABRIC:
      return {
        ...state,
        fabrics: state.fabrics.filter((f) => f.id !== action.payload.id),
        fabricGroupMappings: state.fabricGroupMappings.filter((m) => m.fabricId !== action.payload.id),
        fabricMappings: state.fabricMappings.filter((m) => m.fabricId !== action.payload.id),
      };

    case ACTIONS.IMPORT_FABRICS:
      return { ...state, fabrics: [...state.fabrics, ...action.payload.fabrics.map((f) => ({ id: f.id || genId(), ...f, createdAt: f.createdAt || new Date().toISOString(), updatedAt: f.updatedAt || new Date().toISOString() }))] };

    // ── Fabric Groups ──
    case ACTIONS.ADD_FABRIC_GROUP:
      return {
        ...state,
        fabricGroups: [
          ...state.fabricGroups,
          { id: genId(), ...action.payload, status: "active", isActive: true, createdAt: new Date().toISOString() },
        ],
      };

    case ACTIONS.EDIT_FABRIC_GROUP:
      return {
        ...state,
        fabricGroups: state.fabricGroups.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates } : g
        ),
      };

    case ACTIONS.DELETE_FABRIC_GROUP:
      return {
        ...state,
        fabricGroups: state.fabricGroups.filter((g) => g.id !== action.payload.id),
        fabricGroupMappings: state.fabricGroupMappings.filter((m) => m.groupId !== action.payload.id),
      };

    case ACTIONS.TOGGLE_FABRIC_GROUP:
      return {
        ...state,
        fabricGroups: state.fabricGroups.map((g) =>
          g.id === action.payload.id ? { ...g, isActive: !g.isActive } : g
        ),
      };

    // ── Fabric Group Mappings ──
    case ACTIONS.ADD_FABRIC_GROUP_MAPPING:
      return { ...state, fabricGroupMappings: [...state.fabricGroupMappings, action.payload] };

    case ACTIONS.REMOVE_FABRIC_GROUP_MAPPING:
      return {
        ...state,
        fabricGroupMappings: state.fabricGroupMappings.filter(
          (m) => !(m.fabricId === action.payload.fabricId && m.groupId === action.payload.groupId)
        ),
      };

    // ── Fabric Mappings ──
    case ACTIONS.ADD_FABRIC_MAPPING:
      return { ...state, fabricMappings: [...state.fabricMappings, { id: genId(), ...action.payload }] };

    case ACTIONS.EDIT_FABRIC_MAPPING:
      return {
        ...state,
        fabricMappings: state.fabricMappings.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      };

    case ACTIONS.DELETE_FABRIC_MAPPING:
      return { ...state, fabricMappings: state.fabricMappings.filter((m) => m.id !== action.payload.id) };

    case ACTIONS.BULK_SAVE_FABRIC_MAPPINGS: {
      const { fabricId, categoryId, mappings } = action.payload;
      const filtered = state.fabricMappings.filter(
        (m) => !(m.fabricId === fabricId && m.categoryId === categoryId)
      );
      const newMappings = mappings.map((m) => ({ id: genId(), fabricId, categoryId, ...m }));
      return { ...state, fabricMappings: [...filtered, ...newMappings] };
    }

    // ── Builder Groups ──
    case ACTIONS.ADD_BUILDER_GROUP:
      return { ...state, builderGroups: [...state.builderGroups, { id: genId(), ...action.payload }] };

    case ACTIONS.EDIT_BUILDER_GROUP:
      return {
        ...state,
        builderGroups: state.builderGroups.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates } : g
        ),
      };

    case ACTIONS.DELETE_BUILDER_GROUP:
      return { ...state, builderGroups: state.builderGroups.filter((g) => g.id !== action.payload.id) };

    // ── Contrast Mappings ──
    case ACTIONS.ADD_CONTRAST_MAPPING:
      return { ...state, contrastMappings: [...state.contrastMappings, { id: genId(), ...action.payload }] };

    case ACTIONS.EDIT_CONTRAST_MAPPING:
      return {
        ...state,
        contrastMappings: state.contrastMappings.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      };

    case ACTIONS.DELETE_CONTRAST_MAPPING:
      return { ...state, contrastMappings: state.contrastMappings.filter((m) => m.id !== action.payload.id) };

    // ── Global Toggle ──
    case ACTIONS.TOGGLE_STATUS: {
      const { entity, id, entityKey } = action.payload;
      if (entityKey) {
        // For nested entities like components[categoryId]
        const items = (state[entity][entityKey] || []).map((item) =>
          item.id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
        );
        return { ...state, [entity]: { ...state[entity], [entityKey]: items } };
      }
      // For flat arrays
      const items = state[entity].map((item) =>
        item.id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item
      );
      return { ...state, [entity]: items };
    }

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, defaultInitialState, getInitialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("adminStoreState", JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save state to localStorage:", err);
    }
  }, [state]);

  // Convenience dispatchers
  const actions = {
    // Attributes
    addAttributeValue: useCallback((category, attribute, value) =>
      dispatch({ type: ACTIONS.ADD_ATTRIBUTE_VALUE, payload: { category, attribute, value } }), []),
    editAttributeValue: useCallback((category, attribute, id, updates) =>
      dispatch({ type: ACTIONS.EDIT_ATTRIBUTE_VALUE, payload: { category, attribute, id, updates } }), []),
    deleteAttributeValue: useCallback((category, attribute, id) =>
      dispatch({ type: ACTIONS.DELETE_ATTRIBUTE_VALUE, payload: { category, attribute, id } }), []),
    importAttributeValues: useCallback((category, attributeMap) =>
      dispatch({ type: ACTIONS.IMPORT_ATTRIBUTE_VALUES, payload: { category, attributeMap } }), []),

    // Categories
    addCategory: useCallback((name, status) =>
      dispatch({ type: ACTIONS.ADD_CATEGORY, payload: { name, status } }), []),
    editCategory: useCallback((id, updates) =>
      dispatch({ type: ACTIONS.EDIT_CATEGORY, payload: { id, updates } }), []),
    deleteCategory: useCallback((id) =>
      dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: { id } }), []),

    // Components
    addComponent: useCallback((categoryId, name) =>
      dispatch({ type: ACTIONS.ADD_COMPONENT, payload: { categoryId, name } }), []),
    editComponent: useCallback((categoryId, id, updates) =>
      dispatch({ type: ACTIONS.EDIT_COMPONENT, payload: { categoryId, id, updates } }), []),
    deleteComponent: useCallback((categoryId, id) =>
      dispatch({ type: ACTIONS.DELETE_COMPONENT, payload: { categoryId, id } }), []),

    // Component Values
    addComponentValue: useCallback((componentId, valueName, isDefault) =>
      dispatch({ type: ACTIONS.ADD_COMPONENT_VALUE, payload: { componentId, valueName, isDefault } }), []),
    editComponentValue: useCallback((componentId, id, updates) =>
      dispatch({ type: ACTIONS.EDIT_COMPONENT_VALUE, payload: { componentId, id, updates } }), []),
    deleteComponentValue: useCallback((componentId, id) =>
      dispatch({ type: ACTIONS.DELETE_COMPONENT_VALUE, payload: { componentId, id } }), []),
    setDefaultValue: useCallback((componentId, id) =>
      dispatch({ type: ACTIONS.SET_DEFAULT_VALUE, payload: { componentId, id } }), []),

    // Sub Categories
    addSubCategory: useCallback((componentId, name, type, dependsOn, level) =>
      dispatch({ type: ACTIONS.ADD_SUB_CATEGORY, payload: { componentId, name, type, dependsOn, level } }), []),
    editSubCategory: useCallback((componentId, id, updates) =>
      dispatch({ type: ACTIONS.EDIT_SUB_CATEGORY, payload: { componentId, id, updates } }), []),
    deleteSubCategory: useCallback((componentId, id) =>
      dispatch({ type: ACTIONS.DELETE_SUB_CATEGORY, payload: { componentId, id } }), []),

    // Sub Category Values
    addSubCategoryValue: useCallback((subCategoryId, parentValueId, valueName, isDefault) =>
      dispatch({ type: ACTIONS.ADD_SUB_CATEGORY_VALUE, payload: { subCategoryId, parentValueId, valueName, isDefault } }), []),
    editSubCategoryValue: useCallback((subCategoryId, id, updates) =>
      dispatch({ type: ACTIONS.EDIT_SUB_CATEGORY_VALUE, payload: { subCategoryId, id, updates } }), []),
    deleteSubCategoryValue: useCallback((subCategoryId, id) =>
      dispatch({ type: ACTIONS.DELETE_SUB_CATEGORY_VALUE, payload: { subCategoryId, id } }), []),

    // Fabrics
    setFabrics: useCallback((fabrics) =>
      dispatch({ type: ACTIONS.SET_FABRICS, payload: fabrics }), []),
    addFabric: useCallback((fabricData) =>
      dispatch({ type: ACTIONS.ADD_FABRIC, payload: fabricData }), []),
    editFabric: useCallback((id, updates) =>
      dispatch({ type: ACTIONS.EDIT_FABRIC, payload: { id, updates } }), []),
    deleteFabric: useCallback((id) =>
      dispatch({ type: ACTIONS.DELETE_FABRIC, payload: { id } }), []),
    importFabrics: useCallback((fabrics) =>
      dispatch({ type: ACTIONS.IMPORT_FABRICS, payload: { fabrics } }), []),

    // Fabric Groups
    addFabricGroup: useCallback((groupData) =>
      dispatch({ type: ACTIONS.ADD_FABRIC_GROUP, payload: groupData }), []),
    editFabricGroup: useCallback((id, updates) =>
      dispatch({ type: ACTIONS.EDIT_FABRIC_GROUP, payload: { id, updates } }), []),
    deleteFabricGroup: useCallback((id) =>
      dispatch({ type: ACTIONS.DELETE_FABRIC_GROUP, payload: { id } }), []),
    toggleFabricGroup: useCallback((id) =>
      dispatch({ type: ACTIONS.TOGGLE_FABRIC_GROUP, payload: { id } }), []),

    // Fabric Group Mappings
    addFabricGroupMapping: useCallback((fabricId, groupId) =>
      dispatch({ type: ACTIONS.ADD_FABRIC_GROUP_MAPPING, payload: { fabricId, groupId } }), []),
    removeFabricGroupMapping: useCallback((fabricId, groupId) =>
      dispatch({ type: ACTIONS.REMOVE_FABRIC_GROUP_MAPPING, payload: { fabricId, groupId } }), []),

    // Fabric Mappings
    addFabricMapping: useCallback((mappingData) =>
      dispatch({ type: ACTIONS.ADD_FABRIC_MAPPING, payload: mappingData }), []),
    editFabricMapping: useCallback((id, updates) =>
      dispatch({ type: ACTIONS.EDIT_FABRIC_MAPPING, payload: { id, updates } }), []),
    deleteFabricMapping: useCallback((id) =>
      dispatch({ type: ACTIONS.DELETE_FABRIC_MAPPING, payload: { id } }), []),
    bulkSaveFabricMappings: useCallback((fabricId, categoryId, mappings) =>
      dispatch({ type: ACTIONS.BULK_SAVE_FABRIC_MAPPINGS, payload: { fabricId, categoryId, mappings } }), []),

    // Builder Groups
    addBuilderGroup: useCallback((groupData) =>
      dispatch({ type: ACTIONS.ADD_BUILDER_GROUP, payload: groupData }), []),
    editBuilderGroup: useCallback((id, updates) =>
      dispatch({ type: ACTIONS.EDIT_BUILDER_GROUP, payload: { id, updates } }), []),
    deleteBuilderGroup: useCallback((id) =>
      dispatch({ type: ACTIONS.DELETE_BUILDER_GROUP, payload: { id } }), []),

    // Contrast
    addContrastMapping: useCallback((data) =>
      dispatch({ type: ACTIONS.ADD_CONTRAST_MAPPING, payload: data }), []),
    editContrastMapping: useCallback((id, updates) =>
      dispatch({ type: ACTIONS.EDIT_CONTRAST_MAPPING, payload: { id, updates } }), []),
    deleteContrastMapping: useCallback((id) =>
      dispatch({ type: ACTIONS.DELETE_CONTRAST_MAPPING, payload: { id } }), []),

    // Global
    toggleStatus: useCallback((entity, id, entityKey) =>
      dispatch({ type: ACTIONS.TOGGLE_STATUS, payload: { entity, id, entityKey } }), []),
  };

  return (
    <AdminContext.Provider value={{ state, dispatch, ...actions }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export { ACTIONS };
export default AdminContext;
