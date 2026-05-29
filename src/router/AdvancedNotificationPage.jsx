import React from 'react';

const AdvancedNotificationPage = () => {
  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '1.5rem' }}>Advanced Notification Admin Panel</h1>
      <div style={{ background: '#fff', padding: 'clamp(1rem, 4vw, 2rem)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Notification Templates</h3>
        <ul style={{ list-style: 'none', padding: 0 }}>
          <li style={{ padding: '1.25rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <strong>Order Update</strong> - Sent when order status changes
          </li>
          <li style={{ padding: '1.25rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <strong>Enquiry Received</strong> - Sent to admins when a new enquiry is created
          </li>
          <li style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <strong>Customer Follow-up</strong> - Automated reminder for awaiting customers
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedNotificationPage;