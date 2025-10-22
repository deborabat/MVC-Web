const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Student } = require('../models');

router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ where: { email } });
  if (!student) return res.render('auth/login', { error: 'Credenciais inválidas' });
  const match = await bcrypt.compare(password, student.passwordHash);
  if (!match) return res.render('auth/login', { error: 'Credenciais inválidas' });
  req.session.studentId = student.id;
  req.session.studentName = student.name;
  res.redirect('/projects');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;