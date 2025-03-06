// Import necessary modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Import the User model from the models directory

// Configure the Google OAuth 2.0 strategy for use by Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google Client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret from environment variables
      callbackURL: '/auth/google/callback', // URL to which Google will redirect after authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function is called after Google has authenticated the user
      try {
        // Attempt to find a user with the provided Google ID
        let user = await User.findOne({
          where: { oauthProviderId: profile.id },
        });

        // If the user doesn't exist, create a new user record
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value, // User's email from their Google profile
            full_name: profile.displayName || 'Google user', // User's display name from their Google profile
            oauthProvider: 'google', // The OAuth provider (in this case, Google)
            oauthProviderId: profile.id, // The user's unique ID from Google
            password_hash: null, // No password is stored for Google users
          });
        }

        // Call the done function with the user object to proceed
        return done(null, user);
      } catch (error) {
        // If an error occurs, pass it to the done function
        return done(error, null);
      }
    }
  )
);

// 🔹 LOCAL STRATEGY (Email & Password)
passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // Using email instead of username
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 🔹 JWT Strategy (Token-Based Authentication)
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      console.log('Decoded JWT Payload:', jwtPayload); // 👀 Debugging
      try {
        const user = await User.findByPk(jwtPayload.id);
        if (!user) {
          return done(null, false); // User not found
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user's ID in the session
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve the user record by ID
    const user = await User.findByPk(id);
    done(null, user); // Pass the user object to the done function
  } catch (error) {
    done(error, null); // If an error occurs, pass it to the done function
  }
});
