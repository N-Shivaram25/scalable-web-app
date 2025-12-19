require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/project');
const { pool } = require('./db');
const { users, projects, tasks } = require('./db/schema');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.BACKEND_PORT || 3000;

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        profile_image TEXT,
        cover_photo TEXT,
        gender TEXT DEFAULT '',
        mobile_number TEXT DEFAULT '',
        address TEXT DEFAULT '',
        qualification TEXT DEFAULT '',
        work_status TEXT DEFAULT '',
        theme TEXT DEFAULT 'light',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        category TEXT DEFAULT 'Web App',
        status TEXT DEFAULT 'Not Started',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        thumbnail TEXT DEFAULT '',
        github_link TEXT DEFAULT '',
        live_link TEXT DEFAULT '',
        owner TEXT DEFAULT 'Unknown',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Database tables created/verified');
  } finally {
    client.release();
  }
}

initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database initialization error:', err);
    process.exit(1);
  });
