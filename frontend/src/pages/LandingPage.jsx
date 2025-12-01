import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import './LandingPage.css';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleRegisterClose = () => {
    setShowRegister(false);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  };

  const handleRegisterSuccess = (token) => {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      {/* Animated background blobs */}
      <div className="landing-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-nav-brand">
            <div className="landing-nav-brand-icon">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Scalable Web App
          </div>
          <div className="landing-nav-buttons">
            <button
              onClick={() => setShowLogin(true)}
              className="landing-nav-login"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="landing-nav-signup"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="landing-content">
        {/* Left side - Content */}
        <div className="landing-left">
          <div>
            <h2 className="landing-title">
              Manage Your <span className="landing-gradient-text">Tasks Efficiently</span>
            </h2>
            <p className="landing-description">
              A modern, scalable web application with secure authentication, task management, and profile management.
            </p>
          </div>

          {/* Features List */}
          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="landing-feature-text">Secure JWT Authentication</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="landing-feature-text">Complete Task Management</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="landing-feature-text">Responsive Design</p>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="landing-feature-text">Beautiful Modern UI</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="landing-cta">
            <button
              onClick={() => setShowLogin(true)}
              className="landing-cta-primary"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="landing-cta-secondary"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="landing-right">
          <div className="landing-visual">
            <div className="landing-visual-bg"></div>
            <div className="landing-visual-card">
              <div className="landing-visual-line"></div>
              <div className="landing-visual-line landing-visual-line-short"></div>
              <div className="landing-visual-lines">
                <div className="landing-visual-item"></div>
                <div className="landing-visual-item"></div>
                <div className="landing-visual-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={handleLoginClose}
              className="modal-close"
            >
              ✕
            </button>
            <Login onSuccess={handleLoginSuccess} onClose={handleLoginClose} />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={handleRegisterClose}
              className="modal-close"
            >
              ✕
            </button>
            <Register onSuccess={handleRegisterSuccess} onClose={handleRegisterClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
