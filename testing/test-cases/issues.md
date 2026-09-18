# TEST CASES — ISSUE ENDPOINTS

**Scope:** All six issue endpoints + validation + DB rules
**Owner of implementation:** Rajveer Dhiman (backend), Gunjan Yadav (frontend consumers)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §13 Issue Workflow, §14 Database Model, §15 Database Rules, §19 Validation, §22 Error Handling

All tests start at NOT RUN. Nothing here has been executed.

---

## A. Create — POST /api/issues

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-ISS-001 | Issues / Create | Server running; DB reachable; auth as required by current phase | POST with { "title": "Fan not working", "description": "Room 204 ceiling fan not turning on" } | HTTP 201 (or 200 per agreed contract) | | NOT RUN |
| QA-ISS-002 | Issues / Create | Same | Same | success === true; created issue returned with id | | NOT RUN |
| QA-ISS-003 | Issues / Create | Same | Same | Returned issue has valid status from lifecycle enum | | NOT RUN |
| QA-ISS-004 | Issues / Create | Same | Same | user_id set to authenticated user; NOT client-supplied | | NOT RUN |
| QA-ISS-005 | Issues / Create | Same | Same | created_at and updated_at populated | | NOT RUN |
| QA-ISS-006 | Issues / Validation | Same | POST with empty title | Rejected 4xx; §22 envelope; no DB write | | NOT RUN |
| QA-ISS-007 | Issues / Validation | Same | POST with missing description | Rejected 4xx; §22 envelope | | NOT RUN |
| QA-ISS-008 | Issues / Validation | Same | POST with title > max length (define limit with Rajveer) | Rejected 4xx | | NOT RUN |
| QA-ISS-009 | Issues / Validation | Same | POST with title: 123 (non-string) | Rejected 4xx | | NOT RUN |
| QA-ISS-010 | Issues / Create | Same | POST with client-supplied status: "RESOLVED" | Server ignores or rejects; created issue starts at OPEN | | NOT RUN |
| QA-ISS-011 | Issues / Create | Same | POST with client-supplied priority: "CRITICAL" | Per contract (flag ambiguity to Garv); must not violate §19 | | NOT RUN |
| QA-ISS-012 | Issues / Create | Same | POST with malformed JSON body | Rejected 4xx; §22 envelope; no 500 | | NOT RUN |

---

## B. List — GET /api/issues

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-ISS-020 | Issues / List | At least one issue exists | GET /api/issues | HTTP 200; success === true; array of issues | | NOT RUN |
| QA-ISS-021 | Issues / List | No issues exist | GET /api/issues | HTTP 200; empty array (NOT 404) | | NOT RUN |
| QA-ISS-022 | Issues / List | Multiple issues | Inspect returned issues | Each has required fields per §14 | | NOT RUN |
| QA-ISS-023 | Issues / List | Multiple issues, current user is STUDENT | Inspect returned issues | Only issues owned by the caller (§16) | | BLOCKED |
| QA-ISS-024 | Issues / List | Multiple issues, current user is ADMIN | Inspect returned issues | Broader access per role (§16) | | BLOCKED |
| QA-ISS-025 | Issues / List | Multiple issues | GET /api/issues?status=OPEN | Filtered correctly (if filtering implemented) | | NOT RUN |
| QA-ISS-026 | Issues / List | Multiple issues | GET /api/issues?priority=HIGH | Filtered correctly (if implemented) | | NOT RUN |
| QA-ISS-027 | Issues / List | Multiple issues | GET /api/issues?category=Electrical | Filtered correctly (if implemented) | | NOT RUN |
| QA-ISS-028 | Issues / List | Multiple issues | GET /api/issues?search=fan | Search works (if implemented) | | NOT RUN |
| QA-ISS-029 | Issues / List | Server running | POST /api/issues (wrong method) | Rejected 404/405 | | NOT RUN |

---

## C. Detail — GET /api/issues/:id

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-ISS-040 | Issues / Detail | Known valid issue id | GET /api/issues/<valid-id> | HTTP 200; success === true; issue object | | NOT RUN |
| QA-ISS-041 | Issues / Detail | Nonexistent id (e.g. 999999) | GET /api/issues/999999 | 404 with §22 envelope; no 500 | | NOT RUN |
| QA-ISS-042 | Issues / Detail | Malformed id (e.g. abc) | GET /api/issues/abc | 4xx with §22 envelope; no 500 | | NOT RUN |
| QA-ISS-043 | Issues / Detail | Known valid id | Inspect returned object | All §14 core fields present | | NOT RUN |
| QA-ISS-044 | Issues / Detail | Issue owned by another user, caller is STUDENT | GET /api/issues/<other-id> | 403 or 404 per §16 | | BLOCKED |

---

