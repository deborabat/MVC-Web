const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class StudentKnowledge extends Model {}
StudentKnowledge.init({
  level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, max: 10 } }
}, { sequelize, modelName: 'StudentKnowledge', tableName: 'student_knowledges', timestamps: false });

module.exports = StudentKnowledge;