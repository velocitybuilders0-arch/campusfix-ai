// Allowed issue status transitions.
// Per the approved architecture:
//   OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
//   OPEN → REJECTED
// Everything else is rejected by the backend.

const { badRequest } = require('./errors');

const STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const ALLOWED_TRANSITIONS = {
  OPEN:        ['ASSIGNED', 'REJECTED'],
  ASSIGNED:    ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED'],
  RESOLVED:    ['CLOSED'],
  CLOSED:      [],
  REJECTED:    []
};

function canTransition(from, to) {
  if (!ALLOWED_TRANSITIONS[from]) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

function assertTransition(from, to) {
  if (from === to) return; // no-op allowed
  if (!canTransition(from, to)) {
    throw badRequest(
      `Invalid status transition: ${from} → ${to}. Allowed from ${from}: ${
        ALLOWED_TRANSITIONS[from]?.join(', ') || 'none'
      }`
    );
  }
}

module.exports = { STATUSES, ALLOWED_TRANSITIONS, canTransition, assertTransition };
