import { useMemo } from "react";

/**
 * useMappingValidation — Validates component-to-fabric mapping completeness.
 *
 * Usage:
 *   const { errors, warnings, isValid } = useMappingValidation(mappings, fabrics, components);
 */
export default function useMappingValidation(mappings = [], fabrics = []) {
  const validation = useMemo(() => {
    const errors = [];
    const warnings = [];

    // Check for mappings with missing fabrics
    mappings.forEach((mapping) => {
      const fabric = fabrics.find((f) => f.id === mapping.fabricId);
      if (!fabric) {
        errors.push({
          type: "missing_fabric",
          mappingId: mapping.id,
          message: `Mapping references non-existent fabric ID: ${mapping.fabricId}`,
        });
      } else if (fabric.status !== "active") {
        warnings.push({
          type: "inactive_fabric",
          mappingId: mapping.id,
          fabricId: fabric.id,
          message: `Fabric "${fabric.fabricName}" is inactive`,
        });
      }
    });

    // Check for mappings with missing images
    const noImageMappings = mappings.filter((m) => m.isAvailable && !m.image);
    if (noImageMappings.length > 0) {
      warnings.push({
        type: "missing_images",
        count: noImageMappings.length,
        message: `${noImageMappings.length} available mapping(s) are missing images`,
      });
    }

    // Check for duplicate mappings (same fabric + component + value)
    const seen = new Set();
    mappings.forEach((m) => {
      const key = `${m.fabricId}-${m.componentId}-${m.componentValueId}`;
      if (seen.has(key)) {
        errors.push({
          type: "duplicate_mapping",
          mappingId: m.id,
          message: `Duplicate mapping found for fabric ${m.fabricId}, component ${m.componentId}, value ${m.componentValueId}`,
        });
      }
      seen.add(key);
    });

    return {
      errors,
      warnings,
      isValid: errors.length === 0,
      hasWarnings: warnings.length > 0,
    };
  }, [mappings, fabrics]);

  return validation;
}
