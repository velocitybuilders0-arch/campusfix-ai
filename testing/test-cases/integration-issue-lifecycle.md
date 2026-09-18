# PHASE 2 INTEGRATION TEST CASES — ISSUE LIFECYCLE

**Covers required areas:** 4 (Issue creation), 7 (Issue details), 8 (Issue updates), 9 (Status transitions), 10 (Assignment), 15 (Database persistence)
**Owners of implementation:** Rajveer Dhiman (backend), Gunjan Yadav (frontend), Garv Nain (DB schema via Supabase)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §13 (issue workflow), §14 (DB model), §15 (DB rules), §16 (auth), §22 (errors)

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-ISSUE-NNN / QA-INT-LIFE-NNN / QA-INT-ASSIGN-NNN / QA-INT-DB-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. ISSUE CREATION (Area 4)

### QA-INT-ISSUE-001 — Create issue with valid payload

    Purpose:      Verify POST /api/issues creates a persisted issue.
    Preconditions: Backend running; DB reachable; authenticated student token; Supabase migration applied.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues \
           -H "Authorization: Bearer <token>" \
           -H "Content-Type: application/json" \
           -d '{"title":"Fan not working","description":"Ceiling fan in Room 204 not turning on"}'
      2. Inspect response body.
      3. Query the issues table for the new row.
    Expected:     200 or 201; body { success: true, data: <issue with id> }; DB row exists with user_id = caller.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-002 — Created issue starts with status OPEN

    Purpose:      Verify new issues start at OPEN per §13 lifecycle.
    Preconditions: Same as above.
    Steps:
      1. Create an issue.
      2. Inspect status field.
    Expected:     status === "OPEN".
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-003 — Server sets user_id from session

    Purpose:      Verify user_id is NOT accepted from client body (§16).
    Preconditions: Authenticated student token.
    Steps:
      1. POST with body including "user_id": "<some-other-user>".
      2. Inspect the created row's user_id.
    Expected:     user_id === authenticated student's id; body value ignored.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-004 — created_at and updated_at auto-populate

    Purpose:      Verify §14 timestamps are server-generated.
    Preconditions: Same as above.
    Steps:
      1. Create an issue with no timestamps in the body.
      2. Inspect created_at and updated_at.
    Expected:     Both fields populated with server time.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-005 — Client-supplied priority is ignored or rejected

    Purpose:      Verify priority handling on create — flagged ambiguity.
    Preconditions: Same as above; Garv decision on whether client may supply priority.
    Steps:
      1. POST with body { "title": "...", "description": "...", "priority": "CRITICAL" }.
      2. Inspect the created row's priority.
    Expected:     Either the field is ignored (server sets priority via AI or default) OR the request is rejected 400. Contract decision pending from Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-006 — Client-supplied status is ignored

    Purpose:      Verify status cannot be forced by client.
    Preconditions: Same as above.
    Steps:
      1. POST with body including "status": "RESOLVED".
      2. Inspect the created row's status.
    Expected:     status === "OPEN"; the body value has no effect.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-007 — Client-supplied category / department are ignored or derived

    Purpose:      Verify §18 server-side AI derivation cannot be bypassed.
    Preconditions: Same as above.
    Steps:
      1. POST with body including "category": "Foo" and "department": "Bar".
      2. Inspect the created row.
    Expected:     Either the fields are ignored (AI/service derives them) OR the request is rejected. Contract decision pending from Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-008 — Issue appears in caller's list immediately

    Purpose:      Verify persistence is visible through GET.
    Preconditions: Issue just created.
    Steps:
      1. GET /api/issues.
      2. Search the response for the newly created id.
    Expected:     The new issue appears.
    Actual:
    Status:       BLOCKED

---

## B. ISSUE DETAILS (Area 7)

### QA-INT-ISSUE-020 — Fetch own issue detail

    Purpose:      Verify GET /api/issues/:id returns full issue.
    Preconditions: Authenticated student; own issue exists.
    Steps:
      1. curl -H "Authorization: Bearer <token>" http://localhost:5000/api/issues/<own-id>
    Expected:     200; { success: true, data: <issue with all §14 core fields> }.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-021 — Detail response includes all core fields

    Purpose:      Verify §14 field coverage.
    Preconditions: Same as above.
    Steps:
      1. Fetch issue detail.
      2. Inspect keys.
    Expected:     Keys include: id, user_id, title, description, image_url, category, priority, ai_summary, department, status, assigned_to, created_at, updated_at.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-022 — Nonexistent id returns 404

    Purpose:      Verify clean not-found handling.
    Preconditions: Authenticated token.
    Steps:
      1. GET /api/issues/999999.
    Expected:     404; §22 envelope; no stack trace.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-023 — Malformed id handled cleanly

    Purpose:      Verify non-UUID/malformed id is rejected.
    Preconditions: Same as above.
    Steps:
      1. GET /api/issues/not-a-uuid.
    Expected:     400 or 404; §22 envelope; no 500.
    Actual:
    Status:       BLOCKED

