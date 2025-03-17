const express = require('express');
const router = express.Router();
const passport = require('passport');
const savedJobsController = require('../controllers/savedJobsController');

// 🔹 GET all saved jobs for the logged-in user
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  savedJobsController.getSavedJobs
);

// 🔹 SAVE a job
router.post(
  '/:jobId',
  passport.authenticate('jwt', { session: false }),
  savedJobsController.saveJob
);

// 🔹 DELETE a saved job
router.delete(
  '/:jobId',
  passport.authenticate('jwt', { session: false }),
  savedJobsController.removeSavedJob
);

module.exports = router;
