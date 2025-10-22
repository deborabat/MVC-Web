const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Knowledge extends Model {}
Knowledge.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { sequelize, modelName: 'Knowledge', tableName: 'knowledges', timestamps: false });

module.exports = Knowledge;