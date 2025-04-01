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

// 🔹 CREATE PROFILE (With Profile Picture & Cover Photo Upload)
const createProfile = async (req, res) => {
  try {
    const { bio, location, phone_number, linkedin, github, portfolio } =
      req.body;
    const userId = req.user.id;

    // Prevent duplicate profile
    const existingProfile = await Profile.findOne({
      where: { user_id: userId },
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: 'Profile already exists. Use update instead.' });
    }

    // Handle image uploads from req.files
    const profilePicture = req.files?.profile_picture?.[0]?.filename || null;
    const coverPhoto = req.files?.cover_photo?.[0]?.filename || null;

    // Create profile
    const profile = await Profile.create({
      user_id: userId,
      bio,
      location,
      phone_number,
      linkedin,
      github,
      portfolio,
      profile_picture: profilePicture,
      cover_photo: coverPhoto,
    });

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// 🔹 UPDATE PROFILE (With Image Replacement)
const updateProfile = async (req, res) => {
  try {
    const { bio, location, phone_number, linkedin, github, portfolio } =
      req.body;
    const userId = req.user.id;

    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // 🔁 Replace profile picture if provided
    const newProfilePic = req.files?.profile_picture?.[0]?.filename;
    if (newProfilePic) {
      if (profile.profile_picture) {
        const oldPath = path.join(
          __dirname,
          '..',
          'uploads',
          'profiles',
          profile.profile_picture
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      profile.profile_picture = newProfilePic;
    }

    // 🔁 Replace cover photo if provided
    const newCoverPhoto = req.files?.cover_photo?.[0]?.filename;
    if (newCoverPhoto) {
      if (profile.cover_photo) {
        const oldCoverPath = path.join(
          __dirname,
          '..',
          'uploads',
          'profiles',
          'cover_photos',
          profile.cover_photo
        );
        if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
      }
      profile.cover_photo = newCoverPhoto;
    }

    // Update text fields if present
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone_number !== undefined) profile.phone_number = phone_number;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (github !== undefined) profile.github = github;
    if (portfolio !== undefined) profile.portfolio = portfolio;

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
