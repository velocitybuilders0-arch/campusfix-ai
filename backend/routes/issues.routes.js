const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');
const { authenticate } = require('../middleware/auth');

// All issue routes require authentication.
router.use(authenticate);

// GET /api/issues
router.get('/', issueController.list);

// POST /api/issues
router.post('/', issueController.create);

// GET /api/issues/:id
router.get('/:id', issueController.getOne);

// PATCH /api/issues/:id
router.patch('/:id', issueController.update);

// POST /api/issues/:id/updates
router.post('/:id/updates', issueController.addUpdate);

// DELETE /api/issues/:id
router.delete('/:id', issueController.remove);

module.exports = router;
