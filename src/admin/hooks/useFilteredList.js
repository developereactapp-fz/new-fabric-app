import { useState, useMemo } from "react";

/**
 * useFilteredList — Generic multi-field search + multi-filter hook.
 *
 * Usage:
 *   const { filtered, search, setSearch, filters, setFilter, clearFilters, hasActiveFilters } =
 *     useFilteredList(state.fabrics, {
 *       searchFields: ["fabricId", "fabricName", "material", "color"],
 *       filters: {
 *         status: { default: "all", match: (item, val) => item.status === val },
 *         material: { default: "all", match: (item, val) => item.material === val },
 *       }
 *     });
 */
export default function useFilteredList(data = [], config = {}) {
  const { searchFields = [], filters: filterConfig = {} } = config;

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState(() => {
    const initial = {};
    Object.entries(filterConfig).forEach(([key, cfg]) => {
      initial[key] = cfg.default ?? "all";
    });
    return initial;
  });

  const setFilter = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const reset = {};
    Object.entries(filterConfig).forEach(([key, cfg]) => {
      reset[key] = cfg.default ?? "all";
    });
    setFilterValues(reset);
    setSearch("");
  };

  const hasActiveFilters = Object.entries(filterValues).some(
    ([key, val]) => val !== (filterConfig[key]?.default ?? "all")
  );

  const activeFilterCount = Object.entries(filterValues).filter(
    ([key, val]) => val !== (filterConfig[key]?.default ?? "all")
  ).length;

  // Extract unique values for select options
  const filterOptions = useMemo(() => {
    const options = {};
    Object.entries(filterConfig).forEach(([key, cfg]) => {
      if (cfg.extractOptions) {
        const field = cfg.field || key;
        const set = new Set(data.map((item) => item[field]).filter(Boolean));
        options[key] = [...set].sort();
      } else if (cfg.options) {
        options[key] = cfg.options;
      }
    });
    return options;
  }, [data, filterConfig]);

  const filtered = useMemo(() => {
    let result = [...data];

    // Search
    if (search.trim() && searchFields.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field] || "").toLowerCase().includes(q)
        )
      );
    }

    // Filters
    Object.entries(filterValues).forEach(([key, val]) => {
      const cfg = filterConfig[key];
      if (!cfg || val === (cfg.default ?? "all")) return;

      if (cfg.match) {
        result = result.filter((item) => cfg.match(item, val));
      } else {
        const field = cfg.field || key;
        result = result.filter((item) => item[field] === val);
      }
    });

    return result;
  }, [data, search, searchFields, filterValues, filterConfig]);

  return {
    filtered,
    search,
    setSearch,
    filterValues,
    setFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    filterOptions,
  };
}
