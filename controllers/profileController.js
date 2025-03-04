const { Profile } = require('../models');

// 🔹 GET PROFILE
const getProfile = async (req, res) => {
  try {
    // Find the profile that belongs to the logged-in user
    const profile = await Profile.findOne({
      where: { user_id: req.user.id },
    });
    res.json({ profile });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create profile
const createProfile = async (req, res) => {
  try {
    const {
      bio,
      location,
      phone_number,
      linkedin,
      github,
      portfolio,
      profile_picture,
    } = req.body;
    const profile = await Profile.create({
      user_id: req.user.id,
      bio,
      location,
      phone_number,
      linkedin,
      github,
      portfolio,
      profile_picture,
    });
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Create Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile
// Update profile with partial updates
const updateProfile = async (req, res) => {
  try {
    const {
      bio,
      location,
      phone_number,
      linkedin,
      github,
      portfolio,
      profile_picture,
    } = req.body;

    // Find the profile based on user_id
    const profile = await Profile.findOne({
      where: { user_id: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    //  Only update fields that are provided in the request
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone_number !== undefined) profile.phone_number = phone_number;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (github !== undefined) profile.github = github;
    if (portfolio !== undefined) profile.portfolio = portfolio;
    if (profile_picture !== undefined)
      profile.profile_picture = profile_picture;

    // Save the updated profile
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
