import React, { useState } from 'react';
import './CommunityPanel.css';

const CommunityPanelPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Mock data structure for collections and templates
  const categories = ['All', 'Suits', 'Shirts', 'Outerwear'];
  const collections = [
    {
      name: 'Autumn/Winter 2024',
      category: 'Suits',
      templates: [
        { id: 1, name: 'Slim Fit Charcoal', image: '/mock-suit-1.jpg' },
        { id: 2, name: 'Navy Windowpane', image: '/mock-suit-2.jpg' },
      ]
    },
    {
      name: 'Business Essentials',
      category: 'Shirts',
      templates: [
        { id: 3, name: 'Classic White Poplin', image: '/mock-shirt-1.jpg' },
        { id: 4, name: 'Blue Herringbone', image: '/mock-shirt-2.jpg' },
      ]
    }
  ];

  const filteredCollections = collections.filter(col => 
    selectedCategory === 'All' || col.category === selectedCategory
  );

  return (
    <div className="community-admin-panel">
      <header className="panel-header">
        <h1>Community Admin Panel</h1>
        <div className="filter-bar">
          <label>Filter by Category:</label>
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </header>

      <main className="collections-container">
        {filteredCollections.map((collection, index) => (
          <section key={index} className="collection-section">
            <div className="collection-info">
                <h2>{collection.name}</h2>
                <span className="badge">{collection.category}</span>
                <button className="btn-select-collection">Manage Collection</button>
            </div>
            
            <div className="template-grid">
              {collection.templates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-preview">
                      {/* Placeholder for template image */}
                      <div className="img-placeholder">Template View</div>
                  </div>
                  <div className="template-details">
                    <h5>{template.name}</h5>
                    <div className="template-actions">
                        <button className="btn-edit">Edit</button>
                        <button className="btn-assign">Assign Collection</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <style jsx>{`
        .community-admin-panel { padding: 1.5rem; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
        .filter-bar { display: flex; align-items: center; gap: 0.5rem; }
        .filter-bar select { padding: 0.4rem 0.8rem; border-radius: 6px; border: 1px solid #cbd5e1; }
        .template-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); 
            gap: 20px; 
            margin-top: 15px;
        }
        .template-card { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff; transition: transform 0.2s; }
        .template-card:hover { transform: translateY(-4px); }
        .collection-section { margin-bottom: 40px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; }
        .collection-info { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .img-placeholder { height: 150px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .badge { background: #eff6ff; color: #3b82f6; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-left: 10px; }
        .template-details { padding: 1rem; }
        .template-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
        .template-actions button { flex: 1; padding: 0.4rem; font-size: 0.85rem; cursor: pointer; }

        @media (max-width: 768px) {
            .panel-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
            .template-grid { grid-template-columns: 1fr; }
            .community-admin-panel { padding: 1rem; }
            .collection-info button { width: 100%; }
            .panel-header h1 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default CommunityPanelPage;