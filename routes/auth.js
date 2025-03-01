// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔹 REGISTER A NEW USER
router.post('/register', authController.register);

// 🔹 LOCAL LOGIN
router.post('/login', authController.login);

// 🔹 GOOGLE LOGIN
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: 'Google Login Successful', user: req.user });
  }
);

// 🔹 LOGOUT
router.get('/logout', authController.logout);

module.exports = router;
