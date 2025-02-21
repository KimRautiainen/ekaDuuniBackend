'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // -- Define associations -- //

      // A Skill belongs to many projects
      Skill.belongsToMany(models.Project, {
        through: models.ProjectSkill,
        foreignKey: 'skill_id',
        onDelete: 'CASCADE',
      });
      // A Skill belongs to many jobs
      Skill.belongsToMany(models.Job, {
        through: models.JobSkill,
        foreignKey: 'skill_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Skill.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Skill',
      tableName: 'skills',
      timestamps: true,
      underscored: true,
    }
  );

  return Skill;
};
