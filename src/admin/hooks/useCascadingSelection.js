import { useState, useMemo } from "react";
import { useAdmin } from "../store/adminStore";

/**
 * useCascadingSelection — Manages Category→Component→Value cascading selection state.
 * Automatically resets downstream selections when upstream changes.
 *
 * Usage:
 *   const { selection, setCategory, setComponent, setValue, availableComponents, availableValues } = useCascadingSelection();
 */
export default function useCascadingSelection(initialCategory = "", initialComponent = "", initialValue = "") {
  const { state } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedComponent, setSelectedComponent] = useState(initialComponent);
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const categories = state.categories || [];

  const availableComponents = useMemo(() => {
    if (!selectedCategory) return [];
    return state.components[selectedCategory] || [];
  }, [selectedCategory, state.components]);

  const availableValues = useMemo(() => {
    if (!selectedComponent) return [];
    return state.componentValues[selectedComponent] || [];
  }, [selectedComponent, state.componentValues]);

  const setCategory = (value) => {
    setSelectedCategory(value);
    setSelectedComponent("");
    setSelectedValue("");
  };

  const setComponent = (value) => {
    setSelectedComponent(value);
    setSelectedValue("");
  };

  const setValue = (value) => {
    setSelectedValue(value);
  };

  const reset = () => {
    setSelectedCategory(initialCategory);
    setSelectedComponent(initialComponent);
    setSelectedValue(initialValue);
  };

  return {
    categories,
    selectedCategory,
    selectedComponent,
    selectedValue,
    availableComponents,
    availableValues,
    setCategory,
    setComponent,
    setValue,
    reset,
  };
}
