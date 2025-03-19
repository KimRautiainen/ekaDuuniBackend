const express = require('express');
const passport = require('passport');
const upload = require('../middlewares/upload'); // Import Multer middleware
const projectsController = require('../controllers/projectsController');

const router = express.Router();

// get projects
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  projectsController.getProjects
);
// get a projects by user id
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  projectsController.getProjectById
);
// post a new project
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.uploadProjectMedia.array('project_media', 5), // allow up to 5 files
  projectsController.createProject
);
// update a project
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.uploadProjectMedia.array('project_media', 5), // allow up to 5 files
  projectsController.updateProject
);
// delete a project
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  projectsController.deleteProject
);

module.exports = router;
