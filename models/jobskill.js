'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Jobskill belongs to job
      JobSkill.belongsTo(models.Job, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });
      // Jobskill belongs to skill
      JobSkill.belongsTo(models.Skill, {
        foreignKey: 'skill_id',
        onDelete: 'CASCADE',
      });
    }
  }

  JobSkill.init(
    {
      job_id: {
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
      modelName: 'JobSkill',
      tableName: 'job_skills',
      timestamps: false,
      underscored: true,
    }
  );

  return JobSkill;
};
