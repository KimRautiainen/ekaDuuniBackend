const express = require('express');
const router = express.Router();
const passport = require('passport');
const educationController = require('../controllers/educationController');

// Create new education
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  educationController.createEducation
);

// Get education for logged-in user
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  educationController.getMyEducations
);

// Get education by user ID
router.get(
  '/user/:userId',
  passport.authenticate('jwt', { session: false }),
  educationController.getEducationsByUserId
);

//  Update education
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  educationController.updateEducation
);

//  Delete education
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  educationController.deleteEducation
);

module.exports = router;
