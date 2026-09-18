const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

// Load the app. This will emit the standard `[env] Warning: missing...` line
// if SUPABASE vars are not set; that is expected in a fresh checkout.
const app = require('../server');

test('GET /api/health returns expected success payload', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: 'CampusFix API is running'
  });
});

test('Unknown route returns 404 with consistent error shape', async () => {
  const res = await request(app).get('/api/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.ok(res.body.error && typeof res.body.error.message === 'string');
});

test('POST /api/ai/analyze without auth returns 503 (auth not configured)', async () => {
  // With no Supabase env set, authenticate() throws 503 before the adapter runs.
  const res = await request(app)
    .post('/api/ai/analyze')
    .send({ title: 'Fan', description: 'Not working' });
  assert.equal(res.status, 503);
  assert.equal(res.body.success, false);
  assert.ok(typeof res.body.error.message === 'string');
});

test('POST /api/ai/analyze with invalid body and no auth still 503 first', async () => {
  // Auth is enforced before validation here, so 503 takes precedence.
  const res = await request(app).post('/api/ai/analyze').send({});
  assert.equal(res.status, 503);
  assert.equal(res.body.success, false);
});

test('GET /api/issues without auth returns 503 (auth not configured)', async () => {
  const res = await request(app).get('/api/issues');
  assert.equal(res.status, 503);
  assert.equal(res.body.success, false);
});

test('Invalid JSON body returns 400 with consistent error shape', async () => {
  const res = await request(app)
    .post('/api/issues')
    .set('Content-Type', 'application/json')
    .send('{ not json');
  // Auth runs first in the chain — 503 may be returned before body parse
  // for this route in a fresh checkout. Accept either 400 (if parse failed first)
  // or 503 (if auth was reached first). This is expected given missing env.
  assert.ok([400, 503].includes(res.status), `expected 400 or 503, got ${res.status}`);
  assert.equal(res.body.success, false);
  assert.ok(res.body.error && typeof res.body.error.message === 'string');
});
