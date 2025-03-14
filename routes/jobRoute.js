const express = require('express');
const { uploadJobMedia } = require('../middlewares/upload');
const jobController = require('../controllers/jobController');
const passport = require('passport');

const router = express.Router();
// get Jobs by employer
router.get('/employer/:employerId', jobController.getJobsByEmployer);

// searh / filter jobs
router.get('/search', jobController.searchJobs);

// ✅ Get all jobs
router.get('/', jobController.getJobs);

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

// ✅ Get a single job by id
router.get('/:id', jobController.getJobById);

// ✅ Update a job
router.patch(
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

module.exports = router;
