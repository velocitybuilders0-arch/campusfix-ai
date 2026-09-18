# PHASE 2 INTEGRATION TEST CASES — ERRORS, INVALID INPUT, UNAUTHORIZED

**Covers required areas:** 12 (Error handling), 13 (Invalid input), 14 (Unauthorized requests)
**Owners of implementation:** Rajveer Dhiman (backend), Gunjan Yadav (frontend error states)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §22 (error envelope), §26 (security), §16 (auth)

**Note:** Area 14 (Unauthorized) overlaps with integration-auth.md. Where the
focus is *authorization outcome* the test lives in integration-auth.md. Where
the focus is *error shape / response envelope* it lives here.

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-ERR-NNN / QA-INT-INVAL-NNN / QA-INT-UNAUTH-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. STANDARD ERROR ENVELOPE (§22) — Area 12

### QA-INT-ERR-001 — 400 response uses §22 envelope

    Purpose:      Verify every 400 carries the locked error shape.
    Preconditions: Backend running; a route exists that returns 400 (e.g. POST /api/issues with empty body).
    Steps:
      1. curl -X POST http://localhost:5000/api/issues with {}.
      2. Inspect body.
    Expected:     HTTP 400; { success: false, error: { message: <string> } }.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-002 — 401 response uses §22 envelope

    Purpose:      Verify unauthenticated responses use the same shape.
    Preconditions: Backend running; protected route.
    Steps:
      1. curl protected route without Authorization header.
    Expected:     401; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-003 — 403 response uses §22 envelope

    Purpose:      Verify forbidden responses use the same shape.
    Preconditions: Authenticated as student; an admin-only route.
    Steps:
      1. curl admin-only route as student.
    Expected:     403; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-004 — 404 response uses §22 envelope

    Purpose:      Verify not-found responses use the same shape.
    Preconditions: Backend running.
    Steps:
      1. curl http://localhost:5000/api/nonexistent.
    Expected:     404; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-005 — 405 response uses §22 envelope (if applicable)

    Purpose:      Verify method-not-allowed handling.
    Preconditions: Backend running.
    Steps:
      1. curl -X DELETE http://localhost:5000/api/health.
    Expected:     404 or 405; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-006 — 500 response uses §22 envelope, no stack trace

    Purpose:      Verify unhandled errors do not leak internals.
    Preconditions: A way to trigger an internal error (e.g. malformed DB call; ask Rajveer for a test hook).
    Steps:
      1. Trigger the error.
      2. Inspect body.
    Expected:     500; §22 envelope; message does not contain stack trace, file paths, or DB driver errors.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-007 — Malformed JSON body handled

    Purpose:      Verify the JSON body parser error is normalized.
    Preconditions: Backend running.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues -H "Content-Type: application/json" -d '{ not json'.
    Expected:     400; §22 envelope; not a raw Express/body-parser error page.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-008 — error.message is always a string

    Purpose:      Verify no object/array/null leaks into error.message.
    Preconditions: Trigger several error responses.
    Steps:
      1. Collect error responses from 400/401/403/404/500.
      2. Inspect error.message.
    Expected:     typeof === "string" every time; never null, never object, never empty.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-009 — Envelope consistency across endpoints

    Purpose:      Verify every endpoint uses the same envelope.
    Preconditions: All routes implemented.
    Steps:
      1. Trigger success and error on /api/health, /api/ai/analyze, /api/issues (all 6 verbs).
    Expected:     Every success is { success: true, ... }; every error is { success: false, error: { message } }.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-010 — No raw DB error surfaces to client

    Purpose:      Verify DB errors are wrapped.
    Preconditions: A way to trigger a constraint violation (e.g. invalid FK).
    Steps:
      1. Trigger the FK violation via API.
      2. Inspect response.
    Expected:     400; §22 envelope; message is user-safe, no "Postgres" / SQL text.
    Actual:
    Status:       BLOCKED

---

## B. INVALID INPUT — Area 13

