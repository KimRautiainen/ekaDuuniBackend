const { uploadJobMedia } = require('../middlewares/upload');
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

// Create a new job
const createJob = async (req, res) => {
  const transaction = await Job.sequelize.transaction();

  try {
    const {
      title,
      company,
      logo,
      poster_image,
      apply_type,
      job_description,
      location,
      start_date,
      end_date,
      work_type,
      employment_type,
      min_salary,
      max_salary,
      salary_type,
      salary_details,
      skills,
    } = req.body;
    const employer_id = req.user.id; // Get employer ID from authenticated user

    console.log('Received skills:', skills); // Debugging

    // Ensure skills is always an array
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills
        ? JSON.parse(skills)
        : [];

    const job = await Job.create(
      {
        employer_id: employer_id,
        title,
        company,
        logo,
        poster_image,
        apply_type,
        job_description,
        location,
        start_date,
        end_date,
        work_type,
        employment_type,
        min_salary,
        max_salary,
        salary_type,
        salary_details,
      },
      { transaction }
    );

    // handle media files (multiple files supported)
    if (req.files && req.files.length > 0) {
      const jobMedia = req.files.map((file) => ({
        job_id: job.id,
        file_path: file.path,
        file_type: file.mimetype,
      }));

      await uploadJobMedia.bulkCreate(jobMedia, { transaction });
    }

    // handle job skills (auto-create skills if they don't exist)
    if (skillsArray.length > 0) {
      const skillRecords = await Promise.all(
        skillsArray.map(async (skillName) => {
          // find or create each skill
          const [skill] = await Skill.findOrCreate({
            where: { name: skillName },
            defaults: { name: skillName },
            transaction,
          });
          return skill;
        })
      );

      const jobSkills = skillRecords.map((skill) => ({
        job_id: job.id,
        skill_id: skill.id,
      }));

      await JobSkill.bulkCreate(jobSkills, { transaction }); // insert into jobskills table
    }
    await transaction.commit(); // commit transaction
    res.status(201).json({ message: 'Job created succesfully', job });
  } catch (error) {
    await transaction.rollback(); // Rollback if anything fails
    console.error('Create Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJobs,
  createJob,
};
