const { Sequelize } = require('sequelize');
const { MsSqlDialect } = require('@sequelize/mssql');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: MsSqlDialect,
    dialectOptions: {
      options: {
        encrypt: true,
        enableArithAbort: true,
      },
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Yhteys tietokantaan onnistui.');
  } catch (error) {
    console.error('Yhteyden muodostaminen epäonnistui:', error);
  }
}

testConnection();

module.exports = sequelize;
