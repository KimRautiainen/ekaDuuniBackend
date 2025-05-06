'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProjectMedia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media_type: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // ✅ Optional: Add a CHECK constraint to enforce allowed values
    await queryInterface.sequelize.query(`
      ALTER TABLE ProjectMedia ADD CONSTRAINT chk_media_type
      CHECK (media_type IN ('image', 'video'))
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProjectMedia');
  },
};
