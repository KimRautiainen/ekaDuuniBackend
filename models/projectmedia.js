'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // -- Define associations -- //

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
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProjectMedia',
      tableName: 'projectmedia',
      timestamps: true,
      underscored: false,
    }
  );

  return ProjectMedia;
};
