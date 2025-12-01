# Profile Feature - Setup & Integration Guide

## 🚀 Quick Start

### Prerequisites
- Node.js and npm installed
- MongoDB instance running
- Backend server running on `http://localhost:5000`
- Frontend running with Vite

### Installation Steps

#### 1. Backend Setup (Already Done)
Your backend has been updated with:
- ✅ Enhanced User schema with profile fields in `backend/models/User.js`
- ✅ New profile routes in `backend/routes/profile.js`
- ✅ JWT authentication in `backend/middleware/auth.js`

#### 2. Frontend Setup (Already Done)
Your frontend has been updated with:
- ✅ New ProfileModal component at `frontend/src/components/ProfileModal.jsx`
- ✅ ProfileModal styling at `frontend/src/components/ProfileModal.css`
- ✅ Dashboard integration in `frontend/src/pages/Dashboard.jsx`
- ✅ Component exports updated in `frontend/src/components/index.jsx`

### 3. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install  # if not already done
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm install  # if not already done
npm run dev
```

The application should be available at `http://localhost:5173` (or the Vite port shown in terminal).

---

## 📋 Feature Overview

### Profile Modal Tabs

#### 1️⃣ **Profile Tab** (Read-Only View)
Shows all user information:
- Gender, Mobile Number, Address
- Qualification, Work Status
- Member Since (account creation date)

#### 2️⃣ **Edit Profile Tab**
Update personal information:
- Full Name & Email
- Upload Profile Picture & Cover Photo
- Gender, Mobile, Address
- Qualification, Work Status

#### 3️⃣ **Security Tab**
- Change password (with validation)
- Delete account (requires password confirmation)
- Permanent deletion with warning

#### 4️⃣ **Settings Tab**
- Light/Dark theme toggle
- Logout button

---

## 🎨 Visual Components

### Profile Modal Layout
```
┌─────────────────────────────────────────┐
│ [Close ✕]                               │
│                                         │
│        [COVER PHOTO AREA]               │
│                                         │
├─────────────────────────────────────────┤
│  [Avatar]  John Doe                     │
│            john@example.com             │
│            Bachelor's in CS             │
├─────────────────────────────────────────┤
│ [Profile] [Edit Profile] [Security]    │
│ [Settings]                              │
├─────────────────────────────────────────┤
│                                         │
│  Content based on active tab...         │
│                                         │
│  [Cancel] [Save/Action Button]          │
│                                         │
└─────────────────────────────────────────┘
```

### Database Schema
```
User {
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  profileImage: String (base64),
  coverPhoto: String (base64),
  gender: String,
  mobileNumber: String,
  address: String,
  qualification: String,
  workStatus: String,
  theme: String ('light' | 'dark'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints Summary

All endpoints require `Authorization: Bearer {token}` header.

### Profile Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/profile` | Fetch user profile |
| PUT | `/api/profile` | Update profile info |

### Security
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/profile/change-password` | Change password |
| DELETE | `/api/profile` | Delete account |

### Settings
| Method | Endpoint | Purpose |
|--------|----------|---------|
| PUT | `/api/profile/theme` | Update theme preference |

---

## 💾 Data Flow

```
User clicks Avatar
       ↓
setProfileModalOpen(true)
       ↓
ProfileModal rendered with profile data
       ↓
User interacts with form/tabs
       ↓
Submit to backend API
       ↓
Backend validates & updates MongoDB
       ↓
Response sent back to frontend
       ↓
setProfile(updatedData)
       ↓
