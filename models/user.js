'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User has one Profile
      User.hasOne(models.Profile, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A User has many Education records
      User.hasMany(models.Education, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A User has many Work Experience records
      User.hasMany(models.WorkExperience, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A User (Employer) has many Jobs
      User.hasMany(models.Job, {
        foreignKey: 'employer_id',
        onDelete: 'CASCADE',
      });

      // A User has many Applications
      User.hasMany(models.Application, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A User has many Saved Jobs
      User.hasMany(models.SavedJob, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A User has many Projects
      User.hasMany(models.Project, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A User has many Notifications
      User.hasMany(models.Notification, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oauthProvider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oauthProviderId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'junior_dev',
        validate: {
          isIn: [['junior_dev', 'employer']],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: false,
    }
  );

  return User;
};
