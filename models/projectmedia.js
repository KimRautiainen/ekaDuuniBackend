'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectMedia extends Model {
    static associate(models) {
      // A ProjectMedia belongs to a Project
      ProjectMedia.belongsTo(models.Project, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
      });
    }
  }

  ProjectMedia.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['image', 'video']],
        },
      },
    },
    {
      sequelize,
      modelName: 'ProjectMedia',
      tableName: 'Projectmedia',
      timestamps: true,
      underscored: false,
    }
  );

  return ProjectMedia;
};
