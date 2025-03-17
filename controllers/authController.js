const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../models');
require('dotenv').config();

// Utility function to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

// 🔹 REGISTER A NEW USER
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    console.log('📩 Registering user:', req.body);

    // Check if email already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      oauthProvider: 'local',
    });

    // Generate JWT Token
    const token = generateToken(user);

    res
      .status(201)
      .json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 LOGIN USER (LOCAL STRATEGY)
exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        console.error('❌ Passport Authentication Error:', err);
        return res
          .status(500)
          .json({ message: 'Server error', error: err.message });
      }
      if (!user) {
        console.warn('⚠️ Login failed:', info);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT Token
      const token = generateToken(user);

      res.json({ message: 'Login successful', token, user });
    })(req, res, next);
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 LOGOUT USER (Clears session)
exports.logout = (req, res) => {
  try {
    req.logout(() => {
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('❌ Logout Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 GET CURRENTLY LOGGED-IN USER (Using Token)
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'full_name', 'email', 'role', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('❌ Get Current User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
