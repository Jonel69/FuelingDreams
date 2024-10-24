const express = require('express');
const { getProfile, updateProfile, uploadProfileImage, getProfileImage, deleteAccount } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');  // Import multer configuration
const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, getProfile);

// Update user profile
router.post('/update-profile', verifyToken, updateProfile);

// Upload profile image
router.post('/upload-profile-image', verifyToken, upload.single('profileImage'), uploadProfileImage);

// Get profile image
router.get('/profile-image', verifyToken, getProfileImage);

// Delete user account
router.delete('/deleteAccount', verifyToken, deleteAccount);

module.exports = router;
