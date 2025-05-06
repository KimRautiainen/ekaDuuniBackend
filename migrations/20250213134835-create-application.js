'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Applications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
          onDelete: 'CASCADE',
        },
        job_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Jobs', key: 'id' },
          onDelete: 'CASCADE',
        },
        cover_letter: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        resume_link: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'pending',
        },
        applied_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('GETDATE()'),
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('GETDATE()'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('GETDATE()'),
        },
      });
    } catch (err) {
      console.error('❌ Migration failed:', err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Applications');
  },
};
