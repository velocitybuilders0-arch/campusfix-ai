# CAMPUSFIX AI — PHASE 1 QA TEST PLAN

**Owner:** Lokesh Malik (QA + DevOps + Integration Support)
**Branch:** lokesh-main
**Phase:** 1 — Foundation
**Source of truth:** CAMPUSFIX_ARCHITECTURE.md
**Status:** NOT RUN — plan authored, no execution performed.

---

## 1. PURPOSE

This plan establishes the QA foundation for CampusFix AI so that backend,
frontend, AI, and integration work can be verified as it lands. It is written
in Phase 1, before most implementation exists, so that:

- Test cases exist in parallel with development.
- API contract compliance can be checked the moment endpoints appear.
- Integration mismatches are caught early, not at deployment.
- No feature is marked complete without an executed test.

This plan does NOT claim any test has passed. Every test below starts at
NOT RUN.

---

## 2. SCOPE

### In scope (approved system)

| Area | Endpoint / Surface | Architecture Ref |
|---|---|---|
| Health | GET /api/health | Master Prompt API Contract |
| AI Analysis | POST /api/ai/analyze | §18 |
| AI Validation | (internal) | §19 |
| AI Fallback | (internal) | §20 |
| Issue Create | POST /api/issues | §13 |
| Issue List | GET /api/issues | §13 |
| Issue Detail | GET /api/issues/:id | §13 |
| Issue Update | PATCH /api/issues/:id | §13 |
| Issue Update Add | POST /api/issues/:id/updates | §13 |
| Issue Delete | DELETE /api/issues/:id | §13 |
| Database Model | users, issues, issue_updates | §14, §15 |
| Auth / AuthZ | Supabase Auth, role enforcement | §16 |
| Image Upload | Supabase Storage | §17 |
| Error Handling | Standard envelope | §22 |
| Frontend UX | Forms, states, responsiveness | §23, §24 |
| Security | Secret hygiene, input validation | §26 |
| Integration | FE->BE->DB, Issue->AI->DB | §25 |

### Explicitly out of scope for Phase 1 execution

- Live database assertions (no schema/migration exists yet).
- Live auth assertions (Supabase Auth not yet wired).
- Live image upload assertions (Storage bucket not yet provisioned).
- Load / performance testing.
- Cross-browser matrix beyond a single modern browser.

These are planned, not skipped. They become executable in later phases.

---

## 3. TEST ID CONVENTION

    QA-<AREA>-<NNN>

| Area Code | Meaning |
|---|---|
| HLTH | Health endpoint |
| AI | AI analysis endpoint |
| AIVAL | AI output validation |
| AIFB | AI fallback |
| ISS | Issue CRUD endpoints |
| ISSV | Issue validation |
| AUTH | Authentication (future) |
| AUTZ | Authorization (future) |
| DB | Database model / rules |
| IMG | Image upload |
| ERR | Error handling |
| INT | Integration flows |
| UI | Frontend UX |
| SEC | Security / secret hygiene |

---

## 4. TEST STATUS VALUES

Only these four values are permitted:

| Status | Meaning |
|---|---|
| NOT RUN | Authored, not yet executed. Default state in Phase 1. |
| PASS | Executed, observed result matched expected. |
| FAIL | Executed, observed result did not match expected. |
| BLOCKED | Cannot execute — dependency missing. |

A test may only be marked PASS after it has actually been executed and the
observed output recorded in the Actual result column.

---

## 5. PRIORITY LEVELS

| Level | Meaning |
|---|---|
| P0 | Blocks the demo / core user journey. Must pass before Phase 5. |
| P1 | Core functionality. Must pass before Phase 4 exit. |
| P2 | Polish / edge cases. Fix if time permits. |

---

## 6. TEST CASE FILES

| File | Covers |
|---|---|
| testing/test-cases/backend.md | GET /api/health |
| testing/test-cases/ai.md | POST /api/ai/analyze, AI validation, AI fallback |
| testing/test-cases/issues.md | All six issue endpoints, validation, DB rules |
| testing/test-cases/auth-future.md | Auth/AuthZ — BLOCKED until implemented |

Each file uses the required 7-column structure:

    Test ID | Area | Preconditions | Action | Expected result | Actual result | Status

---

## 7. EXECUTION POLICY

1. Lokesh executes tests only when the relevant implementation exists.
2. Observed output is pasted verbatim into Actual result.
3. Status is set based on observed vs expected.
4. A FAIL produces a BLOCKER report to the responsible owner:
   - Backend failures -> Rajveer Dhiman
   - Frontend failures -> Gunjan Yadav
   - AI failures -> Garv Nain
5. Lokesh does NOT modify another member's component to make a test pass.
6. Cross-component changes require Garv's explicit approval.

---

## 8. REGRESSION POLICY

- Any merge into main triggers a re-run of all P0 tests.
- Any change to the API contract (paths, methods, response shape) triggers a
  re-run of testing/API_CONTRACT_CHECKLIST.md.
- Regression results are reported in the Completion Report, not silently.

---

## 9. PHASE 1 DELIVERABLES (THIS DOCUMENT SET)

| Deliverable | File | Status |
|---|---|---|
| Phase 1 QA Test Plan | testing/PHASE1_TEST_PLAN.md | Authored |
| Backend test cases | testing/test-cases/backend.md | Authored |
| AI test cases | testing/test-cases/ai.md | Authored |
| Issue endpoint test cases | testing/test-cases/issues.md | Authored |
| Auth future test cases | testing/test-cases/auth-future.md | Authored |
| API Contract Checklist | testing/API_CONTRACT_CHECKLIST.md | Authored |
| Integration Plan | docs/INTEGRATION_PLAN.md | Authored |
| Environment Checklist | docs/ENVIRONMENT_CHECKLIST.md | Authored |
| Git / Team Verification | docs/GIT_TEAM_VERIFICATION.md | Authored |
| Phase 1 Verification Checklist | docs/PHASE1_VERIFICATION_CHECKLIST.md | Authored |

No test in this plan has been executed. No PASS status exists in Phase 1.

---

## 10. PHASE 1 COMPLETION STATEMENT

This plan constitutes QA preparation, not QA execution. Per the Phase Approval
Rule (§29), only Garv Nain may declare Phase 1 approved.

Lokesh may report: MY WORK FOR PHASE 1 IS COMPLETE
Lokesh may NOT report: PHASE 1 APPROVED