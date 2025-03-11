const fs = require('fs');
const path = require('path');
const { Profile } = require('../models');

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const profile = await Profile.findOne({
      where: { user_id: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 CREATE PROFILE (With Image Upload Handling)
const createProfile = async (req, res) => {
  try {
    const { bio, location, phone_number, linkedin, github, portfolio } =
      req.body;
    const userId = req.user.id;

    // Find existing profile
    let profile = await Profile.findOne({ where: { user_id: userId } });

    if (profile) {
      return res
        .status(400)
        .json({ message: 'Profile already exists. Use update instead.' });
    }

    // Handle profile picture upload
    const profilePicture = req.file ? req.file.filename : null;

    // Create new profile
    profile = await Profile.create({
      user_id: userId,
      bio,
      location,
      phone_number,
      linkedin,
      github,
      portfolio,
      profile_picture: profilePicture,
    });

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 UPDATE PROFILE (With Profile Picture Replacement)
const updateProfile = async (req, res) => {
  try {
    const { bio, location, phone_number, linkedin, github, portfolio } =
      req.body;
    const userId = req.user.id;

    // Find the profile
    const profile = await Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Handle profile picture update
    if (req.file) {
      // Delete the old profile picture if exists
      if (profile.profile_picture) {
        const oldPicPath = path.join(
          __dirname,
          '..',
          'uploads',
          profile.profile_picture
        );
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath); // Delete the old picture
        }
      }
      profile.profile_picture = req.file.filename; // Save new image
    }

    // Only update fields that are provided in the request
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone_number !== undefined) profile.phone_number = phone_number;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (github !== undefined) profile.github = github;
    if (portfolio !== undefined) profile.portfolio = portfolio;

    // Save updated profile
    await profile.save();
    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};
