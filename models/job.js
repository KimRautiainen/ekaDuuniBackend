'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      // A Job belongs to an Employer (User)
      Job.belongsTo(models.User, {
        foreignKey: 'employer_id',
        onDelete: 'CASCADE',
      });

      // A Job has many Applications
      Job.hasMany(models.Application, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });

      // A Job has many SavedJobs
      Job.hasMany(models.SavedJob, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });

      // A Job belongs to many Skills (Many-to-Many)
      Job.belongsToMany(models.Skill, {
        through: models.JobSkill,
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Job.init(
    {
      employer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      poster_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      apply_type: {
        type: DataTypes.ENUM('internal', 'external'),
        allowNull: false,
      },
      job_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      work_type: {
        type: DataTypes.ENUM('remote', 'onsite', 'hybrid'),
        allowNull: false,
      },
      employment_type: {
        type: DataTypes.ENUM(
          'full_time',
          'part_time',
          'contract',
          'internship'
        ),
        allowNull: false,
      },
      min_salary: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      max_salary: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      salary_type: {
        type: DataTypes.ENUM('hourly', 'monthly', 'yearly'),
        allowNull: true,
      },
      salary_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Job',
      tableName: 'jobs',
      timestamps: true,
      underscored: true,
    }
  );

  return Job;
};
