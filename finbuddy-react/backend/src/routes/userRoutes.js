const express = require('express');
const router = express.Router();
const { 
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllBadges
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/badges', protect, getAllBadges);

module.exports = router;