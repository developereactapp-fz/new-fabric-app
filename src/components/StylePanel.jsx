export default function StylePanel({ styles }) {
  return (
    <div className="style-menu">
      {styles.map((s) => (
        <div key={s.id} className="style-menu-item">
          {s.name}
        </div>
      ))}
    </div>
  );
}