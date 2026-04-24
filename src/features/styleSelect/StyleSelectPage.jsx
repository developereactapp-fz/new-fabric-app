import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { styleConfigs } from "./styleConfigs";

import FabricViewer from "../../components/fabric/FabricViewer";
import ArrowNav from "../../components/ui/ArrowNav";
import StyleMenu from "../../components/ui/StyleMenu";
import Button from "../../components/ui/Button";

const garmentTypes = ["shirt", "tuxedo", "pant", "tuxedo-pant", "jacket", "tuxedo-jacket", "waistcoat", "coat"];

// Map type to route path
const typeToRoute = {
  "shirt": "/shirt",
  "tuxedo": "/tuxedo-shirt",
  "pant": "/pant",
  "tuxedo-pant": "/tuxedo-pant",
  "jacket": "/jacket",
  "tuxedo-jacket": "/tuxedo-jacket",
  "waistcoat": "/waistcoat",
  "coat": "/coat",
};

export default function StyleSelectPage({ type: propType }) {
  const { category } = useParams();
  const config = styleConfigs[category] || styleConfigs.basic;
  const navigate = useNavigate();

  const getInitialIndex = () => {
    if (propType && garmentTypes.includes(propType)) {
      return garmentTypes.indexOf(propType);
    }
    return 0;
  };

  const [typeIndex, setTypeIndex] = useState(getInitialIndex());

  const type = garmentTypes[typeIndex];
  const current = config.types[type];

  const nextType = () => {
    const newIndex = (typeIndex + 1) % garmentTypes.length;
    setTypeIndex(newIndex);
    const newType = garmentTypes[newIndex];
    navigate(typeToRoute[newType]);
  };

  const prevType = () => {
    const newIndex = (typeIndex - 1 + garmentTypes.length) % garmentTypes.length;
    setTypeIndex(newIndex);
    const newType = garmentTypes[newIndex];
    navigate(typeToRoute[newType]);
  };

  const handleTypeChange = (newType) => {
    setTypeIndex(garmentTypes.indexOf(newType));
    navigate(typeToRoute[newType]);
  };

  useEffect(() => {
    setTypeIndex(getInitialIndex());
  }, [category, propType]);

  if (!current) return <h2>No Data Found</h2>;

  return (
    <div className="page">

      {/* ================= HEADER ================= */}
      <div className="header">
        <h3 className="title">
          <img src="/assets/icon.png" alt="icon" className="title-icon" />
          {config.title}
        </h3>
      </div>

      {/* ================= VIEWER ================= */}
      <div className="viewer">
        <ArrowNav onPrev={prevType} onNext={nextType} />
        <FabricViewer layers={current.layers} />
      </div>

      {/* ================= FOOTER ================= */}
      <div className="footer">
        {/* Toggle for shirt group */}
        {(type === "shirt" || type === "tuxedo") && (
          <div className="toggle">
            <button
              className={type === "shirt" ? "active" : ""}
              onClick={() => handleTypeChange("shirt")}
            >
              Shirt
            </button>
            <button
              className={type === "tuxedo" ? "active" : ""}
              onClick={() => handleTypeChange("tuxedo")}
            >
              Tuxedo
            </button>
          </div>
        )}

        {/* Toggle for pant group */}
        {(type === "pant" || type === "tuxedo-pant") && (
          <div className="toggle">
            <button
              className={type === "pant" ? "active" : ""}
              onClick={() => handleTypeChange("pant")}
            >
              Pant
            </button>
            <button
              className={type === "tuxedo-pant" ? "active" : ""}
              onClick={() => handleTypeChange("tuxedo-pant")}
            >
              Tuxedo Pant
            </button>
          </div>
        )}

        {/* Show StyleMenu only when not showing specific toggles */}
        {!["shirt", "tuxedo", "pant", "tuxedo-pant"].includes(type) && (
          <StyleMenu
            value={type}
            onChange={handleTypeChange}
            filter={propType}
          />
        )}

        <p className="desc">{current.description}</p>

        <Button onClick={() => navigate(current.redirect)}>
          Confirm
        </Button>
      </div>
    </div>
  );
}