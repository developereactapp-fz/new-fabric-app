import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Icons
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

const FabricPieceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const FullImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Option Item Component
const OptionItem = ({ option }) => (
  <div className="finish-option-item">
    <div className="finish-option-icon">
      <div className="finish-option-icon-inner" />
    </div>
    <div className="finish-option-details">
      <span className="finish-option-label">{option.label}</span>
      <span className="finish-option-value">{option.value}</span>
      <span className="finish-option-code">{option.code}</span>
    </div>
  </div>
);

// Summary Card Component - 2-column layout (image + details)
const SummaryCard = ({ data, editable = false, onEdit, isShirt = false }) => {
  // Logic to handle layer replacement (e.g., Contrast)
  const renderLayers = () => {
    // Show shirt layers/merged pieces (not fabric thumbnail)
    if (data.layers && data.layers.length > 0) {
      return (
        <div className="finish-layers-wrapper">
          {data.layers.map((layer, index) => (
            <img
              key={index}
              src={layer}
              alt={`${data.item} layer ${index + 1}`}
              className="finish-card-layer"
              style={{ zIndex: index }}
            />
          ))}
        </div>
      );
    }

    // Fallback to placeholder if no shirt image available
    return (
      <div className="finish-card-image-placeholder">
        <span>{data.item?.charAt(0)}</span>
      </div>
    );
  };

  return (
    <div className={`finish-summary-card ${isShirt ? 'is-shirt' : ''}`}>
      {/* Left Side - Garment Image (The main fabric image where pieces are applied) */}
      <div className="finish-card-image">
        {renderLayers()}
      </div>
      
      {/* Right Side - Details */}
      <div className="finish-card-content">
        <div className="finish-card-header">
          <div>
            <h3 className="finish-card-title">{data.item}</h3>
            <p className="finish-card-subtitle">{data.options?.length || 0} customizations applied</p>
          </div>
          {editable && (
            <button className="finish-edit-btn" onClick={onEdit} title="Edit Design">
              <EditIcon />
            </button>
          )}
        </div>
        <div className="finish-options-grid">
          {data.options?.map((option, idx) => (
            <OptionItem key={idx} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Selected Design Card - Shows fabric with piece and full image
const SelectedDesignCard = ({ fabric, garmentType, styleName }) => {
  const [showFullImage, setShowFullImage] = useState(true);

  if (!fabric) return (
    <div className="finish-summary-card">
      <div className="finish-card-content">
        <h3 className="finish-card-title">No Design Selected</h3>
        <p className="finish-card-subtitle">Please select a fabric from the customization page</p>
      </div>
    </div>
  );

  return (
    <div className="finish-summary-card finish-design-card">
      <div className="finish-card-image finish-design-preview">
        {showFullImage ? (
          <div className="finish-full-preview-wrapper">
            {fabric.layers?.map((layer, index) => (
              <img
                key={index}
                src={layer}
                alt={`${fabric.name} layer ${index + 1}`}
                className="finish-full-preview-layer"
                style={{ zIndex: index }}
              />
            ))}
          </div>
        ) : (
          <div className="finish-piece-preview">
            {fabric.thumbnail ? (
              <img src={fabric.thumbnail} alt={fabric.name} />
            ) : (
              <div 
                className="finish-piece-swatch"
                style={{ backgroundColor: fabric.color || '#ccc' }}
              >
                {fabric.pattern === 'stripe' && <div className="fabric-pattern stripe" />}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="finish-card-content">
        <div className="finish-card-header">
          <div>
            <h3 className="finish-card-title">{garmentType ? garmentType.charAt(0).toUpperCase() + garmentType.slice(1) : 'Design'}</h3>
            <p className="finish-card-subtitle">{styleName || 'Classic Style'}</p>
          </div>
        </div>
        
        <div className="finish-fabric-info-section">
          <div className="finish-fabric-header">
            <span className="finish-fabric-tag">Selected Fabric</span>
            <h4 className="finish-fabric-title">{fabric.name}</h4>
          </div>
          
          {fabric.color && (
            <div className="finish-fabric-color-row">
              <span className="finish-fabric-label">Color</span>
              <div 
                className="finish-fabric-color-swatch"
                style={{ backgroundColor: fabric.color }}
              />
              <span className="finish-fabric-color-value">{fabric.color}</span>
            </div>
          )}
          
          {fabric.pattern && (
            <div className="finish-fabric-pattern-row">
              <span className="finish-fabric-label">Pattern</span>
              <span className="finish-fabric-pattern-value">{fabric.pattern}</span>
            </div>
          )}
        </div>

        {/* Toggle View Buttons */}
        <div className="finish-view-toggle">
          <button 
            className={`finish-view-btn ${showFullImage ? 'active' : ''}`}
            onClick={() => setShowFullImage(true)}
          >
            <FullImageIcon />
            <span>Full Garment</span>
          </button>
          <button 
            className={`finish-view-btn ${!showFullImage ? 'active' : ''}`}
            onClick={() => setShowFullImage(false)}
          >
            <FabricPieceIcon />
            <span>Fabric Piece</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Fabric Info Card Component
const FabricInfoCard = ({ fabric }) => (
  <div className="finish-fabric-card">
    <div className="finish-fabric-image">
      {fabric.image || fabric.thumbnail ? (
        <img src={fabric.image || fabric.thumbnail} alt={fabric.name} />
      ) : (
        <div 
          className="finish-fabric-fallback"
          style={{ backgroundColor: fabric.color || '#ccc' }}
        />
      )}
      <div className="finish-fabric-overlay">
        <span className="finish-fabric-badge">PREMIUM FABRIC</span>
        <h3 className="finish-fabric-name">{fabric.name}</h3>
      </div>
    </div>
    <div className="finish-fabric-details">
      <div className="finish-fabric-row">
        <span className="finish-fabric-label">Material</span>
        <span className="finish-fabric-value">{fabric.material || 'Premium Blend'}</span>
      </div>
      <div className="finish-fabric-row">
        <span className="finish-fabric-label">GSM</span>
        <span className="finish-fabric-value">{fabric.gsm || '250g/m²'}</span>
      </div>
      <div className="finish-fabric-row">
        <span className="finish-fabric-label">Season</span>
        <span className="finish-fabric-value">{fabric.season || 'All Season'}</span>
      </div>
    </div>
  </div>
);

// Mock customization data for complete suit summary
const customizationData = {
  shirt: {
    item: "Shirt",
    customizationsCount: 6,
    layers: null,
    image: "/assets/images/blacksatin/body.png",
    options: [
      { label: "FABRIC", value: "Navy Herringbone Wool", code: "W-07" },
      { label: "CUFF", value: "Full Lined", code: "CU-09" },
      { label: "POCKETS", value: "Flap Pockets", code: "PK-01" },
      { label: "BUTTON", value: "Black Horn", code: "BT-13" },
      { label: "LAPEL", value: "NOTCH", code: "LP-01" },
      { label: "VENT", value: "Double Vent", code: "VN-02" }
    ]
  },
  trousers: {
    item: "Trousers",
    customizationsCount: 6,
    layers: null,
    image: "/assets/images/blacksatin/pant.png",
    options: [
      { label: "WAISTBAND", value: "Standard", code: "WB-01" },
      { label: "PLEAT", value: "No Pleat", code: "PL-00" },
      { label: "CUFF", value: "No Cuff", code: "CU-00" },
      { label: "POCKET", value: "Side Pockets", code: "PK-01" },
      { label: "FINISH", value: "Premium", code: "FI-05" },
      { label: "BELT LOOPS", value: "Standard", code: "BL-01" }
    ]
  },
  jacket: {
    item: "Jacket",
    customizationsCount: 6,
    layers: null,
    image: "/assets/images/blacksatin/jacket.png",
    options: [
      { label: "FABRIC", value: "Standard", code: "WB-01" },
      { label: "POCKET", value: "Side Pockets", code: "PK-01" },
      { label: "PLEAT", value: "No Pleat", code: "PL-00" },
      { label: "FINISH", value: "Premium", code: "FI-05" },
      { label: "CUFF", value: "No Cuff", code: "CU-00" },
      { label: "BELT LOOPS", value: "Standard", code: "BL-01" }
    ]
  },
  waistcoat: {
    item: "Waistcoat",
    customizationsCount: 6,
    layers: null,
    image: null,
    options: [
      { label: "STYLE", value: "Single Breasted", code: "ST-01" },
      { label: "BUTTON", value: "Matching", code: "BT-M" },
      { label: "POCKETS", value: "Welt Pockets", code: "PK-02" },
      { label: "FABRIC", value: "Herring", code: "FB-H" },
      { label: "BACK", value: "Adjustable", code: "BK-A" },
      { label: "BACK", value: "Adjustable", code: "BK-A2" }
    ]
  }
};

const fabricData = {
  name: "Navy Pure 100% Wool",
  code: "NAV-001",
  material: "100% Virgin Wool",
  gsm: "285g/m²",
  season: "Summer",
  image: "/assets/images/bluestripe/fabric.png"
};

// Main Finish Page Component
export default function FinishPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [designData, setDesignData] = useState(null);

  // Load data from navigation state or localStorage
  useEffect(() => {
    const stateData = location.state;
    if (stateData) {
      setDesignData(stateData);
      localStorage.setItem('finishDesignData', JSON.stringify(stateData));
    } else {
      const savedData = localStorage.getItem('finishDesignData');
      if (savedData) {
        setDesignData(JSON.parse(savedData));
      }
    }
  }, [location.state]);

  const { garmentType, fabric, styleName, customizationOptions } = designData || {};

  // Use selected fabric if available, otherwise use mock
  const activeFabric = fabric || fabricData;
  const hasActiveFabric = !!fabric;

  const handleEnquire = () => {
    alert("Enquiry submitted! We'll contact you soon.");
  };

  const handleSave = () => {
    const newDesign = {
      id: Date.now(),
      name: styleName || `${garmentType ? garmentType.charAt(0).toUpperCase() + garmentType.slice(1) : 'Custom'} Design`,
      type: garmentType?.toUpperCase() === 'TUXEDO' ? 'TUXEDO' : 'SHIRT',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      fabric: activeFabric,
      details: activeCustomizationData.slice(0, 2).map(d => ({ label: d.label, value: d.value })),
      image: fabric?.layers?.[0] || fabric?.thumbnail || "/assets/images/default-design.png",
      layers: fabric?.layers || []
    };

    const existing = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    localStorage.setItem('saved_designs', JSON.stringify([newDesign, ...existing]));
    
    navigate('/saved-designs');
  };

  const handleEdit = (item) => {
    const routes = {
      shirt: "/customize/shirt",
      trousers: "/customize/pant",
      jacket: "/customize/jacket",
      waistcoat: "/customize/waistcoat"
    };
    navigate(routes[item] || "/");
  };

  // Build customization data from the options if available
  const buildCustomizationData = () => {
    if (!customizationOptions) return [];
    
    return Object.entries(customizationOptions).map(([key, category]) => {
      const selectedOption = category.options?.find(o => o.selected) || category.options?.[0];
      return {
        label: category.title?.toUpperCase() || key.toUpperCase(),
        value: selectedOption?.name || 'Standard',
        code: selectedOption?.code || `${key.substring(0, 2).toUpperCase()}-01`
      };
    });
  };

  const activeCustomizationData = buildCustomizationData();

  return (
    <div className="finish-page">
      {/* Header Section */}
      <div className="finish-header">
        <div className="finish-badge">
          <CheckIcon />
          <span>CUSTOMIZATION COMPLETE</span>
        </div>
        <h1 className="finish-title">
          {hasActiveFabric ? 'Your Custom Design' : 'Your Custom Suit Summary'}
        </h1>
        <p className="finish-subtitle">
          Review your personalized selections before placing your order. Every detail has been tailored to your preferences.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="finish-grid">
        {hasActiveFabric ? (
          // Show only selected fabric details - matching reference image layout (4/2 split)
          <>
            {/* Row 1: Selected Garment Summary Card (4 cols) + Fabric Info (2 cols) */}
            <div className="finish-grid-row">
              <div className="finish-grid-col-4">
                <SummaryCard 
                  data={{
                    item: garmentType ? garmentType.charAt(0).toUpperCase() + garmentType.slice(1) : 'Design',
                    options: activeCustomizationData,
                    layers: fabric?.layers
                    // Removed thumbnail - showing only shirt layers/pieces, not fabric texture
                  }}
                  editable 
                  onEdit={() => handleEdit(garmentType)}
                />
              </div>
              <div className="finish-grid-col-2">
                <FabricInfoCard fabric={fabric} />
              </div>
            </div>

            {/* Row 2: Actions only (aligned right like in reference) */}
            <div className="finish-grid-row">
              <div className="finish-grid-col-4">
                {/* Empty or can show style info */}
              </div>
              <div className="finish-grid-col-2 finish-actions-col">
                <button className="finish-btn-enquire" onClick={handleEnquire}>
                  <span>ENQUIRE NOW</span>
                  <ArrowRightIcon />
                </button>
                <button className="finish-btn-save" onClick={handleSave}>
                  SAVE
                </button>
              </div>
            </div>
          </>
        ) : (
          // Show full suit summary (mock data)
          <>
            {/* Row 1: Shirt + Fabric Info */}
            <div className="finish-grid-row">
              <div className="finish-grid-col-4">
                <SummaryCard 
                  data={customizationData.shirt}
                />
              </div>
              <div className="finish-grid-col-2">
                <FabricInfoCard fabric={activeFabric} />
              </div>
            </div>

            {/* Row 2: Trousers + Actions */}
            <div className="finish-grid-row">
              <div className="finish-grid-col-4">
                <SummaryCard 
                  data={customizationData.trousers}
                  editable 
                  onEdit={() => handleEdit("trousers")}
                />
              </div>
              <div className="finish-grid-col-2 finish-actions-col">
                <button className="finish-btn-enquire" onClick={handleEnquire}>
                  <span>ENQUIRE NOW</span>
                  <ArrowRightIcon />
                </button>
                <button className="finish-btn-save" onClick={handleSave}>
                  SAVE
                </button>
              </div>
            </div>

            {/* Row 3: Jacket */}
            <div className="finish-grid-row">
              <div className="finish-grid-col-4">
                <SummaryCard 
                  data={customizationData.jacket}
                  editable 
                  onEdit={() => handleEdit("jacket")}
                />
              </div>
            </div>

            {/* Row 4: Waistcoat */}
            <div className="finish-grid-row">
              <div className="finish-grid-col-4">
                <SummaryCard 
                  data={customizationData.waistcoat}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
