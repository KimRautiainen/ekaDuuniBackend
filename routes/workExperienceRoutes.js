const express = require('express');
const router = express.Router();
const passport = require('passport');
const workExperienceController = require('../controllers/workExperienceController');


// 🔒 Get all work experiences for logged-in user
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  workExperienceController.getMyWorkExperiences
);


// Post new work experience
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  workExperienceController.createWorkExperience
);

// Get work experiences by specific user ID
router.get(
  '/user/:userId',
  passport.authenticate('jwt', { session: false }),
  workExperienceController.getWorkExperiencesByUserId
);

// DELETE work experience by ID (only own)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  workExperienceController.deleteWorkExperience
);

module.exports = router;
