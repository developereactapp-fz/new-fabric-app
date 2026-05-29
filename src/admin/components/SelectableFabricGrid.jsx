/**
 * SelectableFabricGrid — Grid of fabric cards with selection checkboxes and select-all toggle.
 *
 * Usage:
 *   <SelectableFabricGrid
 *     fabrics={availableFabrics}
 *     selectedIds={selectedFabrics}
 *     onToggle={(id) => toggleFabric(id)}
 *     onSelectAll={handleSelectAll}
 *     emptyMessage="No fabrics found."
 *   />
 */
export default function SelectableFabricGrid({
  fabrics = [],
  selectedIds = [],
  onToggle,
  onSelectAll,
  emptyMessage = "No fabrics available.",
  emptyPrompt,
  showSelectAll = true,
}) {
  if (emptyPrompt) {
    return <div className="builder-empty-state">{emptyPrompt}</div>;
  }

  if (fabrics.length === 0) {
    return <div className="builder-empty-state">{emptyMessage}</div>;
  }

  return (
    <>
      {showSelectAll && fabrics.length > 0 && (
        <div className="main-header" style={{ marginBottom: 12 }}>
          <span>{fabrics.length} fabric(s) available</span>
          <button className="admin-btn secondary small" onClick={onSelectAll}>
            {selectedIds.length === fabrics.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      )}
      <div className="fabric-grid">
        {fabrics.map((fabric) => {
          const isSelected = selectedIds.includes(fabric.fabricId);
          return (
            <div
              key={fabric.fabricId}
              className={`fabric-group-card ${isSelected ? "selected" : ""}`}
              onClick={() => onToggle(fabric.fabricId)}
            >
              <div className="fabric-group-img-wrapper">
                {fabric.mappedImage ? (
                  <img src={fabric.mappedImage} alt={fabric.fabricName} />
                ) : (
                  <div className="no-image-warning">No Mapped Image</div>
                )}
                <div className="selection-overlay">
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="fabric-group-details">
                <span className="fabric-code">{fabric.fabricCode}</span>
                <span className="fabric-name">{fabric.fabricName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
