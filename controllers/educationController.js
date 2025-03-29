const { Education } = require('../models');

// Create new education
const createEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { institution, degree, field_of_study, start_date, end_date } = req.body;

    const education = await Education.create({
      user_id: userId,
      institution,
      degree,
      field_of_study,
      start_date,
      end_date,
    });

    res.status(201).json({ message: 'Education added successfully', education });
  } catch (error) {
    console.error('Create Education Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all education records for logged-in user
const getMyEducations = async (req, res) => {
  try {
    const userId = req.user.id;

    const educations = await Education.findAll({
      where: { user_id: userId },
      order: [['start_date', 'DESC']],
    });

    res.json({ educations });
  } catch (error) {
    console.error('Get My Educations Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get education by user ID
const getEducationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const educations = await Education.findAll({
      where: { user_id: userId },
      order: [['start_date', 'DESC']],
    });

    res.json({ educations });
  } catch (error) {
    console.error('Get Educations By UserId Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update education
const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const education = await Education.findOne({
      where: { id, user_id: userId },
    });

    if (!education) {
      return res.status(404).json({ message: 'Education not found or not yours' });
    }

    const { institution, degree, field_of_study, start_date, end_date } = req.body;

    await education.update({
      institution,
      degree,
      field_of_study,
      start_date,
      end_date,
    });

    res.json({ message: 'Education updated successfully', education });
  } catch (error) {
    console.error('Update Education Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete education
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const education = await Education.findOne({
      where: { id, user_id: userId },
    });

    if (!education) {
      return res.status(404).json({ message: 'Education not found or not yours' });
    }

    await education.destroy();
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete Education Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
    createEducation,
    getMyEducations,
    getEducationsByUserId,
    updateEducation,
    deleteEducation,
};