import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore";
import "./ContrastMapper.css";

export default function ContrastMapperPage() {
  const { state, actions } = useAdmin();

  // Selections
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedComponentValueId, setSelectedComponentValueId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const categories = state.categories || [];
  const builderGroups = state.builderGroups || [];

  // Available components based on category
  const availableComponents = useMemo(() => {
    if (!selectedCategory) return [];
    return state.components[selectedCategory] || [];
  }, [selectedCategory, state.components]);

  // Available values based on component
  const availableComponentValues = useMemo(() => {
    if (!selectedComponentId) return [];
    return state.componentValues[selectedComponentId] || [];
  }, [selectedComponentId, state.componentValues]);

  // Find the default mapping for this component to auto-detect default fabric
  // Note: Usually default fabric is detected via isDefault flag on fabricMappings.
  const defaultFabricMapping = useMemo(() => {
    if (!selectedCategory || !selectedComponentId) return null;
    return state.fabricMappings.find(
      (m) => m.categoryId === selectedCategory && m.componentId === selectedComponentId && m.isDefault === true
    );
  }, [selectedCategory, selectedComponentId, state.fabricMappings]);

  const defaultFabric = useMemo(() => {
    if (!defaultFabricMapping) return null;
    return state.fabrics.find(f => f.id === defaultFabricMapping.fabricId);
  }, [defaultFabricMapping, state.fabrics]);

  // Selected Group details
  const selectedGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return builderGroups.find(g => g.id === selectedGroupId);
  }, [selectedGroupId, builderGroups]);

  // Auto cleanup logic: Filter out the default fabric from the group's items
  const cleanGroupItems = useMemo(() => {
    if (!selectedGroup) return [];
    const items = selectedGroup.items || [];
    
    // Clean up: remove the default fabric if it exists
    if (defaultFabric) {
      return items.map(item => {
        return {
          ...item,
          isDuplicate: item.fabricId === defaultFabric.id
        };
      });
    }
    
    return items.map(item => ({ ...item, isDuplicate: false }));
  }, [selectedGroup, defaultFabric]);

  const validItems = useMemo(() => {
    return cleanGroupItems.filter(item => !item.isDuplicate);
  }, [cleanGroupItems]);

  const handleSaveContrastMapping = () => {
    if (!selectedCategory || !selectedComponentId || !selectedComponentValueId || !selectedGroupId) {
      alert("Please complete all selections.");
      return;
    }

    if (validItems.length === 0) {
      alert("The selected group has no valid items after auto-cleanup. Please select a different group.");
      return;
    }

    const mappingData = {
      categoryId: selectedCategory,
      componentId: selectedComponentId,
      componentValueId: selectedComponentValueId,
      groupId: selectedGroupId,
      defaultFabricId: defaultFabric ? defaultFabric.id : null,
      mappedItems: validItems,
      createdAt: new Date().toISOString()
    };

    actions.addContrastMapping(mappingData);
    alert("Contrast Mapping saved successfully!");
    
    // Reset form
    setSelectedCategory("");
    setSelectedComponentId("");
    setSelectedComponentValueId("");
    setSelectedGroupId("");
  };

  return (
    <div className="contrast-mapper-page">
      <div className="page-header">
        <h1>Contrast Group Mapper</h1>
        <p>Apply reusable fabric groups as contrast options to specific component values.</p>
      </div>

      <div className="info-alert">
        <div className="info-alert-icon">💡</div>
        <p className="info-alert-text">
          <strong>Auto-cleanup enabled:</strong> If the default fabric for the selected component exists within the chosen contrast group, it will automatically be identified and excluded to prevent duplicate material selection.
        </p>
      </div>

      <div className="mapper-layout">
        {/* Left Sidebar: Form */}
        <div className="mapper-sidebar">
          <div className="form-group">
            <label>Target Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedComponentId("");
                setSelectedComponentValueId("");
              }}
            >
              <option value="">Select Category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Component</label>
            <select
              className="form-control"
              value={selectedComponentId}
              onChange={(e) => {
                setSelectedComponentId(e.target.value);
                setSelectedComponentValueId("");
              }}
              disabled={!selectedCategory}
            >
              <option value="">Select Component...</option>
              {availableComponents.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sub-component Type / Value</label>
            <select
              className="form-control"
              value={selectedComponentValueId}
              onChange={(e) => setSelectedComponentValueId(e.target.value)}
              disabled={!selectedComponentId}
            >
              <option value="">Select Value...</option>
              {availableComponentValues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.valueName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Reusable Group</label>
            <select
              className="form-control"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">Select a Group...</option>
              {builderGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName} ({g.groupId})
                </option>
              ))}
            </select>
          </div>

          <div className="actions-footer">
            <button className="btn-secondary" onClick={() => {
              setSelectedCategory("");
              setSelectedComponentId("");
              setSelectedComponentValueId("");
              setSelectedGroupId("");
            }}>
              Reset
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSaveContrastMapping}
              disabled={!selectedCategory || !selectedComponentId || !selectedComponentValueId || !selectedGroupId}
            >
              Save Mapping
            </button>
          </div>
        </div>

        {/* Right Content: Preview */}
        <div className="mapper-main">
          {/* Default Fabric Detection */}
          {selectedComponentId && (
            <div className="default-fabric-section">
              <h3>Auto-detected Default Fabric</h3>
              {defaultFabric ? (
                <div className="default-fabric-card">
                  <img src={defaultFabricMapping.image} alt={defaultFabric.fabricName} className="default-fabric-img" />
                  <div className="default-fabric-info">
                    <span className="fabric-name">{defaultFabric.fabricName}</span>
                    <span className="fabric-code">{defaultFabric.fabricId}</span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  No default fabric is mapped for this component yet.
                </div>
              )}
            </div>
          )}

          {/* Group Preview */}
          <div className="preview-section">
            <div className="preview-header">
              <h2>Contrast Options Preview</h2>
              {selectedGroup && (
                <span className="preview-meta">
                  {validItems.length} valid option(s)
                </span>
              )}
            </div>

            {!selectedGroup ? (
              <div className="empty-state">
                Select a group to preview contrast options.
              </div>
            ) : (
              <div className="contrast-grid">
                {cleanGroupItems.map((item, index) => (
                  <div key={index} className={`contrast-card ${item.isDuplicate ? 'is-duplicate' : ''}`}>
                    <img src={item.mappedImage} alt={item.fabricName} className="contrast-img" />
                    <div className="contrast-info">
                      <span className="contrast-name">{item.fabricName}</span>
                      <span className="contrast-code">{item.fabricCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
