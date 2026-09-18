// POST /api/ai/analyze
// Body: { title, description }
// Response: { success: true, data: { category, priority, summary, department } }

const { validateAnalyzeBody } = require('../utils/validators');
const aiAdapter = require('../services/aiAdapter');

async function analyze(req, res, next) {
  try {
    const { title, description } = validateAnalyzeBody(req.body);
    const data = await aiAdapter.analyzeIssue({ title, description });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze };
