const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth');

// POST /api/ai/analyze
// Requires an authenticated user (per architecture: AI runs on behalf of a user).
router.post('/analyze', authenticate, aiController.analyze);

module.exports = router;
