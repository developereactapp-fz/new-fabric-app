import { useState } from "react";
import { jacketData } from "./Data/jacketData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function JacketCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(jacketData.fabrics[0]);

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
            fabrics={jacketData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="jacket"
          />
        </div>
      </div>
    </div>
  );
}
