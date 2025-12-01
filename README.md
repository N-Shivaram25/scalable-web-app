# Scalable Web App with Authentication & Dashboard

A modern, full-stack web application built with React, Node.js/Express, and MongoDB featuring authentication, user profiles, and task management.

## 🎯 Features

✅ **Authentication**
- JWT-based login and registration
- Password hashing with bcrypt
- Secure token storage in localStorage

✅ **Dashboard**
- User profile display
- Task statistics
- Quick action buttons
- Responsive design

✅ **Task Management**
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Search and filter tasks
- Real-time UI updates

✅ **Profile Management**
- View user profile
- Update name and email
- Secure data endpoints

✅ **Modern UI**
- TailwindCSS styling
- Responsive design (mobile-first)
- Dark gradient backgrounds
- Smooth animations and transitions
- Reusable components

## 📁 Project Structure

```
scalable-react-app/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable components (Button, Input, Card, etc.)
│   │   ├── pages/           # Page components (Login, Register, Dashboard, Tasks, Profile)
│   │   ├── App.jsx          # Main app routing
│   │   ├── App.css          # Global styles
│   │   ├── index.css        # Tailwind CSS
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Frontend environment variables
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
│
└── backend/                 # Node.js/Express API
    ├── server.js            # Express server entry point
    ├── routes/              # API routes (auth, tasks, profile)
    ├── models/              # Mongoose schemas (User, Task)
    ├── middleware/          # Authentication middleware
    ├── .env                 # Backend environment variables
    └── package.json         # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

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

## 📚 API Documentation

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

## 🎨 Reusable Components

The project includes well-structured, reusable components in `frontend/src/components/index.jsx`:

- **Button** - Customizable button with variants (primary, secondary, danger, success)
- **Input** - Input field with labels and error handling
- **Card** - Container component with consistent styling
- **Alert** - Alert/notification component with types (error, success)
- **Modal** - Modal dialog component
- **Navbar** - Navigation bar with user info and logout

## 🔒 Security Best Practices

1. **Passwords** - Hashed using bcryptjs before storage
2. **JWT** - Token-based authentication with expiration
3. **CORS** - Configured to prevent unauthorized access
4. **Input Validation** - Server-side validation for all inputs
5. **Environment Variables** - Sensitive data stored in `.env` files (never committed)
6. **Protected Routes** - Frontend routes protected with JWT verification

## 📈 Scaling the Frontend-Backend Integration

### Production Deployment

1. **Frontend Deployment** (e.g., Vercel, Netlify)
   ```bash
   # Update .env for production
   VITE_API_URL=https://api.yourdomain.com
   
   # Build
   npm run build
   
   # Deploy static files
   ```

2. **Backend Deployment** (e.g., Heroku, AWS, Azure)
   ```bash
   # Push to deployment platform
   # Update .env with production MongoDB URI and JWT_SECRET
   ```

3. **Database Scaling**
   - Use MongoDB Atlas for cloud-hosted database
   - Enable auto-scaling and backups
   - Use connection pooling for better performance

4. **Performance Optimization**
   - Implement caching (Redis)
   - Use CDN for static assets
   - Enable GZIP compression
   - Implement pagination for large datasets

5. **Monitoring & Logging**
   - Use tools like Sentry for error tracking
   - Implement CloudWatch/ELK for logs
   - Monitor API performance with APM tools

6. **Load Balancing**
   - Deploy multiple backend instances
   - Use a load balancer (AWS ALB, NGINX)
   - Enable auto-scaling based on demand

## 🛠️ Technology Stack

**Frontend:**
- React 18.x
- Vite (build tool)
- TailwindCSS (styling)
- React Router (routing)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- CORS (cross-origin requests)

## 📝 Notes

- The app uses `localStorage` to store JWT tokens. For production, consider using httpOnly cookies for better security.
- All API responses follow a consistent JSON format.
- Error handling is implemented with meaningful error messages.
- The UI is fully responsive and works on mobile, tablet, and desktop.

## 🤝 Contributing

Feel free to extend this project with additional features like:
- Email verification
- Password reset
- Social authentication
- Real-time notifications
- Advanced task management (categories, priorities, reminders)
- User analytics dashboard

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, Node.js, and TailwindCSS**
