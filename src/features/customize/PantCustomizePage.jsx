import { useState } from "react";
import { pantData } from "./Data/pantData";

import PreviewArea from "../../components/PreviewArea";
import FabricPanel from "../../components/FabricPanel";

export default function PantCustomizePage() {
  const [selectedFabric, setSelectedFabric] = useState(pantData.fabrics[0]);

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
            fabrics={pantData.fabrics}
            selected={selectedFabric}
            onSelect={setSelectedFabric}
            garmentType="pant"
          />
        </div>
      </div>
    </div>
  );
}
