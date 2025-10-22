const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/myKnowledgeController');
const { ensureAuthenticated } = require('../middleware/auth');

router.use(ensureAuthenticated);

router.get('/', ctrl.index);
router.post('/', ctrl.save);
router.post('/:id/delete', ctrl.remove);

module.exports = router;