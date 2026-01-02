require('dotenv').config();
console.log('Starting server.js');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/project');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;

console.log('Attempting MongoDB connection to:', process.env.MONGO_URI ? 'provided URI' : 'no URI');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err && err.stack ? err.stack : err);
    // ensure we exit with non-zero code so the supervising process (nodemon) reports failure
    process.exit(1);
  });
