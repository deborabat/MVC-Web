const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { ensureAuthenticated } = require('../middleware/auth');
const { ensureAdmin } = require('../middleware/admin');

router.use(ensureAuthenticated, ensureAdmin);

// Students
router.get('/students', ctrl.studentsIndex);
router.get('/students/new', ctrl.studentsNewForm);
router.post('/students', ctrl.studentsCreate);
router.get('/students/:id/edit', ctrl.studentsEditForm);
router.post('/students/:id', ctrl.studentsUpdate);
router.post('/students/:id/delete', ctrl.studentsDelete);

// Keywords
router.get('/keywords', ctrl.keywordsIndex);
router.get('/keywords/new', ctrl.keywordsNewForm);
router.post('/keywords', ctrl.keywordsCreate);
router.get('/keywords/:id/edit', ctrl.keywordsEditForm);
router.post('/keywords/:id', ctrl.keywordsUpdate);
router.post('/keywords/:id/delete', ctrl.keywordsDelete);

// Knowledges
router.get('/knowledges', ctrl.knowledgesIndex);
router.get('/knowledges/new', ctrl.knowledgesNewForm);
router.post('/knowledges', ctrl.knowledgesCreate);
router.get('/knowledges/:id/edit', ctrl.knowledgesEditForm);
router.post('/knowledges/:id', ctrl.knowledgesUpdate);
router.post('/knowledges/:id/delete', ctrl.knowledgesDelete);

module.exports = router;
