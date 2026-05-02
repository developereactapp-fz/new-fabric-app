import { useCallback } from "react";
import { useAdmin } from "../store/adminStore";

/**
 * useFabricLookup — Provides helper functions to resolve names from IDs.
 *
 * Usage:
 *   const { getComponentName, getComponentValueName, getCategoryName, getFabricName } = useFabricLookup();
 */
export default function useFabricLookup() {
  const { state } = useAdmin();

  const getCategoryName = useCallback(
    (categoryId) => {
      const cat = (state.categories || []).find((c) => c.id === categoryId || c.name === categoryId);
      return cat ? cat.name : categoryId || "Unknown Category";
    },
    [state.categories]
  );

  const getComponentName = useCallback(
    (categoryId, componentId) => {
      const catComps = state.components[categoryId] || [];
      const comp = catComps.find((c) => c.id === componentId);
      return comp ? comp.name : "Unknown Component";
    },
    [state.components]
  );

  const getComponentValueName = useCallback(
    (componentId, valueId) => {
      const vals = state.componentValues[componentId] || [];
      const val = vals.find((v) => v.id === valueId);
      return val ? val.valueName : "Unknown Value";
    },
    [state.componentValues]
  );

  const getFabricName = useCallback(
    (fabricId) => {
      const fabric = (state.fabrics || []).find((f) => f.id === fabricId);
      return fabric ? fabric.fabricName : "Unknown Fabric";
    },
    [state.fabrics]
  );

  const getFabricById = useCallback(
    (fabricId) => {
      return (state.fabrics || []).find((f) => f.id === fabricId) || null;
    },
    [state.fabrics]
  );

  return {
    getCategoryName,
    getComponentName,
    getComponentValueName,
    getFabricName,
    getFabricById,
  };
}
