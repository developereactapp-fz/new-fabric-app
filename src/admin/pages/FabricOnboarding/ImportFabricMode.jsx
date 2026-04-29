import { useState, useMemo } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import SearchInput from "../../components/SearchInput";

export default function ImportFabricMode({ groupId, groupName }) {
  const { state, addFabricGroupMapping, removeFabricGroupMapping } = useAdmin();
  const [sourceGroupId, setSourceGroupId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFabricIds, setSelectedFabricIds] = useState(new Set());
  const [imported, setImported] = useState(false);

  // Get fabrics mapped to the source group
  const sourceFabrics = useMemo(() => {
    if (!sourceGroupId) return state.fabrics;
    const mappedFabIds = state.fabricGroupMappings
      .filter((m) => m.groupId === sourceGroupId)
      .map((m) => m.fabricId);
    return state.fabrics.filter((f) => mappedFabIds.includes(f.id));
  }, [sourceGroupId, state.fabrics, state.fabricGroupMappings]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return sourceFabrics;
    const q = search.toLowerCase();
    return sourceFabrics.filter(
      (f) => f.fabricId?.toLowerCase().includes(q) || f.fabricName?.toLowerCase().includes(q)
    );
  }, [sourceFabrics, search]);

  // Already mapped to target group
  const alreadyMapped = useMemo(() => {
    if (!groupId) return new Set();
    return new Set(
      state.fabricGroupMappings
        .filter((m) => m.groupId === groupId)
        .map((m) => m.fabricId)
    );
  }, [groupId, state.fabricGroupMappings]);

  const toggleFabric = (fabricId) => {
    setSelectedFabricIds((prev) => {
      const next = new Set(prev);
      if (next.has(fabricId)) next.delete(fabricId);
      else next.add(fabricId);
      return next;
    });
  };

  const toggleAll = () => {
    const selectable = filtered.filter((f) => !alreadyMapped.has(f.id));
    const allSelected = selectable.length > 0 && selectable.every((f) => selectedFabricIds.has(f.id));
    if (allSelected) {
      setSelectedFabricIds(new Set());
    } else {
      setSelectedFabricIds(new Set(selectable.map((f) => f.id)));
    }
  };

  const handleImport = () => {
    if (!groupId || selectedFabricIds.size === 0) return;
    selectedFabricIds.forEach((fabId) => {
      if (!alreadyMapped.has(fabId)) {
        addFabricGroupMapping(fabId, groupId);
      }
    });
    setImported(true);
    setSelectedFabricIds(new Set());
  };

  if (!groupId) {
    return (
      <div className="admin-card">
        <div className="admin-empty" style={{ padding: 40 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          <h3 style={{ margin: "12px 0 4px", color: "#475569" }}>Select a Group First</h3>
          <p>Choose a target fabric group above to import fabrics into.</p>
        </div>
      </div>
    );
  }

  if (imported) {
    return (
      <div className="admin-card">
        <div className="fo-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3>Fabrics Imported!</h3>
          <p>Successfully imported fabrics into "{groupName}"</p>
          <button className="admin-btn admin-btn-primary" onClick={() => setImported(false)}>Import More</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Import Existing Fabrics</h3>
          <p className="admin-card-subtitle">Import fabrics into "{groupName}"</p>
        </div>
      </div>

      {/* Source Group Selector */}
      <div className="fo-import-controls">
        <div className="fo-field" style={{ maxWidth: 300 }}>
          <label className="admin-label">Source Group (optional)</label>
          <select className="admin-select" value={sourceGroupId} onChange={(e) => setSourceGroupId(e.target.value)}>
            <option value="">All Fabrics (no group filter)</option>
            {state.fabricGroups.filter((g) => g.id !== groupId).map((g) => (
              <option key={g.id} value={g.id}>{g.groupName}</option>
            ))}
          </select>
        </div>
        <div className="fo-field" style={{ flex: 1 }}>
          <label className="admin-label">Search Fabrics</label>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by ID or name..." />
        </div>
      </div>

      {/* Fabric Select List */}
      <div className="fo-import-header">
        <label className="fo-select-all">
          <input
            type="checkbox"
            checked={(() => { const s = filtered.filter(f => !alreadyMapped.has(f.id)); return s.length > 0 && s.every(f => selectedFabricIds.has(f.id)); })()}
            onChange={toggleAll}
          />
          <span>Select All ({filtered.length})</span>
        </label>
        <StatusBadge status="info" label={`${selectedFabricIds.size} selected`} size="sm" />
      </div>

      <div className="fo-import-list">
        {filtered.length === 0 ? (
          <div className="admin-empty" style={{ padding: 24 }}>
            <p>{state.fabrics.length === 0 ? "No fabrics exist yet. Create some first." : "No matching fabrics found."}</p>
          </div>
        ) : (
          filtered.map((fab) => {
            const alreadyIn = alreadyMapped.has(fab.id);
            return (
              <div key={fab.id} className={`fo-import-row ${selectedFabricIds.has(fab.id) ? "selected" : ""} ${alreadyIn ? "mapped" : ""}`}>
                <label className="fo-import-check">
                  <input
                    type="checkbox"
                    checked={selectedFabricIds.has(fab.id)}
                    onChange={() => toggleFabric(fab.id)}
                    disabled={alreadyIn}
                  />
                </label>
                <div className="fo-import-info">
                  <span className="fo-import-id">{fab.fabricId}</span>
                  <span className="fo-import-name">{fab.fabricName}</span>
                  <div className="fo-import-tags">
                    {fab.color && <span className="fo-prop-tag">{fab.color}</span>}
                    {fab.material && <span className="fo-prop-tag">{fab.material}</span>}
                  </div>
                </div>
                <div className="fo-import-status">
                  {alreadyIn ? (
                    <StatusBadge status="active" label="Already in group" size="xs" />
                  ) : (
                    <StatusBadge status={fab.status} size="xs" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Import Action */}
      <div className="fo-form-actions" style={{ marginTop: 16 }}>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleImport}
          disabled={selectedFabricIds.size === 0}
        >
          Import {selectedFabricIds.size} Fabric{selectedFabricIds.size !== 1 ? "s" : ""} into Group
        </button>
      </div>
    </div>
  );
}
