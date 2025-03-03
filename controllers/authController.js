const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../models');

// 🔹 REGISTER A NEW USER
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    console.log('Registering user:', req.body);

    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      oauthProvider: 'local',
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration Error:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 LOGIN A USER (LOCAL STRATEGY)
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Server error', err });
    if (!user) return res.status(400).json({ message: info.message });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, user });
  })(req, res, next);
};

// 🔹 LOGOUT
exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logout successful' });
  });
};