Modal updates with new data
```

---

## 🧪 Testing the Features

### Test Profile Viewing
1. Click avatar in navbar
2. Modal opens showing profile info
3. Check each tab to view information
4. ✅ Should show existing user data

### Test Profile Editing
1. Go to "Edit Profile" tab
2. Change name, add mobile number
3. Click "Save Changes"
4. ✅ Should see success message
5. ✅ Data should persist after refresh

### Test Password Change
1. Go to "Security" tab
2. Enter correct current password
3. Enter new password twice
4. Click "Change Password"
5. ✅ Should show success message
6. ✅ Old password won't work anymore

### Test Image Upload
1. Go to "Edit Profile" tab
2. Click "Profile Picture" file input
3. Select an image
4. See preview update
5. Click "Save Changes"
6. ✅ Image should be saved

### Test Theme Toggle
1. Go to "Settings" tab
2. Click "Dark Mode" button
3. ✅ Theme should change immediately
4. Refresh page
5. ✅ Theme preference should persist

### Test Logout
1. Go to "Settings" tab
2. Click "Logout"
3. ✅ Should redirect to login page

### Test Account Deletion
1. Go to "Security" tab
2. Click "Delete My Account"
3. Enter password
4. Click "Permanently Delete Account"
5. ✅ Account should be deleted
6. ✅ Should redirect to login

---

## 🐛 Debugging Tips

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform an action (e.g., save profile)
4. Check API response and status code

### Check Console Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check for CORS or 401 errors

### Backend Logs
```bash
# Terminal running backend should show:
# ✓ API requests
# ✓ Database operations
# ✓ Any errors
```

### Verify Database
```javascript
// Use MongoDB Compass or CLI
db.users.findOne({ email: "your@email.com" })
// Should show all updated fields
```

---

## 📱 Responsive Design

The profile modal is fully responsive:
- **Desktop (1024px+):** Full layout with 2-column forms
- **Tablet (768px-1023px):** Adjusted spacing
- **Mobile (< 768px):** Single column layout, stacked buttons

---

## 🔐 Security Features

✅ Password hashing (bcryptjs)  
✅ JWT token authentication  
✅ Password confirmation on delete  
✅ Input validation (frontend & backend)  
✅ HTTPS ready (use in production)  
✅ Secure password storage  

---

## 📝 File Modifications Summary

### New Files Created
- `frontend/src/components/ProfileModal.jsx` (500+ lines)
- `frontend/src/components/ProfileModal.css` (700+ lines)
- `PROFILE_FEATURE_GUIDE.md`
- `SETUP_AND_INTEGRATION_GUIDE.md`

### Files Modified
- `backend/models/User.js` - Added new fields
- `backend/routes/profile.js` - Added 5 new endpoints
- `frontend/src/pages/Dashboard.jsx` - Integrated ProfileModal
- `frontend/src/components/index.jsx` - Exported ProfileModal

---

## ✅ Implementation Checklist

- [x] User schema updated with profile fields
- [x] Backend endpoints created
- [x] Authentication middleware configured
- [x] ProfileModal component created
- [x] Styling and responsive design implemented
- [x] Dashboard integration done
- [x] Image upload support added
- [x] Password change functionality
- [x] Account deletion with confirmation
- [x] Theme preference toggle
- [x] Documentation created

---

## 🎯 Next Steps (Optional Enhancements)

1. **Profile Picture Cropping**
   - Add image crop tool before upload
   - Resize large images automatically

2. **Additional Fields**
   - Bio/About section
   - Social media links
   - Preferred language

3. **Advanced Security**
   - Two-factor authentication
   - Login history
   - Active sessions management

4. **Profile Visibility**
   - Public/private toggle
   - Share profile link
   - Profile privacy settings

5. **Enhanced Notifications**
   - Email notifications on profile changes
   - Security alerts
   - Account activity log

---

## 🆘 Support

### Common Issues & Solutions

**Issue:** Images not uploading
- Solution: Check file size (< 5MB recommended)
- Try different image format

**Issue:** Password change not working
- Solution: Current password must be correct
- New password min 6 characters

**Issue:** Theme not persisting
- Solution: Check browser localStorage
- Clear cache and try again

**Issue:** 401 Unauthorized errors
- Solution: Token may be expired, login again
- Check token in localStorage

---

## 📚 Related Documentation

See `PROFILE_FEATURE_GUIDE.md` for detailed feature documentation.

---

**Implementation Date:** November 30, 2025  
**Status:** ✅ Complete and Ready for Use  
**Last Updated:** November 30, 2025
