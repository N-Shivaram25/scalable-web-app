import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from '../components';
import BackButton from '../components/BackButton';
import './Login.css';

const Login = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (onSuccess) {
          onSuccess(data.token);
        } else {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={onSuccess ? 'login-modal' : 'login-container'}>
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-left-brand">Nucleus</div>
          <div className="auth-left-quote">“Simply all the tools that my team and I need.”</div>
          <div className="auth-left-author">Karen Yui — Director of Digital Planning</div>
        </div>

        <div className="auth-right">
          <div className="auth-back"><BackButton /></div>
          <Card className={onSuccess ? '' : ''}>
            <div className="login-header">
              <div className="login-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to access your tasks and profile</p>
            </div>
        {error && <Alert message={error} type="error" onClose={() => setError('')} />}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(''); }}
              className={`form-input ${emailError ? 'error' : ''}`}
              disabled={loading}
            />
            {emailError && <p className="form-error">{emailError}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                className={`form-input ${passwordError ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordError && <p className="form-error">{passwordError}</p>}
          </div>

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
            <div className="login-footer">
              <p>Don't have an account? <button onClick={onClose} className="login-footer-link">Create one</button></p>
              {!onSuccess && <div className="footer-back"><BackButton /></div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