---

## C. ISSUE UPDATES (Area 8)

### QA-INT-ISSUE-040 — Admin updates priority

    Purpose:      Verify PATCH /api/issues/:id accepts priority change by admin.
    Preconditions: Admin token; existing issue.
    Steps:
      1. PATCH /api/issues/<id> with { "priority": "HIGH" }.
      2. Inspect response and DB.
    Expected:     200; priority === "HIGH"; updated_at bumped.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-041 — Staff updates category

    Purpose:      Verify PATCH accepts category change by staff.
    Preconditions: Staff token; existing issue.
    Steps:
      1. PATCH /api/issues/<id> with { "category": "Electrical" }.
    Expected:     200; category updated; if invalid category, rejected.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-042 — Update adds a row in issue_updates (if applicable)

    Purpose:      Verify update history is preserved when specified.
    Preconditions: Same as above; issue_updates workflow in place.
    Steps:
      1. PATCH an issue.
      2. Query issue_updates for the issue.
    Expected:     Either a system-generated update row appears OR the change is logged per team's chosen approach. Flag decision to Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-043 — Immutable fields rejected

    Purpose:      Verify id / user_id / created_at cannot be changed by client.
    Preconditions: Same as above.
    Steps:
      1. PATCH with { "id": "hacked", "user_id": "someone-else" }.
      2. Inspect DB.
    Expected:     Fields ignored or 400; original values unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-044 — Post a progress update

    Purpose:      Verify POST /api/issues/:id/updates creates a row.
    Preconditions: Staff or admin token; existing issue.
    Steps:
      1. POST /api/issues/<id>/updates with { "message": "Electrician has been assigned to inspect the fan." }.
      2. Query issue_updates.
    Expected:     200 or 201; new row with issue_id, message, created_at (and status if provided).
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-045 — Empty update message rejected

    Purpose:      Verify validation on update message.
    Preconditions: Same as above.
    Steps:
      1. POST with { "message": "" }.
    Expected:     400; §22 envelope; no DB write.
    Actual:
    Status:       BLOCKED

### QA-INT-ISSUE-046 — Update on nonexistent issue returns 404

    Purpose:      Verify FK behavior at the API layer.
    Preconditions: Authenticated token.
    Steps:
      1. POST /api/issues/999999/updates with valid body.
    Expected:     404; §22 envelope.
    Actual:
    Status:       BLOCKED

---

## D. STATUS TRANSITIONS (Area 9)

### QA-INT-LIFE-001 — OPEN to ASSIGNED accepted

    Purpose:      Verify first valid transition.
    Preconditions: Admin token; issue at OPEN.
    Steps:
      1. PATCH status to ASSIGNED (with assigned_to set).
    Expected:     200; status === "ASSIGNED".
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-002 — ASSIGNED to IN_PROGRESS accepted

    Purpose:      Verify second valid transition.
    Preconditions: Issue at ASSIGNED.
    Steps:
      1. PATCH status to IN_PROGRESS.
    Expected:     200; status === "IN_PROGRESS".
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-003 — IN_PROGRESS to RESOLVED accepted

    Purpose:      Verify third valid transition.
    Preconditions: Issue at IN_PROGRESS.
    Steps:
      1. PATCH status to RESOLVED.
    Expected:     200; status === "RESOLVED".
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-004 — RESOLVED to CLOSED accepted

    Purpose:      Verify final valid transition.
    Preconditions: Issue at RESOLVED.
    Steps:
      1. PATCH status to CLOSED.
    Expected:     200; status === "CLOSED".
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-005 — REJECTED reachable from OPEN (or per policy)

    Purpose:      Verify rejection path exists.
    Preconditions: Admin token; issue at OPEN.
    Steps:
      1. PATCH status to REJECTED.
    Expected:     200; status === "REJECTED". Confirm policy with Garv: REJECTED allowed from which states?
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-006 — Backward transition rejected (CLOSED to OPEN)

    Purpose:      Verify closed issues cannot be reopened without policy.
    Preconditions: Issue at CLOSED.
    Steps:
      1. PATCH status to OPEN.
    Expected:     400 or 409; §22 envelope; status unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-007 — Skipping a stage rejected (OPEN to RESOLVED)

    Purpose:      Verify no stage skipping.
    Preconditions: Issue at OPEN.
    Steps:
      1. PATCH status to RESOLVED directly.
    Expected:     400; §22 envelope; status unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-LIFE-008 — Unknown status rejected

    Purpose:      Verify enum enforcement.
    Preconditions: Admin token; any issue.
    Steps:
      1. PATCH status to "BANANA".
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

---

