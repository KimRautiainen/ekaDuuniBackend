require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // Import passport configuration
const app = express();
const authRoutes = require('./routes/auth');

// Middleware configurations
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }, // Set 'secure' to true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
