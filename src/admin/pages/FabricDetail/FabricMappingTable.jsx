import useFabricLookup from "../../hooks/useFabricLookup";

/**
 * FabricMappingTable — Displays component mappings grouped by category for a single fabric.
 */
export default function FabricMappingTable({ mappingsByCategory }) {
  const { getComponentName, getComponentValueName } = useFabricLookup();

  if (Object.keys(mappingsByCategory).length === 0) {
    return (
      <p className="no-mappings-text">
        No components have been mapped to this fabric yet.
      </p>
    );
  }

  return Object.entries(mappingsByCategory).map(([categoryId, catMappings]) => (
    <div key={categoryId} className="category-mapping-section">
      <h4 className="category-heading">{categoryId}</h4>
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
            {catMappings.map((m) => (
              <tr key={m.id}>
                <td>{getComponentName(m.categoryId, m.componentId)}</td>
                <td>{getComponentValueName(m.componentId, m.componentValueId)}</td>
                <td>
                  {m.isDefault ? (
                    <span className="badge default-badge">Default</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <span className={`badge ${m.isAvailable ? "available" : "unavailable"}`}>
                    {m.isAvailable ? "Available" : "N/A"}
                  </span>
                </td>
                <td>
                  {m.image ? (
                    <img src={m.image} alt="Mapped" className="mapped-thumbnail" />
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
  ));
}
