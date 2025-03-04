require('dotenv').config();
const { Sequelize } = require('sequelize');

const environment = process.env.NODE_ENV || 'production';
const config = require('../config/config.js')[environment];

console.log(`🛠️ Running in ${environment} mode using ${config.dialect}`);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = sequelize;
