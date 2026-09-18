# CAMPUSFIX AI — PHASE 2 INTEGRATION TEST PLAN

**Owner:** Lokesh Malik (QA + DevOps + Integration Support)
**Branch:** lokesh-main
**Phase:** 2 — Core Development (QA preparation)
**Source of truth:** CAMPUSFIX_ARCHITECTURE.md
**Status:** NOT RUN — plan authored, zero tests executed.

---

## 1. PURPOSE

This plan prepares integration test cases for the REAL CampusFix AI system as
backend, frontend, AI, database, auth, and storage come online during Phase 2.
It is authored now so that:

- Every integration surface is tested the moment it becomes executable.
- No contract mismatch survives to Phase 3.
- Every test is pre-shaped and only needs the "Actual result" filled in.
- No fabricated PASS ever enters the record.

**Nothing in this document or its companion files has been executed.**

---

## 2. WORKING ASSUMPTIONS (flagged, not guessed)

Per §32, ambiguous contract details are flagged rather than invented. The
following defaults were confirmed with Lokesh on 2026-09-19:

| # | Assumption | Flag |
|---|---|---|
| 1 | Auth token travels as `Authorization: Bearer <Supabase JWT>` | ASSUMPTION — verify against Gunjan's frontend interceptor and Rajveer's middleware |
| 2 | `POST /api/issues` returns 200 or 201 on success | AMBIGUITY — test asserts "200 or 201"; final value to be locked by Garv |
| 3 | Client-supplied `priority` / `category` / `department` on create | BLOCKED — architecture §18 implies server-derives; tests marked BLOCKED until Garv decides |
| 4 | Integration tests run manually with curl / Postman / browser | CONFIRMED — format is `.md` with copyable commands |

Any of these may be revised by Garv. When revised, the affected tests are
updated in the same commit, not silently.

---

## 3. TEST STATUS VALUES

Only these are permitted in any Phase 2 test file:

| Status | Meaning |
|---|---|
| NOT RUN | Authored, executable in principle, not yet executed. |
| BLOCKED | Cannot execute — dependency missing (endpoint, auth, DB, bucket, etc.). |
| PASS | Executed, observed result matched expected. |
| FAIL | Executed, observed result did not match expected. |

No PASS exists in Phase 2 preparation. The status column is populated only
after real execution.

---

## 4. TEST ID CONVENTION

    QA-INT-<AREA>-<NNN>

| Area | Range | File |
|---|---|---|
| AUTH | QA-INT-AUTH-001..050 | integration-auth.md |
| AUTZ | QA-INT-AUTZ-001..050 | integration-auth.md |
| ISSUE | QA-INT-ISSUE-001..080 | integration-issue-lifecycle.md |
| LIFECYCLE | QA-INT-LIFE-001..040 | integration-issue-lifecycle.md |
| ASSIGN | QA-INT-ASSIGN-001..030 | integration-issue-lifecycle.md |
| DB | QA-INT-DB-001..040 | integration-issue-lifecycle.md |
| AI | QA-INT-AI-001..050 | integration-ai.md |
| AIFB | QA-INT-AIFB-001..030 | integration-ai.md |
| QUERY | QA-INT-QUERY-001..050 | integration-query.md |
| ERR | QA-INT-ERR-001..050 | integration-errors.md |
| INVAL | QA-INT-INVAL-001..050 | integration-errors.md |
| UNAUTH | QA-INT-UNAUTH-001..030 | integration-errors.md |
| FE-BE | QA-INT-FEBE-001..050 | integration-frontend-backend.md |
| SEC | QA-INT-SEC-001..040 | integration-security.md |
| ENV | QA-INT-ENV-001..030 | integration-security.md |

---

## 5. COVERAGE MAP — THE 19 REQUIRED AREAS

| # | Area | Where it lives |
|---|---|---|
| 1 | Authentication | integration-auth.md (AUTH) |
| 2 | Student authorization | integration-auth.md (AUTZ) |
| 3 | Admin authorization | integration-auth.md (AUTZ) |
| 4 | Issue creation | integration-issue-lifecycle.md (ISSUE) |
| 5 | AI classification | integration-ai.md (AI) |
| 6 | Issue listing | integration-query.md (QUERY) |
| 7 | Issue details | integration-issue-lifecycle.md (ISSUE) |
| 8 | Issue updates | integration-issue-lifecycle.md (ISSUE) |
| 9 | Status transitions | integration-issue-lifecycle.md (LIFECYCLE) |
| 10 | Assignment | integration-issue-lifecycle.md (ASSIGN) |
| 11 | Search / filter | integration-query.md (QUERY) |
| 12 | Error handling | integration-errors.md (ERR) |
| 13 | Invalid input | integration-errors.md (INVAL) |
| 14 | Unauthorized requests | integration-errors.md (UNAUTH) |
| 15 | Database persistence | integration-issue-lifecycle.md (DB) |
| 16 | AI failure / fallback | integration-ai.md (AIFB) |
| 17 | Frontend ↔ backend integration | integration-frontend-backend.md (FE-BE) |
| 18 | Security checks | integration-security.md (SEC) |
| 19 | Environment / secrets checks | integration-security.md (ENV) |

