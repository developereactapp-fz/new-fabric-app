export default function StyleDetailPanel({
  type,
  productType,
  onSelect,
  onBack,
}) {
  const options = [
    {
      id: 1,
      name: "Option 1",
      image: `/assets/${productType}/${type}-1.png`,
    },
    {
      id: 2,
      name: "Option 2",
      image: `/assets/${productType}/${type}-2.png`,
    },
  ];

  return (
    <div className="style-detail">

      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <h4 className="panel-title">{type}</h4>

      <div className="style-grid">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="style-card"
            onClick={() => onSelect(opt)}
          >
            <img src={opt.image} />
            <span>{opt.name}</span>
          </div>
        ))}
      </div>

    </div>
  );
}