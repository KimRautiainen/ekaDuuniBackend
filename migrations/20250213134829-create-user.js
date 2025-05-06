'use strict';

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
        allowNull: true,
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
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'junior_dev',
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

    // ✅ Add constraint to restrict values
    await queryInterface.sequelize.query(`
      ALTER TABLE Users ADD CONSTRAINT chk_user_role
      CHECK (role IN ('junior_dev', 'employer'))
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
