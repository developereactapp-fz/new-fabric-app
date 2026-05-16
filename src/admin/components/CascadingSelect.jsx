import FormGroup from "./FormGroup";

/**
 * CascadingSelect — Chained Category → Component → Value select dropdowns.
 * Automatically resets downstream selections when upstream changes.
 *
 * Usage:
 *   <CascadingSelect
 *     categories={categories}
 *     components={availableComponents}
 *     componentValues={availableValues}
 *     selectedCategory={cat}
 *     selectedComponent={comp}
 *     selectedValue={val}
 *     onCategoryChange={setCat}
 *     onComponentChange={setComp}
 *     onValueChange={setVal}
 *   />
 */
export default function CascadingSelect({
  categories = [],
  components = [],
  componentValues = [],
  selectedCategory,
  selectedComponent,
  selectedValue,
  onCategoryChange,
  onComponentChange,
  onValueChange,
  categoryLabel = "Category",
  componentLabel = "Component",
  valueLabel = "Component Value",
  categoryPlaceholder = "-- Select Category --",
  componentPlaceholder = "-- Select Component --",
  valuePlaceholder = "-- Select Value --",
  showValueSelect = true,
  required = false,
}) {
  return (
    <>
      <FormGroup label={categoryLabel} required={required}>
        <select
          className="admin-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">{categoryPlaceholder}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name ?? c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FormGroup>

      <FormGroup label={componentLabel} required={required}>
        <select
          className="admin-select"
          value={selectedComponent}
          onChange={(e) => onComponentChange(e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">{componentPlaceholder}</option>
          {components.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FormGroup>

      {showValueSelect && (
        <FormGroup label={valueLabel} required={required}>
          <select
            className="admin-select"
            value={selectedValue}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={!selectedComponent}
          >
            <option value="">{valuePlaceholder}</option>
            {componentValues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.valueName}
              </option>
            ))}
          </select>
        </FormGroup>
      )}
    </>
  );
}
