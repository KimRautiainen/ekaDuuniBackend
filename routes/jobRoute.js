const express = require('express');
const { uploadJobMedia } = require('../middlewares/upload');
const { getJobs } = require('../controllers/jobController');
const router = express.Router();

// ✅ Get all jobs
router.get('/', getJobs);

module.exports = router;
