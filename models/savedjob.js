'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // -- Define associations -- //

      // A SavedJob belongs to a User
      SavedJob.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      // A SavedJob belongs to a Job
      SavedJob.belongsTo(models.Job, {
        foreignKey: 'job_id',
        onDelete: 'CASCADE',
      });
    }
  }

  SavedJob.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SavedJob',
      tableName: 'saved_jobs',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'job_id'],
        },
      ],
    }
  );

  return SavedJob;
};
