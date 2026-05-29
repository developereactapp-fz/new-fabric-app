import React, { useState } from 'react';
import './AdvancedEnquiry.css'; // Assume basic styling for cards and layout

const AdvancedEnquiryDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month'); // 'day' | 'month' | 'year'

  // Mock Data based on requirements
  const stats = {
    avgResolutionTime: "27.5h",
    resolutionRate: "59.9%",
    enquiryDistribution: [
      { status: 'Viewed', count: 120 },
      { status: 'Created', count: 85 },
      { status: 'Contact Attempted', count: 45 },
      { status: 'Awaiting Customer', count: 30 },
      { status: 'In Progress', count: 55 },
      { status: 'Closed', count: 20 },
      { status: 'Resolved', count: 95 },
    ]
  };

  const calculateConversion = () => {
    const resolved = stats.enquiryDistribution.find(d => d.status === 'Resolved')?.count || 0;
    const total = stats.enquiryDistribution.reduce((acc, curr) => acc + curr.count, 0);
    return total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0";
  };

  return (
    <div className="advanced-enquiry-container">
      <h1 className="dashboard-title">Advanced Enquiry Dashboard</h1>
      
      <div className="time-insights-header">
        <div className="filter-group">
          <button className={timeFilter === 'day' ? 'active' : ''} onClick={() => setTimeFilter('day')}>Daily</button>
          <button className={timeFilter === 'month' ? 'active' : ''} onClick={() => setTimeFilter('month')}>Monthly</button>
          <button className={timeFilter === 'year' ? 'active' : ''} onClick={() => setTimeFilter('year')}>Yearly</button>
        </div>
        <span>Showing insights by: {timeFilter.toUpperCase()}</span>
      </div>

      <div className="top-metrics">
        <div className="metric-card">
          <h3>Avg Resolution Time</h3>
          <p className="metric-value">{stats.avgResolutionTime}</p>
        </div>
        <div className="metric-card">
          <h3>Resolution Rate</h3>
          <p className="metric-value">{stats.resolutionRate}</p>
        </div>
        <div className="metric-card">
            <h3>Enquiry Conversion</h3>
            <p className="metric-value">
                {calculateConversion()}%
            </p>
            <small>(Resolved / Total Cases)</small>
        </div>
      </div>

      <div className="distribution-grid">
        {stats.enquiryDistribution.map((item) => (
          <div key={item.status} className="status-card" onClick={() => console.log(`Opening ${item.status} details`)}>
            <h4>{item.status}</h4>
            <p>{item.count} Enquiries</p>
            {/* Note: Avg Response and other metrics removed per requirements */}
          </div>
        ))}
      </div>

      <div className="component-insights-grid">
        <div className="component-stats-section">
          <h2>Top Performing Categories</h2>
          <div className="category-card">
            <h3>Total Fabrics</h3>
            <div className="component-breakdown">
              <div className="breakdown-item">
                <span>Total Components:</span>
                <strong>450</strong>
              </div>
              <div className="breakdown-item">
                <span>Total Values:</span>
                <strong>$12,400</strong>
              </div>
              <div className="breakdown-item">
                <span>Active Components:</span>
                <strong className="text-success">380 ($10,200)</strong>
              </div>
              <div className="breakdown-item">
                <span>Inactive Components:</span>
                <strong className="text-danger">70 ($2,200)</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="component-stats-section">
          <h2>Least Performing Categories</h2>
          <div className="category-card">
            <h3>Lining Materials</h3>
            <div className="component-breakdown">
              <div className="breakdown-item">
                <span>Total Components:</span>
                <strong>85</strong>
              </div>
              <div className="breakdown-item">
                <span>Total Values:</span>
                <strong>$1,850</strong>
              </div>
              <div className="breakdown-item">
                <span>Active Components:</span>
                <strong className="text-success">45 ($950)</strong>
              </div>
              <div className="breakdown-item">
                <span>Inactive Components:</span>
                <strong className="text-danger">40 ($900)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEnquiryDashboard;