const { WorkExperience } = require('../models');

// POST new work experience
const createWorkExperience = async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      start_date,
      end_date,
      description,
    } = req.body;

    const user_id = req.user.id; // haetaan kirjautuneen käyttäjän id JWT:stä

    const workExperience = await WorkExperience.create({
      user_id,
      company,
      position,
      location,
      start_date,
      end_date,
      description,
    });

    res.status(201).json({
      message: 'Work experience added successfully',
      workExperience,
    });
  } catch (error) {
    console.error('Create Work Experience Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all work experiences for logged-in user
const getMyWorkExperiences = async (req, res) => {
  try {
    const userId = req.user.id;

    const experiences = await WorkExperience.findAll({
      where: { user_id: userId },
      order: [['start_date', 'DESC']],
    });

    if (!experiences.length) {
      return res.status(404).json({ message: 'No work experiences found' });
    }

    res.json({ experiences });
  } catch (error) {
    console.error('Get My Work Experiences Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all work experiences by user ID (parameter)
const getWorkExperiencesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const experiences = await WorkExperience.findAll({
      where: { user_id: userId },
      order: [['start_date', 'DESC']],
    });

    if (!experiences.length) {
      return res.status(404).json({ message: 'No work experiences found for this user' });
    }

    res.json({ experiences });
  } catch (error) {
    console.error('Get Work Experiences By User ID Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const experience = await WorkExperience.findOne({
      where: { id, user_id: userId },
    });

    if (!experience) {
      return res.status(404).json({ message: 'Work experience not found or not yours' });
    }

    await experience.destroy();

    res.json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Delete Work Experience Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = {
  createWorkExperience,
  getMyWorkExperiences,
  getWorkExperiencesByUserId,
  deleteWorkExperience,
};
