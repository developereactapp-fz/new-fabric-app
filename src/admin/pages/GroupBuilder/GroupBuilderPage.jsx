import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore";
import useCascadingSelection from "../../hooks/useCascadingSelection";
import PageHeader from "../../components/PageHeader";
import FormGroup from "../../components/FormGroup";
import CascadingSelect from "../../components/CascadingSelect";
import CheckboxList from "../../components/CheckboxList";
import SelectableFabricGrid from "../../components/SelectableFabricGrid";
import ActionBar from "../../components/ActionBar";
import "./GroupBuilder.css";

export default function GroupBuilderPage() {
  const { state, actions } = useAdmin();

  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [targetCategories, setTargetCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);

  const {
    categories,
    selectedCategory: sourceCategory,
    selectedComponent: selectedComponentId,
    selectedValue: selectedComponentValueId,
    availableComponents,
    availableValues: availableComponentValues,
    setCategory: setSourceCategory,
    setComponent: setSelectedComponentId,
    setValue: setSelectedComponentValueId,
  } = useCascadingSelection();

  // Load mapped fabrics based on Source Category, Component, and Value
  const availableFabrics = useMemo(() => {
    if (!sourceCategory || !selectedComponentId || !selectedComponentValueId) return [];
    
    const relevantMappings = state.fabricMappings.filter(
      (m) => m.categoryId === sourceCategory && 
             m.componentId === selectedComponentId &&
             m.componentValueId === selectedComponentValueId &&
             m.isAvailable === true
    );

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
    }).filter(f => f.fabricId);
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
      setSelectedFabrics([]);
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

    if(actions.addBuilderGroup) {
      actions.addBuilderGroup(payload);
    } else {
       alert("Group saved successfully! (Simulated)");
    }

    setGroupName("");
    setGroupId("");
    setSelectedFabrics([]);
  };

  // Determine the empty/prompt state for the fabric grid
  const fabricGridPrompt = (!sourceCategory || !selectedComponentId || !selectedComponentValueId)
    ? "Please complete the Source Mapping selection on the left to view available fabrics."
    : null;

  return (
    <div className="group-builder-page">
      <PageHeader
        title="Group Builder"
        subtitle="Create reusable groups from existing mapped fabrics for use as Contrast Options or general groups."
      />

      <div className="builder-layout">
        <div className="builder-sidebar">
          
          <div className="admin-card">
            <h3>Group Details</h3>
            <FormGroup label="Group ID" required>
              <input 
                type="text" 
                className="admin-input" 
                value={groupId} 
                onChange={(e) => setGroupId(e.target.value)} 
                placeholder="e.g. GRP-LINEN-COLLAR"
              />
            </FormGroup>
            <FormGroup label="Group Name" required>
              <input 
                type="text" 
                className="admin-input" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
                placeholder="e.g. Linen Collar Options"
              />
            </FormGroup>
          </div>

          <div className="admin-card">
            <h3>Target Categories *</h3>
            <p className="admin-helper">Which categories can use this group?</p>
            <CheckboxList
              items={categories.map(c => ({ id: c.name, label: c.name }))}
              checkedIds={targetCategories}
              onChange={handleTargetCategoryChange}
              className="target-categories-list"
            />
          </div>

          <div className="admin-card">
            <h3>Source Mapping *</h3>
            <p className="admin-helper">Select the source criteria to load available fabrics.</p>
            <CascadingSelect
              categories={categories}
              components={availableComponents}
              componentValues={availableComponentValues}
              selectedCategory={sourceCategory}
              selectedComponent={selectedComponentId}
              selectedValue={selectedComponentValueId}
              onCategoryChange={setSourceCategory}
              onComponentChange={setSelectedComponentId}
              onValueChange={setSelectedComponentValueId}
              categoryLabel="Source Category"
              componentLabel="Component"
              valueLabel="Component Type/Value"
            />
          </div>
        </div>

        <div className="builder-main">
          <div className="admin-card">
            <div className="main-header">
              <h3>Available Fabrics</h3>
            </div>
            <SelectableFabricGrid
              fabrics={availableFabrics}
              selectedIds={selectedFabrics}
              onToggle={handleToggleFabricSelection}
              onSelectAll={handleSelectAllFabrics}
              emptyMessage="No fabrics found with mapped images for the selected criteria."
              emptyPrompt={fabricGridPrompt}
              showSelectAll={availableFabrics.length > 0}
            />
          </div>

          <ActionBar className="builder-actions">
            <button className="admin-btn primary full-width" onClick={handleSaveGroup}>
              Save Fabric Group
            </button>
          </ActionBar>
        </div>
      </div>
    </div>
  );
}
