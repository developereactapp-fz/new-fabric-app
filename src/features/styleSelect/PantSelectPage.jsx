import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { pantConfigs } from "./pantConfigs";

import FabricViewer from "../../components/fabric/FabricViewer";
import ArrowNav from "../../components/ui/ArrowNav";
import Button from "../../components/ui/Button";

const pantTypes = ["pant", "tuxedo-pant"];

export default function PantSelectPage({ type: propType }) {
  const { category } = useParams();
  const config = pantConfigs[category] || pantConfigs.basic;

  const getInitialIndex = () => {
    if (propType === "tuxedo-pant") return 1;
    return 0;
  };

  const [typeIndex, setTypeIndex] = useState(getInitialIndex());
  const navigate = useNavigate();

  const type = pantTypes[typeIndex];
  const current = config.types[type];

  const nextType = () => {
    setTypeIndex((prev) => (prev + 1) % pantTypes.length);
  };

  const prevType = () => {
    setTypeIndex((prev) => (prev - 1 + pantTypes.length) % pantTypes.length);
  };

  useEffect(() => {
    setTypeIndex(getInitialIndex());
  }, [category, propType]);

  if (!current) return <h2>No Data Found</h2>;

  return (
    <div className="page">

      <div className="header">
        <h3 className="title">
          <img src="/assets/icon.png" alt="icon" className="title-icon" />
          {config.title}
        </h3>
      </div>

      <div className="viewer">
        <ArrowNav onPrev={prevType} onNext={nextType} />
        <FabricViewer layers={current.layers} />
      </div>

      <div className="footer">
        <div className="toggle">
          <button
            className={type === "pant" ? "active" : ""}
            onClick={() => setTypeIndex(0)}
          >
            Pant
          </button>
          <button
            className={type === "tuxedo-pant" ? "active" : ""}
            onClick={() => setTypeIndex(1)}
          >
            Tuxedo Pant
          </button>
        </div>

        <p className="desc">{current.description}</p>

        <Button onClick={() => navigate(current.redirect)}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
