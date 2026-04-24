import React from 'react';
import './AuthLayout.css';
import Header from '../components/layout/Header';

export default function AuthLayout({
  children,
  leftContent,
  borderGradient,
  bgGradient,
}) {
  return (
    <div className="auth-page-wrapper">
      <Header />
      <div 
        className="auth-container-fluid" 
        style={{ background: bgGradient || '#f8fafc' }}
      >
        <div className="auth-content-container">
          <div className="auth-grid">
            {/* LEFT CONTENT */}
            <div className="auth-left-panel">
              {leftContent}
            </div>

            {/* RIGHT CARD */}
            <div className="auth-card">
              {/* TOP GRADIENT BORDER */}
              <div 
                className="auth-card-top-border" 
                style={{ background: borderGradient }}
              />

              {/* CARD BODY */}
              <div className="auth-card-body">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
