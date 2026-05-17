import { useState, useCallback, useEffect } from "react";
import { shirtData } from "./Data/shirtData";
import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function ShirtCustomizePage() {
  const [fabrics, setFabrics] = useState(shirtData.fabrics);
  const [selectedFabric, setSelectedFabric] = useState(shirtData.fabrics[0]);
  const [focusArea, setFocusArea] = useState(null);
  const [customLayers, setCustomLayers] = useState(shirtData.fabrics[0].layers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePieceChange = useCallback((category, option, isContrast) => {
    if (!selectedFabric) return;
    setCustomLayers((prev) => {
      const newLayers = [...prev];
      const layerImage = option.image || option.raw?.asset?.url || option.raw?.imageUrl;

      if (category === "collar") {
        if (isContrast) {
          newLayers[2] = option.id === "no-contrast" ? selectedFabric.layers[2] : "/assets/shirt/collar-white.png";
        } else {
          newLayers[2] = layerImage || prev[2];
        }
      } else if (category === "cuff") {
        if (isContrast) {
          newLayers[3] = option.id === "no-contrast" ? selectedFabric.layers[3] : "/assets/shirt/cuff-white.png";
        } else {
          newLayers[3] = layerImage || prev[3];
        }
      } else if (category === "button" || category === "buttons") {
        newLayers[4] = layerImage || prev[4];
      } else if (category === "placket") {
        if (layerImage) {
          newLayers[5] = layerImage;
        }
      } else if (category === "backDetails" || category === "chestPocket" || category === "hem" || category === "sleeve") {
        if (layerImage) {
          newLayers[0] = layerImage;
        }
      }

      return newLayers;
    });
  }, [selectedFabric]);

  useEffect(() => {
    if (selectedFabric) {
      setCustomLayers(selectedFabric.layers);
    }
  }, [selectedFabric]);

  return (
    <div className="custom-page">
      <div className="custom-body">
        <div className="preview-section">
          <PreviewArea
            layers={customLayers}
            fabricName={selectedFabric?.name || ""}
            focusArea={focusArea}
          />
        </div>

        <div className="panel-section">
          {loading ? (
            <div style={{ padding: 16 }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: 16 }}>{error}</div>
          ) : (
            <FabricPanel
              fabrics={fabrics}
              selected={selectedFabric}
              onSelect={setSelectedFabric}
              garmentType="shirt"
              onFocusAreaChange={setFocusArea}
              onPieceChange={handlePieceChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
