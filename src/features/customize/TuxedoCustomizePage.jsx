import { useState } from "react";
import { tuxedoData } from "./Data/tuxedoData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function TuxedoCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(tuxedoData.fabrics[0]);
  const [focusArea, setFocusArea] = useState(null);

  return (
    <div className="custom-page">

      <div className="custom-body">

        <div className="preview-section">
          <PreviewArea
            layers={selectedFabric.layers}
            fabricName={selectedFabric.name}
            focusArea={focusArea}
          />
        </div>

        <div className="panel-section">
          <FabricPanel
            fabrics={tuxedoData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="tuxedo"
            onFocusAreaChange={setFocusArea}
          />
        </div>

      </div>
    </div>
  );
}