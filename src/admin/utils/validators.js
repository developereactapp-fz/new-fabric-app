/**
 * Shared validation helpers for the Fabric Configuration System.
 */

/**
 * Case-insensitive duplicate check.
 * @param {string} newValue - The value to check
 * @param {string[]} existingValues - Array of existing values
 * @returns {boolean} true if duplicate exists
 */
export function isDuplicate(newValue, existingValues) {
  if (!newValue || !Array.isArray(existingValues)) return false;
  const lower = newValue.trim().toLowerCase();
  return existingValues.some((v) => String(v).trim().toLowerCase() === lower);
}

/**
 * Check if a value is a valid name (non-empty, no special chars that would break things).
 * @param {string} value
 * @returns {{ valid: boolean, message: string }}
 */
export function validateName(value) {
  if (!value || !value.trim()) {
    return { valid: false, message: "Name cannot be empty" };
  }
  if (value.trim().length < 1) {
    return { valid: false, message: "Name is too short" };
  }
  if (value.trim().length > 100) {
    return { valid: false, message: "Name is too long (max 100 characters)" };
  }
  return { valid: true, message: "Available" };
}

/**
 * Validate fabric ID uniqueness.
 * @param {string} fabricId
 * @param {Array} existingFabrics
 * @returns {{ valid: boolean, message: string }}
 */
export function validateFabricId(fabricId, existingFabrics) {
  if (!fabricId || !fabricId.trim()) {
    return { valid: false, message: "Fabric ID is required" };
  }
  const exists = existingFabrics.some(
    (f) => f.fabricId?.toLowerCase() === fabricId.trim().toLowerCase()
  );
  if (exists) {
    return { valid: false, message: "Fabric ID already exists" };
  }
  return { valid: true, message: "Available" };
}

/**
 * Validate fabric name uniqueness.
 * @param {string} fabricName
 * @param {Array} existingFabrics
 * @returns {{ valid: boolean, message: string }}
 */
export function validateFabricName(fabricName, existingFabrics) {
  if (!fabricName || !fabricName.trim()) {
    return { valid: false, message: "Fabric name is required" };
  }
  const exists = existingFabrics.some(
    (f) => f.fabricName?.toLowerCase() === fabricName.trim().toLowerCase()
  );
  if (exists) {
    return { valid: false, message: "Fabric name already exists" };
  }
  return { valid: true, message: "Available" };
}

/**
 * Validate GSM value.
 * @param {number|string} gsm
 * @returns {{ valid: boolean, message: string }}
 */
export function validateGSM(gsm) {
  const num = Number(gsm);
  if (isNaN(num)) {
    return { valid: false, message: "GSM must be a number" };
  }
  if (num < 80 || num > 500) {
    return { valid: false, message: "GSM recommended range: 80–500" };
  }
  return { valid: true, message: "" };
}

/**
 * Validate required fields in an object.
 * @param {Object} data - The data object
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequired(data, requiredFields) {
  const missing = requiredFields.filter((field) => {
    const val = data[field];
    if (val === null || val === undefined) return true;
    if (typeof val === "string" && !val.trim()) return true;
    return false;
  });
  return { valid: missing.length === 0, missing };
}

/**
 * Get dependency count — how many records reference a given value.
 * @param {string} valueId
 * @param {Array} mappings
 * @param {string} field - The field name to check in mappings
 * @returns {number}
 */
export function getDependencyCount(valueId, mappings, field = "componentValueId") {
  if (!Array.isArray(mappings)) return 0;
  return mappings.filter((m) => m[field] === valueId).length;
}

/**
 * Find duplicates in an array (case-insensitive).
 * @param {string[]} values
 * @returns {string[]} Array of duplicate values
 */
export function findDuplicates(values) {
  const seen = new Map();
  const duplicates = [];
  values.forEach((v) => {
    const lower = String(v).trim().toLowerCase();
    if (!lower) return;
    if (seen.has(lower)) {
      if (!duplicates.includes(seen.get(lower))) {
        duplicates.push(seen.get(lower));
      }
    } else {
      seen.set(lower, String(v).trim());
    }
  });
  return duplicates;
}
