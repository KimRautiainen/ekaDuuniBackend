const express = require('express');
const passport = require('passport');
const upload = require('../middlewares/upload'); // Import Multer middleware
const profileController = require('../controllers/profileController');

const router = express.Router();

// Get profile
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.getProfile
);

// Create profile with image upload
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.uploadProfilePicture.single('profile_picture'),
  profileController.createProfile
);

// Update profile with image upload
router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.uploadProfilePicture.single('profile_picture'),
  profileController.updateProfile
);

module.exports = router;
