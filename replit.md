# Scalable Web App - Project Management System

## Overview
A full-stack task and project management web application with secure JWT authentication, built with React (Vite) frontend and Express.js backend with PostgreSQL database.

## Project Architecture

### Frontend (React + Vite)
- **Location**: `/frontend`
- **Port**: 5000 (development via Vite proxy)
- **Key Files**:
  - `src/App.jsx` - Main app with routing
  - `src/pages/` - Page components (Dashboard, Login, Register, Tasks, Profile)
  - `src/components/` - Reusable components
  - `vite.config.js` - Vite configuration with proxy to backend

### Backend (Express.js)
- **Location**: `/backend`
- **Port**: 3000 (development), 5000 (production)
- **Key Files**:
  - `server.js` - Main server entry point
  - `routes/` - API routes (auth, profile, project, task)
  - `db/` - Database connection and schema (Drizzle ORM)
  - `middleware/auth.js` - JWT authentication middleware

### Database (PostgreSQL)
- **ORM**: Drizzle
- **Tables**: users, projects, tasks
- **Schema**: `/backend/db/schema.js`

## Development Commands

### Start Development
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && node server.js`

### Database
- Push schema changes: `cd backend && npm run db:push`

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provided)
- `JWT_SECRET` - Secret key for JWT tokens
- `BACKEND_PORT` - Backend server port (default: 3000)
- `VITE_API_URL` - API URL for frontend (default: /api)

## API Endpoints

### Auth (`/api/auth`)
- POST `/register` - Register new user
- POST `/login` - User login

### Profile (`/api/profile`)
- GET `/` - Get user profile
- PUT `/` - Update profile
- PUT `/theme` - Update theme preference
- POST `/change-password` - Change password
- DELETE `/` - Delete account

### Projects (`/api/projects`)
- GET `/` - Get all projects
- GET `/:id` - Get single project
- POST `/` - Create project
- PUT `/:id` - Update project
- DELETE `/:id` - Delete project

### Tasks (`/api/tasks`)
- GET `/` - Get all tasks
- POST `/` - Create task
- PUT `/:id` - Update task
- DELETE `/:id` - Delete task

## Deployment
- Build frontend: `cd frontend && npm run build`
- Production: Backend serves static files from frontend build
- Uses autoscale deployment with NODE_ENV=production
