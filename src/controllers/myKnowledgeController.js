const { Knowledge, StudentKnowledge } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // show all knowledges and the current student's levels
  index: async (req, res) => {
    const studentId = req.session.studentId;
    const knowledges = await Knowledge.findAll({ order: [['name','ASC']] });

    // fetch student's existing StudentKnowledge rows
    const myLevels = await StudentKnowledge.findAll({
      where: { [Op.or]: [{ StudentId: studentId }, { studentId: studentId }] }
    });

    const mapLevels = {};
    myLevels.forEach(sk => {
      const kId = sk.KnowledgeId || sk.knowledgeId;
      mapLevels[kId] = { level: sk.level, id: sk.id };
    });

    res.render('my/knowledges/index', { knowledges, mapLevels });
  },

  // save posted levels (expects fields like level_<knowledgeId>)
  save: async (req, res) => {
    const studentId = req.session.studentId;
    const body = req.body;
    const updates = Object.keys(body).filter(k => k.startsWith('level_'));

    for (const key of updates) {
      const knowledgeId = key.split('_')[1];
      const value = body[key];
      const level = value === '' ? null : parseInt(value, 10);

      // try to find existing row (both FK naming options)
      let existing = await StudentKnowledge.findOne({
        where: {
          [Op.and]: [
            { [Op.or]: [{ StudentId: studentId }, { studentId: studentId }] },
            { [Op.or]: [{ KnowledgeId: knowledgeId }, { knowledgeId: knowledgeId }] }
          ]
        }
      });

      if ((level === null || isNaN(level))) {
        if (existing) await existing.destroy();
        continue;
      }

      if (existing) {
        await existing.update({ level });
      } else {
        await StudentKnowledge.create({
          StudentId: studentId,
          KnowledgeId: knowledgeId,
          level
        }).catch(async () => {
          // fallback with other FK names
          await StudentKnowledge.create({
            studentId: studentId,
            knowledgeId: knowledgeId,
            level
          });
        });
      }
    }

    res.redirect('/my/knowledges');
  },

  // optional: delete a single StudentKnowledge by id (ensure ownership)
  remove: async (req, res) => {
    const studentId = req.session.studentId;
    const id = req.params.id;
    const sk = await StudentKnowledge.findByPk(id);
    if (!sk) return res.redirect('/my/knowledges');
    const ownerId = sk.StudentId || sk.studentId;
    if (ownerId !== studentId) return res.status(403).send('Forbidden');
    await sk.destroy();
    res.redirect('/my/knowledges');
  }
};