import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserEnquiry.css";

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const UserEnquiryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [designData, setDesignData] = useState(null);
  const [activeTab, setActiveTab] = useState("jacket");
  const [contactMethod, setContactMethod] = useState("email");
  const [hasPhone, setHasPhone] = useState(false); // Combined phone status logic

  useEffect(() => {
    const stateData = location.state;
    if (stateData) {
      setDesignData(stateData);
    } else {
      const savedData = localStorage.getItem('finishDesignData');
      if (savedData) {
        setDesignData(JSON.parse(savedData));
      }
    }
  }, [location.state]);

  const productData = {
    suit: {
      title: "Custom Navy Suit",
      count: "12 customizations applied",
      heroImage: "https://images.unsplash.com/photo-1594932224828-b4b059b6f6f2?auto=format&fit=crop&q=80&w=800",
      customizations: [
        { label: "COLLAR", value: "Classic", code: "CL-01", image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=200" },
        { label: "CUFF", value: "Rounded", code: "CF-02", image: "https://images.unsplash.com/photo-1624378442362-d3247e8126ec?auto=format&fit=crop&q=80&w=200" },
        { label: "PLACKET", value: "Stitched On", code: "PL-01", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=200" },
        { label: "POCKET", value: "Side Pocket", code: "PK-01", image: "https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?auto=format&fit=crop&q=80&w=200" },
        { label: "LAPEL", value: "Notched", code: "LP-01", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f6f2?auto=format&fit=crop&q=80&w=200" },
        { label: "BUTTON", value: "Silver Metal", code: "BT-05", image: "https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?auto=format&fit=crop&q=80&w=200" },
        { label: "FABRIC", value: "Navy Wool Blend", code: "FB-12", image: "https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?auto=format&fit=crop&q=80&w=200" },
        { label: "LINING", value: "Silk Premium", code: "LN-08", image: "https://images.unsplash.com/photo-1620783770629-122b7f187703?auto=format&fit=crop&q=80&w=200" },
      ]
    },
    shirt: {
      title: "Custom White Dress Shirt",
      count: "8 customizations applied",
      heroImage: "https://images.unsplash.com/photo-1603252109303-2751441dd15e?auto=format&fit=crop&q=80&w=800",
      customizations: [
        { label: "COLLAR", value: "Spread", code: "CL-03", image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=200" },
        { label: "CUFF", value: "French", code: "CF-01", image: "https://images.unsplash.com/photo-1624378442362-d3247e8126ec?auto=format&fit=crop&q=80&w=200" },
        { label: "PLACKET", value: "Hidden", code: "PL-02", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=200" },
        { label: "POCKET", value: "None", code: "PK-00", image: "https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?auto=format&fit=crop&q=80&w=200" },
      ]
    },
    jacket: {
      title: "Custom Olive Jacket",
      count: "10 customizations applied",
      heroImage: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&q=80&w=800",
      customizations: [
        { label: "LAPEL", value: "Peak", code: "LP-02", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f6f2?auto=format&fit=crop&q=80&w=200" },
        { label: "BUTTON", value: "Horn Natural", code: "BT-03", image: "https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?auto=format&fit=crop&q=80&w=200" },
        { label: "POCKET", value: "Flap Pocket", code: "PK-01", image: "https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?auto=format&fit=crop&q=80&w=200" },
        { label: "FABRIC", value: "Olive Tweed", code: "FB-15", image: "https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?auto=format&fit=crop&q=80&w=200" },
      ]
    }
  };

  const currentProduct = productData[activeTab];

  return (
    <div className="enquiry-container">
      <div className="enquiry-content-wrapper">
        <div className="enquiry-top-header">
          <div className="header-text">
            <h1>Create Enquiry</h1>
            <p>Submit your custom tailoring request</p>
          </div>
          <div className="user-toggle">
            <button 
              className={`toggle-btn ${hasPhone ? 'active' : ''}`}
              onClick={() => {
                setHasPhone(true);
                setContactMethod('email'); // Reset selection
              }}
            >
              User w/ Phone
            </button>
            <button 
              className={`toggle-btn ${!hasPhone ? 'active' : ''}`}
              onClick={() => {
                setHasPhone(false);
                setContactMethod('email'); // Default to email as phone is unavailable
              }}
            >
              User w/o Phone
            </button>
          </div>
        </div>

        <div className="product-tabs-container">
          <span className="tabs-label">Select Product:</span>
          <div className="product-tabs">
            <button className={`tab-btn ${activeTab === 'suit' ? 'active' : ''}`} onClick={() => setActiveTab('suit')}>Custom Navy Suit</button>
            <button className={`tab-btn ${activeTab === 'shirt' ? 'active' : ''}`} onClick={() => setActiveTab('shirt')}>Custom White Dress Shirt</button>
            <button className={`tab-btn ${activeTab === 'jacket' ? 'active' : ''}`} onClick={() => setActiveTab('jacket')}>Custom Olive Jacket</button>
          </div>
        </div>

        <div className="enquiry-main-card">
          <div className="enquiry-hero-section">
            <div className="hero-image-wrapper">
              <img src={currentProduct.heroImage} alt={currentProduct.title} className="hero-image" />
            </div>
            <div className="hero-details">
              <h2>{currentProduct.title}</h2>
              <p className="customizations-count">{currentProduct.count}</p>
            </div>
          </div>

          <div className="customizations-section">
            <h3>Customizations</h3>
            <div className="customizations-grid">
              {currentProduct.customizations.map((item, idx) => (
                <div key={idx} className="custom-item-card">
                  <div className="item-image">
                    <img src={item.image} alt={item.label} />
                  </div>
                  <div className="item-info">
                    <span className="item-label">{item.label}</span>
                    <span className="item-value">{item.value}</span>
                    <span className="item-code">{item.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="enquiry-details-card">
          <h3>Enquiry Details</h3>
          
          <div className="form-group">
            <label>Your Message *</label>
            <textarea placeholder="Add any specific requests, measurements, or questions..." rows="4"></textarea>
          </div>

          <div className="contact-methods-section">
            <label>Preferred Contact Method</label>
            
            {!hasPhone && (
              <div className="warning-banner">
                <div className="warning-icon">!</div>
                <div className="warning-text">
                  <p className="warning-title">Phone number required</p>
                  <p className="warning-desc">Add your phone number in your profile for faster communication (calls & WhatsApp).</p>
                </div>
              </div>
            )}

            <div className="contact-options">
              <div className={`contact-option ${contactMethod === 'email' ? 'selected' : ''}`} onClick={() => setContactMethod('email')}>
                <input type="radio" checked={contactMethod === 'email'} readOnly />
                <div className="option-text">
                  <span className="method-name">Email</span>
                  <span className="method-detail">{hasPhone ? 'james.anderson@email.com' : 'sarah.mitchell@email.com'}</span>
                </div>
              </div>

              <div 
                className={`contact-option ${!hasPhone ? 'disabled' : ''} ${contactMethod === 'phone' ? 'selected' : ''}`} 
                onClick={() => hasPhone && setContactMethod('phone')}
              >
                <input type="radio" checked={contactMethod === 'phone'} disabled={!hasPhone} readOnly />
                <div className="option-text">
                  <span className="method-name">Phone Call</span>
                  <span className="method-detail">{hasPhone ? '+1 (555) 123 4567' : 'Not available'}</span>
                </div>
              </div>

              <div 
                className={`contact-option ${!hasPhone ? 'disabled' : ''} ${contactMethod === 'whatsapp' ? 'selected' : ''}`} 
                onClick={() => hasPhone && setContactMethod('whatsapp')}
              >
                <input type="radio" checked={contactMethod === 'whatsapp'} disabled={!hasPhone} readOnly />
                <div className="option-text">
                  <span className="method-name">WhatsApp</span>
                  <span className="method-detail">{hasPhone ? '+1 (555) 123 4567' : 'Not available'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="attachments-section">
            <label>Attachments (Optional)</label>
            <div className="upload-box">
              <UploadIcon />
              <p>Upload reference images or measurement files.</p>
              <span>PNG, JPG, PDF up to 10MB</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button className="submit-btn" onClick={() => { alert("Enquiry Submitted!"); navigate("/dashboard"); }}>
              <SendIcon />
              Submit Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEnquiryPage;
