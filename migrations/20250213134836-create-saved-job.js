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
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'jobs', key: 'id' },
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

    // Add Unique Constraint
    await queryInterface.addConstraint('SavedJobs', {
      fields: ['user_id', 'job_id'],
      type: 'unique',
      name: 'unique_saved_job_per_user',
    });
  },

  async down(queryInterface, Sequelize) {
    // ✅ Use the actual constraint names from your database
    await queryInterface
      .removeConstraint('SavedJobs', 'savedjobs_ibfk_1')
      .catch(() =>
        console.log(
          'Foreign Key Constraint savedjobs_ibfk_1 not found, skipping'
        )
      );

    await queryInterface
      .removeConstraint('SavedJobs', 'savedjobs_ibfk_2')
      .catch(() =>
        console.log(
          'Foreign Key Constraint savedjobs_ibfk_2 not found, skipping'
        )
      );

    await queryInterface
      .removeConstraint('SavedJobs', 'unique_saved_job_per_user')
      .catch(() =>
        console.log(
          'Unique Constraint unique_saved_job_per_user not found, skipping'
        )
      );

    // ✅ Drop Table
    await queryInterface.dropTable('SavedJobs');
  },
};
