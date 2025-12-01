import React, { useState, useEffect } from "react";

const categoryOptions = ["Web App", "Mobile App", "Desktop App", "API", "Library", "Other"];
const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold"];

export default function ProjectForm({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) {
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
  const [touched, setTouched] = useState({});

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "Web App",
        status: initialData.status || "Not Started",
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : "",
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : "",
        githubLink: initialData.githubLink || "",
        liveLink: initialData.liveLink || "",
        thumbnail: initialData.thumbnail || ""
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Project title is required";
    } else if (formData.name.trim().length > 200) {
      newErrors.name = "Title must be less than 200 characters";
    }

    // Description validation
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    // Dates validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error for this field if user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Compress image
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
            const compressedImage = canvas.toDataURL("image/jpeg", 0.7);
            
            setFormData(prev => ({ ...prev, thumbnail: compressedImage }));
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image processing error:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        githubLink: formData.githubLink.trim(),
        liveLink: formData.liveLink.trim(),
        thumbnail: formData.thumbnail
      };
      
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form-wrapper">
      {/* Basic Information Section */}
      <div className="form-section">
        <h3>📋 Basic Information</h3>
        
        <div className="form-group">
          <label htmlFor="name">
            Project Title <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter project title"
            maxLength="200"
            className={`form-input ${formErrors.name ? "is-invalid" : ""}`}
            disabled={isLoading}
          />
          <div className="input-meta">
            <span className="char-count">{formData.name.length}/200</span>
            {formErrors.name && touched.name && (
              <span className="error-message">{formErrors.name}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe your project... (optional)"
            maxLength="1000"
            rows="4"
            className={`form-input ${formErrors.description ? "is-invalid" : ""}`}
            disabled={isLoading}
          />
          <div className="input-meta">
            <span className="char-count">{formData.description.length}/1000</span>
            {formErrors.description && touched.description && (
              <span className="error-message">{formErrors.description}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              disabled={isLoading}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              disabled={isLoading}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="form-section">
        <h3>📅 Timeline</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date / Expected Completion</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${formErrors.endDate ? "is-invalid" : ""}`}
              disabled={isLoading}
            />
            {formErrors.endDate && touched.endDate && (
              <span className="error-message">{formErrors.endDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Section */}
      <div className="form-section">
        <h3>🖼️ Project Thumbnail</h3>
        
        <div className="form-group">
          <label htmlFor="thumbnail">Upload Image</label>
          <div className="file-upload">
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              disabled={isLoading}
            />
            <label htmlFor="thumbnail" className="file-label">
              📸 Choose Image or Drag & Drop
            </label>
          </div>
          {formData.thumbnail && (
            <div className="thumbnail-preview">
              <img src={formData.thumbnail} alt="Preview" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, thumbnail: "" }))}
                className="btn-remove"
                disabled={isLoading}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="form-section">
        <h3>🔗 Project Links</h3>
        
        <div className="form-group">
          <label htmlFor="githubLink">GitHub Repository</label>
          <input
            id="githubLink"
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://github.com/..."
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="liveLink">Live Demo / Website</label>
          <input
            id="liveLink"
            type="url"
            name="liveLink"
            value={formData.liveLink}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com"
            className="form-input"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "⏳ Saving..." : "✓ Create Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
