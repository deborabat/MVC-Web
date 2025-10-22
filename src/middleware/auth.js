const { Project, Student } = require('../models');

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.studentId) return next();
    return res.redirect('/login');
  },

  ensureProjectDeveloper: async (req, res, next) => {
    try {
      const projectId = req.params.id || req.body.id;
      if (!projectId) return res.status(400).send('project id required');
      const project = await Project.findByPk(projectId, { include: [{ model: Student, as: 'students' }] });
      if (!project) return res.status(404).send('Project not found');
      const isDev = project.students.some(s => s.id === req.session.studentId);
      if (!isDev) return res.status(403).send('Forbidden');
      req.project = project;
      return next();
    } catch (err) {
      console.error('ensureProjectDeveloper error', err);
      return res.status(500).send('Internal error');
    }
  }
};