Every one of the 19 areas is covered. Nothing is skipped or deferred.

---

## 6. TEST CASE FORMAT

Every test in the companion files uses exactly this shape:

    TEST ID:      QA-INT-<AREA>-<NNN>
    Purpose:      one sentence — what is being verified
    Preconditions: what must be true before the test can run
    Steps:        numbered steps to reproduce
    Expected:     exact expected result (status code, body shape, DB state)
    Actual:       (blank — filled at execution time)
    Status:       NOT RUN | BLOCKED

No test uses any other shape. No test is marked PASS without a recorded
Actual result.

---

## 7. EXECUTION POLICY

1. Lokesh executes a test only when its Preconditions are satisfied by the
   live system.
2. Actual result is recorded verbatim — status code + response body or
   observed behavior.
3. FAIL produces a BLOCKER report to the responsible owner:
   - Backend failures → Rajveer Dhiman
   - Frontend failures → Gunjan Yadav
   - AI failures → Garv Nain
   - Integration failures → Lokesh escalates to Garv
4. Lokesh does NOT patch another member's code to make a test pass.
5. Contract changes required by a test are raised to Garv BEFORE implementation
   (§32), not silently accepted.

---

## 8. ENVIRONMENT PREREQUISITES FOR EXECUTION

Before any test in this plan can leave NOT RUN:

- [ ] Backend runs locally and responds on GET /api/health
- [ ] Supabase project provisioned (URL, anon key, service role key in .env)
- [ ] Supabase DB migration applied (§14 tables exist)
- [ ] Supabase Auth enabled
- [ ] Supabase Storage bucket created (for image tests)
- [ ] Gemini API key provisioned (or fallback-only mode decided by Garv)
- [ ] Frontend dev server runs locally
- [ ] Frontend points at local backend (VITE_API_BASE_URL)

Blocked on any of these → tests stay BLOCKED, not skipped.

---

## 9. COMPANION FILES (THE FULL PHASE 2 SET)

| # | File | Areas | Status |
|---|---|---|---|
| 1 | testing/PHASE2_INTEGRATION_TEST_PLAN.md | master index | this file |
| 2 | testing/test-cases/integration-auth.md | 1, 2, 3, 14 | authored |
| 3 | testing/test-cases/integration-issue-lifecycle.md | 4, 7, 8, 9, 10, 15 | authored |
| 4 | testing/test-cases/integration-ai.md | 5, 16 | authored |
| 5 | testing/test-cases/integration-query.md | 6, 11 | authored |
| 6 | testing/test-cases/integration-errors.md | 12, 13, 14 | authored |
| 7 | testing/test-cases/integration-frontend-backend.md | 17 | authored |
| 8 | testing/test-cases/integration-security.md | 18, 19 | authored |
| 9 | testing/PHASE2_FINAL_INTEGRATION_CHECKLIST.md | merge gate | authored |
| 10 | docs/PHASE2_QA_NOTES.md | interpretation notes | authored |

---

## 10. RELATIONSHIP TO PHASE 1 FILES

Phase 1 test files remain valid and are not superseded:

- testing/PHASE1_TEST_PLAN.md — framework-level plan
- testing/API_CONTRACT_CHECKLIST.md — contract compliance gate
- testing/test-cases/backend.md — health endpoint
- testing/test-cases/ai.md — AI endpoint unit-level
- testing/test-cases/issues.md — issue endpoint unit-level
- testing/test-cases/auth-future.md — reserved auth placeholders

Phase 2 files build on these with end-to-end integration flows. Where Phase 1
and Phase 2 IDs collide, Phase 1 IDs are referenced from Phase 2, not
duplicated.

---

## 11. REGRESSION POLICY

- Any merge into main triggers a re-run of all PASS tests.
- Any change to the API contract, DB schema, auth model, or AI response shape
  triggers a re-read of testing/API_CONTRACT_CHECKLIST.md and a re-run of
  affected tests.
- Regression failures are reported with the same BLOCKER format, not hidden.

---

## 12. PHASE 2 COMPLETION STATEMENT

This plan constitutes QA preparation for integration, not QA execution. No
test has been run. No PASS status exists.

Per the Phase Approval Rule (§29):

- Lokesh may report: MY WORK FOR PHASE 2 IS COMPLETE
- Lokesh may NOT report: PHASE 2 APPROVED
- Only Garv Nain may declare PHASE 2 APPROVED.