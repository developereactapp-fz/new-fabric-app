import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { coatConfigs } from "./coatConfigs";

import FabricViewer from "../../components/fabric/FabricViewer";
import ArrowNav from "../../components/ui/ArrowNav";
import Button from "../../components/ui/Button";

const coatTypes = ["coat", "waistcoat"];

export default function CoatSelectPage({ type: propType }) {
  const { category } = useParams();
  const config = coatConfigs[category] || coatConfigs.basic;

  const getInitialIndex = () => {
    if (propType === "waistcoat") return 1;
    return 0;
  };

  const [typeIndex, setTypeIndex] = useState(getInitialIndex());
  const navigate = useNavigate();

  const type = coatTypes[typeIndex];
  const current = config.types[type];

  const nextType = () => {
    setTypeIndex((prev) => (prev + 1) % coatTypes.length);
  };

  const prevType = () => {
    setTypeIndex((prev) => (prev - 1 + coatTypes.length) % coatTypes.length);
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
            className={type === "coat" ? "active" : ""}
            onClick={() => setTypeIndex(0)}
          >
            Coat
          </button>
          <button
            className={type === "waistcoat" ? "active" : ""}
            onClick={() => setTypeIndex(1)}
          >
            Waistcoat
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
