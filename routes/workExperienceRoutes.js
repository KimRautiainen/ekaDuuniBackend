const express = require('express');
const router = express.Router();
const passport = require('passport');
const workExperienceController = require('../controllers/workExperienceController');

// Post new work experience
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  workExperienceController.createWorkExperience
);

module.exports = router;
