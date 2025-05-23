require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database'); // Import Sequelize instance
require('./config/passport'); // Import passport configuration
const app = express();
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoute');
const projectRoutes = require('./routes/projectsRoute');
const jobRoutes = require('./routes/jobRoute');
const savedJobsRoutes = require('./routes/savedJobsRoute');
const userRoutes = require('./routes/userRoute');
const educationRoutes = require('./routes/educationRoutes');
const workExperienceRoutes = require('./routes/workExperienceRoutes');
const cors = require('cors');
const path = require('path');

// Middleware configurations
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set 'secure' to true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
  'http://localhost:5173', // Development frontend
  'https://eka-duuni-frontend-kim-rautiainens-projects.vercel.app', // ✅ Only allow real frontend in production
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies if needed
  })
);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -- DEFINE ROUTES -- //

// Define auth routes
app.use('/auth', authRoutes);

// Define profile routes
app.use('/profile', profileRoutes);

// Define project routes
app.use('/projects', projectRoutes);

// Define job routes
app.use('/jobs', jobRoutes);

// Define saved jobs routes
app.use('/saved-jobs', savedJobsRoutes);

// Define user routes
app.use('/users', userRoutes);

// Define education routes
app.use('/education', educationRoutes);
// Define work experience routes
app.use('/work-experiences', workExperienceRoutes);

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
    console.error('Yhteyden muodostaminen epäonnistui:', err + err.message);
    process.exit(1); // Exit the process with failure
  });
