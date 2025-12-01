import '../components.css';
import { ProfileModal } from './ProfileModal';
import ProjectForm from './ProjectForm';
import './ProjectForm.css';

// Reusable Button Component
export const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, type = 'button' }) => {
  const baseClasses = `btn btn-${variant}`;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

// Reusable Input Component
export const Input = ({ label, type = 'text', placeholder, value, onChange, required = false, error = '', id }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label} {required && <span className="required">*</span>}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

// Reusable Card Component
export const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

// Reusable Alert Component
export const Alert = ({ message, type = 'error', onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <p>{message}</p>
      {onClose && <button className="alert-close" onClick={onClose}>✕</button>}
    </div>
  );
};

// Reusable Modal Component
export const Modal = ({ isOpen, title, children, onClose, footerButtons }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <Card className="w-full max-w-md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#6b7280' }}>×</button>
        </div>
        {children}
        {footerButtons && <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>{footerButtons}</div>}
      </Card>
    </div>
  );
};

// Reusable Navbar Component
export const Navbar = ({ user, onLogout, links = [] }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">TaskApp</div>
        <div className="navbar-links">
          {links.map((link, idx) => (
            <a key={idx} href={link.href} className="navbar-link">{link.label}</a>
          ))}
          {user && <span className="navbar-user">{user.name}</span>}
          <Button variant="danger" onClick={onLogout} className="text-sm">Logout</Button>
        </div>
      </div>
    </nav>
  );
};

// Export ProfileModal
export { ProfileModal, ProjectForm };

