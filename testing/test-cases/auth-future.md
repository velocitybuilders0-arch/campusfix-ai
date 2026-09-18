---CUT---
# TEST CASES — AUTHENTICATION / AUTHORIZATION (FUTURE)

**Status:** ALL BLOCKED — pending Supabase Auth implementation (§16)
**Owner of implementation:** Rajveer Dhiman (backend enforcement), Gunjan Yadav (frontend flow), Garv Nain (Supabase config)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §14 (roles), §16 (authentication), §22 (errors), §26 (security)

---

## Why this file exists in Phase 1

Per the Phase 1 brief, authentication/authorization must be listed as **future
verification areas where implementation is not yet available**. This file
reserves the test IDs and documents the intent so that when auth lands, tests
are ready. Nothing here is executable yet.

**Every test in this file starts at `BLOCKED`.**

Scope chosen for this file: **medium depth** — the key role × endpoint
combinations that matter for demo safety, not an exhaustive matrix. Full
expansion happens in Phase 2 when the implementation exists.

---

## Roles (§14)
STUDENT
ADMIN
STAFF

## Permission intent (§16)
Student → Can create/view own issues
Staff/Admin → Can manage authorized issues
Admin → Can perform administrative operations

---

## A. Authentication

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AUTH-001 | Auth / Signup | Supabase Auth configured | Sign up new user via frontend | User created; row in `users` table | | BLOCKED |
| QA-AUTH-002 | Auth / Login | Existing user | Log in via frontend | Session token issued | | BLOCKED |
| QA-AUTH-003 | Auth / Login | Wrong password | Attempt login | Rejected; no session | | BLOCKED |
| QA-AUTH-004 | Auth / Protected route | Not logged in | Call `POST /api/issues` | 401 with §22 envelope | | BLOCKED |
| QA-AUTH-005 | Auth / Protected route | Not logged in | Call `GET /api/issues` | 401 with §22 envelope | | BLOCKED |
| QA-AUTH-006 | Auth / Token | Logged in | Call protected route with valid token | Accepted | | BLOCKED |
| QA-AUTH-007 | Auth / Token | Logged in | Call protected route with expired/invalid token | 401 with §22 envelope | | BLOCKED |
| QA-AUTH-008 | Auth / Logout | Logged in | Log out | Session cleared; subsequent protected calls 401 | | BLOCKED |
| QA-AUTH-009 | Auth / Roles | User row exists | Inspect `users.role` | One of `STUDENT`, `ADMIN`, `STAFF` | | BLOCKED |
| QA-AUTH-010 | Auth / Roles | Any request | Inspect backend logic | Role is read server-side from token/session, NOT trusted from request body (§16) | | BLOCKED |

---

## B. Authorization — issue access

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AUTZ-001 | AuthZ / Student | STUDENT logged in | GET own issue | 200 | | BLOCKED |
| QA-AUTZ-002 | AuthZ / Student | STUDENT logged in | GET another student's issue | 403/404 per §16 | | BLOCKED |
| QA-AUTZ-003 | AuthZ / Student | STUDENT logged in | GET issue list | Only own issues returned | | BLOCKED |
| QA-AUTZ-004 | AuthZ / Student | STUDENT logged in | PATCH own issue status to RESOLVED | Rejected (students cannot self-resolve) | | BLOCKED |
| QA-AUTZ-005 | AuthZ / Student | STUDENT logged in | DELETE own issue | Rejected per §16 (prefer status-based resolution) | | BLOCKED |
| QA-AUTZ-006 | AuthZ / Staff | STAFF logged in | GET broader issue list | Per role policy (§16) | | BLOCKED |
| QA-AUTZ-007 | AuthZ / Staff | STAFF logged in | PATCH issue priority | Allowed per role policy | | BLOCKED |
| QA-AUTZ-008 | AuthZ / Staff | STAFF logged in | PATCH issue assignment | Allowed per role policy | | BLOCKED |
| QA-AUTZ-009 | AuthZ / Staff | STAFF logged in | DELETE issue | Rejected per §16 (admin-only) | | BLOCKED |
| QA-AUTZ-010 | AuthZ / Admin | ADMIN logged in | GET full issue list | All issues visible | | BLOCKED |
| QA-AUTZ-011 | AuthZ / Admin | ADMIN logged in | PATCH issue status through full lifecycle | Allowed | | BLOCKED |
| QA-AUTZ-012 | AuthZ / Admin | ADMIN logged in | DELETE issue | Allowed per §16 | | BLOCKED |

---

## C. Cross-cutting auth concerns

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AUTZ-020 | AuthZ / Spoofing | STUDENT logged in | POST with body `{ "role": "ADMIN" }` | Role ignored; effective role still STUDENT (§16) | | BLOCKED |
| QA-AUTZ-021 | AuthZ / Spoofing | STUDENT logged in | POST with body `{ "user_id": <other-user-id> }` | `user_id` taken from session, not body (§16) | | BLOCKED |
| QA-AUTZ-022 | AuthZ / Frontend | STUDENT logged in | Manually navigate to admin URL in frontend | Route protected; backend also enforces (§16, §26) | | BLOCKED |
| QA-AUTZ-023 | AuthZ / Consistency | Any role | Same request via frontend and direct API call | Same authorization outcome — no frontend-only gates | | BLOCKED |

---

## D. Security overlay (§26)

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-SEC-001 | Security / Secrets | Repo cloned fresh | Inspect tracked files | No `.env` with real values committed | | NOT RUN |
| QA-SEC-002 | Security / Secrets | Repo cloned fresh | Grep for known key patterns | No Supabase/Gemini keys in source | | NOT RUN |
| QA-SEC-003 | Security / Env | Server running | Inspect client bundle | No server-only secrets (e.g. service role key) reachable from browser | | NOT RUN |
| QA-SEC-004 | Security / Validation | Server running | Send malformed input to any endpoint | Rejected with §22 envelope; no stack trace leaked | | NOT RUN |
| QA-SEC-005 | Security / SQL | Code review | Inspect DB access | Parameterized queries or Supabase client only (§15) | | NOT RUN |
| QA-SEC-006 | Security / Upload | Upload route live | Upload disallowed file type | Rejected; not stored (§17) | | BLOCKED |
| QA-SEC-007 | Security / Upload | Upload route live | Upload file exceeding size limit | Rejected; not stored (§17) | | BLOCKED |

---

## Notes

- Rows marked `NOT RUN` in section D are executable today (no auth dependency)
  and become part of the Phase 1/2 QA sweep.
- Rows marked `BLOCKED` depend on Supabase Auth wiring (§16). When it lands,
  run them in order: A → B → C → then re-run any regressions.
- QA-AUTZ-020 / 021 enforce the §16 rule: "The backend must not blindly trust
  user-provided role information."
- Section D is intentionally mixed into this file because security hygiene is
  an auth concern; the secret-hygiene items are duplicated in
  `docs/ENVIRONMENT_CHECKLIST.md` for visibility.
---CUT---