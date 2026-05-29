import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAdmin } from "../../store/adminStore";
import useCascadingSelection from "../../hooks/useCascadingSelection";
import PageHeader from "../../components/PageHeader";
import CascadingSelect from "../../components/CascadingSelect";
import FormGroup from "../../components/FormGroup";
import ActionBar from "../../components/ActionBar";
import EmptyState from "../../components/EmptyState";
import "./ContrastMapper.css";

export default function ContrastMapperPage() {
  const { state, actions } = useAdmin();

  const {
    categories,
    selectedCategory,
    selectedComponent: selectedComponentId,
    selectedValue: selectedComponentValueId,
    availableComponents,
    availableValues: availableComponentValues,
    setCategory,
    setComponent,
    setValue,
    reset: resetCascade,
  } = useCascadingSelection();

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const builderGroups = useMemo(() => state.builderGroups || [], [state.builderGroups]);

  // Find the default mapping for this component to auto-detect default fabric
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
    
    if (defaultFabric) {
      return items.map(item => ({
        ...item,
        isDuplicate: item.fabricId === defaultFabric.id
      }));
    }
    
    return items.map(item => ({ ...item, isDuplicate: false }));
  }, [selectedGroup, defaultFabric]);

  const validItems = useMemo(() => {
    return cleanGroupItems.filter(item => !item.isDuplicate);
  }, [cleanGroupItems]);

  const handleReset = () => {
    resetCascade();
    setSelectedGroupId("");
  };

  const handleSaveContrastMapping = () => {
    if (!selectedCategory || !selectedComponentId || !selectedComponentValueId || !selectedGroupId) {
      toast.error("Please complete all selections.");
      return;
    }

    if (validItems.length === 0) {
      toast.error("The selected group has no valid items after auto-cleanup. Please select a different group.");
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
    toast.success("Contrast Mapping saved successfully!");
    handleReset();
  };

  return (
    <div className="contrast-mapper-page">
      <PageHeader
        title="Contrast Group Mapper"
        subtitle="Apply reusable fabric groups as contrast options to specific component values."
      />

      <div className="mapper-layout">
        {/* Left Sidebar: Form */}
        <div className="mapper-sidebar">
          <CascadingSelect
            categories={categories}
            components={availableComponents}
            componentValues={availableComponentValues}
            selectedCategory={selectedCategory}
            selectedComponent={selectedComponentId}
            selectedValue={selectedComponentValueId}
            onCategoryChange={setCategory}
            onComponentChange={setComponent}
            onValueChange={setValue}
            categoryLabel="Target Category"
            componentLabel="Component"
            valueLabel="Sub-component Type / Value"
            categoryPlaceholder="Select Category..."
            componentPlaceholder="Select Component..."
            valuePlaceholder="Select Value..."
          />

          <FormGroup label="Select Reusable Group">
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
          </FormGroup>

          <ActionBar>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSaveContrastMapping}
              disabled={!selectedCategory || !selectedComponentId || !selectedComponentValueId || !selectedGroupId}
            >
              Save Mapping
            </button>
          </ActionBar>
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
                <EmptyState message="No default fabric is mapped for this component yet." />
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
              <EmptyState message="Select a group to preview contrast options." />
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
