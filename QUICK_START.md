# 🚀 Quick Start Guide - Scalable Web App

## ⚡ 5-Minute Setup

### Step 1: Start the Backend
```bash
cd backend
npm install  # Only needed first time
npm start
```
✅ Backend running on `http://localhost:5000`

### Step 2: Start the Frontend
```bash
cd frontend
npm install  # Only needed first time
npm run dev
```
✅ Frontend running on `http://localhost:5173`

### Step 3: Open in Browser
```
http://localhost:5173
```

---

## 🎯 Complete User Journey

### First Time? Create Account
1. Open landing page (http://localhost:5173)
2. Click "Sign Up" button in navbar
3. Fill in: Name, Email, Password
4. Click "Create Account"
5. ✅ Automatically redirected to Dashboard

### Existing User? Log In
1. Open landing page
2. Click "Login" button in navbar
3. Enter Email and Password
4. Click "Sign In"
5. ✅ Automatically redirected to Dashboard

### Dashboard Actions
From the dashboard you can:
- 📋 **Manage Tasks** → Add, complete, delete tasks
- 👤 **Edit Profile** → Update name and email
- 🚪 **Logout** → Sign out and return to landing page

---

## 🎨 What You'll See

### Landing Page
- Beautiful gradient background with animated blobs
- "Scalable Web App" branding in navbar
- Hero section with features list
- Login/Sign Up modal-based authentication
- Responsive design

### Dashboard
- User profile card with name and email
- Quick action buttons
- Statistics showing account status
- Navigation bar for easy page switching

### Tasks Page
- Add new tasks
- Search/filter tasks
- Mark tasks complete
- Delete tasks
- Real-time statistics (Total, Completed, Remaining)

### Profile Page
- Edit your name and email
- Save changes
- Success notifications

---

## 🔗 Important URLs

| Page | URL | Auth Required |
|------|-----|---------------|
| Landing | `http://localhost:5173/` | ❌ No |
| Dashboard | `http://localhost:5173/dashboard` | ✅ Yes |
| Tasks | `http://localhost:5173/tasks` | ✅ Yes |
| Profile | `http://localhost:5173/profile` | ✅ Yes |

---

## 🧪 Test Credentials

After creating an account during signup, use those credentials to log in.

**Example**:
- Email: `test@example.com`
- Password: `password123`

---

## ⚙️ Configuration Files

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/scalable-app
JWT_SECRET=your-secret-key-here
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure backend is running on port 5000
- Check: `npm start` in backend folder
- Verify MongoDB is running

### "404 Not Found" pages
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend dev server

### "Login not working"
- Check browser console for errors (F12)
- Verify `.env` files are properly configured
- Ensure backend is running

### "Port already in use"
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173

# Then restart servers
```

---

## 📚 File Locations

```
Frontend Pages:
├── src/pages/LandingPage.jsx      (Home page with modals)
├── src/pages/Dashboard.jsx         (Main dashboard)
├── src/pages/Tasks.jsx             (Task management)
└── src/pages/Profile.jsx           (User profile)

Reusable Components:
└── src/components/index.jsx        (Button, Input, Card, Alert, etc.)

Backend API:
├── server.js                       (Express server)
├── routes/auth.js                  (Login/Register)
├── routes/task.js                  (Task CRUD)
└── routes/profile.js               (User profile)
```

---

## 💡 Tips

1. **Check Network Requests**: Open DevTools (F12) → Network tab to see API calls
2. **View Token**: In Console → `localStorage.getItem('token')`
3. **Clear Data**: In Console → `localStorage.clear()` then refresh
4. **Hot Reload**: Frontend automatically reloads on code changes

---

## 🚀 Deploy to Production

See `SCALING_GUIDE.md` for deployment instructions to:
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas

---

## 📞 Need Help?

Check these documentation files:
- `README.md` - Full project overview
- `API_DOCUMENTATION.json` - API reference
- `IMPLEMENTATION_SUMMARY.md` - Detailed technical info
- `SCALING_GUIDE.md` - Production deployment

---

**Enjoy your scalable web app! 🎉**
