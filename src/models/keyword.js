const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Keyword extends Model {}
Keyword.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { sequelize, modelName: 'Keyword', tableName: 'keywords', timestamps: false });

module.exports = Keyword;