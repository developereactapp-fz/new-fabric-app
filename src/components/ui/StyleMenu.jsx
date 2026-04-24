const allGarmentTypes = [
  { id: "shirt", label: "Shirt", group: "shirt" },
  { id: "tuxedo", label: "Tuxedo", group: "shirt" },
  { id: "pant", label: "Pant", group: "pant" },
  { id: "tuxedo-pant", label: "Tuxedo Pant", group: "pant" },
  { id: "jacket", label: "Jacket", group: "jacket" },
  { id: "tuxedo-jacket", label: "Tuxedo Jacket", group: "jacket" },
  { id: "waistcoat", label: "Waistcoat", group: "coat" },
  { id: "coat", label: "Coat", group: "coat" },
];

export default function StyleMenu({ value, onChange, filter }) {
  // Filter garment types based on current route
  const garmentTypes = filter
    ? allGarmentTypes.filter(type => type.group === filter)
    : allGarmentTypes;

  return (
    <div className="style-menu-grid">
      {garmentTypes.map((type) => (
        <button
          key={type.id}
          className={`style-menu-btn ${value === type.id ? "active" : ""}`}
          onClick={() => onChange(type.id)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
