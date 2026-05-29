/**
 * CheckboxList — List of checkbox items with optional select-all toggle.
 *
 * Usage:
 *   <CheckboxList
 *     items={categories.map(c => ({ id: c.id, label: c.name }))}
 *     checkedIds={selectedIds}
 *     onChange={(id) => toggle(id)}
 *     showSelectAll
 *   />
 */
export default function CheckboxList({
  items = [],
  checkedIds = [],
  onChange,
  onSelectAll,
  showSelectAll = false,
  className = "",
}) {
  const allChecked = items.length > 0 && items.every((item) => checkedIds.includes(item.id));

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    }
  };

  return (
    <div className={`admin-checkbox-list ${className}`}>
      {showSelectAll && items.length > 0 && (
        <label className="checkbox-label checkbox-select-all">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={handleSelectAll}
          />
          <span style={{ fontWeight: 600 }}>
            {allChecked ? "Deselect All" : "Select All"}
          </span>
        </label>
      )}
      {items.map((item) => (
        <label key={item.id} className="checkbox-label">
          <input
            type="checkbox"
            checked={checkedIds.includes(item.id)}
            onChange={() => onChange(item.id)}
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}
