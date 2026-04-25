import React from "react";

const FabricDetailModal = ({ 
  showModal, 
  selectedFabricDetail, 
  closeModal, 
  openFullscreen, 
  onSelect 
}) => {
  if (!showModal || !selectedFabricDetail) return null;

  return (
    <div className="fabric-modal-overlay" onClick={closeModal}>
      <div className="fabric-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fabric-modal-close" onClick={closeModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="fabric-modal-content">
          {/* Left Side - Full Shirt Preview */}
          <div className="fabric-modal-left">
            <div className="fabric-modal-label">FABRIC DETAIL</div>
            <div className="fabric-modal-image-wrapper fabric-full-view">
              {/* Fullscreen icon */}
              <div className="fabric-modal-fullscreen" onClick={openFullscreen}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M15 3h6v6M14 10l7-7M3 21l7-7m-7 7v-6m0 6h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* Stack all layers to show complete shirt */}
              {selectedFabricDetail.layers?.map((layer, index) => (
                <img
                  key={index}
                  src={layer}
                  alt={`${selectedFabricDetail.name} layer ${index + 1}`}
                  className="fabric-layer-image"
                  style={{ zIndex: index }}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="fabric-modal-right">
            <h2 className="fabric-modal-title">{selectedFabricDetail.name}</h2>
            <p className="fabric-modal-description">
              A luxurious blend of wool, silk, and linen with a distinctive herringbone pattern. Perfect for sophisticated formal occasions.
            </p>
            <div className="fabric-modal-specs-title">FABRIC SPECIFICATIONS</div>
            <div className="fabric-modal-specs">
              <div className="fabric-modal-spec-row">
                <div className="fabric-modal-spec-item full-width">
                  <label>COMPOSITION</label>
                  <span>70% Wool, 18% Silk, 12% Linen</span>
                </div>
              </div>
              <div className="fabric-modal-spec-row">
                <div className="fabric-modal-spec-item">
                  <label>WEIGHT</label>
                  <span>220g/m2</span>
                </div>
                <div className="fabric-modal-spec-item">
                  <label>SEASON</label>
                  <span>Spring/Summer</span>
                </div>
              </div>
              <div className="fabric-modal-spec-row">
                <div className="fabric-modal-spec-item full-width">
                  <label>FABRIC CODE</label>
                  <span>210702/8027</span>
                </div>
              </div>
            </div>
            <button
              className="fabric-modal-select-btn"
              onClick={() => {
                onSelect(selectedFabricDetail);
                closeModal();
              }}
            >
              SELECT THIS FABRIC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricDetailModal;
