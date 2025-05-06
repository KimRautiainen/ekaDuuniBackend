'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobSkills', {
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Jobs', key: 'id' },
        onDelete: 'CASCADE',
      },
      skill_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Skills', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('SYSUTCDATETIME()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('SYSUTCDATETIME()'),
      },
    });

    // Add a composite primary key to prevent duplicate job-skill entries
    await queryInterface.addConstraint('JobSkills', {
      fields: ['job_id', 'skill_id'],
      type: 'primary key',
      name: 'pk_job_skills',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JobSkills');
  },
};
