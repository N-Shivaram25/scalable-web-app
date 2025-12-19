const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      profileImage: users.profileImage,
      coverPhoto: users.coverPhoto,
      gender: users.gender,
      mobileNumber: users.mobileNumber,
      address: users.address,
      qualification: users.qualification,
      workStatus: users.workStatus,
      theme: users.theme,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, req.user.id));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { name, email, profileImage, coverPhoto, gender, mobileNumber, address, qualification, workStatus } = req.body;
    
    const [user] = await db.update(users)
      .set({
        name,
        email,
        profileImage,
        coverPhoto,
        gender,
        mobileNumber,
        address,
        qualification,
        workStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        profileImage: users.profileImage,
        coverPhoto: users.coverPhoto,
        gender: users.gender,
        mobileNumber: users.mobileNumber,
        address: users.address,
        qualification: users.qualification,
        workStatus: users.workStatus,
        theme: users.theme,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });
    
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, req.user.id));
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/theme', auth, async (req, res) => {
  try {
    const { theme } = req.body;
    
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme' });
    }
    
    const [user] = await db.update(users)
      .set({ theme, updatedAt: new Date() })
      .where(eq(users.id, req.user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        profileImage: users.profileImage,
        coverPhoto: users.coverPhoto,
        gender: users.gender,
        mobileNumber: users.mobileNumber,
        address: users.address,
        qualification: users.qualification,
        workStatus: users.workStatus,
        theme: users.theme,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });
    
    res.json(user);
  } catch (err) {
    console.error('Update theme error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }
    
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    await db.delete(users).where(eq(users.id, req.user.id));
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
