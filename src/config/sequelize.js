const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mvc_web_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'sqlite', // troque para 'mysql' ou 'postgres' em produção
    storage: process.env.DB_STORAGE || './data/database.sqlite', // apenas para sqlite
    logging: false,
  }
);

module.exports = sequelize;