## E. ASSIGNMENT (Area 10)

### QA-INT-ASSIGN-001 — Admin assigns issue to staff

    Purpose:      Verify assignment is permitted for admin.
    Preconditions: Admin token; a STAFF user exists.
    Steps:
      1. PATCH /api/issues/<id> with { "assigned_to": "<staff-id>" }.
      2. Inspect DB.
    Expected:     200; assigned_to === staff-id; status may auto-advance to ASSIGNED per §13.
    Actual:
    Status:       BLOCKED

### QA-INT-ASSIGN-002 — Assign to nonexistent user rejected

    Purpose:      Verify FK enforcement at API layer.
    Preconditions: Admin token.
    Steps:
      1. PATCH with { "assigned_to": "00000000-0000-0000-0000-000000000000" }.
    Expected:     400; §22 envelope; no DB write.
    Actual:
    Status:       BLOCKED

### QA-INT-ASSIGN-003 — Assign to non-staff user rejected (or warned)

    Purpose:      Verify assignment target validation.
    Preconditions: Admin token; a STUDENT exists.
    Steps:
      1. PATCH with { "assigned_to": "<student-id>" }.
    Expected:     400 or policy-approved acceptance. Confirm with Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-ASSIGN-004 — Staff cannot assign to themselves

    Purpose:      Verify assignment authority is admin-only.
    Preconditions: Staff token.
    Steps:
      1. PATCH with { "assigned_to": "<own-staff-id>" }.
    Expected:     403 (or policy-approved per Garv).
    Actual:
    Status:       BLOCKED

### QA-INT-ASSIGN-005 — Unassign (set null) permitted by admin

    Purpose:      Verify unassignment path.
    Preconditions: Admin token; issue currently assigned.
    Steps:
      1. PATCH with { "assigned_to": null }.
    Expected:     200; assigned_to === null; status rollback policy per Garv.
    Actual:
    Status:       BLOCKED

---

## F. DATABASE PERSISTENCE (Area 15)

### QA-INT-DB-001 — Issue survives backend restart

    Purpose:      Verify persistence is real, not in-memory.
    Preconditions: Issue created; backend running.
    Steps:
      1. Stop backend.
      2. Start backend.
      3. GET the issue.
    Expected:     Issue still returned by id.
    Actual:
    Status:       BLOCKED

### QA-INT-DB-002 — Issue visible in Supabase dashboard

    Purpose:      Verify the row lands in Supabase, not a local cache.
    Preconditions: Issue created.
    Steps:
      1. Open Supabase Table Editor.
      2. Locate the row by id.
    Expected:     Row exists with all fields.
    Actual:
    Status:       BLOCKED

### QA-INT-DB-003 — FK: user_id references users

    Purpose:      Verify §14 relationship.
    Preconditions: Migration applied.
    Steps:
      1. Attempt to insert an issue with an invalid user_id via Supabase SQL.
    Expected:     Rejected by FK constraint.
    Actual:
    Status:       NOT RUN

### QA-INT-DB-004 — FK: issue_id in issue_updates references issues

    Purpose:      Verify §14 relationship.
    Preconditions: Migration applied.
    Steps:
      1. Attempt to insert an issue_update with an invalid issue_id.
    Expected:     Rejected by FK constraint.
    Actual:
    Status:       NOT RUN

### QA-INT-DB-005 — Status constraint enforces enum

    Purpose:      Verify §15 enum enforcement at DB level.
    Preconditions: Migration applied.
    Steps:
      1. Attempt to insert an issue with status = 'BANANA'.
    Expected:     Rejected by CHECK constraint.
    Actual:
    Status:       NOT RUN

### QA-INT-DB-006 — Priority constraint enforces enum

    Purpose:      Same as above for priority.
    Preconditions: Migration applied.
    Steps:
      1. Attempt to insert with priority = 'URGENT'.
    Expected:     Rejected.
    Actual:
    Status:       NOT RUN

### QA-INT-DB-007 — Timestamps use server time

    Purpose:      Verify no client-controlled timestamps.
    Preconditions: Issue created.
    Steps:
      1. Compare created_at to actual server time.
    Expected:     Within seconds; not client-supplied.
    Actual:
    Status:       BLOCKED

---

## G. NOTES

- Every test is BLOCKED pending real implementation of issues endpoints, DB
  migration, and auth.
- QA-INT-ISSUE-005 / 007 are flagged as BLOCKED on a Garv contract decision
  about server-derived fields.
- QA-INT-ISSUE-042, QA-INT-LIFE-005, QA-INT-ASSIGN-003, QA-INT-ASSIGN-004,
  QA-INT-ASSIGN-005 have policy ambiguities that Garv should decide.
- QA-INT-DB-003 through QA-INT-DB-006 are executable as soon as the migration
  exists — no backend required.
- No PASS status exists in this file.