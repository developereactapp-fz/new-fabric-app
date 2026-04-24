export default function Toggle({ value, onChange }) {
  return (
    <div className="toggle">
      <button
        className={value === "shirt" ? "active" : ""}
        onClick={() => onChange("shirt")}
      >
        Shirt
      </button>

      <button
        className={value === "tuxedo" ? "active" : ""}
        onClick={() => onChange("tuxedo")}
      >
        Tuxedo
      </button>
    </div>
  );
}