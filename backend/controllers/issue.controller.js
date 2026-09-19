// Issue HTTP controllers. Each handler:
//   1. validates input
//   2. enforces authorization (via middleware, plus per-issue ownership here)
//   3. delegates to issueService
//   4. returns a consistent JSON response

const {
  validateCreateIssueBody,
  validateUpdateIssueBody,
  validateCreateUpdateBody,
  requireUuid
} = require('../utils/validators');
const { assertTransition } = require('../utils/statusFlow');
const { forbidden, notFound } = require('../utils/errors');
const issueService = require('../services/issueService');
const aiAdapter = require('../services/aiAdapter');

// ---------- helpers ----------

function canModifyIssue(user, issue) {
  if (user.role === 'ADMIN' || user.role === 'STAFF') return true;
  return issue.user_id === user.id;
}

async function loadIssueOrThrow(id, user) {
  return issueService.getIssueById(id, { userId: user.id, role: user.role });
}

// ---------- GET /api/issues ----------

async function list(req, res, next) {
  try {
    const filters = {};
    for (const key of ['status', 'priority', 'category', 'assigned_to', 'user_id']) {
      if (req.query[key]) filters[key] = String(req.query[key]);
    }
    const data = await issueService.listIssues({
      userId: req.user.id,
      role: req.user.role,
      filters
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ---------- GET /api/issues/:id ----------

async function getOne(req, res, next) {
  try {
    const id = requireUuid(req.params.id, 'id');
    const issue = await loadIssueOrThrow(id, req.user);
    const updates = await issueService.listUpdatesForIssue(id);
    res.status(200).json({ success: true, data: { ...issue, updates } });
  } catch (err) {
    next(err);
  }
}

// ---------- POST /api/issues ----------

async function create(req, res, next) {
  try {
    const body = validateCreateIssueBody(req.body);

    // AI enrichment is authoritative for classification fields. If AI is
    // unavailable, leave those fields null rather than trusting client input.
    let aiFields = {};
    if (aiAdapter.isAvailable()) {
      try {
        const analysis = await aiAdapter.analyzeIssue({
          title: body.title,
          description: body.description
        });
        aiFields = {
          category: analysis.category,
          priority: analysis.priority,
          department: analysis.department,
          ai_summary: analysis.summary
        };
      } catch (aiErr) {
        // Log but do not fail creation on AI outage.
        console.warn('[issues.create] AI enrichment skipped:', aiErr.message);
      }
    }

    const payload = {
      user_id: req.user.id,
      title: body.title,
      description: body.description,
      image_url: body.image_url ?? null,
      category: aiFields.category ?? null,
      priority: aiFields.priority ?? null,
      department: aiFields.department ?? null,
      ai_summary: aiFields.ai_summary ?? null,
      status: 'OPEN'
    };

    const created = await issueService.createIssue(payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

// ---------- PATCH /api/issues/:id ----------

async function update(req, res, next) {
  try {
    const id = requireUuid(req.params.id, 'id');
    const patch = validateUpdateIssueBody(req.body);
    const existing = await loadIssueOrThrow(id, req.user);

    if (!canModifyIssue(req.user, existing)) {
      throw forbidden('You are not allowed to modify this issue');
    }

    // Students cannot change status, priority, department, or assignment.
    if (req.user.role === 'STUDENT') {
      for (const field of ['status', 'priority', 'department', 'assigned_to']) {
        if (patch[field] !== undefined) {
          throw forbidden(`Students cannot modify "${field}"`);
        }
      }
    }

    // Status transition validation.
    if (patch.status !== undefined) {
      assertTransition(existing.status, patch.status);
    }

    const updated = await issueService.updateIssue(id, patch);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// ---------- POST /api/issues/:id/updates ----------

async function addUpdate(req, res, next) {
  try {
    const id = requireUuid(req.params.id, 'id');
    const { message, status } = validateCreateUpdateBody(req.body);
    const existing = await loadIssueOrThrow(id, req.user);

    // Owner, staff, admin may post updates. Others forbidden.
    if (!canModifyIssue(req.user, existing)) {
      throw forbidden('You are not allowed to update this issue');
    }

    // Status transition validation if a new status is included.
    if (status !== undefined) {
      assertTransition(existing.status, status);
    }

    const created = await issueService.addIssueUpdate(id, { message, status });

    // If a status was supplied, reflect it on the issue row.
    if (status !== undefined) {
      await issueService.updateIssue(id, { status });
    }

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

// ---------- DELETE /api/issues/:id ----------

async function remove(req, res, next) {
  try {
    const id = requireUuid(req.params.id, 'id');
    const existing = await loadIssueOrThrow(id, req.user);

    // Only admin may delete. Staff may not.
    if (req.user.role !== 'ADMIN') {
      throw forbidden('Only admins may delete issues');
    }

    await issueService.deleteIssue(id);
    res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, addUpdate, remove };
