/**
 * FabricMappingTable — Displays resolved component mappings grouped by
 * category (product name) for a single fabric.
 *
 * Props:
 *   resolvedMappings — { [categoryName]: [{ id, partTypeId, partName, typeName, isDefault, isChecked, image }] }
 */
export default function FabricMappingTable({ resolvedMappings }) {
  const categories = Object.keys(resolvedMappings || {});

  if (categories.length === 0) {
    return (
      <p className="no-mappings-text">
        No components have been mapped to this fabric yet.
      </p>
    );
  }

  return categories.map((categoryName) => {
    const items = resolvedMappings[categoryName];
    return (
      <div key={categoryName} className="category-mapping-section">
        <h4 className="category-heading">{categoryName}</h4>
        <div className="mapping-table-wrapper">
          <table className="mapping-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Value</th>
                <th>Default?</th>
                <th>Availability</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id || m.partTypeId}>
                  <td>{m.partName}</td>
                  <td>{m.typeName}</td>
                  <td>
                    {m.isDefault ? (
                      <span className="badge default-badge">Default</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <span className={`badge ${m.isChecked ? "available" : "unavailable"}`}>
                      {m.isChecked ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    {m.image ? (
                      <img src={m.image} alt={m.typeName} className="mapped-thumbnail" />
                    ) : (
                      <span className="no-img-text">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  });
}
