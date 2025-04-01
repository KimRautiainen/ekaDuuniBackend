const express = require('express');
const passport = require('passport');
const upload = require('../middlewares/upload');
const profileController = require('../controllers/profileController');

const router = express.Router();

// Combined upload middleware for profile picture & cover photo
const uploadProfileAssets = upload.uploadProfileAssets.fields([
  { name: 'profile_picture', maxCount: 1 },
  { name: 'cover_photo', maxCount: 1 },
]);

// Get profile
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  profileController.getProfile
);

// Create profile with profile picture and cover photo
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadProfileAssets,
  profileController.createProfile
);

// Update profile with profile picture and cover photo
router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadProfileAssets,
  profileController.updateProfile
);

module.exports = router;
