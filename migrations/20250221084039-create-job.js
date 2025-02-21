'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logo: {
        type: Sequelize.STRING,
      },
      poster_image: {
        type: Sequelize.STRING,
      },
      apply_type: {
        type: Sequelize.ENUM('internal', 'external'),
        allowNull: false,
      },
      job_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      work_type: {
        type: Sequelize.ENUM('remote', 'onsite', 'hybrid'),
        allowNull: false,
      },
      employment_type: {
        type: Sequelize.ENUM(
          'full_time',
          'part_time',
          'contract',
          'internship'
        ),
        allowNull: false,
      },
      min_salary: {
        type: Sequelize.INTEGER,
      },
      max_salary: {
        type: Sequelize.INTEGER,
      },
      salary_type: {
        type: Sequelize.ENUM('hourly', 'monthly', 'yearly'),
      },
      salary_details: {
        type: Sequelize.TEXT,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Jobs_apply_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Jobs_work_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Jobs_employment_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Jobs_salary_type";'
    );
    await queryInterface.dropTable('Jobs');
  },
};
