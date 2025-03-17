const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const router = express.Router();

// Get user by id (public profile)
router.get('/:id', userController.getUserById);

// Update user profile
router.patch(
  '/update',
  passport.authenticate('jwt', { session: false }),
  userController.updateUser
);

// Delete user account
router.delete(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  userController.deleteUser
);


module.exports = router;