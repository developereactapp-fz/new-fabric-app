import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedDesigns = () => {
  const navigate = useNavigate();
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // Options: newest, oldest, name-asc, name-desc

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    setSavedDesigns(saved);
  }, []);

  const handleDelete = (id) => {
    const updated = savedDesigns.filter(design => design.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem('saved_designs', JSON.stringify(updated));
  };

  const filteredAndSortedDesigns = savedDesigns
    .filter(design => {
      const matchesFilter = filter === 'ALL' || design.type === filter;
      const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            design.fabric?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="saved-designs-container">
      <header className="saved-designs-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            BACK TO DASHBOARD
          </button>
          <h1>My Saved Designs</h1>
          <div className="design-count-wrapper">
            <span className="design-count">{savedDesigns.length} designs</span>
            <span className="saved-label">saved</span>
          </div>
        </div>
        <button className="create-btn" onClick={() => navigate('/style-select')}>
          + CREATE NEW DESIGN
        </button>
      </header>

      <div className="filter-bar">
        <div className="filter-group">
          <div className="filter-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
          </div>
          <button 
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            ALL
          </button>
          <button 
            className={`filter-btn ${filter === 'TUXEDO' ? 'active' : ''}`}
            onClick={() => setFilter('TUXEDO')}
          >
            TUXEDOS
          </button>
          <button 
            className={`filter-btn ${filter === 'SHIRT' ? 'active' : ''}`}
            onClick={() => setFilter('SHIRT')}
          >
            SHIRTS
          </button>
        </div>
        
        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by name or fabric..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort-wrapper">
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="designs-grid">
        {filteredAndSortedDesigns.map((design) => (
          <div key={design.id} className="design-card">
              <div className="card-image-container">
                <img 
                  src={design.fabric?.image || design.fabric?.thumbnail || design.image} 
                  alt={design.name} 
                  className="main-design-image" 
                />
                <span className="type-badge">{design.type}</span>
              </div>
            
            <div className="card-content">
              <h3 className="design-name">{design.name}</h3>
              <p className="design-date">Created {design.date}</p>
              
              <div className="details-list">
                {design.details?.map((detail, idx) => (
                  <div key={idx} className="detail-item">
                    <span className="detail-label">{detail.label}:</span>
                    <span className="detail-value">{detail.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="view-details-btn" 
                  onClick={() => {
                    sessionStorage.setItem('selected_saved_design_id', String(design.id));
                    navigate('/saved-customization');
                  }}
                >
                  VIEW DETAILS
                </button>
                <button className="delete-btn" onClick={() => handleDelete(design.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');
        
        .saved-designs-container {
          padding: 60px 80px;
          width: 100%;
          font-family: 'Inter', sans-serif;
          background-color: #ffffff;
          margin: 0;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        :global(body), :global(html), :global(#root) {
          background-color: #ffffff !important;
        }

        .saved-designs-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #666;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        h1 {
          font-size: 38px;
          margin: 0;
          color: #1a1a1a;
          font-weight: 400;
          font-family: "Playfair Display", serif;
        }

        .design-count-wrapper {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .design-count {
          color: #666;
          font-size: 13px;
        }

        .saved-label {
          color: #666;
          font-size: 13px;
        }

        .create-btn {
          background: #723e3e;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 12px;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 20px;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
          gap: 15px;
          width: 100%;
        }

        .filter-group {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .filter-icon-wrapper {
          color: #666;
          margin-right: 5px;
        }

        .filter-btn {
          padding: 8px 24px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          background: white;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          color: #444;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }

        .filter-btn.active {
          background: #723e3e;
          color: white;
        }

        .filter-btn:hover {
          border-color: #ccc;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb;
        }

        .search-wrapper input {
          width: 100%;
          padding: 10px 15px 10px 45px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          outline: none;
          font-size: 13px;
          color: #666;
        }

        .search-wrapper input:focus {
          border-color: #723e3e;
        }

        .sort-wrapper {
          min-width: 140px;
        }

        .sort-select {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          outline: none;
          font-size: 13px;
          color: #666;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='3 4 6 7 9 4'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 35px;
        }

        .sort-select:focus {
          border-color: #723e3e;
        }

        .designs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .design-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .design-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }

        .card-image-container {
          position: relative;
          height: 320px;
          background-color: #ffffff;
          overflow: hidden;
        }

        .main-design-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .type-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(114, 62, 62, 0.8);
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 10;
        }

        .card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .design-name {
          font-size: 22px;
          margin: 0;
          color: #1a1a1a;
          font-weight: 500;
          font-family: "Playfair Display", serif;
        }

        .design-date {
          color: #999;
          font-size: 12px;
          margin: 6px 0 20px;
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .detail-label {
          color: #999;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.02em;
        }

        .detail-value {
          font-weight: 500;
          color: #1a1a1a;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .view-details-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #e5e5e5;
          background: white;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }

        .view-details-btn:hover {
          background: #f9f9f9;
          border-color: #ccc;
        }

        .delete-btn {
          width: 44px;
          height: 44px;
          border: 1px solid #fee2e2;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          background: #fff5f5;
        }
      `}</style>
    </div>
  );
};

export default SavedDesigns;
