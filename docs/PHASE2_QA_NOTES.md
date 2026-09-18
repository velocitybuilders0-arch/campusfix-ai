# CAMPUSFIX AI — PHASE 2 QA NOTES

**Author:** Lokesh Malik (QA + DevOps + Integration Support)
**Audience:** Garv Nain (Team Lead), Rajveer Dhiman (Backend), Gunjan Yadav (Frontend)
**Phase:** 2 — Core Development
**Status:** INFORMATION — not a test artifact, not a phase approval.

---

## 1. PURPOSE

This document collects the QA-side interpretation notes, flagged assumptions,
and open decisions that came out of authoring the Phase 2 integration test
plan. It exists so that:

- Ambiguities are visible in one place, not buried in 7 test files.
- Decisions requested from Garv are listed together.
- Test IDs that are BLOCKED have a documented reason.
- Contract drift risks are called out before implementation closes.

**Nothing in this document is a test result. Nothing is a phase approval.**

---

## 2. WORKING ASSUMPTIONS TAKEN

These were confirmed with Lokesh on 2026-09-19 (defaults accepted). They may
be revised by Garv at any time. If revised, affected tests are updated in the
same commit — not silently.

| # | Assumption | Where it appears | Impact if wrong |
|---|---|---|---|
| 1 | Auth token travels as `Authorization: Bearer <Supabase JWT>` | integration-auth.md (all AUTH / AUTZ tests), integration-frontend-backend.md QA-INT-FEBE-003 | All curl steps in auth tests rewritten if cookie-based |
| 2 | `POST /api/issues` returns 200 or 201 on success | integration-issue-lifecycle.md QA-INT-ISSUE-001 | Minor — assert "200 or 201" becomes a single value |
| 3 | Client-supplied `priority` / `category` / `department` policy is undecided | integration-issue-lifecycle.md QA-INT-ISSUE-005, 007 | Tests stay BLOCKED until Garv decides |

---

## 3. OPEN CONTRACT DECISIONS FOR GARV

Listed in priority order. Each blocks at least one test.

### Decision 1 — Server-derived vs client-supplied AI fields

**Question:** On `POST /api/issues`, are `category`, `priority`, and `department`
accepted from the client body, or always derived server-side from AI?

**Architecture reading:** §18 implies AI derives these during issue creation.
But the endpoint contract in §13 does not explicitly forbid client supply.

**Blocks:** QA-INT-ISSUE-005, QA-INT-ISSUE-007, QA-INT-INVAL-010,
QA-INT-FEBE-010, QA-INT-SEC-025.

**Decision needed by:** Before Rajveer implements POST /api/issues.

---

### Decision 2 — Status transition policy

**Question:** For `REJECTED`, which states can transition into it? Is a
reverse transition (e.g. CLOSED → OPEN) ever permitted (admin override)?

**Architecture reading:** §13 lists the linear lifecycle OPEN → ASSIGNED →
IN_PROGRESS → RESOLVED → CLOSED plus REJECTED. Reverse transitions not
explicitly addressed.

**Blocks:** QA-INT-LIFE-005, QA-INT-LIFE-006.

**Decision needed by:** Before Rajveer implements PATCH status.

---

### Decision 3 — Assignment authority and target

**Question:**
- Can STAFF assign to themselves?
- Can STAFF assign to another STAFF?
- Can an ADMIN assign to another ADMIN?
- Must the target always be a STAFF user, or can an ADMIN also be assigned?
- Does setting `assigned_to` automatically move status to ASSIGNED?

**Architecture reading:** §16 says "Staff/Admin → Can manage authorized issues".
"Authorized" is not defined in role terms.

**Blocks:** QA-INT-ASSIGN-003, QA-INT-ASSIGN-004, QA-INT-ASSIGN-005.

**Decision needed by:** Before Rajveer implements PATCH assigned_to.

---

### Decision 4 — Search / filter scope

**Question:**
- Which query parameter names are canonical? (`search` vs `q`, `status` vs `state`, etc.)
- Are search and filter server-side, client-side, or both?
- Are they implemented in Phase 2 or deferred?

**Architecture reading:** §13 says "Supports appropriate filtering/search
parameters when implemented." §6 says do not guess.

**Blocks:** all of QA-INT-QUERY-020 through QA-INT-QUERY-047.

**Decision needed by:** Before Rajveer or Gunjan begins search/filter work.

---

### Decision 5 — Cascading deletes

**Question:** When a user is deleted, what happens to their issues? When an
issue is deleted, what happens to its issue_updates?

**Architecture reading:** §15 requires referential integrity but does not
specify cascade vs restrict.

**Blocks:** QA-INT-DB-008 (in Phase 1 file issues.md) and DB-related regression.

**Decision needed by:** Before Supabase migration is finalized.

---

### Decision 6 — Rate limiting scope

**Question:** Is rate limiting in scope for the hackathon deliverable?

**Architecture reading:** §26 lists security requirements but not rate limiting.

**Blocks:** QA-INT-SEC-080, QA-INT-SEC-081, QA-INT-SEC-082.

