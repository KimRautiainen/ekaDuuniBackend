'use strict';

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
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      employment_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      min_salary: {
        type: Sequelize.INTEGER,
      },
      max_salary: {
        type: Sequelize.INTEGER,
      },
      salary_type: {
        type: Sequelize.STRING,
      },
      salary_details: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
    });

    // Add CHECK constraints (optional, but good for MSSQL safety)
    await queryInterface.sequelize.query(`
      ALTER TABLE Jobs ADD CONSTRAINT chk_apply_type
      CHECK (apply_type IN ('internal', 'external'))
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE Jobs ADD CONSTRAINT chk_work_type
      CHECK (work_type IN ('remote', 'onsite', 'hybrid'))
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE Jobs ADD CONSTRAINT chk_employment_type
      CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship'))
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE Jobs ADD CONSTRAINT chk_salary_type
      CHECK (salary_type IN ('hourly', 'monthly', 'yearly'))
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobs');
  },
};
