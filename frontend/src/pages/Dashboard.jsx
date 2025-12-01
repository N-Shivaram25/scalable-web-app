import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, ProfileModal, ProjectForm } from "../components";
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

  // theme
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  // layout
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");
  const [viewAllProjects, setViewAllProjects] = useState(false);

  // auth/profile
  const [profile, setProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // data (projects)
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);

  // modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // form fields - enhanced
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Web App",
    status: "Not Started",
    startDate: "",
    endDate: "",
    githubLink: "",
    liveLink: "",
    thumbnail: ""
  });

  const [formErrors, setFormErrors] = useState({});

  // Settings
  const [settings, setSettings] = useState({
    siteName: localStorage.getItem('siteName') || 'My App',
    siteDescription: localStorage.getItem('siteDescription') || 'Professional Project Manager',
    themeColor: localStorage.getItem('themeColor') || '#2563eb',
    defaultLanguage: localStorage.getItem('defaultLanguage') || 'English',
    timezone: localStorage.getItem('timezone') || 'UTC'
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // DEBUG: Monitor formData changes
  useEffect(() => {
    if (modalOpen) {
      console.group("🔵 FORM DATA CHANGE");
      console.log("Modal is open");
      console.log("formData.name:", `"${formData.name}"`);
      console.log("formData object:", formData);
      console.groupEnd();
    }
  }, [formData, modalOpen]);

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

  // Fetch items
  useEffect(() => {
    fetchItems();
  }, []);

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
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to fetch projects");
      }
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

  // Image compression function
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

  // Handle project form submission (called from ProjectForm component)
  async function handleSaveProject(payload) {
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
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Update failed");
        }
        const updated = await res.json();
        setItems((s) => s.map((it) => (it._id === updated._id ? updated : it)));
        setSuccess("Project updated successfully!");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        const res = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Create failed");
        }
        const created = await res.json();
        setItems((s) => [created, ...s]);
        setSuccess("Project created successfully!");
        setTimeout(() => setSuccess(""), 2000);
      }
      closeModal();
    } catch (err) {
      console.error("❌ Error saving project:", err);
      setError(err.message || "Save failed. Please try again.");
    }
  }

  // Delete confirmation
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
    setFormData({
      name: "",
      description: "",
      category: "Web App",
      status: "Not Started",
      startDate: "",
      endDate: "",
      githubLink: "",
      liveLink: "",
      thumbnail: ""
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditing(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "Web App",
      status: item.status || "Not Started",
      startDate: item.startDate ? item.startDate.split('T')[0] : "",
      endDate: item.endDate ? item.endDate.split('T')[0] : "",
      githubLink: item.githubLink || "",
      liveLink: item.liveLink || "",
      thumbnail: item.thumbnail || ""
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setFormData({
      name: "",
      description: "",
      category: "Web App",
      status: "Not Started",
      startDate: "",
      endDate: "",
      githubLink: "",
      liveLink: "",
      thumbnail: ""
    });
    setFormErrors({});
  }

  function handleProfileUpdate(updatedProfile) {
    setProfile(updatedProfile);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({ ...formErrors, thumbnail: "File size must be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, thumbnail: event.target.result });
        setFormErrors({ ...formErrors, thumbnail: "" });
      };
      reader.readAsDataURL(file);
    }
  }

  function saveSettings() {
    localStorage.setItem('siteName', settings.siteName);
    localStorage.setItem('siteDescription', settings.siteDescription);
    localStorage.setItem('themeColor', settings.themeColor);
    localStorage.setItem('defaultLanguage', settings.defaultLanguage);
    localStorage.setItem('timezone', settings.timezone);
    setError(null);
    alert("Settings saved successfully!");
  }

  const categoryOptions = ["Web App", "Mobile", "ML", "Blockchain", "Desktop", "Other"];
  const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold"];
  const languageOptions = ["English", "Spanish", "French", "German", "Chinese"];
  const timezoneOptions = ["UTC", "EST", "CST", "MST", "PST", "GMT", "IST"];

  return (
    <div className={`dashboard ${collapsed ? "sidebar-collapsed" : ""} ${darkMode ? 'dark-mode' : ''}`}>
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
            className={`nav-link ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-link ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            👤 Profile
          </button>
          <button 
            className={`nav-link ${activeSection === "projects" ? "active" : ""}`}
            onClick={() => setActiveSection("projects")}
          >
            🚀 Projects
          </button>
          <button className="nav-link settings-btn" onClick={() => setSettingsOpen(true)}>⚙️ Settings</button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn secondary" onClick={openCreateModal}>+ New Project</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main ${darkMode ? 'dark-bg' : ''}`}>
        <header className="topbar">
          <div className="top-actions">
            <button className="btn ghost" onClick={() => alert("Notifications placeholder")}>🔔</button>

            {/* Theme Toggle */}
            <button 
              className="btn ghost theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Profile */}
            <div className="profile" onClick={() => setProfileModalOpen(true)} tabIndex={0} role="button" style={{ cursor: "pointer" }}>
              <div className="avatar">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile ? (profile.name ? profile.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "U") : "U"
                )}
              </div>
              <div className="profile-name">{profile ? profile.name : "Loading..."}</div>
            </div>
          </div>
        </header>

        <section className="content">
          {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
          {success && <Alert message={success} type="success" onClose={() => setSuccess(null)} />}

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div>
              <div className="stats-grid">
                <StatCard title="Total Projects" value={items.length} />
                <StatCard title="In Progress" value={items.filter(i => i.status?.toLowerCase() === "in progress").length} />
                <StatCard title="Completed" value={items.filter(i => i.status?.toLowerCase() === "completed").length} />
                <StatCard title="On Hold" value={items.filter(i => i.status?.toLowerCase() === "on hold").length} />
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="card">
              <div className="card-head">
                <h3>My Profile</h3>
              </div>
              <div className="profile-section-content">
                {profile ? (
                  <>
                    <div className="profile-card-display">
                      <div className="profile-avatar-display">
                        {profile?.profileImage ? (
                          <img src={profile.profileImage} alt={profile.name} />
                        ) : (
                          <div className="avatar-placeholder-display">
                            {profile.name ? profile.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "U"}
                          </div>
                        )}
                      </div>
                      <div className="profile-info-display">
                        <h3>{profile.name}</h3>
                        <p className="email">{profile.email}</p>
                        {profile.qualification && <p className="qualification">{profile.qualification}</p>}
                        {profile.workStatus && <p className="work-status">{profile.workStatus}</p>}
                      </div>
                    </div>

                    <div className="profile-details">
                      <div className="profile-details-grid">
                        <div className="detail-item">
                          <label>Gender</label>
                          <p>{profile.gender || "Not specified"}</p>
                        </div>
                        <div className="detail-item">
                          <label>Mobile Number</label>
                          <p>{profile.mobileNumber || "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                          <label>Address</label>
                          <p>{profile.address || "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                          <label>Member Since</label>
                          <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button className="btn primary" onClick={() => setProfileModalOpen(true)}>Edit Profile</button>
                    </div>
                  </>
                ) : (
                  <div className="muted" style={{ padding: 20 }}>Loading profile...</div>
                )}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === "projects" && (
            <div>
              {/* Projects Header with Filters and View Toggle */}
              <div className="projects-header">
                <div className="search">
                  <input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Search"
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

                    <button 
                      className={`view-toggle-btn ${viewAllProjects ? 'active' : ''}`}
                      onClick={() => setViewAllProjects(!viewAllProjects)}
                    >
                      {viewAllProjects ? '📋 Table View' : '🎯 All Projects'}
                    </button>
                  </div>
                </div>

                <div className="projects-header-actions">
                  <button className="btn primary add-project-btn" onClick={openCreateModal}>+ Add Project</button>
                  <button className="btn ghost" onClick={() => fetchItems()}>🔄 Reload</button>
                </div>
              </div>

              {/* All Projects Card View */}
              {viewAllProjects ? (
                <div className="all-projects-container">
                  <div className="projects-count">
                    <h3>All Projects ({filtered.length})</h3>
                  </div>
                  {loadingItems ? (
                    <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Loading projects...</div>
                  ) : filtered.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📁</div>
                      <h3>No Projects Yet</h3>
                      <p>Create your first project to get started</p>
                      <button className="btn primary" onClick={openCreateModal}>+ Create Project</button>
                    </div>
                  ) : (
                    <div className="projects-grid">
                      {filtered.map((project) => (
                        <div key={project._id} className={`project-card status-${(project.status || "").toLowerCase().replace(' ', '-')}`}>
                          <div className="project-card-header">
                            <div className="project-card-thumb">
                              {project.thumbnail ? (
                                <img src={project.thumbnail} alt={project.name} />
                              ) : (
                                <div className="thumb-placeholder">📦</div>
                              )}
                            </div>
                            <div className="project-card-info">
                              <h4>{project.name}</h4>
                              <p className="project-owner">👤 {profile?.name || 'You'}</p>
                            </div>
                          </div>

                          <div className="project-card-body">
                            <div className="project-meta">
                              <span className={`status-badge status-${(project.status || "").toLowerCase().replace(' ', '-')}`}>
                                {project.status}
                              </span>
                              <span className="category-badge">{project.category}</span>
                            </div>

                            {project.description && (
                              <p className="project-description">{project.description.substring(0, 80)}...</p>
                            )}

                            <div className="project-dates">
                              {project.startDate && (
                                <div className="date-item">
                                  <span className="date-label">Start:</span>
                                  <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {project.endDate && (
                                <div className="date-item">
                                  <span className="date-label">End:</span>
                                  <span>{new Date(project.endDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>

                            <div className="project-links">
                              {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="link-btn github">
                                  🔗 GitHub
                                </a>
                              )}
                              {project.liveLink && (
                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="link-btn live">
                                  🌐 Live
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="project-card-actions">
                            <button className="btn tiny" onClick={() => openEditModal(project)}>✏️ Edit</button>
                            <button className="btn tiny danger" onClick={() => confirmDelete(project._id)}>🗑️ Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Table View */
                <div className="card table-card">
                  <div className="table-topbar">
                    <div className="muted">Showing {filtered.length} results</div>
                  </div>

                  <div className="table-wrap">
                    {loadingItems ? (
                      <div className="muted" style={{ padding: 20 }}>Loading...</div>
                    ) : (
                      <table className="items-table" role="grid">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageItems.map((it) => (
                            <tr key={it._id}>
                              <td className="project-name">
                                {it.thumbnail && <img src={it.thumbnail} alt="" className="project-thumb" />}
                                {it.name}
                              </td>
                              <td>{it.category || "—"}</td>
                              <td><span className={`badge ${(it.status || "").toLowerCase().replace(' ', '-')}`}>{it.status}</span></td>
                              <td>{it.startDate ? new Date(it.startDate).toLocaleDateString() : "—"}</td>
                              <td>
                                <button className="btn tiny" onClick={() => openEditModal(it)}>Edit</button>
                                <button className="btn tiny ghost" onClick={() => confirmDelete(it._id)}>Delete</button>
                              </td>
                            </tr>
                          ))}

                          {pageItems.length === 0 && (
                            <tr>
                              <td colSpan="5" className="muted">No results found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <button className="btn ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                    <div className="muted">Page {page} / {totalPages}</div>
                    <button className="btn ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
                  </div>
                </div>
              )}
            </div>
          )}


        </section>

        <footer className="footer">© {new Date().getFullYear()} Scalable React App • Built with React & MongoDB</footer>
      </main>

      {/* Project Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal project-modal" role="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "✏️ Edit Project" : "✨ Create New Project"}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <ProjectForm 
                initialData={editing}
                onSubmit={handleSaveProject}
                onCancel={closeModal}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal delete-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Project?</h3>
            <p className="muted">Are you sure you want to permanently delete this project? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {settingsOpen && (
        <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={() => setSettingsOpen(false)}>✕</button>
            </div>

            <div className="settings-content">
              <div className="settings-section">
                <h3>Website Configuration</h3>
                
                <div className="form-group">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="My App"
                  />
                </div>

                <div className="form-group">
                  <label>Site Description / Tagline</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    placeholder="Professional Project Manager"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Theme Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                    />
                    <span className="color-value">{settings.themeColor}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Default Language</label>
                  <select value={settings.defaultLanguage} onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}>
                    {languageOptions.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Timezone</label>
                  <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}>
                    {timezoneOptions.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn secondary" onClick={() => setSettingsOpen(false)}>Close</button>
                <button className="btn primary" onClick={saveSettings}>Save Settings</button>
              </div>
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