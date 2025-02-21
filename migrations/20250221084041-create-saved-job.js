'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SavedJobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Jobs', key: 'id' },
        onDelete: 'CASCADE',
      },
      saved_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    //  Add a unique constraint to prevent duplicate saved jobs
    await queryInterface.addConstraint('SavedJobs', {
      fields: ['user_id', 'job_id'],
      type: 'unique',
      name: 'unique_saved_job_per_user', // Constraint name
    });
  },

  async down(queryInterface, Sequelize) {
    //  First remove the unique constraint before dropping the table
    await queryInterface.removeConstraint(
      'SavedJobs',
      'unique_saved_job_per_user'
    );
    await queryInterface.dropTable('SavedJobs');
  },
};
