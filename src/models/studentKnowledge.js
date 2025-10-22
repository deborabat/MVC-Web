const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class StudentKnowledge extends Model {}
StudentKnowledge.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  StudentId: { type: DataTypes.INTEGER, allowNull: false },
  KnowledgeId: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, max: 10 } }
}, {
  sequelize,
  modelName: 'StudentKnowledge',
  tableName: 'student_knowledges',
  timestamps: false
});

module.exports = StudentKnowledge;