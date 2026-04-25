import React from "react";

const FabricFilterPanel = ({ 
  showFilterPanel, 
  setShowFilterPanel, 
  collapsedSections, 
  setCollapsedSections, 
  sortBy, 
  setSortBy, 
  selectedColors, 
  setSelectedColors 
}) => {
  if (!showFilterPanel) return null;

  return (
    <div className="fabric-filter-overlay" onClick={() => setShowFilterPanel(false)}>
      <div className="fabric-filter-panel" onClick={(e) => e.stopPropagation()}>
        <div className="fabric-filter-header">
          <h3>Filter Fabrics</h3>
          <button className="fabric-filter-close" onClick={() => setShowFilterPanel(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="fabric-filter-content">
          {/* Sort By Section */}
          <div className="fabric-filter-section">
            <div className="fabric-filter-section-header">
              <h4>Sort by</h4>
              <button
                className="fabric-filter-collapse"
                onClick={() => setCollapsedSections({ ...collapsedSections, sort: !collapsedSections.sort })}
              >
                {collapsedSections.sort ? "+" : "−"}
              </button>
            </div>
            {!collapsedSections.sort && (
              <div className="fabric-filter-options">
                {[
                  { value: "default", label: "Default" },
                  { value: "newest", label: "Newest" }
                ].map((option) => (
                  <label key={option.value} className="fabric-filter-option">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={() => setSortBy(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color Section */}
          <div className="fabric-filter-section">
            <div className="fabric-filter-section-header">
              <h4>Color</h4>
              <button
                className="fabric-filter-collapse"
                onClick={() => setCollapsedSections({ ...collapsedSections, color: !collapsedSections.color })}
              >
                {collapsedSections.color ? "+" : "−"}
              </button>
            </div>
            {!collapsedSections.color && (
              <div className="fabric-filter-color-grid">
                {[
                  { name: "Blue", color: "#4A5568" },
                  { name: "White", color: "#FFFFFF", border: true },
                  { name: "Brown", color: "#8B6F5C" },
                  { name: "Green", color: "#68A07C" },
                  { name: "Purple", color: "#8B7AA8" },
                  { name: "Black", color: "#1A1A1A" },
                  { name: "Grey", color: "#9BA5B0" },
                  { name: "Red", color: "#8B4545" }
                ].map((color) => (
                  <label key={color.name} className="fabric-filter-color-option">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.name)}
                      onChange={() => {
                        if (selectedColors.includes(color.name)) {
                          setSelectedColors(selectedColors.filter((c) => c !== color.name));
                        } else {
                          setSelectedColors([...selectedColors, color.name]);
                        }
                      }}
                    />
                    <div
                      className={`fabric-filter-color-swatch ${color.border ? "has-border" : ""}`}
                      style={{ backgroundColor: color.color }}
                    />
                    <span>{color.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="fabric-filter-footer">
          <button
            className="fabric-filter-clear"
            onClick={() => {
              setSortBy("default");
              setSelectedColors([]);
            }}
          >
            Clear All
          </button>
          <button
            className="fabric-filter-apply"
            onClick={() => setShowFilterPanel(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FabricFilterPanel;
