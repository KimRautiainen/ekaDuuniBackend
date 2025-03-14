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

// ✅ Get a single job
router.get('/:id', jobController.getJob);

// ✅ Update a job
router.put(
  '/:id',
  uploadJobMedia.fields([
    { name: 'poster_image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  passport.authenticate('jwt', { session: false }),
  jobController.updateJob
);

// ✅ Delete a job
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  jobController.deleteJob
);

// get Jobs by employer
router.get('/employer/:employerId', jobController.getJobsByEmployer);

// searh / filter jobs
router.get('/search', jobController.searchJobs);

// TODO Save a job


module.exports = router;
