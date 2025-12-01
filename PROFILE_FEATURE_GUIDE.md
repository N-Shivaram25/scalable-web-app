# Profile Feature Implementation Guide

## Overview
The profile feature has been fully implemented with a comprehensive profile modal that appears when users click their avatar in the dashboard navbar. This feature includes profile viewing, editing, security management, theme preferences, and account deletion.

## Features Implemented

### 1. **Profile Modal (Frontend)**
A fully-featured modal component at `frontend/src/components/ProfileModal.jsx` with 4 tabs:

#### Tab 1: Profile (View)
- Display all user information in a read-only format
- Shows:
  - Gender
  - Mobile Number
  - Address
  - Qualification
  - Work Status
  - Member Since (Account Creation Date)

#### Tab 2: Edit Profile
- Edit all profile information
- Upload Profile Picture (Image Preview)
- Upload Cover Photo (Image Preview)
- Fields:
  - Full Name *
  - Email *
  - Profile Picture
  - Cover Photo
  - Gender (Dropdown: Male, Female, Other)
  - Mobile Number
  - Address
  - Qualification
  - Work Status (Dropdown: Student, Working, Student & Working)

#### Tab 3: Security
- **Change Password Section:**
  - Current Password *
  - New Password *
  - Confirm New Password *
  - Password validation (min 6 characters, must match)

- **Delete Account Section:**
  - Warning message about permanent deletion
  - Requires password confirmation
  - Shows confirmation dialog before deletion

#### Tab 4: Settings
- **Theme Preference:**
  - Light Mode (☀️)
  - Dark Mode (🌙)
  - Active theme is highlighted
- **Logout:** Sign out from the current device

### 2. **Database Schema Updates**
Updated `User.js` model with new fields:
```javascript
{
  name: String,
  email: String,
  password: String,
  profileImage: String,        // Base64 encoded image
  coverPhoto: String,          // Base64 encoded image
  gender: String,              // 'male', 'female', 'other', or ''
  mobileNumber: String,
  address: String,
  qualification: String,
  workStatus: String,          // 'student', 'working', 'both', or ''
  theme: String,               // 'light' or 'dark'
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Backend API Endpoints**

All endpoints require Bearer token authentication.

#### GET `/api/profile`
- Fetch user profile data
- Returns: User object (without password)

#### PUT `/api/profile`
- Update profile information
- Request body:
  ```json
  {
    "name": "string",
    "email": "string",
    "profileImage": "base64_string",
    "coverPhoto": "base64_string",
    "gender": "string",
    "mobileNumber": "string",
    "address": "string",
    "qualification": "string",
    "workStatus": "string"
  }
  ```

#### POST `/api/profile/change-password`
- Change user password
- Request body:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- Returns: Success message

#### PUT `/api/profile/theme`
- Update theme preference
- Request body:
  ```json
  {
    "theme": "light" | "dark"
  }
  ```

#### DELETE `/api/profile`
- Permanently delete user account
- Request body:
  ```json
  {
    "password": "string"
  }
  ```
- Returns: Success message

### 4. **Frontend Integration**

#### Dashboard.jsx Updates
- Added `profileModalOpen` state to manage modal visibility
- Profile icon in navbar now opens the full ProfileModal
- Profile data is fetched on component mount
- Profile updates are reflected in real-time
- Logout functionality integrated with profile modal

#### Components
- `ProfileModal.jsx`: Main profile component
- `ProfileModal.css`: Comprehensive styling with responsive design and dark mode support

## How to Use

### 1. **Access Profile**
Click on the profile avatar/name in the top-right corner of the dashboard navbar.

### 2. **View Profile**
- Default tab shows all your profile information
- No editing needed for viewing

### 3. **Edit Profile**
1. Click "Edit Profile" tab
2. Update any fields:
   - Basic Info: Name, Email
   - Images: Upload new profile picture or cover photo
   - Personal: Gender, Mobile, Address
   - Education/Work: Qualification, Work Status
3. Click "Save Changes" button
4. Success message appears, modal returns to view tab

### 4. **Change Password**
1. Click "Security" tab
2. Enter:
   - Current Password
   - New Password
   - Confirm New Password
3. Click "Change Password"
4. Password must be at least 6 characters
5. Success message confirms password change

### 5. **Delete Account**
1. Click "Security" tab
2. Scroll to "Delete Account" section
3. Click "Delete My Account" button
4. Enter password to confirm
5. Click "Permanently Delete Account"
6. Account and all data are permanently removed
7. User is logged out and redirected to login page

### 6. **Theme Switching**
1. Click "Settings" tab
2. Click either "☀️ Light Mode" or "🌙 Dark Mode"
3. Theme preference is saved and applied immediately

### 7. **Logout**
1. Click "Settings" tab
2. Click "Logout" button
3. User is redirected to login page

## Styling Features

### ProfileModal.css Includes:
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark Mode Support:** Automatically adapts to system preferences
- **Smooth Animations:** Slide-up entrance animation and transitions
- **Professional UI:** Gradient buttons, proper spacing, and visual hierarchy
- **Form Validation:** Error messages and disabled states
- **Image Previews:** See before/after of profile and cover photos

### Color Scheme:
- Primary: Purple gradient (#667eea to #764ba2)
- Danger: Red (#ff5252)
- Success: Green
- Background: White/Dark gray
- Text: Dark gray/Light gray

## Technical Details

### Image Storage
- Profile images are stored as Base64 encoded strings in MongoDB
- Supports JPEG, PNG, and other common image formats
- Automatic preview before upload

### Authentication
- Uses JWT token-based authentication
- All requests include `Authorization: Bearer {token}` header
- Invalid or expired tokens trigger logout

### Data Persistence
- All changes are immediately saved to MongoDB
- Profile data is fetched on dashboard load
- Real-time updates across components

### Error Handling
- Form validation before submission
- API error messages displayed to user
- Graceful fallbacks for missing data

## File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ProfileModal.jsx       (Main component)
│   │   ├── ProfileModal.css       (Styling)
│   │   └── index.jsx              (Export)
│   └── pages/
│       └── Dashboard.jsx          (Integration)
backend/
├── models/
│   └── User.js                    (Updated schema)
├── routes/
│   └── profile.js                 (New endpoints)
└── middleware/
    └── auth.js                    (Authentication)
```

## Future Enhancements
- Profile picture crop/resize functionality
- Social media links
- Bio/About section
- Profile visibility/privacy settings
- Two-factor authentication
- Login history and sessions management
- Profile completion percentage indicator

## Troubleshooting

### Images Not Showing
- Check browser console for errors
- Ensure file size is reasonable (<5MB)
- Try different image format

### Password Change Not Working
- Verify current password is correct
- Check that new password is at least 6 characters
- Ensure passwords match

### Theme Not Persisting
- Clear browser cache
- Check localStorage settings
- Verify database connection

### Account Deletion Failing
- Confirm password is correct
- Check internet connection
- Ensure account exists in database

## Security Considerations
- Passwords are hashed with bcryptjs before storage
- Sensitive operations (delete account) require password confirmation
- All API routes protected with JWT authentication
- Frontend validates input before submission
- Backend validates all inputs server-side
