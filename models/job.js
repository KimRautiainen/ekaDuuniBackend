'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, {
        foreignKey: 'employer_id',
        onDelete: 'CASCADE',
      });

      Job.hasMany(models.Application, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });

      Job.hasMany(models.SavedJob, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });

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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['internal', 'external']],
        },
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['remote', 'onsite', 'hybrid']],
        },
      },
      employment_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['full_time', 'part_time', 'contract', 'internship']],
        },
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
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: [['hourly', 'monthly', 'yearly']],
        },
      },
      salary_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Job',
      tableName: 'Jobs',
      timestamps: true,
    }
  );

  return Job;
};
