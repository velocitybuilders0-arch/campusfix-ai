const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusFix API is running'
  });
});

module.exports = router;
