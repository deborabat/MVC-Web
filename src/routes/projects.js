const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { ensureAuthenticated, ensureProjectDeveloper } = require('../middleware/auth');

router.use(ensureAuthenticated);

router.get('/', ctrl.index);
router.get('/new', ctrl.newForm);
router.post('/', ctrl.create);

router.get('/:id/edit', ensureProjectDeveloper, ctrl.editForm);
router.post('/:id', ensureProjectDeveloper, ctrl.update);
router.post('/:id/delete', ensureProjectDeveloper, ctrl.destroy);

module.exports = router;