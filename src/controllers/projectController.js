const { Project, Student, Keyword } = require('../models');

module.exports = {
  index: async (req, res) => {
    const projects = await Project.findAll({
      include: [{ model: Student, as: 'students' }, { model: Keyword, as: 'keywords' }]
    });
    res.render('projects/index', { projects, userId: req.session.studentId });
  },

  newForm: async (req, res) => {
    const students = await Student.findAll();
    const keywords = await Keyword.findAll();
    res.render('projects/new', { students, keywords });
  },

  create: async (req, res) => {
    const { name, summary, externalLink, keywordIds = [], studentIds = [] } = req.body;
    const project = await Project.create({ name, summary, externalLink });
    // attach keywords and students
    if (Array.isArray(keywordIds) && keywordIds.length) await project.setKeywords(keywordIds);
    // ensure creator is included
    const devs = Array.from(new Set([String(req.session.studentId), ...(Array.isArray(studentIds) ? studentIds : [])]));
    await project.setStudents(devs);
    res.redirect('/projects');
  },

  editForm: async (req, res) => {
    const project = await Project.findByPk(req.params.id, { include: [{ model: Student, as: 'students' }, { model: Keyword, as: 'keywords' }] });
    if (!project) return res.status(404).send('Not found');
    const students = await Student.findAll();
    const keywords = await Keyword.findAll();
    res.render('projects/edit', { project, students, keywords });
  },

  update: async (req, res) => {
    const { name, summary, externalLink, keywordIds = [], studentIds = [] } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not found');
    await project.update({ name, summary, externalLink });
    await project.setKeywords(Array.isArray(keywordIds) ? keywordIds : [keywordIds].filter(Boolean));
    const devs = Array.from(new Set([String(req.session.studentId), ...(Array.isArray(studentIds) ? studentIds : [studentIds].filter(Boolean))]));
    await project.setStudents(devs);
    res.redirect('/projects');
  },

  destroy: async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not found');
    await project.destroy();
    res.redirect('/projects');
  }
};