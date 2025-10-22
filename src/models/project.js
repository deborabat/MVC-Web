const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Project extends Model {}
Project.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  summary: { type: DataTypes.TEXT, allowNull: false },
  externalLink: { type: DataTypes.STRING, allowNull: true }
}, { sequelize, modelName: 'Project', tableName: 'projects' });

module.exports = Project;