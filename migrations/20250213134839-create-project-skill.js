'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProjectSkills', {
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      skill_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'skills', key: 'id' },
        onDelete: 'CASCADE',
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

    // Add a composite primary key to prevent duplicates
    await queryInterface.addConstraint('ProjectSkills', {
      fields: ['project_id', 'skill_id'],
      type: 'primary key',
      name: 'pk_project_skills',
    });
},

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProjectSkills');
  },
};
