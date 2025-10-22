const sequelize = require('../config/sequelize');
const Student = require('./student');
const Project = require('./project');
const Keyword = require('./keyword');
const Knowledge = require('./knowledge');
const StudentKnowledge = require('./studentKnowledge');

// join tables names explicit
const ProjectStudent = sequelize.define('ProjectStudent', {}, { tableName: 'project_students', timestamps: false });
const ProjectKeyword = sequelize.define('ProjectKeyword', {}, { tableName: 'project_keywords', timestamps: false });

// Associations
Student.belongsToMany(Project, { through: ProjectStudent, as: 'projects' });
Project.belongsToMany(Student, { through: ProjectStudent, as: 'students' });

Project.belongsToMany(Keyword, { through: ProjectKeyword, as: 'keywords' });
Keyword.belongsToMany(Project, { through: ProjectKeyword, as: 'projects' });

Student.belongsToMany(Knowledge, { through: StudentKnowledge, as: 'knowledges' });
Knowledge.belongsToMany(Student, { through: StudentKnowledge, as: 'students' });

module.exports = {
  sequelize,
  Student,
  Project,
  Keyword,
  Knowledge,
  StudentKnowledge,
  ProjectStudent,
  ProjectKeyword
};