# PHASE 2 INTEGRATION TEST CASES — AUTHENTICATION & AUTHORIZATION

**Covers required areas:** 1 (Authentication), 2 (Student authorization), 3 (Admin authorization), 14 (Unauthorized requests)
**Owners of implementation:** Rajveer Dhiman (backend enforcement), Gunjan Yadav (frontend flow), Garv Nain (Supabase Auth config)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §14 (roles), §16 (auth), §22 (error envelope), §26 (security)

**Working assumption (flagged):** auth token travels as
`Authorization: Bearer <Supabase JWT>` header. If Rajveer implements a different
mechanism, every test in this file is updated — not silently re-interpreted.

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-AUTH-NNN / QA-INT-AUTZ-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. AUTHENTICATION (Area 1)

### QA-INT-AUTH-001 — Sign up new user

    Purpose:      Verify Supabase Auth creates a user and a users-table row.
    Preconditions: Supabase project provisioned; auth enabled; DB migration applied.
    Steps:
      1. Open frontend login/signup page.
      2. Submit a valid new email + password.
      3. Inspect Supabase auth.users table.
      4. Inspect the app users table.
    Expected:     User created in auth.users; row created in users table with role = STUDENT by default.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-002 — Login with valid credentials

    Purpose:      Verify a valid login yields a session token.
    Preconditions: A confirmed user exists.
    Steps:
      1. Submit valid email + password.
      2. Inspect the response.
      3. Check browser storage / cookies for session token.
    Expected:     Session token issued; frontend stores it; subsequent calls include Authorization header.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-003 — Login with wrong password

    Purpose:      Verify wrong credentials do not produce a session.
    Preconditions: A confirmed user exists.
    Steps:
      1. Submit valid email + wrong password.
      2. Inspect the response.
    Expected:     401 (or Supabase auth error); no session token issued.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-004 — Protected route without token

    Purpose:      Verify backend rejects unauthenticated requests.
    Preconditions: Backend running; POST /api/issues exists.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues with a valid body but NO Authorization header.
    Expected:     401; body matches §22 envelope { success: false, error: { message: <string> } }.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-005 — Protected route with valid token

    Purpose:      Verify backend accepts a valid bearer token.
    Preconditions: A valid session token is available.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues -H "Authorization: Bearer <token>" with a valid body.
    Expected:     Request proceeds; issue is created; 200 or 201 returned.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-006 — Protected route with expired/invalid token

    Purpose:      Verify backend rejects a forged/expired token.
    Preconditions: Backend running; a random string is available.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues -H "Authorization: Bearer not-a-real-token" with a valid body.
    Expected:     401; §22 envelope; no DB write.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-007 — Logout clears session

    Purpose:      Verify logout ends the session.
    Preconditions: Logged-in frontend session.
    Steps:
      1. Log out via UI.
      2. Attempt a protected call with the previously-used token.
    Expected:     Session cleared; subsequent protected calls return 401.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-008 — Role is read server-side, not from body

    Purpose:      Verify §16 rule: backend must not trust client-supplied role.
    Preconditions: A STUDENT is logged in.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues with body { "role": "ADMIN", "title": "...", "description": "..." } and the student's bearer token.
    Expected:     Effective role remains STUDENT; the "role" field is ignored.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-009 — User identity is read server-side

    Purpose:      Verify user_id comes from session, not from body.
    Preconditions: A STUDENT is logged in.
    Steps:
      1. curl -X POST http://localhost:5000/api/issues with body { "user_id": <some-other-user>, "title": "...", "description": "..." } and the student's bearer token.
    Expected:     Created issue's user_id equals the logged-in student's id, NOT the body value.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTH-010 — Auth token transmitted as Bearer header

    Purpose:      Confirm the assumption about token transport.
    Preconditions: Frontend dev server running; network tab available.
    Steps:
      1. Log in.
      2. Perform a protected action.
      3. Inspect the network request headers.
    Expected:     Authorization header present with "Bearer <token>" value.
    Actual:
    Status:       BLOCKED

---

## B. STUDENT AUTHORIZATION (Area 2)

### QA-INT-AUTZ-001 — Student sees only own issues in list

    Purpose:      Verify §16 filtering: students see only their own issues.
    Preconditions: Two students exist; each has issues.
    Steps:
      1. Log in as student A.
      2. GET /api/issues.
    Expected:     Only issues where user_id = student A's id are returned.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-002 — Student cannot fetch another student's issue detail

    Purpose:      Verify detail-level ownership enforcement.
    Preconditions: Student A logged in; issue owned by student B exists.
    Steps:
      1. GET /api/issues/<student-B-issue-id> as student A.
    Expected:     403 or 404 per §16; no leakage of issue content.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-003 — Student cannot update another student's issue

    Purpose:      Verify write-side ownership enforcement.
    Preconditions: Student A logged in; issue owned by student B exists.
    Steps:
      1. PATCH /api/issues/<student-B-issue-id> with { "priority": "HIGH" } as student A.
    Expected:     403; issue unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-004 — Student cannot self-resolve issue

    Purpose:      Verify students cannot close their own issues.
    Preconditions: Student A logged in; own issue exists with status OPEN.
    Steps:
      1. PATCH /api/issues/<own-id> with { "status": "RESOLVED" } as student A.
    Expected:     403 (or 400 per transition policy); issue status unchanged.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-005 — Student cannot delete issue

    Purpose:      Verify delete is admin-only.
    Preconditions: Student A logged in; own issue exists.
    Steps:
      1. DELETE /api/issues/<own-id> as student A.
    Expected:     403 per §16.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-006 — Student cannot assign issue

    Purpose:      Verify assignment is privileged.
    Preconditions: Student A logged in; own issue exists.
    Steps:
      1. PATCH /api/issues/<own-id> with { "assigned_to": <some-staff-id> } as student A.
    Expected:     403; assigned_to unchanged.
    Actual:
    Status:       BLOCKED

