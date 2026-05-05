import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useAdmin } from "../../store/adminStore.jsx";

const API = import.meta.env.VITE_API_URL || "https://apperal-clothing-app-production.up.railway.app";
import StatusBadge from "../../components/StatusBadge";
import AddableDropdown from "../../components/AddableDropdown";
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
  price: "",
  stock: "",
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
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [serverAttributes, setServerAttributes] = useState([]);
  const [queuedFabrics, setQueuedFabrics] = useState([]);

  // Memoize image preview URL and revoke on cleanup to prevent memory leak
  const imagePreviewUrl = useMemo(() => {
    if (form.image instanceof File) return URL.createObjectURL(form.image);
    return null;
  }, [form.image]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const getToken = () => import.meta.env.VITE_AUTH_TOKEN; const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-slug": "test-tenant",
  });


  // One request — fetch all attributes, then group by category from the response
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await axios.get(`${API}/api/attributes`, {
          headers: authHeaders(),
        });
        const raw = res.data?.data || res.data || [];
        const items = Array.isArray(raw) ? raw : [];
        setServerAttributes(items);
      } catch (err) {
        console.error("Failed to fetch attributes", err);
      }
    };
    fetchAttributes();
  }, []);

  // Get attribute options from the store (global category)
  const getAttrValues = (attr) => {
    const serverVals = serverAttributes
      .filter(a => a.category === attr && a.isActive)
      .map(a => a.value);

    const allCats = Object.values(state.attributes);
    const localVals = [];
    allCats.forEach((catAttrs) => {
      (catAttrs[attr] || []).forEach((v) => {
        if (v.status === "active" && !localVals.includes(v.value)) localVals.push(v.value);
      });
    });

    return [...new Set([...serverVals, ...localVals])];
  };

  const colorOptions = useMemo(() => getAttrValues("Color"), [state.attributes, serverAttributes]);
  const materialOptions = useMemo(() => getAttrValues("Material"), [state.attributes, serverAttributes]);
  const subMaterialOptions = useMemo(() => getAttrValues("Sub Material"), [state.attributes, serverAttributes]);
  const patternOptions = useMemo(() => getAttrValues("Pattern"), [state.attributes, serverAttributes]);
  const weavePatternOptions = useMemo(() => getAttrValues("Weave Pattern"), [state.attributes, serverAttributes]);
  const seasonOptions = useMemo(() => getAttrValues("Season"), [state.attributes, serverAttributes]);
  const featureOptions = useMemo(() => getAttrValues("Feature"), [state.attributes, serverAttributes]);

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
    if (!form.pattern) newErrors.pattern = "Pattern is required";
    if (!form.season) newErrors.season = "Season is required";
    if (!form.gsm) newErrors.gsm = "GSM is required";
    if (form.price === "" || form.price === null) newErrors.price = "Price is required";

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
  const pendingGroupMapRef = useRef([]);

  // Effect to watch state.fabrics for newly-added fabric and map to group
  useEffect(() => {
    if (pendingGroupMapRef.current.length === 0) return;

    const remaining = [];
    pendingGroupMapRef.current.forEach(({ fabricId: pendingFabricId, groupId: pendingGroupId }) => {
      const newFab = state.fabrics.find((f) => f.fabricId === pendingFabricId || f.code === pendingFabricId);
      if (newFab) {
        addFabricGroupMapping(newFab.id, pendingGroupId);
      } else {
        remaining.push({ fabricId: pendingFabricId, groupId: pendingGroupId });
      }
    });

    pendingGroupMapRef.current = remaining;
  }, [state.fabrics, addFabricGroupMapping]);

  const handleSave = async (addAnother = false) => {
    const isFormEmpty = !form.fabricId && !form.fabricName;
    let currentFabric = null;

    if (!isFormEmpty || addAnother) {
      if (!validate()) return;
      const gsmNum = form.gsm ? Number(form.gsm) : null;
      currentFabric = {
        name: form.fabricName,
        code: form.fabricId,
        type: form.material,
        color: form.color,
        colorHex: "#111111", // Placeholder
        pattern: form.pattern,
        weavePattern: form.weavePattern,
        subMaterial: form.subMaterial,
        gsm: gsmNum,
        season: form.season,
        features: [form.feature1, form.feature2, form.feature3].filter(Boolean),
        weight: gsmNum ? (gsmNum < 150 ? "Light" : gsmNum > 250 ? "Heavy" : "Medium") : "Medium",
        price: form.price !== "" ? Number(form.price) : null,
        isRecommended: false,
        assetId: "123e4567-e89b-12d3-a456-426614174000" // Placeholder
      };
    }

    if (addAnother) {
      if (currentFabric) {
        setQueuedFabrics(prev => [...prev, currentFabric]);
        setRecentlyAdded(prev => [...prev, { fabricId: form.fabricId, fabricName: form.fabricName, status: "queued" }]);
        setForm({ ...EMPTY_FORM });
        setErrors({});
      }
      return;
    }

    const allFabricsToSave = [...queuedFabrics];
    if (currentFabric) {
      allFabricsToSave.push(currentFabric);
    }

    if (allFabricsToSave.length === 0) {
      alert("No fabrics to save.");
      return;
    }

    setIsSaving(true);

    try {
      if (allFabricsToSave.length === 1) {
        const res = await axios.post(`${API}/api/materials/fabrics`, allFabricsToSave[0], {
          headers: authHeaders(),
        });

        const newFabric = res.data?.data || res.data || allFabricsToSave[0];
        addFabric(newFabric);

        if (groupId) {
          pendingGroupMapRef.current.push({ fabricId: newFabric.fabricId || newFabric.code || form.fabricId, groupId });
        }

        setRecentlyAdded((prev) => {
          const nonQueued = prev.filter(p => p.status !== "queued");
          return [...nonQueued, { fabricId: newFabric.fabricId || newFabric.code || form.fabricId, fabricName: newFabric.fabricName || newFabric.name }];
        });
      } else {
        const res = await axios.post(`${API}/api/materials/fabrics/bulk`, allFabricsToSave, {
          headers: authHeaders(),
        });

        const newFabrics = res.data?.data || res.data || allFabricsToSave;
        const fabricsArray = Array.isArray(newFabrics) ? newFabrics : allFabricsToSave;

        fabricsArray.forEach(f => {
          addFabric(f);
          if (groupId) {
            pendingGroupMapRef.current.push({ fabricId: f.fabricId || f.code, groupId });
          }
        });

        setRecentlyAdded((prev) => {
          const nonQueued = prev.filter(p => p.status !== "queued");
          return [
            ...nonQueued,
            ...fabricsArray.map(f => ({ fabricId: f.fabricId || f.code, fabricName: f.fabricName || f.name }))
          ];
        });
      }

      setQueuedFabrics([]);
      setForm({ ...EMPTY_FORM });
      setErrors({});
    } catch (err) {
      console.error("Failed to create fabric", err);
      alert(err.response?.data?.message || "Failed to create fabric");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setForm({ ...EMPTY_FORM });
    setErrors({});
  };

  const handleAddNewAttr = async (attrName, formField, val) => {
    if (!val) return;
    const storeAttrName = attrName.startsWith("Feature") ? "Feature" : attrName;

    try {
      const res = await axios.post(`${API}/api/attributes`, {
        category: storeAttrName,
        value: val,
        isActive: true
      }, {
        headers: authHeaders(),
      });
      // Add to server attributes locally so it appears immediately
      const newAttr = res.data?.data || res.data || { category: storeAttrName, value: val, isActive: true };
      setServerAttributes((prev) => [...prev, newAttr]);

      // Keep store updated just in case
      addAttributeValue(storeAttrName, storeAttrName, val);
    } catch (err) {
      console.error("Failed to add attribute to server", err);
    }

    // Set the form field
    if (formField) {
      setField(formField, val);
      if (errors[formField]) setErrors(prev => ({ ...prev, [formField]: undefined }));
    }
  };

  const previewFabric = previewFabricId
    ? state.fabrics.find((f) => f.id === previewFabricId)
    : null;



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
                  onChange={(e) => { setField("fabricId", e.target.value); if (errors.fabricId) setErrors(prev => ({ ...prev, fabricId: undefined })) }}
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
                  onChange={(e) => { setField("fabricName", e.target.value); if (errors.fabricName) setErrors(prev => ({ ...prev, fabricName: undefined })) }}
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
              <AddableDropdown label="Color" value={form.color} onChange={(val) => { setField("color", val); if (errors.color) setErrors(prev => ({ ...prev, color: undefined })); }} options={colorOptions} attrName="Color" required error={errors.color} onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "color", val)} />
              <AddableDropdown label="Material" value={form.material} onChange={(val) => { setField("material", val); if (errors.material) setErrors(prev => ({ ...prev, material: undefined })); }} options={materialOptions} attrName="Material" required error={errors.material} onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "material", val)} />
              <AddableDropdown label="Sub Material" value={form.subMaterial} onChange={(val) => setField("subMaterial", val)} options={subMaterialOptions} attrName="Sub Material" onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "subMaterial", val)} />
              <AddableDropdown label="Pattern" value={form.pattern} onChange={(val) => { setField("pattern", val); if (errors.pattern) setErrors(prev => ({ ...prev, pattern: undefined })); }} options={patternOptions} attrName="Pattern" required error={errors.pattern} onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "pattern", val)} />
              <AddableDropdown label="Weave Pattern" value={form.weavePattern} onChange={(val) => setField("weavePattern", val)} options={weavePatternOptions} attrName="Weave Pattern" onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "weavePattern", val)} />
              <AddableDropdown label="Season" value={form.season} onChange={(val) => { setField("season", val); if (errors.season) setErrors(prev => ({ ...prev, season: undefined })); }} options={seasonOptions} attrName="Season" required error={errors.season} onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "season", val)} />
            </div>
          </div>

          {/* Technical Details */}
          <div className="fo-section">
            <h4 className="fo-section-title">Technical Details</h4>
            <div className="fo-field-grid">
              <div className="fo-field">
                <label className="admin-label">GSM <span className="fo-required">*</span></label>
                <input
                  className={`admin-input ${errors.gsm ? "error" : ""}`}
                  type="number"
                  min="80"
                  max="300"
                  value={form.gsm}
                  onChange={(e) => { setField("gsm", e.target.value); if (errors.gsm) setErrors(prev => ({ ...prev, gsm: undefined })) }}
                  placeholder="80 – 300"
                />
                {errors.gsm && <span className="fo-error-text" style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.gsm}</span>}
              </div>
              <div className="fo-field">
                <label className="admin-label">Price (₹ per meter) <span className="fo-required">*</span></label>
                <input
                  className={`admin-input ${errors.price ? "error" : ""}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => { setField("price", e.target.value); if (errors.price) setErrors(prev => ({ ...prev, price: undefined })) }}
                  placeholder="e.g. 450.00"
                />
                {errors.price && <span className="fo-error-text" style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.price}</span>}
              </div>
              <div className="fo-field">
                <label className="admin-label">Stock (units)</label>
                <input
                  className="admin-input"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setField("stock", e.target.value)}
                  placeholder="e.g. 150"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="fo-section">
            <h4 className="fo-section-title">Features</h4>
            <div className="fo-field-grid">
              <AddableDropdown label="Feature 1" value={form.feature1} onChange={(val) => setField("feature1", val)} options={featureOptions} attrName="Feature 1" onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "feature1", val)} />
              <AddableDropdown label="Feature 2" value={form.feature2} onChange={(val) => setField("feature2", val)} options={featureOptions} attrName="Feature 2" onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "feature2", val)} />
              <AddableDropdown label="Feature 3" value={form.feature3} onChange={(val) => setField("feature3", val)} options={featureOptions} attrName="Feature 3" onAddNewAttr={(attrName, val) => handleAddNewAttr(attrName, "feature3", val)} />
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
            <button className="admin-btn admin-btn-primary" onClick={() => handleSave(false)} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Fabric"}
            </button>
            <button className="admin-btn admin-btn-primary admin-btn-outline" onClick={() => handleSave(true)} disabled={isSaving}>
              Save & Add Another
            </button>
            <button className="admin-btn admin-btn-secondary" onClick={handleReset} disabled={isSaving}>
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
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
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
              {(form.price || form.stock) && (
                <div className="fo-preview-props" style={{ marginTop: 6 }}>
                  {form.price && <span className="fo-prop-tag">₹{form.price}/m</span>}
                  {form.stock && <span className="fo-prop-tag">{form.stock} units</span>}
                </div>
              )}
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
