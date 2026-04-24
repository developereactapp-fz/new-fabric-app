import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SavedDesignDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [design, setDesign] = useState(null);

  const garmentLabel = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('tux')) return 'Tuxedo';
    if (t.includes('shirt')) return 'Shirt';
    if (t.includes('pant')) return 'Pant';
    if (t.includes('jacket')) return 'Jacket';
    if (t.includes('coat')) return 'Coat';
    if (t.includes('waistcoat')) return 'Waistcoat';
    return 'Design';
  };

  const getFabricImage = (d) => {
    const f = d?.fabric;
    return (
      f?.image ||
      f?.img ||
      f?.thumbnail ||
      f?.thumb ||
      f?.swatch ||
      d?.fabricImage ||
      d?.fabricImg ||
      d?.fabricThumbnail ||
      null
    );
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    const selectedIdFromSession = sessionStorage.getItem('selected_saved_design_id');
    const effectiveId = id ?? selectedIdFromSession;
    const found = saved.find(d => d.id === effectiveId || d.id === parseInt(effectiveId));
    if (found) {
      setDesign(found);
    }
  }, [id]);

  if (!design) {
    return (
      <div className="loading-container">
        <p>Loading design details...</p>
      </div>
    );
  }

  return (
    <div className="saved-details-container">
      <div className="details-content">
        <button className="back-link" onClick={() => navigate('/saved-designs')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          BACK TO CUSTOMIZATION
        </button>

        <div className="page-row">
          <div className="page-left">
            <div className="header-section">
              <div className="title-wrapper">
                <h1>Saved Customization</h1>
                <span className="saved-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  SAVED
                </span>
              </div>
              <p className="subtitle">Your custom {garmentLabel(design.type).toLowerCase()} design has been saved successfully</p>
            </div>

            <div className="left-visual">
              <div className="preview-card">
                {getFabricImage(design) ? (
                  <img src={getFabricImage(design)} alt="fabric" className="fabric-full-preview" />
                ) : design.layers ? (
                  <div className="layers-preview">
                    {design.layers.map((layer, idx) => (
                      <img key={idx} src={layer} alt="preview layer" className="preview-layer" />
                    ))}
                  </div>
                ) : (
                  <img src={design.image} alt={design.name} className="main-preview" />
                )}
              </div>

              <div className="description-card">
                <span className="desc-label">DESCRIPTION</span>
                <p className="desc-text">
                  {design.fabric?.description ||
                    design.description ||
                    'A luxurious blend of wool, silk, and linen with a distinctive herringbone pattern. Perfect for sophisticated formal occasions.'}
                </p>
              </div>
            </div>
          </div>

          <div className="page-right">
            <div className="stack">
              <div className="info-card garment-card">
                <div className="card-header">
                  <span className="label">GARMENT TYPE</span>
                  <span className="type-tag">{design.type || 'TUXEDO'}</span>
                </div>
                <h2 className="card-title">Custom {garmentLabel(design.type)}</h2>
              </div>

              <div className="info-card fabric-card">
                <div className="card-header">
                   <span className="label">FABRIC SELECTION</span>
                </div>
                <h2 className="card-title">{design.fabric?.name || design.fabricName || 'Selected Fabric'}</h2>
              </div>

              <div className="customization-section">
                <h3 className="section-label">CUSTOMIZATION DETAILS</h3>
                <div className="details-stack">
                  {design.details?.map((detail, index) => (
                    <div key={index} className="detail-row">
                      <div className="detail-image-box">
                        {detail.image ? (
                          <img src={detail.image} alt={detail.label} />
                        ) : (
                          <div className="placeholder-icon" />
                        )}
                      </div>
                      <div className="detail-info">
                        <span className="detail-type">{detail.label?.toUpperCase()}</span>
                        <span className="detail-name">{detail.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="actions-stack">
                <button className="btn-secondary" onClick={() => navigate(`/customize/${design.type?.toLowerCase()}`)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  CONTINUE EDITING
                </button>
                <button className="btn-primary">
                  PROCEED TO CHECKOUT
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button className="btn-delete" onClick={() => {
                  const saved = JSON.parse(localStorage.getItem('saved_designs') || '[]');
                  const updated = saved.filter(d => d.id !== design.id);
                  localStorage.setItem('saved_designs', JSON.stringify(updated));
                  navigate('/saved-designs');
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  </svg>
                  DELETE THIS DESIGN
                </button>
              </div>

              <div className="save-info-card">
                <div className="info-header">
                  <span className="sparkle" aria-hidden="true">✦</span>
                  <span className="info-label">SAVE INFORMATION</span>
                </div>
                <p className="info-text">
                  Your customization has been saved to your account. You can access it anytime from your dashboard or continue editing to perfect your design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        .saved-details-container {
          width: 100%;
          background-color: #ffffff;
          padding: 44px 48px;
          font-family: 'Inter', sans-serif;
        }

        .details-content {
          max-width: 1100px;
          margin: 0 auto;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #666;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          margin-bottom: 22px;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #333;
        }

        .header-section {
          margin-top: 8px;
        }

        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0;
        }

        .saved-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #ecfdf3;
          color: #16a34a;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          border: 1px solid #d1fae5;
        }

        .subtitle {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .page-row {
          display: grid;
          grid-template-columns: 550px 450px;
          gap: 56px;
          align-items: start;
          margin-top: 10px;
        }

        .page-left {
          min-height: 1px;
        }

        .left-visual {
          margin-top: 26px;
          width: 100%;
          position: relative;
          overflow: visible;
          padding-bottom: 12px;
        }

        .preview-card {
          width: 100%;
          height: 600px;
          border-radius: 14px;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 18px 30px rgba(0, 0, 0, 0.10);
          border: 1px solid #ededed;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fabric-full-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .layers-preview {
          position: relative;
          width: 100%;
          height: 100%;
          background: #ffffff;
        }

        .preview-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .main-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #ffffff;
        }

        .description-card {
          width: calc(100% - 28px);
          margin: 0 auto;
          margin-top: -18px;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #ececec;
          padding: 16px 18px;
          box-shadow: 0 18px 28px rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 3;
        }

        .fabric-thumb {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          object-fit: cover;
          border: 1px solid #e7e7e7;
          background: #fff;
        }

        .desc-label {
          display: block;
          font-size: 9px;
          font-weight: 700;
          color: #b0b0b0;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }

        .desc-text {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
          color: #6b6b6b;
        }

        .page-right {
          width: 100%;
        }

        .stack {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .info-card {
          background: white;
          border-radius: 10px;
          padding: 18px 20px;
          border: 1px solid #ececec;
          box-shadow: 0 10px 25px rgba(0,0,0,0.04);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .label {
          font-size: 10px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 0.08em;
        }

        .type-tag {
          background: #723e3e;
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 6px;
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0;
        }

        .fabric-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
        }

        .spool {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          background: linear-gradient(180deg, #2c5282 0%, #1e3a8a 100%);
          position: relative;
        }

        .spool:before,
        .spool:after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 3px;
          background: #2c5282;
          border-radius: 3px;
        }

        .spool:before {
          top: -4px;
        }

        .spool:after {
          bottom: -4px;
        }

        .section-label {
          font-size: 10px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 0.08em;
          margin: 6px 0 12px;
        }

        .details-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          background: white;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid #ececec;
        }

        .detail-image-box {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-info {
          display: flex;
          flex-direction: column;
        }

        .detail-type {
          font-size: 9px;
          font-weight: 600;
          color: #aaa;
          margin-bottom: 2px;
        }

        .detail-name {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .actions-stack {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-primary, .btn-secondary, .btn-delete {
          height: 48px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #723e3e;
          color: white;
          border: none;
        }

        .btn-primary:hover {
          background: #5d3232;
        }

        .btn-secondary {
          background: white;
          color: #666;
          border: 1px solid #e5e5e5;
        }

        .btn-secondary:hover {
          background: #f9f9f9;
          border-color: #ccc;
        }

        .btn-delete {
          background: white;
          color: #ef4444;
          border: 1px solid #fee2e2;
        }

        .btn-delete:hover {
          background: #fef2f2;
        }

        .save-info-card {
          margin-top: 6px;
          background: #f6f6f6;
          border-radius: 12px;
          padding: 18px 18px;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .info-label {
          font-size: 11px;
          font-weight: 700;
          color: #555;
          letter-spacing: 0.05em;
        }

        .info-text {
          font-size: 12px;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .saved-details-container {
            padding: 40px 20px;
          }

          .page-row {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .preview-card {
            height: 380px;
          }
        }
      `}</style>
    </div>
  );
};

export default SavedDesignDetails;
