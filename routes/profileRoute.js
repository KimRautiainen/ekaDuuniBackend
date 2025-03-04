const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticateUser = require('../middlewares/authMiddleware');

// Get profile
router.get('/', profileController.getProfile);

// Create profile (Protected route)
router.post('/', authenticateUser, profileController.createProfile);

// Update profile (Protected route)
router.patch('/', authenticateUser, profileController.updateProfile);

module.exports = router;
