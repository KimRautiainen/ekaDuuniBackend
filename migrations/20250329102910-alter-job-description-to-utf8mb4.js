'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'mysql') {
      // MySQL / MariaDB only
      await queryInterface.sequelize.query(`
        ALTER TABLE jobs
          MODIFY job_description TEXT
          CHARACTER SET utf8mb4
          COLLATE utf8mb4_unicode_ci;
      `);
    }
    // else on mssql we do nothing (or you could do a T-SQL ALTER COLUMN here)
  },

  down: async (queryInterface, Sequelize) => {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'mysql') {
      await queryInterface.sequelize.query(`
        ALTER TABLE jobs
          MODIFY job_description TEXT
          CHARACTER SET utf8
          COLLATE utf8_general_ci;
      `);
    }
  }
};