## D. Update — PATCH /api/issues/:id

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-ISS-050 | Issues / Update | Known valid issue | PATCH { "priority": "HIGH" } as authorized user | HTTP 200; success === true; updated issue returned | | NOT RUN |
| QA-ISS-051 | Issues / Update | Known valid issue | PATCH { "status": "IN_PROGRESS" } from OPEN | Accepted if transition valid per lifecycle (§13/README) | | NOT RUN |
| QA-ISS-052 | Issues / Update | Issue status = CLOSED | PATCH { "status": "OPEN" } | Rejected; invalid transition per §13 | | NOT RUN |
| QA-ISS-053 | Issues / Update | Issue status = RESOLVED | PATCH { "status": "IN_PROGRESS" } | Rejected; invalid transition | | NOT RUN |
| QA-ISS-054 | Issues / Update | Known valid issue | PATCH { "status": "BANANA" } (invalid enum) | Rejected 4xx with §22 envelope | | NOT RUN |
| QA-ISS-055 | Issues / Update | Known valid issue | PATCH { "priority": "URGENT" } (invalid enum) | Rejected 4xx with §22 envelope | | NOT RUN |
| QA-ISS-056 | Issues / Update | Known valid issue | PATCH { "assigned_to": <valid-user-id> } | Accepted if authorized; assigned_to updated | | NOT RUN |
| QA-ISS-057 | Issues / Update | Nonexistent id | PATCH /api/issues/999999 | 404 with §22 envelope | | NOT RUN |
| QA-ISS-058 | Issues / Update | Caller is STUDENT (not owner) | PATCH <other-user-issue> | Rejected 403/404 | | BLOCKED |
| QA-ISS-059 | Issues / Update | Caller is STUDENT (owner) | PATCH { "status": "RESOLVED" } | Rejected; students cannot self-resolve | | BLOCKED |
| QA-ISS-060 | Issues / Update | Known valid issue | PATCH { "updated_at": ... } (client-supplied) | Server ignores; uses server timestamp | | NOT RUN |
| QA-ISS-061 | Issues / Update | Known valid issue | PATCH { "id": "hacked" } (immutable field) | Ignored or rejected; id unchanged | | NOT RUN |

---

## E. Add Update — POST /api/issues/:id/updates

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-ISS-070 | Issues / Updates | Known valid issue | POST { "message": "Electrician has been assigned to inspect the fan." } | HTTP 200/201; success === true; update record returned | | NOT RUN |
| QA-ISS-071 | Issues / Updates | Same | Same | New row in issue_updates with issue_id, message, status, created_at per §14 | | NOT RUN |
| QA-ISS-072 | Issues / Updates | Same | POST { "message": "" } | Rejected 4xx; §22 envelope | | NOT RUN |
| QA-ISS-073 | Issues / Updates | Same | POST with no message key | Rejected 4xx | | NOT RUN |
| QA-ISS-074 | Issues / Updates | Nonexistent issue id | POST /api/issues/999999/updates | 404 with §22 envelope | | NOT RUN |
| QA-ISS-075 | Issues / Updates | Known valid issue | POST with optional status field | If accepted, issue_updates.status persists; issue status update follows lifecycle rules | | NOT RUN |
| QA-ISS-076 | Issues / Updates | Known valid issue | POST as unauthorized user | Rejected | | BLOCKED |
| QA-ISS-077 | Issues / Updates | Known valid issue | POST with very long message (e.g. 10k chars) | Accepted or rejected cleanly per agreed limit; no 500 | | NOT RUN |

---

## F. Delete — DELETE /api/issues/:id

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-ISS-080 | Issues / Delete | Known valid issue | DELETE as authorized user | HTTP 200; success === true; issue removed | | NOT RUN |
| QA-ISS-081 | Issues / Delete | Same | DELETE, then GET same id | 404 | | NOT RUN |
| QA-ISS-082 | Issues / Delete | Issue has related issue_updates | DELETE issue | Cascade behavior defined and consistent per §15 | | NOT RUN |
| QA-ISS-083 | Issues / Delete | Nonexistent id | DELETE /api/issues/999999 | 404 with §22 envelope | | NOT RUN |
| QA-ISS-084 | Issues / Delete | Caller is STUDENT | DELETE | Rejected per §16 (students cannot delete) | | BLOCKED |
| QA-ISS-085 | Issues / Delete | Caller is STAFF (not admin) | DELETE | Rejected per §16 | | BLOCKED |
| QA-ISS-086 | Issues / Delete | Caller is ADMIN | DELETE | Allowed per §16 | | BLOCKED |

---

## G. Database rules (§14, §15)

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-DB-001 | DB / Schema | Migration applied | Inspect issues table | All §14 core fields present | | NOT RUN |
| QA-DB-002 | DB / Schema | Migration applied | Inspect issue_updates table | All §14 core fields present | | NOT RUN |
| QA-DB-003 | DB / Schema | Migration applied | Inspect users table | All §14 core fields present; no plaintext password column | | NOT RUN |
| QA-DB-004 | DB / Constraints | Migration applied | Attempt insert issue with invalid status | Rejected by constraint | | NOT RUN |
| QA-DB-005 | DB / Constraints | Migration applied | Attempt insert issue with invalid priority | Rejected by constraint | | NOT RUN |
| QA-DB-006 | DB / Constraints | Migration applied | Attempt insert issue with user_id referencing nonexistent user | Rejected by FK | | NOT RUN |
| QA-DB-007 | DB / Constraints | Migration applied | Attempt insert issue_updates with nonexistent issue_id | Rejected by FK | | NOT RUN |
| QA-DB-008 | DB / Integrity | Migration applied | Delete user with issues | Behavior defined (cascade or restrict) per §15 | | NOT RUN |
| QA-DB-009 | DB / Indexes | Migration applied | Inspect indexes | Indexes exist on FKs and common query columns (user_id, status, priority) | | NOT RUN |
| QA-DB-010 | DB / Timestamps | Migration applied | Insert issue | created_at and updated_at auto-populate | | NOT RUN |
| QA-DB-011 | DB / Safety | Code review | Inspect DB access layer | Uses Supabase client or parameterized queries; no raw string concatenation (§15) | | NOT RUN |

---

## Notes

- BLOCKED tests are blocked only on authentication/authorization implementation
  (§16). They become executable once Supabase Auth is wired.
- QA-ISS-011 and QA-ISS-075 have contract ambiguity (does the server accept
  client-supplied priority/status on create?). Flag to Garv before executing;
  do not guess.
- QA-DB-008 cascade behavior is a §15 decision that must be made explicitly.
  If undecided, mark BLOCKED and report to Rajveer.