### QA-INT-INVAL-001 — Empty title rejected

    Purpose:      Verify title validation.
    Preconditions: Backend running; authenticated.
    Steps:
      1. POST /api/issues with { "title": "", "description": "valid" }.
    Expected:     400; §22 envelope; no DB write.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-002 — Missing title rejected

    Purpose:      Verify required field.
    Preconditions: Same as above.
    Steps:
      1. POST /api/issues with { "description": "valid" }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-003 — title as number rejected

    Purpose:      Verify type validation.
    Preconditions: Same as above.
    Steps:
      1. POST with { "title": 123, "description": "valid" }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-004 — title as object/array rejected

    Purpose:      Same as above for non-string complex types.
    Preconditions: Same as above.
    Steps:
      1. POST with { "title": { "x": 1 }, "description": "valid" }.
      2. POST with { "title": ["a"], "description": "valid" }.
    Expected:     400; §22 envelope both times.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-005 — Overly long title rejected

    Purpose:      Verify max length enforcement.
    Preconditions: Confirm max length with Rajveer.
    Steps:
      1. POST with a 10,000-char title.
    Expected:     400 if a limit is defined; otherwise accepted cleanly with no 500. Record which behavior is correct.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-006 — Missing description rejected (if required)

    Purpose:      Verify required field per contract.
    Preconditions: Confirm whether description is required.
    Steps:
      1. POST with title only.
    Expected:     400 if required; 200/201 if optional per Garv decision.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-007 — description as number rejected

    Purpose:      Verify type validation on description.
    Preconditions: Authenticated.
    Steps:
      1. POST with { "title": "valid", "description": 42 }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-008 — Invalid priority on PATCH rejected

    Purpose:      Verify enum validation on update.
    Preconditions: Authenticated; existing issue.
    Steps:
      1. PATCH /api/issues/<id> with { "priority": "URGENT" }.
    Expected:     400; §22 envelope; DB unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-009 — Invalid status on PATCH rejected

    Purpose:      Verify status enum validation.
    Preconditions: Same as above.
    Steps:
      1. PATCH with { "status": "MAYBE" }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-010 — Invalid category on PATCH rejected

    Purpose:      Verify category validation if client can supply.
    Preconditions: Same as above; confirm client-supply policy.
    Steps:
      1. PATCH with { "category": "Banana" }.
    Expected:     400; §22 envelope; DB unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-011 — Invalid assigned_to rejected

    Purpose:      Verify FK validation.
    Preconditions: Admin token.
    Steps:
      1. PATCH with { "assigned_to": "not-a-uuid" }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-012 — Invalid :id in path rejected

    Purpose:      Verify path param validation.
    Preconditions: Backend running.
    Steps:
      1. GET /api/issues/not-a-uuid.
      2. PATCH /api/issues/not-a-uuid with valid body.
      3. DELETE /api/issues/not-a-uuid.
    Expected:     400 or 404 with §22 envelope; never 500.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-013 — Empty update message rejected

    Purpose:      Verify validation on POST updates.
    Preconditions: Authenticated; existing issue.
    Steps:
      1. POST /api/issues/<id>/updates with { "message": "" }.
    Expected:     400; §22 envelope; no DB write.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-014 — Non-string update message rejected

    Purpose:      Type check on update message.
    Preconditions: Same as above.
    Steps:
      1. POST with { "message": 42 }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-015 — Empty body on PATCH rejected

    Purpose:      Verify PATCH requires at least one field.
    Preconditions: Same as above.
    Steps:
      1. PATCH with {}.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-016 — Unknown field on create ignored or rejected

    Purpose:      Verify strictness policy.
    Preconditions: Same as above.
    Steps:
      1. POST with { "title": "valid", "description": "valid", "unknown_field": "x" }.
    Expected:     Either ignored (created) OR 400 (rejected). Confirm policy with Garv and record.
    Actual:
    Status:       BLOCKED

### QA-INT-INVAL-017 — Prototype pollution attempt rejected

    Purpose:      Security — verify __proto__ / constructor keys do not pollute.
    Preconditions: Backend running.
    Steps:
      1. POST with { "__proto__": { "isAdmin": true }, "title": "valid", "description": "valid" }.
      2. Inspect backend object.
    Expected:     400 OR the extra key ignored; no prototype mutation.
    Actual:
    Status:       BLOCKED

---

