# CAMPUSFIX AI — PHASE 2 FINAL INTEGRATION CHECKLIST

**Owner of verification:** Garv Nain (Team Lead)
**Author:** Lokesh Malik (QA)
**Phase:** 2 — Core Development
**Source of truth:** CAMPUSFIX_ARCHITECTURE.md §28, §29, §30, §32
**Status:** AWAITING USE — no row has been marked PASS. The merge gate at the
end of Phase 2 has not been run.

---

## 1. PURPOSE

This checklist is the merge-gate tool Garv uses when all four branches are
brought together at the end of Phase 2. It verifies that:

- Every member's Phase 2 deliverable is present.
- Integration actually works end-to-end.
- No unauthorized changes crossed component boundaries.
- No secrets leaked.
- Branch state is safe to merge.
- No test PASS was fabricated.

**This is a checklist for Garv. Lokesh authors it, but does NOT run the merge
or approve the phase.**

---

## 2. HOW TO USE

Garv runs this checklist AFTER all four branches are considered complete, and
BEFORE any merge into main.

For each item:
- [ ] PASS — verified by Garv
- [ ] FAIL — does not meet the requirement; blocker
- [ ] BLOCKED — cannot verify due to external dependency
- [ ] N/A — explicitly out of scope

A single FAIL blocks merge. Fix and re-run the whole checklist.

---

## 3. BRANCH STATE VERIFICATION

- [ ] All four branches exist on origin:
       - origin/garv-main
       - origin/rajveer-main
       - origin/gunjan-main
       - origin/lokesh-main
- [ ] Each branch's HEAD is a clean commit
- [ ] No branch has uncommitted changes pushed (check via GitHub)
- [ ] No branch is behind its own origin
- [ ] No force-push history rewrite on any branch
- [ ] main has not received direct commits from any member during Phase 2

---

## 4. PER-BRANCH DELIVERABLES

### 4.1 Rajveer Dhiman — backend/

Branch: `rajveer-main`

- [ ] Health endpoint implemented and passing QA-HLTH-001..010
- [ ] At least one issue endpoint implemented (create or list)
- [ ] Error middleware uses §22 envelope
- [ ] No secrets committed
- [ ] No unauthorized folder changes

### 4.2 Gunjan Yadav — frontend/

Branch: `gunjan-main`

- [ ] Frontend scaffold renders in browser
- [ ] At least one real API call made to backend
- [ ] Loading, empty, and error states exist for at least one screen
- [ ] No hardcoded mock data in production paths (or clearly marked temporary)
- [ ] No secrets in frontend bundle

### 4.3 Garv Nain — ai/

Branch: `garv-main`

- [ ] AI service skeleton exists with Gemini path + fallback path separated
- [ ] AI output validation exists (§19)
- [ ] At least one test for validation or fallback
- [ ] ai/ does not import backend/ or frontend/ code
- [ ] No secrets committed
- [ ] CAMPUSFIX_ARCHITECTURE.md unchanged or changes deliberate and communicated

### 4.4 Lokesh Malik — testing/ + docs/

Branch: `lokesh-main`

- [ ] Phase 1 files intact (10 files)
- [ ] Phase 2 integration plan added
- [ ] Phase 2 test-case files added (7 files)
- [ ] Phase 2 final integration checklist added
- [ ] Phase 2 QA notes added
- [ ] All test cases use the required format and only NOT RUN / BLOCKED / PASS / FAIL statuses
- [ ] No PASS was marked without execution
- [ ] No unauthorized folder changes

---

## 5. END-TO-END INTEGRATION GATES

These map directly to Phase 2 test-case files. Each gate is a single test
whose result stands in for a whole file's readiness.

### 5.1 Frontend → Backend → Database

- [ ] FE loads and calls BE `/api/health` successfully (QA-INT-FEBE-001)
- [ ] FE submits an issue; BE writes to DB; FE shows confirmation (QA-INT-FEBE-010)
- [ ] FE lists issues from BE (QA-INT-FEBE-022)
- [ ] FE opens issue detail from BE (QA-INT-FEBE-040)

### 5.2 Issue → AI → Validation → Database

- [ ] Creating an issue triggers AI analysis (QA-INT-AI-014)
- [ ] AI result validates against §19 (QA-INT-AI-002..006)
- [ ] Malformed AI output never persisted (QA-INT-AI-025)
- [ ] Issue created successfully even when AI falls back (QA-INT-AIFB-004)

### 5.3 Authentication path

- [ ] Login issues a session (QA-INT-AUTH-002)
- [ ] Protected routes reject unauthenticated calls (QA-INT-AUTH-004)
- [ ] Role is read server-side, not from body (QA-INT-AUTH-008)

### 5.4 Error handling

- [ ] Every 4xx uses §22 envelope (QA-INT-ERR-001..005)
- [ ] 500 uses §22 envelope; no stack trace leak (QA-INT-ERR-006)
- [ ] FE displays backend error message (QA-INT-ERR-021)

---

## 6. CROSS-CUTTING SAFETY

- [ ] No `.env` file tracked in any branch
- [ ] `.gitignore` unchanged (still ignores `.env` and `.env.*`)
- [ ] `.env.example` remains placeholder-only
- [ ] No secrets visible in any branch's diff vs main
- [ ] No member modified another member's owned folder
- [ ] No undeclared endpoints invented
- [ ] No undeclared DB fields invented
- [ ] No phase was started before its predecessor was approved

---

## 7. REGRESSION GATE

Before merge to main:

- [ ] All Phase 1 QA-HLTH tests re-run: PASS
- [ ] All Phase 1 QA-ISS tests that are now executable: PASS or explicitly BLOCKED with reason
- [ ] All Phase 2 integration tests that are now executable: PASS or explicitly BLOCKED with reason
- [ ] No regression from previously PASS status to FAIL
- [ ] All BLOCKED tests have a documented reason and owner

No test may transition to PASS unless an Actual result was recorded.

---

## 8. MERGE READINESS

Garv confirms before merging:

- [ ] All four branches reviewed
- [ ] No branch contains secrets
- [ ] No branch contains unauthorized modifications
- [ ] Merge conflict resolution plan documented
- [ ] Merge will be to main, once, deliberately
- [ ] No member will force push after merge

If any check fails, do not merge. Fix first.

---

## 9. BLOCKER SUMMARY

| # | Member | Blocker | Owner | Decision required |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

No merge occurs with an open blocker.

---

## 10. PHASE 2 DECISION

Mark ONE:

- [ ] PHASE 2 VERIFIED — all gates pass; safe to merge
- [ ] PHASE 2 NOT VERIFIED — blockers exist (see section 9)

If verified, Garv may declare:

    PHASE 2 APPROVED

If not verified, Garv lists what must be fixed. No member starts Phase 3
before Phase 2 is approved (§29).

---

## 11. SIGN-OFF

**Verified by (Garv Nain):** _______________________  Date: _________

**Decision:**  PHASE 2 APPROVED  /  PHASE 2 NOT APPROVED  (circle one)

**Notes:**

__________________________________________________________________

__________________________________________________________________

---

## 12. IMPORTANT REMINDERS

- Lokesh authored this checklist but does NOT run the merge or approve the phase.
- Only Garv approves (§29).
- A phase is not approved merely because an AI assistant said so.
- Do not start Phase 3 until Phase 2 is formally approved.
- Merging all branches into main does NOT itself approve the phase.