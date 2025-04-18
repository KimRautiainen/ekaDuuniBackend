const path = require('path');
const fs = require('fs');
const { uploadJobMedia } = require('../middlewares/upload');
const { Job, JobSkill, Skill, Application } = require('../models');
const { Sequelize } = require('sequelize');
const { getImageUrl } = require('../utils/imageHelper');
const createDOMPurify = require('isomorphic-dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
      order: [['createdAt', 'DESC']],
    });

    if (!jobs.length) {
      return res.status(404).json({ message: 'No jobs found' });
    }

    const updatedJobs = jobs.map((job) => ({
      ...job.toJSON(),
      poster_image: getImageUrl(req, 'jobs', job.poster_image),
      logo: getImageUrl(req, 'jobs', job.logo),
    }));

    res.json({ jobs: updatedJobs });
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
    // ✅ Sanitize job_description before saving
    const sanitizedDescription = DOMPurify.sanitize(job_description, {
      ALLOWED_TAGS: [
        'b',
        'i',
        'u',
        'strong',
        'em',
        'p',
        'ul',
        'ol',
        'li',
        'a',
        'h1',
        'h2',
        'h3',
        'br',
        'hr',
        'blockquote',
      ],
      ALLOWED_ATTR: ['href', 'target'],
    });

    console.log('Received skills:', skills); // Debugging

    // Ensure skills is always an array
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills
        ? JSON.parse(skills)
        : [];

    console.log('Raw HTML:', job_description);
    console.log('Sanitized HTML:', sanitizedDescription);

    const job = await Job.create(
      {
        employer_id: employer_id,
        title,
        company,
        apply_type,
        job_description: sanitizedDescription,
        location,
        start_date,
        end_date,
        work_type,
        employment_type,
        min_salary,
        max_salary,
        salary_type,
        salary_details,
        poster_image: req.files?.poster_image
          ? req.files.poster_image[0].filename
          : null,
        logo: req.files?.logo ? req.files.logo[0].filename : null,
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
    res
      .status(201)
      .json({ message: 'Job created succesfully', job, skills: skillsArray });
  } catch (error) {
    await transaction.rollback(); // Rollback if anything fails
    console.error('Create Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update a job
const updateJob = async (req, res) => {
  const transaction = await Job.sequelize.transaction();

  try {
    const job = await Job.findByPk(req.params.id, { transaction });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const {
      title,
      company,
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

    // ✅ Sanitize job_description
    const sanitizedDescription = DOMPurify.sanitize(job_description, {
      ALLOWED_TAGS: [
        'b',
        'i',
        'u',
        'strong',
        'em',
        'p',
        'ul',
        'ol',
        'li',
        'a',
        'h1',
        'h2',
        'h3',
        'br',
        'hr',
        'blockquote',
      ],
      ALLOWED_ATTR: ['href', 'target'],
    });

    let skillsArray = [];
    if (typeof skills === 'string') {
      try {
        skillsArray = JSON.parse(skills);
        if (!Array.isArray(skillsArray)) {
          skillsArray = [];
        }
      } catch (error) {
        console.error('Invalid skills format:', error);
        skillsArray = [];
      }
    }

    console.log('Raw HTML:', job_description);
    console.log('Sanitized HTML:', sanitizedDescription);

    const updatedJobData = {
      title,
      company,
      apply_type,
      job_description: sanitizedDescription,
      location,
      start_date,
      end_date,
      work_type,
      employment_type,
      min_salary,
      max_salary,
      salary_type,
      salary_details,
    };

    if (req.files) {
      if (req.files.poster_image) {
        updatedJobData.poster_image = req.files.poster_image[0].filename;
      }
      if (req.files.logo) {
        updatedJobData.logo = req.files.logo[0].filename;
      }
    }

    await job.update(updatedJobData, { transaction });

    if (skillsArray.length > 0) {
      const skillRecords = await Promise.all(
        skillsArray.map(async (skillName) => {
          const [skill] = await Skill.findOrCreate({
            where: { name: skillName },
            defaults: { name: skillName },
            transaction,
          });
          return skill;
        })
      );

      await job.setSkills(skillRecords, { transaction });
    }

    await transaction.commit();
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    await transaction.rollback();
    console.error('Update Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
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
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      ...job.toJSON(),
      poster_image: getImageUrl(req, 'jobs', job.poster_image),
      logo: getImageUrl(req, 'jobs', job.logo),
    });
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete a job and its media files
const deleteJob = async (req, res) => {
  const transaction = await Job.sequelize.transaction();

  try {
    const job = await Job.findByPk(req.params.id, { transaction });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Delete associated media files
    const mediaFiles = [job.poster_image, job.logo].filter(Boolean);
    mediaFiles.forEach((file) => {
      const filePath = path.join(__dirname, '../uploads/jobs/', file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await job.destroy({ transaction });
    await transaction.commit();

    res.json({ message: 'Job and associated files deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJobsByEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;
    if (!employerId) {
      return res.status(400).json({ message: 'Employer ID is required' });
    }

    const jobs = await Job.findAll({
      where: { employer_id: employerId },
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
          through: { attributes: [] },
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!jobs.length) {
      return res
        .status(404)
        .json({ message: 'No jobs found for this employer' });
    }

    const updatedJobs = jobs.map((job) => ({
      ...job.toJSON(),
      poster_image: getImageUrl(req, 'jobs', job.poster_image),
      logo: getImageUrl(req, 'jobs', job.logo),
    }));

    res.json({ jobs: updatedJobs });
  } catch (error) {
    console.error('Get Jobs By Employer Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchJobs = async (req, res) => {
  try {
    const {
      title,
      location,
      work_type,
      employment_type,
      min_salary,
      max_salary,
      skills,
    } = req.query;

    const whereConditions = {};

    if (title) whereConditions.title = { [Sequelize.Op.like]: `%${title}%` };
    if (location)
      whereConditions.location = { [Sequelize.Op.like]: `%${location}%` };
    if (work_type) whereConditions.work_type = work_type;
    if (employment_type) whereConditions.employment_type = employment_type;
    if (min_salary)
      whereConditions.min_salary = { [Sequelize.Op.gte]: Number(min_salary) };
    if (max_salary)
      whereConditions.max_salary = { [Sequelize.Op.lte]: Number(max_salary) };

    console.log('Search Conditions:', whereConditions);

    const skillConditions = skills
      ? skills.split(',').map((skill) => ({
          name: { [Sequelize.Op.like]: `%${skill.trim()}%` },
        }))
      : [];

    const jobs = await Job.findAll({
      where: whereConditions,
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
          through: { attributes: [] },
          attributes: ['name'],
          where:
            skillConditions.length > 0
              ? { [Sequelize.Op.or]: skillConditions }
              : undefined,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!jobs.length) {
      console.log('No jobs found matching:', whereConditions);
      return res
        .status(404)
        .json({ message: 'No jobs found matching criteria' });
    }

    const updatedJobs = jobs.map((job) => ({
      ...job.toJSON(),
      poster_image: getImageUrl(req, 'jobs', job.poster_image),
      logo: getImageUrl(req, 'jobs', job.logo),
    }));

    res.json({ jobs: updatedJobs });
  } catch (error) {
    console.error('Search Jobs Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  getJobById,
  deleteJob,
  getJobsByEmployer,
  searchJobs,
};