## C. UNAUTHORIZED REQUESTS — Area 14 (error-shape focus)

### QA-INT-UNAUTH-010 — 401 body matches §22 shape

    Purpose:      Verify unauthenticated response uses the standard envelope.
    Preconditions: Backend running; protected route.
    Steps:
      1. curl protected route without Authorization.
    Expected:     401; { success: false, error: { message: "..." } }.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-011 — 403 body matches §22 shape

    Purpose:      Verify forbidden response uses the standard envelope.
    Preconditions: Authenticated student calling admin route.
    Steps:
      1. curl admin route as student.
    Expected:     403; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-012 — 401 vs 403 distinction is correct

    Purpose:      Verify the backend distinguishes "not logged in" from "logged in but not allowed".
    Preconditions: Backend running.
    Steps:
      1. Call protected route with no token -> record status.
      2. Call protected route as a lower-privileged user -> record status.
    Expected:     First is 401; second is 403. Not both 401, not both 403.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-013 — No data leak on 403

    Purpose:      Verify forbidden responses do not leak issue content.
    Preconditions: Student A logged in; student B's issue id known.
    Steps:
      1. GET /api/issues/<B-issue-id> as A.
      2. Inspect response body.
    Expected:     403; body contains no title, description, or user_id of the forbidden issue. Only the §22 error envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-014 — No partial-success leak

    Purpose:      Verify a failed authorization does not partially modify state.
    Preconditions: Student A attempts PATCH on B's issue.
    Steps:
      1. PATCH with valid body.
      2. Inspect the target issue in the DB.
    Expected:     Issue unchanged; no side effect (updated_at not bumped, no issue_updates row added).
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-015 — Repeated unauthenticated attempts are rate-safe

    Purpose:      Verify no crash or lockout under repeated unauthorized calls.
    Preconditions: Backend running.
    Steps:
      1. Send 50 unauthenticated requests to a protected route in quick succession.
    Expected:     All respond 401 with §22 envelope; no crash, no 500, no lockout of legitimate users.
    Actual:
    Status:       BLOCKED

---

## D. FRONTEND ERROR STATE EXPECTATIONS (cross-layer)

These verify that the frontend correctly surfaces backend errors to users.
They depend on Gunjan's frontend implementation.

### QA-INT-ERR-020 — Frontend shows error state on network failure

    Purpose:      Verify the FE shows a clear message when BE is unreachable.
    Preconditions: Frontend running; backend stopped.
    Steps:
      1. Attempt an issue submission in the UI.
    Expected:     UI shows a network-error state; no blank screen; retry possible.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-021 — Frontend reads §22 message

    Purpose:      Verify the FE displays backend's error.message, not a generic placeholder.
    Preconditions: FE running; BE running; a 400 triggerable via the UI.
    Steps:
      1. Submit an empty title.
    Expected:     UI displays the backend-provided message.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-022 — Frontend handles 401 by redirecting to login

    Purpose:      Verify session-expiry UX.
    Preconditions: FE running; a stale/expired token.
    Steps:
      1. Attempt a protected action.
    Expected:     UI redirects to login (or shows re-authenticate), not a raw error.
    Actual:
    Status:       BLOCKED

### QA-INT-ERR-023 — Frontend does not leak stack trace in UI

    Purpose:      Verify 500 responses do not expose backend internals in UI.
    Preconditions: Triggerable 500.
    Steps:
      1. Trigger a 500 through the UI.
    Expected:     UI shows a user-safe message.
    Actual:
    Status:       BLOCKED

---

## E. NOTES

- Every test is BLOCKED pending real implementation of the routes and the
  frontend error states.
- QA-INT-ERR-006 requires a test hook from Rajveer to trigger a 500 safely. If
  no hook is provided, mark BLOCKED — do not modify backend/ to force it.
- QA-INT-ERR-009 is a consistency sweep across all endpoints — run once
  endpoints exist.
- QA-INT-INVAL-016 and QA-INT-ERR-006 have policy decisions pending from Garv.
- Area 14 is split between integration-auth.md (authorization outcome) and
  this file (response envelope / no-leak checks). Both must pass.
- No PASS status exists in this file.