---

## C. ADMIN AUTHORIZATION (Area 3)

### QA-INT-AUTZ-020 — Admin sees full issue list

    Purpose:      Verify broad read access for ADMIN.
    Preconditions: Admin logged in; multiple issues exist from multiple students.
    Steps:
      1. GET /api/issues as admin.
    Expected:     200; all issues returned, not just admin's own.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-021 — Admin can update any issue

    Purpose:      Verify ADMIN can modify issues they do not own.
    Preconditions: Admin logged in; issue owned by a student exists.
    Steps:
      1. PATCH /api/issues/<student-issue-id> with { "priority": "HIGH" } as admin.
    Expected:     200; issue updated.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-022 — Admin can assign issue to staff

    Purpose:      Verify assignment permission for ADMIN.
    Preconditions: Admin logged in; a STAFF user exists.
    Steps:
      1. PATCH /api/issues/<issue-id> with { "assigned_to": <staff-id> } as admin.
    Expected:     200; assigned_to updated; status may move to ASSIGNED if lifecycle rule applies.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-023 — Admin can delete issue

    Purpose:      Verify ADMIN delete per §16.
    Preconditions: Admin logged in; a throwaway issue exists.
    Steps:
      1. DELETE /api/issues/<throwaway-id> as admin.
      2. GET /api/issues/<throwaway-id>.
    Expected:     200 on delete; 404 on subsequent GET.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-024 — Admin can drive status through full lifecycle

    Purpose:      Verify ADMIN can advance status without restriction.
    Preconditions: Admin logged in; issue at OPEN.
    Steps:
      1. PATCH status to ASSIGNED, then IN_PROGRESS, then RESOLVED, then CLOSED.
    Expected:     Each transition accepted if valid per lifecycle; invalid transitions rejected.
    Actual:
    Status:       BLOCKED

### QA-INT-AUTZ-025 — STAFF (non-admin) cannot delete

    Purpose:      Verify delete is ADMIN-only, not STAFF.
    Preconditions: STAFF logged in; an issue exists.
    Steps:
      1. DELETE /api/issues/<id> as staff.
    Expected:     403.
    Actual:
    Status:       BLOCKED

---

## D. UNAUTHORIZED REQUESTS (Area 14)

### QA-INT-UNAUTH-001 — No token on GET /api/issues

    Purpose:      Verify unauthenticated list is rejected.
    Preconditions: Backend running.
    Steps:
      1. curl http://localhost:5000/api/issues with NO Authorization header.
    Expected:     401; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-002 — No token on PATCH

    Purpose:      Verify unauthenticated write is rejected.
    Preconditions: Backend running; an issue id exists.
    Steps:
      1. curl -X PATCH http://localhost:5000/api/issues/<id> with no Authorization header.
    Expected:     401; §22 envelope; no DB write.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-003 — Malformed Authorization header

    Purpose:      Verify malformed header is rejected cleanly.
    Preconditions: Backend running.
    Steps:
      1. curl -H "Authorization: Bearer" (no token) http://localhost:5000/api/issues.
      2. curl -H "Authorization: NotBearer xyz" http://localhost:5000/api/issues.
    Expected:     401 both times; §22 envelope; no stack trace.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-004 — Expired token

    Purpose:      Verify expired tokens are rejected.
    Preconditions: A token that has been expired (or forged with past exp).
    Steps:
      1. curl with the expired token.
    Expected:     401; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-UNAUTH-005 — Frontend-only route protection does not substitute for backend

    Purpose:      Verify backend enforces even if frontend route is bypassed.
    Preconditions: STUDENT logged in; frontend has an admin-only route.
    Steps:
      1. Manually navigate the frontend to /admin (bypass any client-side guard).
      2. Attempt admin actions via direct API calls.
    Expected:     Backend rejects with 403; no data leak; no action succeeds.
    Actual:
    Status:       BLOCKED

---

## E. NOTES

- Every test is BLOCKED pending Supabase Auth integration and role enforcement
  in the backend (§16).
- Assumption (Bearer JWT) is flagged at the top; if Rajveer implements cookie
  sessions, update all curl-based steps.
- Tests QA-INT-AUTH-008 and QA-INT-AUTH-009 enforce the §16 rule that role and
  identity come from the server's view of the token, never from the body.
- No PASS status exists in this file.