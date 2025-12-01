import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, ProfileModal } from "../components";
import "./Dashboard.css";

const PAGE_SIZE = 6;

function StatCard({ title, value, delta }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {delta !== undefined && (
        <div className={`stat-delta ${delta >= 0 ? "positive" : "negative"}`}>
          {delta >= 0 ? `+${delta}` : delta}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Layout & Theme
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [activeNav, setActiveNav] = useState("projects");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Auth/Profile
  const [profile, setProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Data
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);

  // UI State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formNameError, setFormNameError] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Web App");
  const [formStatus, setFormStatus] = useState("Not Started");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formGithubLink, setFormGithubLink] = useState("");
  const [formLiveLink, setFormLiveLink] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Settings Form
  const [siteName, setSiteName] = useState("Scalable React App");
  const [siteDescription, setSiteDescription] = useState("A modern project management dashboard");
  const [siteLanguage, setSiteLanguage] = useState("en");
  const [siteTimezone, setSiteTimezone] = useState("UTC");
  const [themeColor, setThemeColor] = useState("#2563eb");
  const [siteLogo, setSiteLogo] = useState(null);
  const [siteLogoPreview, setSiteLogoPreview] = useState(null);
  const [siteLoading, setSiteLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark-theme");
      localStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark-theme");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Fetch profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
          }
        });
        if (!res.ok) {
          if (res.status === 401) handleLogout();
          return;
        }
        const data = await res.json();
        setProfile(data.user || data);
      } catch (err) {
        console.warn("Profile load error:", err);
      }
    }
    loadProfile();
  }, []);

  // Fetch projects
  useEffect(() => {
    if (activeNav === "projects") fetchItems();
  }, [activeNav]);

  async function fetchItems() {
    setLoadingItems(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/projects`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        }
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects.");
    } finally {
      setLoadingItems(false);
    }
  }

  // Filtering / sorting / paging
  const filtered = items
    .filter((it) => it.name.toLowerCase().includes(search.toLowerCase()))
    .filter((it) => (statusFilter === "all" ? true : it.status.toLowerCase() === statusFilter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.updatedAt || b.updated) - new Date(a.updatedAt || a.updated);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Image compression
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxSize = 400;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      setFormThumbnail(compressed);
      setThumbnailPreview(compressed);
    } catch (err) {
      setError("Failed to process image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setSiteLoading(true);
    try {
      const compressed = await compressImage(file);
      setSiteLogo(compressed);
      setSiteLogoPreview(compressed);
    } catch (err) {
      setError("Failed to process logo");
    } finally {
      setSiteLoading(false);
    }
  };

  const validateProjectForm = () => {
    setFormNameError("");
    if (!formName.trim()) {
      setFormNameError("Project name is required");
      return false;
    }
    if (formName.trim().length > 200) {
      setFormNameError("Project name must be less than 200 characters");
      return false;
    }
    return true;
  };

  async function handleSaveProject(e) {
    e.preventDefault();
    if (!validateProjectForm()) return;

    const payload = {
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      status: formStatus,
      startDate: formStartDate,
      endDate: formEndDate,
      thumbnail: formThumbnail,
      githubLink: formGithubLink.trim(),
      liveLink: formLiveLink.trim(),
    };

    try {
      if (editing) {
        const res = await fetch(`${API_URL}/projects/${editing._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setItems((s) => s.map((it) => (it._id === updated._id ? updated : it)));
      } else {
        const res = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        const created = await res.json();
        setItems((s) => [created, ...s]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Save failed. Please try again.");
    }
  }

  async function confirmDelete(id) {
    setDeleteConfirm(id);
  }

  async function doDelete() {
    const id = deleteConfirm;
    if (!id) return;
    setDeleteConfirm(null);
    const old = items;
    setItems((s) => s.filter((it) => it._id !== id));
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
      setError("Delete failed, restoring item.");
      setItems(old);
    }
  }

  function openCreateModal() {
    setEditing(null);
    setFormName("");
    setFormNameError("");
    setFormDescription("");
    setFormCategory("Web App");
    setFormStatus("Not Started");
    setFormStartDate("");
    setFormEndDate("");
    setFormThumbnail("");
    setFormGithubLink("");
    setFormLiveLink("");
    setThumbnailPreview(null);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditing(item);
    setFormName(item.name || "");
    setFormNameError("");
    setFormDescription(item.description || "");
    setFormCategory(item.category || "Web App");
    setFormStatus(item.status || "Not Started");
    setFormStartDate(item.startDate || "");
    setFormEndDate(item.endDate || "");
    setFormThumbnail(item.thumbnail || "");
    setFormGithubLink(item.githubLink || "");
    setFormLiveLink(item.liveLink || "");
    setThumbnailPreview(item.thumbnail || null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setFormName("");
    setFormNameError("");
    setFormDescription("");
    setFormCategory("Web App");
    setFormStatus("Not Started");
    setFormStartDate("");
    setFormEndDate("");
    setFormThumbnail("");
    setFormGithubLink("");
    setFormLiveLink("");
    setThumbnailPreview(null);
  }

  function handleProfileUpdate(updatedProfile) {
    setProfile(updatedProfile);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold"];
  const categoryOptions = ["Web App", "Mobile App", "ML/AI", "Blockchain", "Game", "Desktop App", "Other"];
  const timezones = ["UTC", "EST", "CST", "MST", "PST", "GMT", "IST", "JST"];

  return (
    <div className={`dashboard ${collapsed ? "sidebar-collapsed" : ""} ${darkMode ? "dark-theme" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <button className="collapse-btn" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? "»" : "«"}
          </button>
          <div className="brand-text">
            <div className="brand-title">Dashboard</div>
            <div className="brand-sub">Scalable App</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-link ${activeNav === "projects" ? "active" : ""}`}
            onClick={() => setActiveNav("projects")}
          >
            📁 Projects
          </button>
          <button
            className={`nav-link ${activeNav === "settings" ? "active" : ""}`}
            onClick={() => setActiveNav("settings")}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn secondary" onClick={openCreateModal}>
            + New Project
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="search">
            <input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <div className="filters">
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="all">All statuses</option>
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on hold">On Hold</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="updated">Sort: Recent</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          </div>

          <div className="top-actions">
            {/* Theme Toggle */}
            <button
              className="btn ghost theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Profile */}
            <div
              className="profile"
              onClick={() => setProfileModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="avatar">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} />
                ) : (
                  profile?.name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "U"
                )}
              </div>
              <div className="profile-name">{profile?.name || "Loading..."}</div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="content">
          {error && <Alert message={error} type="error" onClose={() => setError(null)} />}

          {activeNav === "projects" && (
            <>
              <div className="stats-grid">
                <StatCard title="Total Projects" value={items.length} />
                <StatCard title="In Progress" value={items.filter(i => i.status?.toLowerCase() === "in progress").length} />
                <StatCard title="Completed" value={items.filter(i => i.status?.toLowerCase() === "completed").length} />
                <StatCard title="On Hold" value={items.filter(i => i.status?.toLowerCase() === "on hold").length} />
              </div>

              <div className="card table-card">
                <div className="card-head">
                  <h3>Projects</h3>
                  <div className="card-actions">
                    <button className="btn" onClick={openCreateModal}>Add Project</button>
                    <button className="btn ghost" onClick={() => fetchItems()}>Reload</button>
                  </div>
                </div>

                <div className="table-topbar">
                  <div className="muted">Showing {filtered.length} results</div>
                </div>

                <div className="table-wrap">
                  {loadingItems ? (
                    <div className="muted" style={{ padding: 20 }}>Loading...</div>
                  ) : (
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Updated</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((it) => (
                          <tr key={it._id}>
                            <td>{it.name}</td>
                            <td>{it.category || "—"}</td>
                            <td>
                              <span className={`badge ${it.status?.toLowerCase().replace(" ", "-")}`}>
                                {it.status}
                              </span>
                            </td>
                            <td>{new Date(it.updatedAt || it.updated).toLocaleDateString()}</td>
                            <td className="action-cell">
                              <button className="btn tiny" onClick={() => openEditModal(it)}>Edit</button>
                              <button className="btn tiny ghost" onClick={() => confirmDelete(it._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                        {pageItems.length === 0 && (
                          <tr>
                            <td colSpan="5" className="muted text-center">No projects found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="pagination">
                  <button className="btn ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                  <div className="muted">Page {page} / {totalPages}</div>
                  <button className="btn ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
                </div>
              </div>
            </>
          )}

          {activeNav === "settings" && (
            <div className="settings-section">
              <div className="card settings-card">
                <div className="card-head">
                  <h3>Website Settings</h3>
                </div>

                <div className="settings-form">
                  {/* Site Name */}
                  <div className="form-group">
                    <label className="form-label">Site Name</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="form-input"
                      placeholder="Your website name"
                    />
                  </div>

                  {/* Site Description */}
                  <div className="form-group">
                    <label className="form-label">Site Description / Tagline</label>
                    <textarea
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      className="form-textarea"
                      placeholder="Brief description of your site"
                      rows="3"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div className="form-group">
                    <label className="form-label">Logo Upload</label>
                    {siteLogoPreview ? (
                      <div className="logo-preview">
                        <img src={siteLogoPreview} alt="Site logo" />
                        <button
                          type="button"
                          className="btn-small ghost"
                          onClick={() => {
                            setSiteLogo("");
                            setSiteLogoPreview(null);
                          }}
                        >
                          Remove Logo
                        </button>
                      </div>
                    ) : (
                      <div className="file-upload-small">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          disabled={siteLoading}
                        />
                        <span>{siteLoading ? "Processing..." : "Upload Logo"}</span>
                      </div>
                    )}
                  </div>

                  {/* Theme Color */}
                  <div className="form-group">
                    <label className="form-label">Theme Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="form-input color-input"
                      />
                      <span className="color-value">{themeColor}</span>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="form-group">
                    <label className="form-label">Default Language</label>
                    <select value={siteLanguage} onChange={(e) => setSiteLanguage(e.target.value)} className="form-select">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select value={siteTimezone} onChange={(e) => setSiteTimezone(e.target.value)} className="form-select">
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  {/* Save Button */}
                  <div className="settings-actions">
                    <button className="btn primary">Save Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="footer">© {new Date().getFullYear()} Scalable React App</footer>
      </main>

      {/* Project Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Project" : "Create New Project"}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSaveProject} className="project-form">
              <div className="form-section">
                <h3 className="section-title">Project Details</h3>

                <div className="form-group">
                  <label className="form-label">
                    Project Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => { setFormName(e.target.value); setFormNameError(""); }}
                    placeholder="Enter project title"
                    className={`form-input ${formNameError ? "error" : ""}`}
                    maxLength="200"
                    autoFocus
                  />
                  {formNameError && <div className="form-error">{formNameError}</div>}
                  <div className="form-hint">{formName.length}/200</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe your project..."
                    className="form-textarea"
                    rows="4"
                    maxLength="1000"
                  />
                  <div className="form-hint">{formDescription.length}/1000</div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="form-select"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="form-select"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expected Completion Date</label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Project Thumbnail</h3>

                <div className="form-group">
                  <label className="form-label">Upload Thumbnail / Logo</label>

                  {thumbnailPreview ? (
                    <div className="thumbnail-preview-container">
                      <img src={thumbnailPreview} alt="Project" className="thumbnail-preview" />
                      <button
                        type="button"
                        className="btn-small ghost"
                        onClick={() => {
                          setFormThumbnail("");
                          setThumbnailPreview(null);
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="file-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="file-input"
                        disabled={uploadingImage}
                      />
                      <div className="file-upload-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p>{uploadingImage ? "Processing..." : "Click to upload image"}</p>
                        <span className="file-hint">PNG, JPG, GIF (Max 5MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Project Links</h3>

                <div className="form-group">
                  <label className="form-label">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={formGithubLink}
                    onChange={(e) => setFormGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Live Demo / Deployment Link</label>
                  <input
                    type="url"
                    value={formLiveLink}
                    onChange={(e) => setFormLiveLink(e.target.value)}
                    placeholder="https://myproject.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editing ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete project?</h3>
            <p className="muted">Are you sure you want to permanently delete this project?</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn primary danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModalOpen && profile && (
        <ProfileModal
          profile={profile}
          onClose={() => setProfileModalOpen(false)}
          onUpdate={handleProfileUpdate}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
