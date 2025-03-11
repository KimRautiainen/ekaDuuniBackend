'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // -- Define associations -- //

      // A ProjectSkill belongs to a Project
      ProjectSkill.belongsTo(models.Project, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
      });
      // A ProjectSkill belongs to a Skill
      ProjectSkill.belongsTo(models.Skill, {
        foreignKey: 'skill_id',
        onDelete: 'CASCADE',
      });
    }
  }
  ProjectSkill.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'ProjectSkill',
      tableName: 'projectskills',
      timestamps: true,
      underscored: false,
    }
  );

  return ProjectSkill;
};
