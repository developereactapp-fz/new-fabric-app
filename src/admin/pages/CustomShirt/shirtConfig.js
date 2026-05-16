/**
 * SHIRT_COMPONENTS — Hardcoded component sections per spec (Section 38).
 * Each section has a key, title, options array, and optional contrast flag.
 * 
 * Extracted from CustomShirtPage for reusability and maintainability.
 */
const SHIRT_COMPONENTS = [
  {
    key: "collar",
    title: "Collar",
    hasContrast: true,
    options: [
      { key: "classic", label: "Classic" },
      { key: "classic_widespread", label: "Classic Widespread" },
      { key: "curved", label: "Curved" },
      { key: "cutaway", label: "Cutaway" },
      { key: "high_widespread", label: "High Widespread" },
      { key: "point", label: "Point" },
      { key: "button_down", label: "Button Down" },
      { key: "band", label: "Band" },
      { key: "wing_tip", label: "Wing Tip" },
      { key: "club", label: "Club" },
    ],
  },
  {
    key: "cuff",
    title: "Cuff",
    hasContrast: true,
    options: [
      { key: "single_round", label: "Single Round" },
      { key: "single_eclipse", label: "Single Eclipse" },
      { key: "single_chisel", label: "Single Chisel" },
      { key: "single_square", label: "Single Square" },
      { key: "double_cuff_round", label: "Double Cuff Round" },
      { key: "double_cuff_square", label: "Double Cuff Square" },
      { key: "double_cuff_chisel", label: "Double Cuff Chisel" },
      { key: "turnback_cuff", label: "Turnback Cuff" },
    ],
  },
  {
    key: "placket",
    title: "Placket",
    options: [
      { key: "plain", label: "Plain" },
      { key: "hidden_button", label: "Hidden Button" },
      { key: "half_hidden_button", label: "Half Hidden Button" },
      { key: "stitched_on", label: "Stitched-On" },
      { key: "plain_bib", label: "Plain Bib" },
      { key: "pleated_bib", label: "Pleated Bib" },
    ],
  },
  {
    key: "back_details",
    title: "Back Details",
    options: [
      { key: "rear_side_pleats", label: "Rear Side Pleats" },
      { key: "center_box_pleats", label: "Center Box Pleats" },
      { key: "box_pleat", label: "Box Pleat" },
      { key: "no_back_pleats", label: "No Back Pleats" },
      { key: "dart_pleats", label: "Dart Pleats" },
    ],
  },
  {
    key: "chest_pocket",
    title: "Chest Pocket",
    options: [
      { key: "no_pocket", label: "No Pocket" },
      { key: "patch_pocket", label: "Patch Pocket" },
      { key: "regular_pocket", label: "Regular Pocket" },
      { key: "regular_flap_pocket", label: "Regular Flap Pocket" },
    ],
  },
  {
    key: "sleeve",
    title: "Sleeve",
    options: [
      { key: "long_sleeve", label: "Long Sleeve" },
      { key: "short_sleeve", label: "Short Sleeve" },
    ],
  },
  {
    key: "hem",
    title: "Hem",
    options: [
      { key: "straight", label: "Straight" },
      { key: "curved", label: "Curved" },
      { key: "gusset", label: "Gusset" },
    ],
  },
  {
    key: "button",
    title: "Accessories — Button",
    options: [
      { key: "tie", label: "Tie" },
      { key: "bow", label: "Bow" },
    ],
  },
];

/** Keys of sections that support contrast */
export const CONTRAST_SECTIONS = SHIRT_COMPONENTS
  .filter((s) => s.hasContrast)
  .map((s) => s.key);

/** Initial contrast state object */
export const initialContrastState = () =>
  Object.fromEntries(CONTRAST_SECTIONS.map((k) => [k, false]));

export default SHIRT_COMPONENTS;
