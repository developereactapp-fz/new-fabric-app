import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import ZoomWrapper from "./fabric/ZoomWrapper";

export default function PreviewArea({ layers, fabricName, focusArea }) {
  const [preview, setPreview] = useState(false);
  const fabricRef = useRef();
  const modalFabricRef = useRef();

  const downloadImage = async (elementRef, filename) => {
    if (!elementRef.current) return;

    try {
      const canvas = await html2canvas(elementRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };

  const handleModalDownload = useCallback(() => {
    const cleanName = fabricName.replace(/\s+/g, "_").toLowerCase();
    const filename = `${cleanName}-preview.png`;
    downloadImage(modalFabricRef, filename);
  }, [fabricName]);

  const handleMainDownload = useCallback(() => {
    const cleanName = fabricName.replace(/\s+/g, "_").toLowerCase();
    const filename = `${cleanName}.png`;
    downloadImage(fabricRef, filename);
  }, [fabricName]);

  return (
    <>
      <div className="preview-container">
        <div className="preview-wrapper zoom-enabled">
          <ZoomWrapper focusArea={focusArea}>
            <div className="preview-fabric" ref={fabricRef}>
              {layers.map((l, i) => (
                <img key={i} src={l} className="preview-layer" crossOrigin="anonymous" />
              ))}
            </div>
          </ZoomWrapper>
        </div>

        <div className="fabric-name-card">
          <span>CURRENT SELECTION</span>
          <h2>{fabricName}</h2>
        </div>

        <button
          className="main-download-btn"
          onClick={handleMainDownload}
          title="Download Design"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>

        <button
          className="live-preview-btn"
          onClick={() => setPreview(true)}
        >
          LIVE PREVIEW
        </button>
      </div>

      {preview && (
        <div className="preview-modal" onClick={() => setPreview(false)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-controls">
              <button
                className="modal-download-btn"
                onClick={handleModalDownload}
                title="Download Preview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>

              <button className="modal-close-btn" onClick={() => setPreview(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="preview-modal-fabric-wrapper">
              <div className="preview-modal-fabric" ref={modalFabricRef}>
                {layers.map((l, i) => (
                  <img key={i} src={l} className="preview-modal-layer" crossOrigin="anonymous" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}