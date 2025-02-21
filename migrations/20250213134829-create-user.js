'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      oauthProvider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      oauthProviderId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('junior_dev', 'employer'),
        allowNull: false,
        defaultValue: 'junior_dev',
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
    // ✅ Check if the column exists before trying to drop it
    await queryInterface
      .describeTable('Users')
      .then(async (tableDefinition) => {
        if (tableDefinition.role) {
          await queryInterface
            .removeColumn('Users', 'role')
            .catch(() => console.log("Column 'role' not found, skipping"));
        }
      });

    await queryInterface
      .dropTable('Users')
      .catch(() => console.log("Table 'Users' not found, skipping"));
  },
};
