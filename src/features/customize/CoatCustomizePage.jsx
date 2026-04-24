import { useState } from "react";
import { coatData } from "./Data/coatData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function CoatCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(coatData.fabrics[0]);

  return (
    <div className="custom-page">
      <div className="custom-body">

        {/* LEFT */}
        <div className="preview-section">
          <PreviewArea
            layers={selectedFabric.layers}
            fabricName={selectedFabric.name}
          />
        </div>

        {/* RIGHT */}
        <div className="panel-section">
          <FabricPanel
            fabrics={coatData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="coat"
          />
        </div>
      </div>
    </div>
  );
}
