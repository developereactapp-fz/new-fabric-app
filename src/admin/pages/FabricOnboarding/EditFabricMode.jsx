import { useState, useMemo, useEffect, useCallback } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService";
import { useAdmin } from "../../store/adminStore.jsx";
import StatusBadge from "../../components/StatusBadge";
import { isDuplicate } from "../../utils/validators";
import { getPublicAssetUrl } from "../../utils/assetUtils";

export default function EditFabricMode({ groupId, groupName, onDirty, preselectedEditId }) {
  const { state, editFabric } = useAdmin();
  const [selectedFabricId, setSelectedFabricId] = useState(null);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [serverAttributes, setServerAttributes] = useState([]);
  const [uploadedAsset, setUploadedAsset] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch server attributes on mount (same as CreateFabricMode)
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await adminService.getAttributes();
        const raw = res.data?.data || res.data || [];
        const items = Array.isArray(raw) ? raw : [];
        setServerAttributes(items);
      } catch (err) {
        console.error("Failed to fetch attributes", err);
      }
    };
    fetchAttributes();
  }, []);

  // Memoize image preview URL and revoke on cleanup to prevent memory leak
  const imagePreviewUrl = useMemo(() => {
    if (!form?.image) return null;
    if (typeof form.image === "string") return form.image;
    if (form.image instanceof File) return URL.createObjectURL(form.image);
    return null;
  }, [form?.image]);

  useEffect(() => {
    return () => {
      if (form?.image instanceof File && imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [form?.image, imagePreviewUrl]);

  // Fetch attributes from API on mount
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await adminService.getAttributes();
        const raw = res.data?.data || res.data || [];
        const items = Array.isArray(raw) ? raw : [];
        setServerAttributes(items);
      } catch (err) {
        console.error("EditFabricMode: Failed to fetch attributes", err);
      }
    };
    fetchAttributes();
  }, []);

  const uploadAsset = async (file) => {
    if (!(file instanceof File)) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "FABRIC");

    const res = await adminService.uploadAsset(formData);

    const payload = res.data?.data || res.data || {};
    return payload.url || payload.asset?.url || payload.imageUrl || payload.image || null;
  };

  const normalizeFabric = (raw) => ({
    ...raw,
    fabricId: raw.fabricId || raw.code || "",
    fabricName: raw.fabricName || raw.name || "",
    material: raw.material || raw.type || "",
    status: raw.status || (raw.isActive === false ? "inactive" : "active"),
    image: raw.image || raw.imageUrl || null,
  });

  // Get attribute options merged from server + local store
  const getAttrValues = useCallback((attr) => {
    // 1. From server
    const serverVals = serverAttributes
      .filter(a => a.category === attr && a.isActive)
      .map(a => a.value);

    // 2. From local store
    const allCats = Object.values(state.attributes);
    const localVals = [];
    allCats.forEach((catAttrs) => {
      (catAttrs[attr] || []).forEach((v) => {
        if (v.status === "active" && !localVals.includes(v.value)) localVals.push(v.value);
      });
    });

    return [...new Set([...serverVals, ...localVals])];
  }, [state.attributes, serverAttributes]);

  // Helper: ensure the current form value is included in options so dropdown shows it selected
  const ensureValueInOptions = (options, value) => {
    if (!value || options.includes(value)) return options;
    return [value, ...options];
  };

  const colorOptions = useMemo(() => getAttrValues("Color"), [getAttrValues]);
  const materialOptions = useMemo(() => getAttrValues("Material"), [getAttrValues]);
  const subMaterialOptions = useMemo(() => getAttrValues("Sub Material"), [getAttrValues]);
  const patternOptions = useMemo(() => getAttrValues("Pattern"), [getAttrValues]);
  const weavePatternOptions = useMemo(() => getAttrValues("Weave Pattern"), [getAttrValues]);
  const seasonOptions = useMemo(() => getAttrValues("Season"), [getAttrValues]);
  const featureOptions = useMemo(() => getAttrValues("Feature"), [getAttrValues]);

  // Fabrics filtered by group
  const fabrics = useMemo(() => {
    if (!groupId) return state.fabrics;
    const mappedIds = state.fabricGroupMappings
      .filter((m) => m.groupId === groupId)
      .map((m) => m.fabricId);
    return state.fabrics.filter((f) => mappedIds.includes(f.id));
  }, [groupId, state.fabrics, state.fabricGroupMappings]);

  // Fetch asset details by assetId
  const fetchAsset = async (assetId) => {
    if (!assetId) return;
    try {
      const res = await adminService.getAsset(assetId);
      const asset = res.data?.data || res.data;
      if (asset) {
        setUploadedAsset(asset);
      }
    } catch (err) {
      console.error("Failed to fetch asset", err);
    }
  };

  // Build form state from a fabric object, mapping API fields correctly
  const buildFormFromFabric = (fab) => {
    // Map features array to feature1/feature2/feature3
    const features = Array.isArray(fab.features) ? fab.features : [];
    return {
      fabricName: fab.fabricName || fab.name || "",
      description: fab.description || "",
      color: fab.color || "",
      material: fab.material || fab.type || "",
      subMaterial: fab.subMaterial || "",
      pattern: fab.pattern || "",
      weavePattern: fab.weavePattern || "",
      season: fab.season || "",
      gsm: fab.gsm || "",
      price: fab.price ?? "",
      stock: fab.stock ?? "",
      feature1: fab.feature1 || features[0] || "",
      feature2: fab.feature2 || features[1] || "",
      feature3: fab.feature3 || features[2] || "",
      image: getPublicAssetUrl(fab.assetId || fab.asset?.id) || fab.image || fab.imageUrl || fab.asset?.url || null,
      status: fab.status || (fab.isActive === false ? "inactive" : "active"),
    };
  };

  useEffect(() => {
    if (preselectedEditId) {
      setSelectedFabricId(preselectedEditId);
      const fab = state.fabrics.find((f) => f.id === preselectedEditId);
      if (fab) {
        setForm(buildFormFromFabric(fab));
        setSaved(false);
        onDirty?.(true);
        // Fetch existing asset for preview
        if (fab.assetId) fetchAsset(fab.assetId);
      }
    }
  }, [preselectedEditId, state.fabrics, onDirty]);

  const handleLoad = () => {
    const fab = state.fabrics.find((f) => f.id === selectedFabricId);
    if (!fab) return;
    setForm(buildFormFromFabric(fab));
    setSaved(false);
    setUploadedAsset(null);
    onDirty?.(true);
    // Fetch existing asset for preview
    if (fab.assetId) fetchAsset(fab.assetId);
  };

  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
    onDirty?.(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please upload a smaller image.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image file (e.g., PNG, JPEG).");
      e.target.value = "";
      return;
    }

    setField("image", file);

    // Upload to /api/assets/upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "FABRIC");

      const res = await adminService.uploadAsset(formData);

      const asset = res.data?.data || res.data;
      setUploadedAsset(asset);
      console.log("Asset uploaded:", asset);
    } catch (err) {
      console.error("Failed to upload asset", err);
      toast.error(err.response?.data?.message || "Failed to upload image");
      setUploadedAsset(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFabricId || !form) return;
    setIsSaving(true);

    const updateData = {
      ...form,
      gsm: form.gsm ? Number(form.gsm) : null,
      price: form.price !== "" ? Number(form.price) : null,
      stock: form.stock !== "" ? Number(form.stock) : null,
      ...(uploadedAsset?.id ? { assetId: uploadedAsset.id } : {}),
    };
    delete updateData.image;

    try {
      const res = await adminService.updateFabric(selectedFabricId, updateData);

      const updatedFabric = res.data?.data || res.data || updateData;
      editFabric(selectedFabricId, updatedFabric);
      setSaved(true);
      onDirty?.(false);
    } catch (err) {
      console.error("Failed to update fabric", err);
      toast.error(err.response?.data?.message || "Failed to update fabric");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(null);
    setSelectedFabricId(null);
    setSaved(false);
    setUploadedAsset(null);
    onDirty?.(false);
  };

  const selectedFab = state.fabrics.find((f) => f.id === selectedFabricId);
  const nameDup = form?.fabricName?.trim()
    ? isDuplicate(form.fabricName.trim(), state.fabrics.filter((f) => f.id !== selectedFabricId).map((f) => f.fabricName))
    : false;
  const isValid = form && form.fabricName.trim() && !nameDup && form.color && form.material && form.pattern && form.season && form.gsm && (form.price !== "" && form.price !== null);

  const renderDropdown = (label, field, options, required = false) => {
    // Ensure the current form value always appears in options so it shows as selected
    const opts = ensureValueInOptions(options, form[field]);
    return (
      <div className="fo-field">
        <label className="admin-label">{label} {required && <span className="fo-required">*</span>}</label>
        <select className="admin-select" value={form[field]} onChange={(e) => setField(field, e.target.value)}>
          <option value="">Select {label}</option>
          {opts.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="fo-edit-layout">
      {/* Selector */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Edit Existing Fabric</h3>
            <p className="admin-card-subtitle">
              {groupName ? `Showing fabrics in "${groupName}"` : "Showing all fabrics"}
            </p>
          </div>
        </div>

        <div className="fo-edit-selector">
          <div className="fo-field" style={{ flex: 1 }}>
            <label className="admin-label">Select Fabric</label>
            <select
              className="admin-select"
              value={selectedFabricId || ""}
              onChange={(e) => setSelectedFabricId(e.target.value || null)}
            >
              <option value="">Choose a fabric...</option>
              {fabrics.length === 0 && groupId ? (
                <option value="" disabled>No fabrics in this group</option>
              ) : (
                fabrics.map((f) => (
                  <option key={f.id} value={f.id}>{f.fabricId} – {f.fabricName}</option>
                ))
              )}
            </select>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={handleLoad} disabled={!selectedFabricId} style={{ alignSelf: "flex-end" }}>
            Load Fabric
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {form && (
        <div className="fo-create-layout">
          <div className="fo-form-column">
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Editing: {selectedFab?.fabricId}</h3>
                  <p className="admin-card-subtitle">Fabric ID is read-only</p>
                </div>
                {saved && <StatusBadge status="active" label="Saved ✓" size="sm" />}
              </div>

              {/* Basic Info */}
              <div className="fo-section">
                <h4 className="fo-section-title">Basic Information</h4>
                <div className="fo-field-grid">
                  <div className="fo-field">
                    <label className="admin-label">Fabric ID</label>
                    <input className="admin-input" value={selectedFab?.fabricId || ""} disabled />
                  </div>
                  <div className="fo-field">
                    <label className="admin-label">Fabric Name <span className="fo-required">*</span></label>
                    <input
                      className={`admin-input ${nameDup ? "error" : ""}`}
                      value={form.fabricName}
                      onChange={(e) => setField("fabricName", e.target.value)}
                    />
                    {nameDup && <span className="fo-availability taken">Already Exists</span>}
                  </div>
                  <div className="fo-field fo-field-full">
                    <label className="admin-label">Description</label>
                    <textarea className="admin-input fo-textarea" value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} />
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="fo-section">
                <h4 className="fo-section-title">Attributes</h4>
                <div className="fo-field-grid">
                  {renderDropdown("Color", "color", colorOptions, true)}
                  {renderDropdown("Material", "material", materialOptions, true)}
                  {renderDropdown("Sub Material", "subMaterial", subMaterialOptions)}
                  {renderDropdown("Pattern", "pattern", patternOptions, true)}
                  {renderDropdown("Weave Pattern", "weavePattern", weavePatternOptions)}
                  {renderDropdown("Season", "season", seasonOptions, true)}
                </div>
              </div>

              {/* Technical + Features */}
              <div className="fo-section">
                <h4 className="fo-section-title">Technical & Features</h4>
                <div className="fo-field-grid">
                  <div className="fo-field">
                    <label className="admin-label">GSM <span className="fo-required">*</span></label>
                    <input className="admin-input" type="number" value={form.gsm} onChange={(e) => setField("gsm", e.target.value)} />
                  </div>
                  <div className="fo-field">
                    <label className="admin-label">Price (₹ per meter) <span className="fo-required">*</span></label>
                    <input className="admin-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="e.g. 450.00" />
                  </div>
                  <div className="fo-field">
                    <label className="admin-label">Stock (units)</label>
                    <input className="admin-input" type="number" min="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} placeholder="e.g. 150" />
                  </div>
                  {renderDropdown("Feature 1", "feature1", featureOptions)}
                  {renderDropdown("Feature 2", "feature2", featureOptions)}
                  {renderDropdown("Feature 3", "feature3", featureOptions)}
                </div>
              </div>

              {/* Media & Status */}
              <div className="fo-section">
                <h4 className="fo-section-title">Media & Status</h4>
                <div className="fo-field-grid">
                  <div className="fo-field fo-field-full">
                    <label className="admin-label">Fabric Image</label>
                    <input type="file" className="admin-input" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
                    {isUploading && <span style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>⏳ Uploading image...</span>}
                    {uploadedAsset && (
                      <span style={{ color: "#4ade80", fontSize: 13, marginTop: 4 }}>✅ Uploaded: {uploadedAsset.fileName || "Image ready"}</span>
                    )}
                  </div>
                </div>
                <div className="fo-status-row" style={{ marginTop: 16 }}>
                  <label className="fo-radio-label">
                    <input type="radio" name="edit-status" checked={form.status === "active"} onChange={() => setField("status", "active")} />
                    <span>Active</span>
                  </label>
                  <label className="fo-radio-label">
                    <input type="radio" name="edit-status" checked={form.status === "inactive"} onChange={() => setField("status", "inactive")} />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="fo-form-actions">
                <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={!isValid || isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button className="admin-btn admin-btn-secondary" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="fo-preview-column">
            <div className="admin-card fo-live-preview">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Live Preview</h3>
              </div>
              <div className="fo-preview-card-inner">
                <div className="fo-preview-image">
                  {(imagePreviewUrl || getPublicAssetUrl(uploadedAsset?.id) || uploadedAsset?.url || (typeof form.image === "string" && form.image)) ? (
                    <img src={imagePreviewUrl || getPublicAssetUrl(uploadedAsset?.id) || uploadedAsset?.url || form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
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
                  <span className="fo-preview-id">{selectedFab?.fabricId}</span>
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
                  <StatusBadge status={form.status} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
