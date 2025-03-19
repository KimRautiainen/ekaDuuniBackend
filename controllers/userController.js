const { User } = require('../models');

// get user by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL params
    // Find user by ID and exclude password_hash from the response
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send user as JSON response
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { full_name, email } = req.body; // Get updated user data from request body
    console.log(req.user.id);
    console.log('Request body: ', req.body);
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }, // Exclude password_hash
    }); // Find user by ID

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only if values are provided
    if (full_name) {
      user.full_name = full_name;
    }
    if (email) {
      user.email = email;
    }

    await user.save(); // Save updated user data
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Find user by ID

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy(); // Delete user
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
};
