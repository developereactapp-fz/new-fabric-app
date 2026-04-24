import ZoomWrapper from "./ZoomWrapper";

export default function FabricViewer({ layers }) {
  if (!layers) return null;

  return (
    <div className="fabric">
      <ZoomWrapper>
        {layers.map((src, index) => (
          <img
            key={index}
            src={src}
            className="layer"
            draggable="false"
          />
        ))}
      </ZoomWrapper>
    </div>
  );
}