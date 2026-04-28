import * as XLSX from "xlsx";

/**
 * Parse an Excel file (ArrayBuffer) and return workbook data.
 * @param {ArrayBuffer} buffer - The file as ArrayBuffer
 * @returns {{ sheetNames: string[], sheets: Object }}
 */
export function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheets = {};

  workbook.SheetNames.forEach((name) => {
    const ws = workbook.Sheets[name];
    sheets[name] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  });

  return {
    sheetNames: workbook.SheetNames,
    sheets,
  };
}

/**
 * Extract unique attribute values from the Unique_Tab sheet.
 * Expected layout: pairs of columns (Name, Count) for each attribute.
 * Column mapping:
 *   A=Color, B=Count, C=Material, D=Count, E=Sub-material, F=Count,
 *   G=Pattern, H=Count, I=Weave Pattern, J=Count, K=Season, L=Count,
 *   M=Features, N=Count
 */
export function extractUniqueTabValues(rows) {
  if (!rows || rows.length < 2) return null;

  const ATTRIBUTE_COLUMNS = [
    { name: "Color", col: 0 },
    { name: "Material", col: 2 },
    { name: "Sub Material", col: 4 },
    { name: "Pattern", col: 6 },
    { name: "Weave Pattern", col: 8 },
    { name: "Season", col: 10 },
    { name: "Feature", col: 12 },
  ];

  const result = {};

  ATTRIBUTE_COLUMNS.forEach(({ name, col }) => {
    const values = [];
    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const val = rows[i]?.[col];
      if (val && String(val).trim()) {
        values.push(String(val).trim());
      }
    }
    result[name] = values;
  });

  return result;
}

/**
 * Extract fabric properties from the Fabric_Properties sheet.
 * Expected columns: A=fabric_id, B=fabric_name, C=Description, D=color,
 * E=material, F=sub-material, G=pattern, H=weave_pattern, I=season,
 * J=gsm, K=features1, L=features2, M=features3
 */
export function extractFabricProperties(rows) {
  if (!rows || rows.length < 2) return [];

  return rows.slice(1).filter(row => row[0]).map((row) => ({
    fabricId: String(row[0] || "").trim(),
    fabricName: String(row[1] || "").trim(),
    description: String(row[2] || "").trim(),
    color: String(row[3] || "").trim(),
    material: String(row[4] || "").trim(),
    subMaterial: String(row[5] || "").trim(),
    pattern: String(row[6] || "").trim(),
    weavePattern: String(row[7] || "").trim(),
    season: String(row[8] || "").trim(),
    gsm: row[9] ? Number(row[9]) : null,
    feature1: String(row[10] || "").trim(),
    feature2: String(row[11] || "").trim(),
    feature3: String(row[12] || "").trim(),
    status: "active",
    availability: true,
  }));
}

/**
 * Auto-map columns from Fabric_Properties for attribute extraction.
 * Returns attribute → [unique values] mapping.
 */
export function extractAttributesFromFabricSheet(rows) {
  if (!rows || rows.length < 2) return null;

  const COLUMN_MAP = {
    Color: 3,       // Column D (0-indexed = 3)
    Material: 4,    // Column E
    "Sub Material": 5, // Column F
    Pattern: 6,     // Column G
    "Weave Pattern": 7, // Column H
    Season: 8,      // Column I
    Feature: null,   // Combined from K, L, M
  };

  const result = {};

  Object.entries(COLUMN_MAP).forEach(([attr, colIdx]) => {
    if (colIdx === null) return;
    const uniqueSet = new Set();
    for (let i = 1; i < rows.length; i++) {
      const val = rows[i]?.[colIdx];
      if (val && String(val).trim()) {
        uniqueSet.add(String(val).trim());
      }
    }
    result[attr] = Array.from(uniqueSet);
  });

  // Features — combine columns K (10), L (11), M (12)
  const featureSet = new Set();
  for (let i = 1; i < rows.length; i++) {
    [10, 11, 12].forEach((colIdx) => {
      const val = rows[i]?.[colIdx];
      if (val && String(val).trim()) {
        featureSet.add(String(val).trim());
      }
    });
  }
  result.Feature = Array.from(featureSet);

  return result;
}

/**
 * Get column summary — count of values per attribute.
 */
export function getColumnSummary(attributeMap) {
  if (!attributeMap) return {};
  const summary = {};
  Object.entries(attributeMap).forEach(([attr, values]) => {
    summary[attr] = values.length;
  });
  return summary;
}
