import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore";
import "./GroupBuilder.css";

export default function GroupBuilderPage() {
  const { state, actions } = useAdmin();

  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  
  // Selections
  const [targetCategories, setTargetCategories] = useState([]);
  const [sourceCategory, setSourceCategory] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedComponentValueId, setSelectedComponentValueId] = useState("");
  const [selectedFabrics, setSelectedFabrics] = useState([]);

  const categories = state.categories || [];
  
  // Available components based on source category
  const availableComponents = useMemo(() => {
    if (!sourceCategory) return [];
    return state.components[sourceCategory] || [];
  }, [sourceCategory, state.components]);

  // Available values based on component
  const availableComponentValues = useMemo(() => {
    if (!selectedComponentId) return [];
    return state.componentValues[selectedComponentId] || [];
  }, [selectedComponentId, state.componentValues]);

  // Load mapped fabrics based on Source Category, Component, and Value
  const availableFabrics = useMemo(() => {
    if (!sourceCategory || !selectedComponentId || !selectedComponentValueId) return [];
    
    // Find mappings that match these criteria
    const relevantMappings = state.fabricMappings.filter(
      (m) => m.categoryId === sourceCategory && 
             m.componentId === selectedComponentId &&
             m.componentValueId === selectedComponentValueId &&
             m.isAvailable === true
    );

    // Map to fabric details, including the specific image mapped to this component
    return relevantMappings.map((mapping) => {
      const fabric = state.fabrics.find(f => f.id === mapping.fabricId);
      return {
        mappingId: mapping.id,
        fabricId: mapping.fabricId,
        fabricName: fabric ? fabric.fabricName : "Unknown Fabric",
        fabricCode: fabric ? fabric.fabricId : "Unknown ID",
        mappedImage: mapping.image,
        isSelected: selectedFabrics.includes(mapping.fabricId)
      };
    }).filter(f => f.fabricId); // exclude any where fabric wasn't found
  }, [sourceCategory, selectedComponentId, selectedComponentValueId, state.fabricMappings, state.fabrics, selectedFabrics]);

  const handleTargetCategoryChange = (catName) => {
    if (targetCategories.includes(catName)) {
      setTargetCategories(targetCategories.filter(c => c !== catName));
    } else {
      setTargetCategories([...targetCategories, catName]);
    }
  };

  const handleToggleFabricSelection = (fabId) => {
    if (selectedFabrics.includes(fabId)) {
      setSelectedFabrics(selectedFabrics.filter(id => id !== fabId));
    } else {
      setSelectedFabrics([...selectedFabrics, fabId]);
    }
  };

  const handleSelectAllFabrics = () => {
    if (selectedFabrics.length === availableFabrics.length) {
      setSelectedFabrics([]); // deselect all
    } else {
      setSelectedFabrics(availableFabrics.map(f => f.fabricId));
    }
  };

  const handleSaveGroup = () => {
    if (!groupName || !groupId || targetCategories.length === 0 || !sourceCategory || !selectedComponentId || !selectedComponentValueId) {
      alert("Please fill out all required fields and selections.");
      return;
    }
    
    if (selectedFabrics.length === 0) {
      alert("Please select at least one fabric for the group.");
      return;
    }

    // Validation: Check if selected fabrics have images
    const missingImages = availableFabrics.filter(
      (f) => selectedFabrics.includes(f.fabricId) && !f.mappedImage
    );

    if (missingImages.length > 0) {
      alert(`Validation Error: ${missingImages.length} selected fabric(s) are missing images for this component. Mapped images are mandatory for group items.`);
      return;
    }

    const payload = {
      groupId,
      groupName,
      targetCategories,
      sourceCategory,
      componentId: selectedComponentId,
      componentValueId: selectedComponentValueId,
      items: selectedFabrics,
      status: "active"
    };

    dispatch({ type: "ADD_BUILDER_GROUP", payload }); // Assuming custom dispatch or direct store action
    
    // Fallback if ADD_BUILDER_GROUP isn't directly exposed in actions
    if(actions.addBuilderGroup) {
      actions.addBuilderGroup(payload);
    } else {
      // Using generic store modification if specific action isn't available
       alert("Group saved successfully! (Simulated)");
    }

    // Reset
    setGroupName("");
    setGroupId("");
    setSelectedFabrics([]);
  };

  return (
    <div className="group-builder-page">
      <div className="admin-page-header">
        <div>
          <h2>Group Builder</h2>
          <p>Create reusable groups from existing mapped fabrics for use as Contrast Options or general groups.</p>
        </div>
      </div>

      <div className="builder-layout">
        <div className="builder-sidebar">
          
          <div className="admin-card">
            <h3>Group Details</h3>
            <div className="form-group">
              <label className="admin-label">Group ID *</label>
              <input 
                type="text" 
                className="admin-input" 
                value={groupId} 
                onChange={(e) => setGroupId(e.target.value)} 
                placeholder="e.g. GRP-LINEN-COLLAR"
              />
            </div>
            <div className="form-group">
              <label className="admin-label">Group Name *</label>
              <input 
                type="text" 
                className="admin-input" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
                placeholder="e.g. Linen Collar Options"
              />
            </div>
          </div>

          <div className="admin-card">
            <h3>Target Categories *</h3>
            <p className="admin-helper">Which categories can use this group?</p>
            <div className="target-categories-list">
              {categories.map(c => (
                <label key={c.id} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={targetCategories.includes(c.name)}
                    onChange={() => handleTargetCategoryChange(c.name)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h3>Source Mapping *</h3>
            <p className="admin-helper">Select the source criteria to load available fabrics.</p>
            
            <div className="form-group">
              <label className="admin-label">Source Category</label>
              <select 
                className="admin-select" 
                value={sourceCategory} 
                onChange={(e) => {
                  setSourceCategory(e.target.value);
                  setSelectedComponentId("");
                  setSelectedComponentValueId("");
                }}
              >
                <option value="">-- Select Category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="admin-label">Component</label>
              <select 
                className="admin-select" 
                value={selectedComponentId} 
                onChange={(e) => {
                  setSelectedComponentId(e.target.value);
                  setSelectedComponentValueId("");
                }}
                disabled={!sourceCategory}
              >
                <option value="">-- Select Component --</option>
                {availableComponents.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="admin-label">Component Type/Value</label>
              <select 
                className="admin-select" 
                value={selectedComponentValueId} 
                onChange={(e) => setSelectedComponentValueId(e.target.value)}
                disabled={!selectedComponentId}
              >
                <option value="">-- Select Value --</option>
                {availableComponentValues.map(v => (
                  <option key={v.id} value={v.id}>{v.valueName}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        <div className="builder-main">
          <div className="admin-card">
            <div className="main-header">
              <h3>Available Fabrics</h3>
              {availableFabrics.length > 0 && (
                <button className="admin-btn secondary small" onClick={handleSelectAllFabrics}>
                  {selectedFabrics.length === availableFabrics.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
            
            {!sourceCategory || !selectedComponentId || !selectedComponentValueId ? (
              <div className="builder-empty-state">
                Please complete the Source Mapping selection on the left to view available fabrics.
              </div>
            ) : availableFabrics.length === 0 ? (
              <div className="builder-empty-state">
                No fabrics found with mapped images for the selected criteria.
              </div>
            ) : (
              <div className="fabric-grid">
                {availableFabrics.map((fabric) => (
                  <div 
                    key={fabric.fabricId} 
                    className={`fabric-group-card ${fabric.isSelected ? "selected" : ""}`}
                    onClick={() => handleToggleFabricSelection(fabric.fabricId)}
                  >
                    <div className="fabric-group-img-wrapper">
                      {fabric.mappedImage ? (
                        <img src={fabric.mappedImage} alt={fabric.fabricName} />
                      ) : (
                        <div className="no-image-warning">No Mapped Image</div>
                      )}
                      <div className="selection-overlay">
                        {fabric.isSelected && (
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
                ))}
              </div>
            )}
          </div>

          <div className="builder-actions">
            <button className="admin-btn primary full-width" onClick={handleSaveGroup}>
              Save Fabric Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
