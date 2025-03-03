require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./config/database'); // Import Sequelize instance
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

// Test database connection and start server
sequelize
  .authenticate()
  .then(() => {
    console.log('Yhteys tietokantaan onnistui.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Yhteyden muodostaminen epäonnistui:', err);
    process.exit(1); // Exit the process with failure
  });
