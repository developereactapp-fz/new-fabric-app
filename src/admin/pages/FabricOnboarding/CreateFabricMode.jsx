import { useState, useEffect, useMemo, useRef } from "react";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import { isDuplicate } from "../../utils/validators";

const EMPTY_FORM = {
  fabricId: "",
  fabricName: "",
  description: "",
  color: "",
  material: "",
  subMaterial: "",
  pattern: "",
  weavePattern: "",
  season: "",
  gsm: "",
  feature1: "",
  feature2: "",
  feature3: "",
  image: null,
  status: "active",
  availability: "available",
};

export default function CreateFabricMode({ groupId, groupName, onDirty, onEditRequest }) {
  const { state, addFabric, addFabricGroupMapping, addAttributeValue } = useAdmin();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [previewFabricId, setPreviewFabricId] = useState(null);
  const [addNewField, setAddNewField] = useState(null); // which attribute field to add new
  const [addNewValue, setAddNewValue] = useState("");
  const [errors, setErrors] = useState({});

  // Get attribute options from the store (global category)
  const getAttrValues = (attr) => {
    const allCats = Object.values(state.attributes);
    const merged = [];
    allCats.forEach((catAttrs) => {
      (catAttrs[attr] || []).forEach((v) => {
        if (v.status === "active" && !merged.includes(v.value)) merged.push(v.value);
      });
    });
    return merged;
  };

  const colorOptions = useMemo(() => getAttrValues("Color"), [state.attributes]);
  const materialOptions = useMemo(() => getAttrValues("Material"), [state.attributes]);
  const subMaterialOptions = useMemo(() => getAttrValues("Sub Material"), [state.attributes]);
  const patternOptions = useMemo(() => getAttrValues("Pattern"), [state.attributes]);
  const weavePatternOptions = useMemo(() => getAttrValues("Weave Pattern"), [state.attributes]);
  const seasonOptions = useMemo(() => getAttrValues("Season"), [state.attributes]);
  const featureOptions = useMemo(() => getAttrValues("Feature"), [state.attributes]);

  const existingIds = state.fabrics.map((f) => f.fabricId);
  const existingNames = state.fabrics.map((f) => f.fabricName);

  const idDup = form.fabricId.trim() ? isDuplicate(form.fabricId.trim(), existingIds) : false;
  const nameDup = form.fabricName.trim() ? isDuplicate(form.fabricName.trim(), existingNames) : false;

  const validate = () => {
    const newErrors = {};
    if (!form.fabricId.trim()) newErrors.fabricId = "Fabric ID is required";
    else if (idDup) newErrors.fabricId = "Fabric ID already exists";

    if (!form.fabricName.trim()) newErrors.fabricName = "Fabric Name is required";
    else if (nameDup) newErrors.fabricName = "Fabric Name already exists";

    if (!form.color) newErrors.color = "Color is required";
    if (!form.material) newErrors.material = "Material is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const dirty = Object.values(form).some((v) => v !== "" && v !== null && v !== "active" && v !== "available");
    onDirty?.(dirty);
  }, [form, onDirty]);

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setField("image", file);
    }
  };

  // Ref to track pending group mappings by fabricId string
  const pendingGroupMapRef = useRef(null);

  // Effect to watch state.fabrics for newly-added fabric and map to group
  useEffect(() => {
    if (!pendingGroupMapRef.current) return;
    const { fabricId: pendingFabricId, groupId: pendingGroupId } = pendingGroupMapRef.current;
    const newFab = state.fabrics.find((f) => f.fabricId === pendingFabricId);
    if (newFab) {
      addFabricGroupMapping(newFab.id, pendingGroupId);
      pendingGroupMapRef.current = null;
    }
  }, [state.fabrics, addFabricGroupMapping]);

  const handleSave = (addAnother = false) => {
    if (!validate()) return;
    const fabricData = { ...form, gsm: form.gsm ? Number(form.gsm) : null };
    addFabric(fabricData);

    // Map to group if selected — use ref to track pending mapping
    if (groupId) {
      pendingGroupMapRef.current = { fabricId: form.fabricId, groupId };
    }

    setRecentlyAdded((prev) => [...prev, { fabricId: form.fabricId, fabricName: form.fabricName }]);
    setForm({ ...EMPTY_FORM });
    setErrors({});
  };

  const handleReset = () => {
    setForm({ ...EMPTY_FORM });
    setErrors({});
  };

  const handleAddNewAttr = (attrName, formField) => {
    const val = addNewValue.trim();
    if (!val) return;
    // Add to global attributes under a default category
    // Features all share the "Feature" attribute key in the store
    const storeAttrName = attrName.startsWith("Feature") ? "Feature" : attrName;
    addAttributeValue("Custom Shirt", storeAttrName, val);
    setAddNewField(null);
    setAddNewValue("");
    // Set the form field
    if (formField) setField(formField, val);
  };

  const previewFabric = previewFabricId
    ? state.fabrics.find((f) => f.id === previewFabricId)
    : null;

  const renderDropdown = (label, field, options, attrName, required = false) => (
    <div className="fo-field">
      <label className="admin-label">
        {label} {required && <span className="fo-required">*</span>}
      </label>
      <div className="fo-dropdown-row">
        <select className={`admin-select ${errors[field] ? "error" : ""}`} value={form[field]} onChange={(e) => { setField(field, e.target.value); if(errors[field]) setErrors(prev => ({...prev, [field]: undefined})) }}>
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => { setAddNewField(attrName); setAddNewValue(""); }}
          title={`Add new ${label}`}
        >
          +
        </button>
      </div>
      {errors[field] && <span className="fo-error-text" style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors[field]}</span>}
      {addNewField === attrName && (
        <div className="fo-add-new-inline">
          <input
            className="admin-input"
            value={addNewValue}
            onChange={(e) => setAddNewValue(e.target.value)}
            placeholder={`New ${label}...`}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAddNewAttr(attrName, field)}
          />
          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleAddNewAttr(attrName, field)}>Add</button>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setAddNewField(null)}>×</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="fo-create-layout">
      {/* Left — Form */}
      <div className="fo-form-column">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Create New Fabric</h3>
              <p className="admin-card-subtitle">
                {groupName ? `Adding to group: ${groupName}` : "No group selected — fabric will be ungrouped"}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="fo-section">
            <h4 className="fo-section-title">Basic Information</h4>
            <div className="fo-field-grid">
              <div className="fo-field">
                <label className="admin-label">Fabric ID <span className="fo-required">*</span></label>
                <input
                  className={`admin-input ${errors.fabricId ? "error" : ""}`}
                  value={form.fabricId}
                  onChange={(e) => { setField("fabricId", e.target.value); if(errors.fabricId) setErrors(prev => ({...prev, fabricId: undefined})) }}
                  placeholder="e.g. FAB001"
                />
                {errors.fabricId ? (
                  <span className="fo-error-text" style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.fabricId}</span>
                ) : form.fabricId.trim() && (
                  <span className={`fo-availability ${idDup ? "taken" : "available"}`}>
                    {idDup ? "Already Exists" : "Available ✓"}
                  </span>
                )}
              </div>
              <div className="fo-field">
                <label className="admin-label">Fabric Name <span className="fo-required">*</span></label>
                <input
                  className={`admin-input ${errors.fabricName ? "error" : ""}`}
                  value={form.fabricName}
                  onChange={(e) => { setField("fabricName", e.target.value); if(errors.fabricName) setErrors(prev => ({...prev, fabricName: undefined})) }}
                  placeholder="e.g. White Cotton"
                />
                {errors.fabricName ? (
                  <span className="fo-error-text" style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.fabricName}</span>
                ) : form.fabricName.trim() && (
                  <span className={`fo-availability ${nameDup ? "taken" : "available"}`}>
                    {nameDup ? "Already Exists" : "Available ✓"}
                  </span>
                )}
              </div>
              <div className="fo-field fo-field-full">
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-input fo-textarea"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Fabric description..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="fo-section">
            <h4 className="fo-section-title">Attributes</h4>
            <div className="fo-field-grid">
              {renderDropdown("Color", "color", colorOptions, "Color", true)}
              {renderDropdown("Material", "material", materialOptions, "Material", true)}
              {renderDropdown("Sub Material", "subMaterial", subMaterialOptions, "Sub Material")}
              {renderDropdown("Pattern", "pattern", patternOptions, "Pattern")}
              {renderDropdown("Weave Pattern", "weavePattern", weavePatternOptions, "Weave Pattern")}
              {renderDropdown("Season", "season", seasonOptions, "Season")}
            </div>
          </div>

          {/* Technical Details */}
          <div className="fo-section">
            <h4 className="fo-section-title">Technical Details</h4>
            <div className="fo-field-grid">
              <div className="fo-field">
                <label className="admin-label">GSM</label>
                <input
                  className="admin-input"
                  type="number"
                  min="80"
                  max="300"
                  value={form.gsm}
                  onChange={(e) => setField("gsm", e.target.value)}
                  placeholder="80 – 300"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="fo-section">
            <h4 className="fo-section-title">Features</h4>
            <div className="fo-field-grid">
              {renderDropdown("Feature 1", "feature1", featureOptions, "Feature 1")}
              {renderDropdown("Feature 2", "feature2", featureOptions, "Feature 2")}
              {renderDropdown("Feature 3", "feature3", featureOptions, "Feature 3")}
            </div>
          </div>

          {/* Media & Status */}
          <div className="fo-section">
            <h4 className="fo-section-title">Media & Status</h4>
            <div className="fo-field-grid">
              <div className="fo-field fo-field-full">
                <label className="admin-label">Fabric Image</label>
                <input type="file" className="admin-input" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
            <div className="fo-status-row" style={{ marginTop: 16 }}>
              <label className="fo-radio-label">
                <input type="radio" name="status" checked={form.status === "active"} onChange={() => setField("status", "active")} />
                <span>Active</span>
              </label>
              <label className="fo-radio-label">
                <input type="radio" name="status" checked={form.status === "inactive"} onChange={() => setField("status", "inactive")} />
                <span>Inactive</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="fo-form-actions">
            <button className="admin-btn admin-btn-primary" onClick={() => handleSave(false)}>
              Save Fabric
            </button>
            <button className="admin-btn admin-btn-primary admin-btn-outline" onClick={() => handleSave(true)}>
              Save & Add Another
            </button>
            <button className="admin-btn admin-btn-secondary" onClick={handleReset}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Right — Live Preview + Quick View */}
      <div className="fo-preview-column">
        {/* Live Preview */}
        <div className="admin-card fo-live-preview">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Live Preview</h3>
          </div>
          <div className="fo-preview-card-inner">
            <div className="fo-preview-image">
              {form.image instanceof File ? (
                <img src={URL.createObjectURL(form.image)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              )}
            </div>
            <div className="fo-preview-details">
              <h4 className="fo-preview-name">{form.fabricName || "Fabric Name"}</h4>
              <span className="fo-preview-id">{form.fabricId || "FAB-XXX"}</span>
              <div className="fo-preview-props">
                {form.color && <span className="fo-prop-tag">{form.color}</span>}
                {form.material && <span className="fo-prop-tag">{form.material}</span>}
                {form.pattern && <span className="fo-prop-tag">{form.pattern}</span>}
                {form.season && <span className="fo-prop-tag">{form.season}</span>}
                {form.gsm && <span className="fo-prop-tag">{form.gsm} GSM</span>}
              </div>
              {form.description && <p className="fo-preview-desc">{form.description}</p>}
              <div className="fo-preview-features">
                {form.feature1 && <span className="fo-feature-tag">{form.feature1}</span>}
                {form.feature2 && <span className="fo-feature-tag">{form.feature2}</span>}
                {form.feature3 && <span className="fo-feature-tag">{form.feature3}</span>}
              </div>
              <StatusBadge status={form.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Recently Added */}
        {recentlyAdded.length > 0 && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Recently Added</h3>
              <StatusBadge status="active" label={`${recentlyAdded.length} fabrics`} size="sm" />
            </div>
            <div className="fo-recent-list">
              {recentlyAdded.map((fab, i) => (
                <div key={i} className="fo-recent-item">
                  <span className="fo-recent-id">{fab.fabricId}</span>
                  <span className="fo-recent-name">{fab.fabricName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick View — Existing Fabrics */}
        {state.fabrics.length > 0 && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Quick View</h3>
              <StatusBadge status="info" label={`${state.fabrics.length} total`} size="sm" />
            </div>
            <select
              className="admin-select"
              value={previewFabricId || ""}
              onChange={(e) => setPreviewFabricId(e.target.value || null)}
              style={{ marginBottom: 12 }}
            >
              <option value="">Select a fabric to preview...</option>
              {state.fabrics.map((f) => (
                <option key={f.id} value={f.id}>{f.fabricId} – {f.fabricName}</option>
              ))}
            </select>
            {previewFabric && (
              <div className="fo-quick-view">
                <div className="fo-qv-row"><span>ID:</span><strong>{previewFabric.fabricId}</strong></div>
                <div className="fo-qv-row"><span>Name:</span><strong>{previewFabric.fabricName}</strong></div>
                <div className="fo-qv-row"><span>Color:</span><span>{previewFabric.color || "—"}</span></div>
                <div className="fo-qv-row"><span>Material:</span><span>{previewFabric.material || "—"}</span></div>
                <div className="fo-qv-row"><span>Pattern:</span><span>{previewFabric.pattern || "—"}</span></div>
                <div className="fo-qv-row"><span>Season:</span><span>{previewFabric.season || "—"}</span></div>
                <div className="fo-qv-row"><span>GSM:</span><span>{previewFabric.gsm || "—"}</span></div>
                <div className="fo-qv-row"><span>Status:</span><StatusBadge status={previewFabric.status} size="xs" /></div>
                <div style={{ marginTop: 12 }}>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => onEditRequest && onEditRequest(previewFabric.id)}>Edit Fabric</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
