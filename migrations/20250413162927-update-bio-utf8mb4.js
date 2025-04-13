"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modify the `bio` column to use utf8mb4
    await queryInterface.sequelize.query(`
      ALTER TABLE profiles
      MODIFY bio TEXT
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback to default utf8 if needed (you can adjust as needed)
    await queryInterface.sequelize.query(`
      ALTER TABLE profiles
      MODIFY bio TEXT
      CHARACTER SET utf8
      COLLATE utf8_general_ci
    `);
  },
};