// Import necessary modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
            name: profile.displayName, // User's display name from their Google profile
            oauthProvider: 'google', // The OAuth provider (in this case, Google)
            oauthProviderId: profile.id, // The user's unique ID from Google
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
