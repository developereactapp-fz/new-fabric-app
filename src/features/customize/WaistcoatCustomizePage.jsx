import { useState } from "react";
import { waistcoatData } from "./Data/waistcoatData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function WaistcoatCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(waistcoatData.fabrics[0]);

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
            fabrics={waistcoatData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="waistcoat"
          />
        </div>
      </div>
    </div>
  );
}
