import { useState } from "react";
import { tuxedoJacketData } from "./Data/tuxedoJacketData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function TuxedoJacketCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(tuxedoJacketData.fabrics[0]);

  return (
    <div className="custom-page">
      <div className="custom-body">

        <div className="preview-section">
          <PreviewArea
            layers={selectedFabric.layers}
            fabricName={selectedFabric.name}
          />
        </div>

        <div className="panel-section">
          <FabricPanel
            fabrics={tuxedoJacketData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="tuxedo-jacket"
          />
        </div>

      </div>
    </div>
  );
}
