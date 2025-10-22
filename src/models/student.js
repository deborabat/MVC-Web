const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Student extends Model {}
Student.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'Student', tableName: 'students' });

module.exports = Student;