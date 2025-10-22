const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { ensureAuthenticated, ensureProjectDeveloper } = require('../middleware/auth');

// Public endpoints
router.get('/', ctrl.publicIndex); // /projects
router.get('/keyword/:keywordId', ctrl.publicByKeyword); // /projects/keyword/5
router.get('/report/knowledge', ctrl.knowledgeReport); // /projects/report/knowledge

// The routes below require authentication
router.use(ensureAuthenticated);

router.get('/new', ctrl.newForm);
router.post('/', ctrl.create);
router.get('/:id/edit', ensureProjectDeveloper, ctrl.editForm);
router.post('/:id', ensureProjectDeveloper, ctrl.update);
router.post('/:id/delete', ensureProjectDeveloper, ctrl.destroy);

module.exports = router;