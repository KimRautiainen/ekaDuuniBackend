'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'mysql') {
      // MySQL: switch to utf8mb4
      await queryInterface.sequelize.query(`
        ALTER TABLE profiles
        MODIFY bio TEXT
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;
      `);
    } else if (dialect === 'mssql') {
      // MSSQL: ensure it's NVARCHAR(MAX) (TEXT in Sequelize maps here)
      await queryInterface.changeColumn('Profiles', 'bio', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === 'mysql') {
      // revert MySQL back to utf8
      await queryInterface.sequelize.query(`
        ALTER TABLE profiles
        MODIFY bio TEXT
        CHARACTER SET utf8
        COLLATE utf8_general_ci;
      `);
    } else if (dialect === 'mssql') {
      // MSSQL: no-op or you could explicitly changeColumn if you had a narrower type before
    }
  },
};
