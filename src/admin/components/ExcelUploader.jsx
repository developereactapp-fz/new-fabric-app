import { useState, useCallback } from "react";

/**
 * ExcelUploader — Drag-drop Excel file upload with validation.
 */
export default function ExcelUploader({ onFileLoaded, accept = ".xlsx,.xls", label = "Upload Excel File" }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;

      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        setError("Please upload a valid Excel file (.xlsx or .xls)");
        return;
      }

      setError("");
      setLoading(true);
      setFileName(file.name);

      try {
        const buffer = await file.arrayBuffer();
        onFileLoaded(buffer, file.name);
      } catch (err) {
        setError("Failed to read file: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [onFileLoaded]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  return (
    <div className="admin-excel-uploader">
      <div
        className={`admin-upload-zone ${dragActive ? "drag-active" : ""} ${fileName ? "has-file" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <div className="admin-upload-loading">
            <div className="admin-spinner" />
            <p>Processing file...</p>
          </div>
        ) : fileName ? (
          <div className="admin-upload-success">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="admin-upload-filename">{fileName}</p>
            <button
              className="admin-upload-change"
              onClick={() => {
                setFileName("");
                setError("");
              }}
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="admin-upload-prompt">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="admin-upload-text">{label}</p>
            <p className="admin-upload-hint">Drag & drop or click to browse</p>
            <p className="admin-upload-formats">Supported: .xlsx, .xls</p>
          </div>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="admin-upload-input"
          id="excel-file-upload"
        />
      </div>

      {error && <p className="admin-upload-error">{error}</p>}
    </div>
  );
}
