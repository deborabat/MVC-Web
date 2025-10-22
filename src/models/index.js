const sequelize = require('../config/sequelize');
const Student = require('./student');
const Project = require('./project');
const Keyword = require('./keyword');
const Knowledge = require('./knowledge');
const StudentKnowledge = require('./studentKnowledge');

// join tables explicit
const ProjectStudent = sequelize.define('ProjectStudent', {}, { tableName: 'project_students', timestamps: false });
const ProjectKeyword = sequelize.define('ProjectKeyword', {}, { tableName: 'project_keywords', timestamps: false });

// Associations with explicit foreign keys
Student.belongsToMany(Project, { through: ProjectStudent, as: 'projects', foreignKey: 'StudentId', otherKey: 'ProjectId' });
Project.belongsToMany(Student, { through: ProjectStudent, as: 'students', foreignKey: 'ProjectId', otherKey: 'StudentId' });

Project.belongsToMany(Keyword, { through: ProjectKeyword, as: 'keywords', foreignKey: 'ProjectId', otherKey: 'KeywordId' });
Keyword.belongsToMany(Project, { through: ProjectKeyword, as: 'projects', foreignKey: 'KeywordId', otherKey: 'ProjectId' });

Student.belongsToMany(Knowledge, { through: StudentKnowledge, as: 'knowledges', foreignKey: 'StudentId', otherKey: 'KnowledgeId' });
Knowledge.belongsToMany(Student, { through: StudentKnowledge, as: 'students', foreignKey: 'KnowledgeId', otherKey: 'StudentId' });

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