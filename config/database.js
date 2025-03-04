const { Sequelize } = require('sequelize');

const environment = process.env.NODE_ENV || 'production';
console.log(`🛠️ Running in ${environment} mode`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT, // ✅ Uses MySQL in dev, MSSQL in prod
    dialectOptions:
      process.env.DB_DIALECT === 'mssql'
        ? {
            options: {
              encrypt: true,
              enableArithAbort: true,
            },
          }
        : {}, // ✅ Only applies MSSQL options when needed
  }
);

module.exports = sequelize;
