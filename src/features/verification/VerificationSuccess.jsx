import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="verification-page">
      <div className="verification-card">
        <div className="icon-container">
          <div className="shield-wrapper">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="shield-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M9 12L11 14L15 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="check-path"
              />
            </svg>
            
            {/* Decorative elements similar to the image */}
            <div className="decoration star-1">+</div>
            <div className="decoration star-2">+</div>
            <div className="decoration dot-1"></div>
            <div className="decoration dot-2"></div>
            <div className="decoration circle-1"></div>
          </div>
        </div>
        
        <div className="text-content">
          <p className="sub-text">Your account has been verified</p>
          <h1 className="main-text">Successfully</h1>
        </div>
        
        <button 
          className="continue-btn"
          onClick={() => navigate('/')}
        >
          Continue
        </button>
      </div>

      <style jsx="true">{`
        .verification-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 60px);
          background-color: #f8faff;
          padding: 20px;
        }

        .verification-card {
          background: white;
          padding: 60px 40px;
          border-radius: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-container {
          position: relative;
          margin-bottom: 40px;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield-wrapper {
          position: relative;
          color: #7b3f3f; /* Your website highlight maroon */
          width: 140px;
          height: 140px;
        }

        .shield-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 10px 15px rgba(123, 63, 63, 0.2));
        }

        .shield-wrapper::before {
          content: '';
          position: absolute;
          inset: -10px;
          background: rgba(123, 63, 63, 0.05);
          border-radius: 50%;
          z-index: -1;
        }

        .decoration {
          position: absolute;
          color: #7b3f3f;
          opacity: 0.4;
          font-weight: bold;
        }

        .star-1 { top: 10px; left: -20px; font-size: 24px; }
        .star-2 { bottom: 40px; right: -25px; font-size: 20px; }
        .dot-1 { top: 60px; right: -15px; width: 6px; height: 6px; background: currentColor; border-radius: 50%; }
        .dot-2 { bottom: 20px; left: -10px; width: 4px; height: 4px; border: 1.5px solid currentColor; border-radius: 50%; background: transparent; }
        .circle-1 { top: -10px; right: 20px; width: 8px; height: 8px; border: 1.5px solid currentColor; border-radius: 50%; }

        .text-content {
          margin-bottom: 40px;
        }

        .sub-text {
          color: #94a3b8;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .main-text {
          color: #1e293b;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
        }

        .continue-btn {
          background-color: #7b3f3f; /* Your website highlight maroon */
          color: white;
          border: none;
          padding: 16px 0;
          width: 100%;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(123, 63, 63, 0.2);
        }

        .continue-btn:hover {
          background-color: #6a3636;
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(123, 63, 63, 0.25);
        }

        .continue-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default VerificationSuccess;
