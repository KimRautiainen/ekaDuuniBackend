"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE jobs
      MODIFY job_description TEXT
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE jobs
      MODIFY job_description TEXT
      CHARACTER SET utf8
      COLLATE utf8_general_ci;
    `);
  }
};
