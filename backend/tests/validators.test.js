const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateCreateIssueBody,
  validateUpdateIssueBody,
  validateCreateUpdateBody,
  validateAnalyzeBody,
  requireUuid,
  requireEnum,
  PRIORITIES,
  STATUSES
} = require('../utils/validators');

test('validateCreateIssueBody: accepts minimal valid input', () => {
  const out = validateCreateIssueBody({ title: 'Fan broken', description: 'No airflow' });
  assert.equal(out.title, 'Fan broken');
  assert.equal(out.description, 'No airflow');
});

test('validateCreateIssueBody: rejects missing title', () => {
  assert.throws(() => validateCreateIssueBody({ description: 'x' }), /title/);
});

test('validateCreateIssueBody: rejects empty description', () => {
  assert.throws(() => validateCreateIssueBody({ title: 'x', description: '   ' }), /description/);
});

test('validateCreateIssueBody: rejects server-controlled fields', () => {
  assert.throws(
    () => validateCreateIssueBody({ title: 'x', description: 'y', user_id: '123' }),
    /server-controlled/
  );
  assert.throws(
    () => validateCreateIssueBody({ title: 'x', description: 'y', status: 'OPEN' }),
    /server-controlled/
  );
});

test('validateCreateIssueBody: rejects bad image_url', () => {
  assert.throws(
    () => validateCreateIssueBody({ title: 'x', description: 'y', image_url: 'not-a-url' }),
    /valid http/
  );
});

test('validateUpdateIssueBody: accepts a single field', () => {
  const out = validateUpdateIssueBody({ title: 'new' });
  assert.equal(out.title, 'new');
});

test('validateUpdateIssueBody: rejects empty object', () => {
  assert.throws(() => validateUpdateIssueBody({}), /at least one/);
});

test('validateUpdateIssueBody: rejects invalid status', () => {
  assert.throws(() => validateUpdateIssueBody({ status: 'DONE' }), /status/);
});

test('validateCreateUpdateBody: accepts message only', () => {
  const out = validateCreateUpdateBody({ message: 'Assigned to electrician' });
  assert.equal(out.message, 'Assigned to electrician');
  assert.equal(out.status, undefined);
});

test('validateCreateUpdateBody: accepts message + valid status', () => {
  const out = validateCreateUpdateBody({ message: 'x', status: 'IN_PROGRESS' });
  assert.equal(out.status, 'IN_PROGRESS');
});

test('validateCreateUpdateBody: rejects issue_id from client', () => {
  assert.throws(
    () => validateCreateUpdateBody({ message: 'x', issue_id: 'abc' }),
    /server-controlled/
  );
});

test('validateAnalyzeBody: requires title and description', () => {
  assert.throws(() => validateAnalyzeBody({ title: 'x' }), /description/);
  assert.throws(() => validateAnalyzeBody({ description: 'y' }), /title/);
  const out = validateAnalyzeBody({ title: 't', description: 'd' });
  assert.deepEqual(out, { title: 't', description: 'd' });
});

test('requireUuid: accepts a v4 UUID', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  assert.equal(requireUuid(id, 'id'), id);
});

test('requireUuid: rejects non-UUID', () => {
  assert.throws(() => requireUuid('not-a-uuid', 'id'), /UUID/);
});

test('requireEnum: rejects bad value', () => {
  assert.throws(() => requireEnum('NOPE', PRIORITIES, 'priority'), /priority/);
  assert.throws(() => requireEnum('NOPE', STATUSES, 'status'), /status/);
});
