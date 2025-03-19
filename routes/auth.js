const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

// 🔹 REGISTER A NEW USER
router.post('/register', authController.register);

// 🔹 LOCAL LOGIN
router.post('/login', authController.login);

// 🔹 GET CURRENT USER (Protected Route)
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  authController.getCurrentUser
);

// 🔹 GOOGLE LOGIN
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.json({ message: 'Google Login Successful', user: req.user });
  }
);

// 🔹 LOGOUT
router.get('/logout', authController.logout);

module.exports = router;
