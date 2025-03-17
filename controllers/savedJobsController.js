const { SavedJob, Job, JobSkill, Skill, User } = require('../models');
const { getImageUrl } = require('../utils/imageHelper');

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Job,
          attributes: [
            'id',
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
              through: { attributes: [] }, // Exclude linking table data
              attributes: ['name'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!savedJobs.length) {
      return res.status(404).json({ message: 'No saved jobs found' });
    }

    const updatedSavedJobs = savedJobs.map((savedJob) => {
      const jobData = savedJob.Job.toJSON();
      return {
        ...savedJob.toJSON(),
        Job: {
          ...jobData,
          poster_image: getImageUrl(req, 'jobs', jobData.poster_image),
          logo: getImageUrl(req, 'jobs', jobData.logo),
        },
      };
    });

    res.json({ savedJobs: updatedSavedJobs });
  } catch (error) {
    console.error('Get Saved Jobs Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// 🔹 SAVE A JOB
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the job is already saved
    const existingSavedJob = await SavedJob.findOne({
      where: { user_id: userId, job_id: jobId },
    });
    if (existingSavedJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Save job
    await SavedJob.create({ user_id: userId, job_id: jobId });

    res.status(201).json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error('Save Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 REMOVE A SAVED JOB
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const savedJob = await SavedJob.findOne({
      where: { user_id: userId, job_id: jobId },
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    await savedJob.destroy();
    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    console.error('Remove Saved Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSavedJobs,
  saveJob,
  removeSavedJob,
};
