const express = require('express');
const { uploadJobMedia } = require('../middlewares/upload');
const jobController = require('../controllers/jobController');
const passport = require('passport');

const router = express.Router();

// ✅ Get all jobs
router.get(
  '/',
  passport.authenticate('jwt', { session: false }), // require authentication
  jobController.getJobs
);

// ✅ Create a new job
router.post(
  '/',
  uploadJobMedia.fields([
    { name: 'poster_image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]), // Multer handles multiple files
  passport.authenticate('jwt', { session: false }),
  jobController.createJob
);

module.exports = router;
