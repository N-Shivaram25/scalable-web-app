import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Alert } from '../components';
import './Tasks.css';

export default function Tasks() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskError, setNewTaskError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const userRes = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // Fetch tasks
      const tasksRes = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const addTask = async () => {
    setNewTaskError('');
    if (!newTask.trim()) {
      setNewTaskError('Task cannot be empty');
      return;
    }

    if (newTask.trim().length > 200) {
      setNewTaskError('Task must be less than 200 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTask })
      });

      if (res.ok) {
        const data = await res.json();
        setTasks([...tasks, data.task]);
        setNewTask('');
      } else {
        setError('Failed to add task');
      }
    } catch {
      setError('Server error');
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (res.ok) {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, completed: !currentStatus } : t));
      }
    } catch {
      setError('Failed to update task');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const saveEdit = async (taskId) => {
    if (!editText.trim()) {
      setError('Task cannot be empty');
      return;
    }

    if (editText.trim().length > 200) {
      setError('Task must be less than 200 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editText })
      });

      if (res.ok) {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, title: editText } : t));
        setEditingId(null);
        setEditText('');
      } else {
        setError('Failed to update task');
      }
    } catch {
      setError('Server error');
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== taskId));
      } else {
        setError('Failed to delete task');
      }
    } catch {
      setError('Server error');
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    remaining: tasks.filter(t => !t.completed).length
  };

  if (loading) {
    return (
      <>
        <Navbar user={null} onLogout={handleLogout} links={[]} />
        <div className="tasks-container">
          <div className="tasks-loading">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profile', href: '/profile' }
        ]}
      />
      <div className="tasks-container">
        <div className="tasks-content">
          <div className="tasks-header">
            <h1 className="tasks-title">📋 My Tasks</h1>
            <p className="tasks-subtitle">Organize and track your daily tasks</p>
          </div>

          {error && <Alert message={error} type="error" onClose={() => setError('')} />}

          {/* Statistics */}
          <div className="tasks-stats">
            <div className="tasks-stat-card tasks-stat-blue">
              <p className="tasks-stat-label">Total Tasks</p>
              <p className="tasks-stat-value">{stats.total}</p>
            </div>
            <div className="tasks-stat-card tasks-stat-green">
              <p className="tasks-stat-label">Completed</p>
              <p className="tasks-stat-value">{stats.completed}</p>
            </div>
            <div className="tasks-stat-card tasks-stat-orange">
              <p className="tasks-stat-label">Remaining</p>
              <p className="tasks-stat-value">{stats.remaining}</p>
            </div>
          </div>

          {/* Add Task Form */}
          <div className="tasks-add-form">
            <div className="tasks-input-group">
              <input
                type="text"
                value={newTask}
                onChange={(e) => { setNewTask(e.target.value); setNewTaskError(''); }}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className={`tasks-input ${newTaskError ? 'error' : ''}`}
                maxLength="200"
              />
              <button 
                onClick={addTask}
                className="tasks-add-btn"
              >
                ➕ Add Task
              </button>
            </div>
            {newTaskError && <p className="tasks-input-error">{newTaskError}</p>}
          </div>

          {/* Search */}
          <div className="tasks-search">
            <svg className="tasks-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="tasks-search-input"
            />
          </div>

          {/* Tasks List */}
          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="tasks-empty">
                <div className="tasks-empty-icon">📭</div>
                <p className="tasks-empty-text">
                  {searchTerm ? 'No tasks found matching your search.' : 'No tasks yet. Create one to get started!'}
                </p>
              </div>
            ) : (
              <ul className="tasks-items">
                {filteredTasks.map((task) => (
                  <li key={task._id} className={`tasks-item ${task.completed ? 'completed' : ''}`}>
                    <div className="tasks-item-content">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task._id, task.completed)}
                        className="tasks-checkbox"
                        aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                      />
                      {editingId === task._id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => saveEdit(task._id)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(task._id)}
                          className="tasks-edit-input"
                          autoFocus
                          maxLength="200"
                        />
                      ) : (
                        <p className="tasks-item-text">{task.title}</p>
                      )}
                    </div>
                    <div className="tasks-item-actions">
                      {!editingId ? (
                        <>
                          <button
                            onClick={() => startEdit(task)}
                            className="tasks-edit-btn"
                            title="Edit task"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteTask(task._id)}
                            className="tasks-delete-btn"
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="tasks-cancel-btn"
                          title="Cancel editing"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
