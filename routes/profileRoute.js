const express = require('express');
const passport = require('passport');
const upload = require('../middlewares/upload');
const profileController = require('../controllers/profileController');

const router = express.Router();

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
  upload.uploadProfileAssets,
  profileController.createProfile
);

// Update profile with profile picture and cover photo
router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.uploadProfileAssets,
  profileController.updateProfile
);

module.exports = router;
