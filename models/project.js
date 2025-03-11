'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Project belongs to a User
      Project.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A Project has many Media
      Project.hasMany(models.ProjectMedia, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
      });

      // A Project belongs to many Skills (Many-to-Many)
      Project.belongsToMany(models.Skill, {
        through: models.ProjectSkill,
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Project.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      github_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      live_demo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      timestamps: true,
      underscored: false,
    }
  );

  return Project;
};
