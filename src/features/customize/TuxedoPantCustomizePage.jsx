import { useState } from "react";
import { tuxedoPantData } from "./Data/tuxedoPantData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function TuxedoPantCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(tuxedoPantData.fabrics[0]);

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
            fabrics={tuxedoPantData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="tuxedo-pant"
          />
        </div>

      </div>
    </div>
  );
}
