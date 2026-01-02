# Scalable Web App with Authentication & Dashboard

A modern, full-stack web application built with React, Node.js/Express, and MongoDB featuring authentication, user profiles, and task management.

## Features

**Authentication**
- JWT-based login and registration
- Password hashing with bcrypt
- Secure token storage in localStorage

**Dashboard**
- User profile display
- Task statistics
- Quick action buttons
- Responsive design

**Task Management**
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Search and filter tasks
- Real-time UI updates

**Profile Management**
- View user profile
- Update name and email
- Secure data endpoints

**Modern UI**
- TailwindCSS styling
- Responsive design (mobile-first)
- Dark gradient backgrounds
- Smooth animations and transitions
- Reusable components


### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

**Note:** Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_super_secret_key` with a strong secret key.

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- **Body:** `{ name, email, password }`
- **Response:** `{ token }`

#### Login
- **POST** `/api/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ token }`

### Profile Endpoints

#### Get Profile
- **GET** `/api/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ _id, name, email }`

#### Update Profile
- **PUT** `/api/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, email }`
- **Response:** `{ _id, name, email }`

### Tasks Endpoints

#### Get All Tasks
- **GET** `/api/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[{ _id, title, completed, createdAt }]`

#### Create Task
- **POST** `/api/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ title }`
- **Response:** `{ _id, title, completed, createdAt }`

#### Update Task
- **PUT** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ title, completed }`
- **Response:** `{ _id, title, completed, createdAt }`

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ message: "Task deleted" }`



## Security Best Practices

1. **Passwords** - Hashed using bcryptjs before storage
2. **JWT** - Token-based authentication with expiration
3. **CORS** - Configured to prevent unauthorized access
4. **Input Validation** - Server-side validation for all inputs
5. **Environment Variables** - Sensitive data stored in `.env` files (never committed)
6. **Protected Routes** - Frontend routes protected with JWT verification

