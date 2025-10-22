const { Student, Keyword, Knowledge } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  // Students
  studentsIndex: async (req, res) => {
    const students = await Student.findAll({
      attributes: ["id", "name", "email", "isAdmin"],
    });
    res.render("admin/students/index", { students });
  },
  studentsNewForm: (req, res) => res.render("admin/students/new"),
  studentsCreate: async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await Student.create({ name, email, passwordHash, isAdmin: !!isAdmin });
    res.redirect("/admin/students");
  },
  studentsEditForm: async (req, res) => {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.redirect("/admin/students");
    res.render("admin/students/edit", { student });
  },
  studentsUpdate: async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.redirect("/admin/students");
    const data = { name, email, isAdmin: !!isAdmin };
    if (password && password.trim())
      data.passwordHash = await bcrypt.hash(password, 10);
    await student.update(data);
    res.redirect("/admin/students");
  },
  studentsDelete: async (req, res) => {
    await Student.destroy({ where: { id: req.params.id } });
    res.redirect("/admin/students");
  },

  // Keywords
  keywordsIndex: async (req, res) => {
    const keywords = await Keyword.findAll();
    res.render("admin/keywords/index", { keywords });
  },
  keywordsNewForm: (req, res) => res.render("admin/keywords/new"),
  keywordsCreate: async (req, res) => {
    const { name } = req.body;
    await Keyword.create({ name });
    res.redirect("/admin/keywords");
  },
  keywordsEditForm: async (req, res) => {
    const keyword = await Keyword.findByPk(req.params.id);
    if (!keyword) return res.redirect("/admin/keywords");
    res.render("admin/keywords/edit", { keyword });
  },
  keywordsUpdate: async (req, res) => {
    const { name } = req.body;
    const keyword = await Keyword.findByPk(req.params.id);
    if (keyword) await keyword.update({ name });
    res.redirect("/admin/keywords");
  },
  keywordsDelete: async (req, res) => {
    await Keyword.destroy({ where: { id: req.params.id } });
    res.redirect("/admin/keywords");
  },

  // Knowledges
  knowledgesIndex: async (req, res) => {
    const knowledges = await Knowledge.findAll();
    res.render("admin/knowledges/index", { knowledges });
  },
  knowledgesNewForm: (req, res) => res.render("admin/knowledges/new"),
  knowledgesCreate: async (req, res) => {
    const { name } = req.body;
    await Knowledge.create({ name });
    res.redirect("/admin/knowledges");
  },
  knowledgesEditForm: async (req, res) => {
    const knowledge = await Knowledge.findByPk(req.params.id);
    if (!knowledge) return res.redirect("/admin/knowledges");
    res.render("admin/knowledges/edit", { knowledge });
  },
  knowledgesUpdate: async (req, res) => {
    const { name } = req.body;
    const knowledge = await Knowledge.findByPk(req.params.id);
    if (knowledge) await knowledge.update({ name });
    res.redirect("/admin/knowledges");
  },
  knowledgesDelete: async (req, res) => {
    await Knowledge.destroy({ where: { id: req.params.id } });
    res.redirect("/admin/knowledges");
  },
};
