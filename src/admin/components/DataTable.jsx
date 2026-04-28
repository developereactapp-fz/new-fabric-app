import { useState, useMemo } from "react";
import SearchInput from "./SearchInput";

/**
 * DataTable — Reusable sortable, searchable table.
 */
export default function DataTable({
  columns,         // [{ key, label, sortable?, render?, width? }]
  data,            // Array of row objects
  searchable = true,
  searchFields,    // Which fields to search across, defaults to all column keys
  emptyMessage = "No data found",
  onRowClick,
  selectedId,
  actions,         // (row) => JSX — row action buttons
  className = "",
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const fields = searchFields || columns.map((c) => c.key);

  const filtered = useMemo(() => {
    let items = [...(data || [])];

    // Search
    if (search && searchable) {
      const q = search.toLowerCase();
      items = items.filter((row) =>
        fields.some((key) => String(row[key] || "").toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortKey) {
      items.sort((a, b) => {
        const va = a[sortKey] ?? "";
        const vb = b[sortKey] ?? "";
        const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return items;
  }, [data, search, sortKey, sortDir, fields, searchable]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className={`admin-data-table ${className}`}>
      {searchable && (
        <div className="admin-table-search">
          <SearchInput value={search} onChange={setSearch} placeholder="Search table..." />
          <span className="admin-table-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      <div className="admin-table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={col.sortable !== false ? "sortable" : ""}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="admin-th-content">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="admin-sort-icon">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
              {actions && <th style={{ width: "120px" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="admin-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`${onRowClick ? "clickable" : ""} ${selectedId === row.id ? "selected" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="admin-table-actions">{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
