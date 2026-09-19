const test = require('node:test');
const assert = require('node:assert/strict');

const { canTransition, assertTransition, ALLOWED_TRANSITIONS } = require('../utils/statusFlow');

test('canTransition: OPEN → ASSIGNED allowed', () => {
  assert.equal(canTransition('OPEN', 'ASSIGNED'), true);
});

test('canTransition: OPEN → REJECTED allowed', () => {
  assert.equal(canTransition('OPEN', 'REJECTED'), true);
});

test('canTransition: OPEN → IN_PROGRESS NOT allowed', () => {
  assert.equal(canTransition('OPEN', 'IN_PROGRESS'), false);
});

test('canTransition: ASSIGNED → IN_PROGRESS allowed', () => {
  assert.equal(canTransition('ASSIGNED', 'IN_PROGRESS'), true);
});

test('canTransition: IN_PROGRESS → RESOLVED allowed', () => {
  assert.equal(canTransition('IN_PROGRESS', 'RESOLVED'), true);
});

test('canTransition: RESOLVED → CLOSED allowed', () => {
  assert.equal(canTransition('RESOLVED', 'CLOSED'), true);
});

test('canTransition: CLOSED is terminal', () => {
  for (const to of Object.keys(ALLOWED_TRANSITIONS)) {
    assert.equal(canTransition('CLOSED', to), false);
  }
});

test('canTransition: REJECTED is terminal', () => {
  for (const to of Object.keys(ALLOWED_TRANSITIONS)) {
    assert.equal(canTransition('REJECTED', to), false);
  }
});

test('assertTransition: no-op from same to same is allowed', () => {
  assert.doesNotThrow(() => assertTransition('OPEN', 'OPEN'));
});

test('assertTransition: invalid transition throws', () => {
  assert.throws(() => assertTransition('OPEN', 'CLOSED'), /Invalid status transition/);
});

test('assertTransition: valid transition does not throw', () => {
  assert.doesNotThrow(() => assertTransition('OPEN', 'ASSIGNED'));
  assert.doesNotThrow(() => assertTransition('ASSIGNED', 'IN_PROGRESS'));
});
