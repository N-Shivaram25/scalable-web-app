import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
      } else {
        navigate('/');
      }
    } catch {
      setError('Failed to load profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNameError('');
    setEmailError('');
    let isValid = true;

    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setUser(data.user);
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Left Column - Profile Info Card */}
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">👤 My Profile</h1>
            <p className="profile-subtitle">Your account information</p>
          </div>

          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-info-row">
                <span className="profile-label">Name</span>
                <span className="profile-value">{user?.name || 'N/A'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Member Since</span>
                <span className="profile-value">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'N/A'
                  }
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditing(true)}
                className="profile-edit-btn"
              >
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-form-group">
                <label className="profile-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(''); }}
                  className={`profile-input ${nameError ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="Enter your full name"
                />
                {nameError && <p className="form-error">{nameError}</p>}
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  className={`profile-input ${emailError ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="Enter your email address"
                />
                {emailError && <p className="form-error">{emailError}</p>}
              </div>

              <div className="profile-buttons">
                <button type="submit" disabled={loading} className="profile-submit">
                  {loading ? '⏳ Saving...' : '✓ Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                    setNameError('');
                    setEmailError('');
                  }}
                  className="profile-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column - Additional Sections */}
        <div className="profile-sections">
          {/* Alerts */}
          {error && <Alert message={error} type="error" onClose={() => setError('')} />}
          {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}

          {/* Account Actions */}
          <div className="profile-section">
            <h2 className="section-title">⚙️ Account Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleBackToDashboard}
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ↩️ Back to Dashboard
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '12px 16px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: '2px solid #fecaca',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fecaca';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="profile-section">
            <h2 className="section-title">ℹ️ Additional Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Gender:</strong>
                <span style={{ color: '#6b7280' }}>{user?.gender || 'Not specified'}</span>
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Mobile:</strong>
                <span style={{ color: '#6b7280', wordBreak: 'break-all' }}>{user?.mobileNumber || 'Not provided'}</span>
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Address:</strong>
                <span style={{ color: '#6b7280', wordBreak: 'break-word' }}>{user?.address || 'Not provided'}</span>
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Qualification:</strong>
                <span style={{ color: '#6b7280' }}>{user?.qualification || 'Not specified'}</span>
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Work Status:</strong>
                <span style={{ color: '#6b7280' }}>{user?.workStatus || 'Not specified'}</span>
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Account Status:</strong>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Active</span>
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px' }}>
                <strong style={{ color: '#1f2937' }}>Last Updated:</strong>
                <span style={{ color: '#6b7280' }}>{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
