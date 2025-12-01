import React, { useState, useEffect } from "react";
import { Alert } from "./index";
import "./ProfileModal.css";

function ProfileModal({ profile, onClose, onUpdate, onLogout }) {
  const [activeTab, setActiveTab] = useState("view"); // view, edit, security, settings
  const [modalTheme, setModalTheme] = useState(localStorage.getItem('modalTheme') || 'system'); // system, light, dark
  const [editFormData, setEditFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    profileImage: profile?.profileImage || "",
    coverPhoto: profile?.coverPhoto || "",
    gender: profile?.gender || "",
    mobileNumber: profile?.mobileNumber || "",
    address: profile?.address || "",
    qualification: profile?.qualification || "",
    workStatus: profile?.workStatus || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState({
    profileImage: profile?.profileImage || null,
    coverPhoto: profile?.coverPhoto || null,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Apply modal theme on mount
  useEffect(() => {
    const modal = document.querySelector('.profile-modal');
    if (modal && modalTheme !== 'system') {
      modal.setAttribute('data-modal-theme', modalTheme);
    }
  }, [modalTheme]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Compress image to reduce file size
  const compressImage = (dataUrl, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  // Handle image upload
  const handleImageChange = async (e, imageType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Compress image
        const compressedImage = await compressImage(reader.result);
        setImagePreviews((prev) => ({
          ...prev,
          [imageType]: compressedImage,
        }));
        setEditFormData((prev) => ({
          ...prev,
          [imageType]: compressedImage,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!editFormData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      onUpdate(data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
        setActiveTab("view");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Toggle modal theme
  const handleToggleModalTheme = (newTheme) => {
    setModalTheme(newTheme);
    localStorage.setItem('modalTheme', newTheme);
    // Apply modal-specific theme
    const modal = document.querySelector('.profile-modal');
    if (modal) {
      modal.setAttribute('data-modal-theme', newTheme);
    }
  };

  // Toggle global theme (profile preference)
  const handleToggleTheme = async (newTheme) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ theme: newTheme }),
      });

      if (!res.ok) throw new Error("Failed to update theme");

      const data = await res.json();
      onUpdate(data);
      document.documentElement.setAttribute("data-theme", newTheme);
      setSuccess("Theme updated!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.message || "Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!deletePassword) {
      setError("Password is required");
      return;
    }

    if (!window.confirm("Are you absolutely sure? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }

      setSuccess("Account deleted successfully. Redirecting...");
      setTimeout(() => {
        localStorage.removeItem("token");
        onLogout();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cover Photo */}
        <div
          className="profile-cover"
          style={{
            backgroundImage: imagePreviews.coverPhoto ? `url('${imagePreviews.coverPhoto}')` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              {imagePreviews.profileImage ? (
                <img src={imagePreviews.profileImage} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {profile?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "U"}
                </div>
              )}
            </div>
            <div className="profile-header-info">
              <h2>{profile?.name}</h2>
              <p>{profile?.email}</p>
              {profile?.qualification && <p className="qualification">{profile.qualification}</p>}
              {profile?.workStatus && <p className="work-status">{profile.workStatus}</p>}
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              Profile
            </button>
            <button
              className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              Edit Profile
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && <Alert message={error} type="error" onClose={() => setError("")} />}
          {success && <Alert message={success} type="success" onClose={() => setSuccess("")} />}

          {/* Tab Content */}
          <div className="profile-tab-content">
            {/* View Profile */}
            {activeTab === "view" && (
              <div className="profile-view">
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Gender</label>
                    <p>{profile?.gender || "Not specified"}</p>
                  </div>
                  <div className="profile-field">
                    <label>Mobile Number</label>
                    <p>{profile?.mobileNumber || "Not provided"}</p>
                  </div>
                  <div className="profile-field">
                    <label>Address</label>
                    <p>{profile?.address || "Not provided"}</p>
                  </div>
                  <div className="profile-field">
                    <label>Qualification</label>
                    <p>{profile?.qualification || "Not specified"}</p>
                  </div>
                  <div className="profile-field">
                    <label>Work Status</label>
                    <p>{profile?.workStatus || "Not specified"}</p>
                  </div>
                  <div className="profile-field">
                    <label>Member Since</label>
                    <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile */}
            {activeTab === "edit" && (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    placeholder="Your full name"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    placeholder="Your email"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "profileImage")}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Cover Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "coverPhoto")}
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, gender: e.target.value })
                      }
                      disabled={loading}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      value={editFormData.mobileNumber}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, mobileNumber: e.target.value })
                      }
                      placeholder="Your phone number"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, address: e.target.value })
                    }
                    placeholder="Your address"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    value={editFormData.qualification}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, qualification: e.target.value })
                    }
                    placeholder="e.g., Bachelor's in CS"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Work Status</label>
                  <select
                    value={editFormData.workStatus}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, workStatus: e.target.value })
                    }
                    disabled={loading}
                  >
                    <option value="">Select Status</option>
                    <option value="student">Student</option>
                    <option value="working">Working</option>
                    <option value="both">Student & Working</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn ghost" onClick={() => setActiveTab("view")} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <form onSubmit={handleChangePassword} className="profile-form">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn primary" disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                  </button>
                </div>

                <hr style={{ margin: "30px 0" }} />

                <h3>Delete Account</h3>
                <p className="warning-text">
                  Deleting your account is permanent and cannot be undone. All your data will be lost.
                </p>

                {deleteConfirm ? (
                  <form onSubmit={handleDeleteAccount} className="delete-form">
                    <div className="form-group">
                      <label>Enter your password to confirm deletion *</label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter password"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => {
                          setDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn danger" disabled={loading}>
                        {loading ? "Deleting..." : "Permanently Delete Account"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    Delete My Account
                  </button>
                )}
              </form>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="profile-settings">
                <h3>🎨 Modal Theme (This Popup Only)</h3>
                <p>Choose how this modal appears independent of your global theme</p>
                <div className="theme-selector">
                  <button
                    className={`theme-btn ${modalTheme === "light" ? "active" : ""}`}
                    onClick={() => handleToggleModalTheme("light")}
                    disabled={loading}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={`theme-btn ${modalTheme === "dark" ? "active" : ""}`}
                    onClick={() => handleToggleModalTheme("dark")}
                    disabled={loading}
                  >
                    🌙 Dark
                  </button>
                </div>

                <hr style={{ margin: "30px 0" }} />

                <h3>🌐 Global Theme (Entire Website)</h3>
                <p>Choose your preferred theme across the entire application</p>
                <div className="theme-selector">
                  <button
                    className={`theme-btn ${profile?.theme === "light" ? "active" : ""}`}
                    onClick={() => handleToggleTheme("light")}
                    disabled={loading}
                  >
                    ☀️ Light Mode
                  </button>
                  <button
                    className={`theme-btn ${profile?.theme === "dark" ? "active" : ""}`}
                    onClick={() => handleToggleTheme("dark")}
                    disabled={loading}
                  >
                    🌙 Dark Mode
                  </button>
                </div>

                <hr style={{ margin: "30px 0" }} />

                <h3>Logout</h3>
                <p>Sign out of your account on this device.</p>
                <button className="btn secondary" onClick={onLogout} disabled={loading}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProfileModal };
