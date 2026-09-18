// Validation helpers for request bodies, route params, and enum values.
// Framework-agnostic: throws ApiError(400) with a clear message on failure.

const { badRequest } = require('./errors');

const ROLES = ['STUDENT', 'ADMIN', 'STAFF'];
const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

// ---------- primitive checks ----------

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function requireNonEmptyString(value, field, { max = 2000 } = {}) {
  if (!isNonEmptyString(value)) {
    throw badRequest(`Field "${field}" is required and must be a non-empty string`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw badRequest(`Field "${field}" must be at most ${max} characters`);
  }
  return trimmed;
}

function optionalString(value, field, { max = 2000 } = {}) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw badRequest(`Field "${field}" must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw badRequest(`Field "${field}" must be at most ${max} characters`);
  }
  return trimmed;
}

function optionalUrl(value, field) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw badRequest(`Field "${field}" must be a string URL`);
  }
  try {
    const u = new URL(value);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      throw new Error('bad protocol');
    }
    return value;
  } catch {
    throw badRequest(`Field "${field}" must be a valid http(s) URL`);
  }
}

// UUID v4-ish — Supabase uses v4. Accept any RFC4122 UUID to be safe.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireUuid(value, field = 'id') {
  if (typeof value !== 'string' || !UUID_RE.test(value)) {
    throw badRequest(`Field "${field}" must be a valid UUID`);
  }
  return value;
}

// ---------- enum checks ----------

function requireEnum(value, allowed, field) {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw badRequest(
      `Field "${field}" must be one of: ${allowed.join(', ')}`
    );
  }
  return value;
}

function optionalEnum(value, allowed, field) {
  if (value === undefined || value === null || value === '') return undefined;
  return requireEnum(value, allowed, field);
}

// ---------- payload validators ----------

// POST /api/issues
function validateCreateIssueBody(body) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be a JSON object');
  }
  const title = requireNonEmptyString(body.title, 'title', { max: 200 });
  const description = requireNonEmptyString(body.description, 'description', { max: 5000 });
  const image_url = optionalUrl(body.image_url, 'image_url');

  // Fields the client may hint at but which the backend re-validates:
  const category = optionalString(body.category, 'category', { max: 100 });
  const priority = optionalEnum(body.priority, PRIORITIES, 'priority');
  const department = optionalString(body.department, 'department', { max: 200 });
  const ai_summary = optionalString(body.ai_summary, 'ai_summary', { max: 1000 });

  // Explicitly ignored / rejected: user_id, status, assigned_to, id.
  // These are server-controlled and must not be trusted from the client.
  for (const forbidden of ['id', 'user_id', 'status', 'assigned_to', 'created_at', 'updated_at']) {
    if (body[forbidden] !== undefined) {
      throw badRequest(`Field "${forbidden}" is server-controlled and must not be supplied`);
    }
  }

  return { title, description, image_url, category, priority, department, ai_summary };
}

// PATCH /api/issues/:id — only fields an authorized user may change.
function validateUpdateIssueBody(body) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be a JSON object');
  }
  const out = {};

  if (body.title !== undefined)       out.title = requireNonEmptyString(body.title, 'title', { max: 200 });
  if (body.description !== undefined) out.description = requireNonEmptyString(body.description, 'description', { max: 5000 });
  if (body.image_url !== undefined)   out.image_url = optionalUrl(body.image_url, 'image_url');
  if (body.category !== undefined)    out.category = optionalString(body.category, 'category', { max: 100 });
  if (body.priority !== undefined)    out.priority = requireEnum(body.priority, PRIORITIES, 'priority');
  if (body.department !== undefined)  out.department = optionalString(body.department, 'department', { max: 200 });
  if (body.status !== undefined)      out.status = requireEnum(body.status, STATUSES, 'status');
  if (body.assigned_to !== undefined) {
    out.assigned_to = body.assigned_to === null ? null : requireUuid(body.assigned_to, 'assigned_to');
  }

  // Server-controlled, not patchable here.
  for (const forbidden of ['id', 'user_id', 'created_at', 'updated_at', 'ai_summary']) {
    if (body[forbidden] !== undefined) {
      throw badRequest(`Field "${forbidden}" is server-controlled and must not be supplied`);
    }
  }

  if (Object.keys(out).length === 0) {
    throw badRequest('Request body must contain at least one updatable field');
  }
  return out;
}

// POST /api/issues/:id/updates
function validateCreateUpdateBody(body) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be a JSON object');
  }
  const message = requireNonEmptyString(body.message, 'message', { max: 2000 });
  const status = optionalEnum(body.status, STATUSES, 'status');
  for (const forbidden of ['id', 'issue_id', 'created_at']) {
    if (body[forbidden] !== undefined) {
      throw badRequest(`Field "${forbidden}" is server-controlled and must not be supplied`);
    }
  }
  return { message, status };
}

// POST /api/ai/analyze
function validateAnalyzeBody(body) {
  if (!body || typeof body !== 'object') {
    throw badRequest('Request body must be a JSON object');
  }
  const title = requireNonEmptyString(body.title, 'title', { max: 200 });
  const description = requireNonEmptyString(body.description, 'description', { max: 5000 });
  return { title, description };
}

module.exports = {
  ROLES,
  STATUSES,
  PRIORITIES,
  isNonEmptyString,
  requireNonEmptyString,
  optionalString,
  optionalUrl,
  requireUuid,
  requireEnum,
  optionalEnum,
  validateCreateIssueBody,
  validateUpdateIssueBody,
  validateCreateUpdateBody,
  validateAnalyzeBody
};
