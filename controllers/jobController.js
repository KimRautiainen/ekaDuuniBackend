const { Job, JobSkill, Skill } = require('../models');
const { Sequelize } = require('sequelize');

// GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      attributes: [
        'id',
        'employer_id',
        'title',
        'company',
        'logo',
        'poster_image',
        'apply_type',
        'job_description',
        'location',
        'start_date',
        'end_date',
        'work_type',
        'employment_type',
        'min_salary',
        'max_salary',
        'salary_type',
        'salary_details',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Skill,
          through: { attributes: [] },
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']], // ✅ Use camelCase
    });

    if (!jobs.length) {
      return res.status(404).json({ message: 'No jobs found' });
    }

    res.json({ jobs });
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJobs,
};