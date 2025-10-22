const { Project, Student, Keyword, Knowledge, StudentKnowledge, sequelize } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // protected list (with actions) - agora aceita ?keywordId=...
  index: async (req, res) => {
    const keywordId = req.query.keywordId || null;
    const keywords = await Keyword.findAll({ order: [['name','ASC']] });

    const include = [{ model: Student, as: 'students' }, { model: Keyword, as: 'keywords' }];
    if (keywordId) {
      // filtra projetos que tenham a keyword selecionada
      include[1] = { model: Keyword, as: 'keywords', where: { id: keywordId } };
    }

    const projects = await Project.findAll({ include });
    res.render('projects/index', { projects, userId: req.session.studentId, keywords, selectedKeyword: keywordId });
  },

  // public list - também aceita ?keywordId=...
  publicIndex: async (req, res) => {
    const keywordId = req.query.keywordId || null;
    const keywords = await Keyword.findAll({ order: [['name','ASC']] });

    const include = [{ model: Student, as: 'students' }, { model: Keyword, as: 'keywords' }];
    if (keywordId) {
      include[1] = { model: Keyword, as: 'keywords', where: { id: keywordId } };
    }

    const projects = await Project.findAll({ include });
    res.render('public/projects/index', { projects, filterKeyword: null, keywords, selectedKeyword: keywordId });
  },

  // public by keyword
  publicByKeyword: async (req, res) => {
    const keywordId = req.params.keywordId;
    const keyword = await Keyword.findByPk(keywordId);
    if (!keyword) return res.status(404).send('Keyword not found');

    const projects = await Project.findAll({
      include: [
        { model: Student, as: 'students' },
        { model: Keyword, as: 'keywords', where: { id: keywordId } }
      ]
    });

    res.render('public/projects/index', { projects, filterKeyword: keyword.name });
  },

  // knowledge report (public)
  knowledgeReport: async (req, res) => {
    const CUT_OFF = 7;
    const totalStudents = await Student.count();
    const knowledges = await Knowledge.findAll({ order: [['name','ASC']] });

    const rows = await Promise.all(knowledges.map(async (k) => {
      const count = await StudentKnowledge.count({
        where: {
          [Op.or]: [{ KnowledgeId: k.id }, { knowledgeId: k.id }],
          level: { [Op.gte]: CUT_OFF }
        }
      });
      const proportion = totalStudents === 0 ? 0 : (count / totalStudents);
      return { id: k.id, name: k.name, count, proportion };
    }));

    res.render('public/knowledgeReport', { rows, totalStudents, cutOff: CUT_OFF });
  },

  // show new project form
  newForm: async (req, res) => {
    const students = await Student.findAll({ order: [['name','ASC']] });
    const keywords = await Keyword.findAll({ order: [['name','ASC']] });
    res.render('projects/new', { students, keywords });
  },

  // create project (creator always included as developer)
  create: async (req, res) => {
    const { name, summary, externalLink } = req.body;
    let keywordIds = req.body.keywordIds || [];
    let studentIds = req.body.studentIds || [];

    if (!Array.isArray(keywordIds)) keywordIds = keywordIds ? [keywordIds] : [];
    if (!Array.isArray(studentIds)) studentIds = studentIds ? [studentIds] : [];

    const project = await Project.create({ name, summary, externalLink });

    if (keywordIds.length) await project.setKeywords(keywordIds);
    // ensure creator is included
    const devs = Array.from(new Set([String(req.session.studentId), ...studentIds.map(String)]));
    await project.setStudents(devs);

    res.redirect('/projects');
  },

  // edit form (only reachable if middleware allowed)
  editForm: async (req, res) => {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Student, as: 'students' }, { model: Keyword, as: 'keywords' }]
    });
    if (!project) return res.status(404).send('Not found');
    const students = await Student.findAll({ order: [['name','ASC']] });
    const keywords = await Keyword.findAll({ order: [['name','ASC']] });
    res.render('projects/edit', { project, students, keywords });
  },

  // update project
  update: async (req, res) => {
    const { name, summary, externalLink } = req.body;
    let keywordIds = req.body.keywordIds || [];
    let studentIds = req.body.studentIds || [];

    if (!Array.isArray(keywordIds)) keywordIds = keywordIds ? [keywordIds] : [];
    if (!Array.isArray(studentIds)) studentIds = studentIds ? [studentIds] : [];

    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not found');

    await project.update({ name, summary, externalLink });
    await project.setKeywords(keywordIds);
    // ensure current user remains developer
    const devs = Array.from(new Set([String(req.session.studentId), ...studentIds.map(String)]));
    await project.setStudents(devs);

    res.redirect('/projects');
  },

  // delete project
  destroy: async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not found');
    await project.destroy();
    res.redirect('/projects');
  }
};