**Decision needed by:** Before Phase 5 (deployment). Not blocking Phase 2.

---

### Decision 7 — AI failure mode when both provider and fallback fail

**Question:** If Gemini fails AND the local fallback also fails (e.g. bad
fallback logic), what happens to issue creation?

**Architecture reading:** §20 covers Gemini fallback but not fallback fallback.

**Blocks:** QA-INT-AIFB-008.

**Decision needed by:** Before Phase 3 integration.

---

### Decision 8 — Frontend env file

**Question:** Does the frontend have its own `.env.example` file, or do the
`VITE_*` variables live in the root `.env.example`?

**Architecture reading:** §21 lists shared variables. §27 lists deployment
targets. Frontend-specific env handling is unspecified.

**Blocks:** nothing critical, but affects `docs/ENVIRONMENT_CHECKLIST.md`.

**Decision needed by:** Phase 3.

---

## 4. TEST FILES SUMMARY

| File | Tests authored | Statuses used |
|---|---|---|
| integration-auth.md | 26 | BLOCKED |
| integration-issue-lifecycle.md | 33 | BLOCKED, NOT RUN (DB checks) |
| integration-ai.md | 28 | BLOCKED, NOT RUN (1 code-review test) |
| integration-query.md | 22 | BLOCKED |
| integration-errors.md | 30 | BLOCKED |
| integration-frontend-backend.md | 30 | BLOCKED, NOT RUN (2 code-review tests) |
| integration-security.md | 31 | BLOCKED, NOT RUN (7 code-review tests) |

**Approximate total: 200 integration test cases.**

**Executed: 0.**
**PASS: 0.**
**FAIL: 0.**
**BLOCKED: ~180.**
**NOT RUN (code-review-only, executable now): ~10.**

Exact numbers are recorded after all files are reviewed — these are the
authoring-time estimates.

---

## 5. IMMEDIATELY EXECUTABLE TESTS (code-review-only)

These do not require a running system. They can be executed as soon as the
relevant source exists.

| Test ID | File | What to check |
|---|---|---|
| QA-INT-FEBE-001 | integration-frontend-backend.md | API base URL from env, not hardcoded |
| QA-INT-FEBE-031 | integration-frontend-backend.md | No fake AI responses in prod paths |
| QA-INT-SEC-001 | integration-security.md | No .env in Git |
| QA-INT-SEC-002 | integration-security.md | .gitignore still correct |
| QA-INT-SEC-003 | integration-security.md | No API key strings in source |
| QA-INT-SEC-004 | integration-security.md | .env.example placeholder-only |
| QA-INT-SEC-007 | integration-security.md | No server secret uses VITE_ |
| QA-INT-SEC-064 | integration-security.md | No fake placeholder URLs |
| QA-INT-ENV-006 | integration-security.md | .env.example in sync with code |
| QA-INT-ENV-007 | integration-security.md | No hardcoded secret fallback |
| QA-INT-AIFB-007 | integration-ai.md | Fallback separated from Gemini path |
| QA-INT-DB-003..006 | integration-issue-lifecycle.md | Migration-level DB constraints |

These may be executed without waiting for backend/frontend runtime.

---

## 6. INTEGRATION ORDER RECOMMENDATION

To minimize cascade failures during Phase 3:

1. Health (FE → BE reachability)
2. Issue create (FE → BE → DB)
3. Issue list + detail (read path)
4. AI path on create
5. AI fallback path
6. Update / delete / updates
7. Auth-protected routes
8. Image upload
9. Full end-to-end sweep

Failures at step N must not be papered over to reach N+1. Record and report.

---

## 7. WHAT QA IS NOT DOING IN PHASE 2

Explicitly out of scope for this phase:

- Executing any test that requires backend / frontend / AI runtime that does
  not yet exist.
- Modifying backend/, frontend/, or ai/ code.
- Adding mock hooks to force AI failures — this must be provided by Garv.
- Running load or performance tests.
- Cross-browser matrix beyond one modern browser.
- Approving any phase. Only Garv approves.

---

## 8. WHAT QA NEEDS FROM THE TEAM

To unblock Phase 2 tests, QA needs:

- **From Garv:** decisions 1–8 above.
- **From Rajveer:**
  - Confirmation of auth token mechanism (Bearer vs cookie).
  - Confirmation of PATCH body semantics.
  - A test hook to trigger a 500 safely (for QA-INT-ERR-006).
  - Confirmation of search/filter parameter names.
- **From Gunjan:**
  - Confirmation of VITE_ variable names for the API base URL.
  - Confirmation of search/filter implementation (client or server).
  - Confirmation of AI-source display policy in the UI.

Requests are recorded here; they are not bugs. No member is at fault.

---

## 9. NO-CLAIM STATEMENT

This document does not:

- Approve any phase.
- Declare any test PASSED.
- Mark any member's work complete.
- Assert the system works.
- Substitute for real execution of the integration test cases.

It is an interpretation and coordination aid only.

---

## 10. CHANGE LOG

| Date | Change | Author |
|---|---|---|
| 2026-09-19 | Initial authoring for Phase 2 | Lokesh Malik |