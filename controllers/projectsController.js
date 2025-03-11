const {
  Project,
  ProjectMedia,
  ProjectSkill,
  Skill,
  User,
} = require('../models');
const { Sequelize } = require('sequelize');

// GET LOGGED-IN USER'S PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.user.id },
      attributes: [
        'id',
        'user_id',
        'name',
        'description',
        'github_link',
        'live_demo',
        'start_date',
        'end_date',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: ProjectMedia,
          attributes: ['id', 'media_url', 'media_type'],
        },
        {
          model: Skill,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']], // ✅ Use camelCase
    });

    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found' });
    }

    res.json({ projects });
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET PROJECTS BY USER ID
const getProjectById = async (req, res) => {
  try {
    // Find user by ID and include projects with media and skills
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Project,
        include: [
          { model: ProjectMedia, attributes: ['media_url', 'media_type'] },
          { model: Skill, through: { attributes: [] }, attributes: ['name'] },
        ],
      },
    });

    if (!user || user.Projects.length === 0) {
      return res
        .status(404)
        .json({ message: 'No projects found for this user' });
    }

    res.status(200).json({
      user: { id: user.id, name: user.full_name },
      projects: user.Projects,
    });
  } catch (error) {
    console.error('Get Project Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Create a new project
const createProject = async (req, res) => {
  const transaction = await Project.sequelize.transaction(); // Start Transaction

  try {
    const {
      name,
      description,
      github_link,
      live_demo,
      start_date,
      end_date,
      skills,
    } = req.body; // Extract fields from request body
    const userId = req.user.id; // Get logged-in user ID

    console.log('Received skills:', skills); // Debugging

    // Ensure skills is always an array
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills
        ? JSON.parse(skills)
        : [];

    // Create new project
    const project = await Project.create(
      {
        user_id: userId,
        name,
        description,
        github_link,
        live_demo,
        start_date,
        end_date,
      },
      { transaction }
    );

    // Handle project media (Multiple files supported)
    if (req.files && req.files.length > 0) {
      const mediaRecords = req.files.map((file) => ({
        project_id: project.id,
        media_url: file.filename,
        media_type: file.mimetype.startsWith('image') ? 'image' : 'video',
      }));

      await ProjectMedia.bulkCreate(mediaRecords, { transaction });
    }

    // Handle project skills (Auto-create skills if they don't exist)
    if (skillsArray.length > 0) {
      const skillRecords = await Promise.all(
        skillsArray.map(async (skillName) => {
          // Find or create each skill
          const [skill] = await Skill.findOrCreate({
            where: { name: skillName },
            defaults: { name: skillName },
            transaction,
          });
          return skill;
        })
      );

      // Insert into ProjectSkill table
      const projectSkills = skillRecords.map((skill) => ({
        project_id: project.id,
        skill_id: skill.id,
      }));

      await ProjectSkill.bulkCreate(projectSkills, { transaction }); // Insert records
    }

    await transaction.commit(); // Commit Transaction
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    await transaction.rollback(); // Rollback if anything fails
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 UPDATE A PROJECT
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    // Find the project
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: 'Project not found or unauthorized' });
    }

    // Extract fields from request body
    const { name, description, github_link, live_demo, start_date, end_date } =
      req.body;

    // If a new media file is uploaded, update the media
    if (req.file) {
      const projectMedia = await ProjectMedia.findOne({
        where: { project_id: projectId },
      });

      if (projectMedia) {
        // Update existing media
        await projectMedia.update({ media_url: req.file.filename });
      } else {
        // Create new media entry
        await ProjectMedia.create({
          project_id: projectId,
          media_url: req.file.filename,
          media_type: 'image', // Assuming it's an image, change logic accordingly
        });
      }
    }

    // Update project fields
    await project.update({
      name,
      description,
      github_link,
      live_demo,
      start_date,
      end_date,
    });

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 DELETE A PROJECT
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    // Find the project
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: 'Project not found or unauthorized' });
    }

    // Delete project and its associations
    await project.destroy();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
