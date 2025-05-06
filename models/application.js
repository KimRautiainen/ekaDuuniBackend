'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // An Application belongs to a User
      Application.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // An Application belongs to a Job
      Application.belongsTo(models.Job, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Application.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cover_letter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resume_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'reviewed', 'interview', 'rejected', 'accepted']],
        },
      },
      applied_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Application',
      tableName: 'Applications',
      timestamps: true,
      underscored: true,
    },
  );

  return Application;
};
