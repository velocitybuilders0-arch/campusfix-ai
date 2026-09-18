# CAMPUSFIX AI — GIT / TEAM VERIFICATION CHECKLIST

**Owner:** Lokesh Malik (QA + DevOps)
**Phase:** 1 — Foundation
**Source of truth:** Master Prompt Git rules + §30 DeepSeek Agent Rules
**Status:** REFERENCE — each member runs this before starting and before reporting.

---

## 1. PURPOSE

This checklist gives every team member a repeatable pre-flight they can run
before starting work and before reporting completion. It exists so that:

- Nobody works on the wrong branch.
- Nobody commits another member's files.
- Nobody pushes secrets.
- Nobody declares work done without verification.
- Phase approval stays with Garv.

Run this checklist:
1. BEFORE starting any work session.
2. BEFORE reporting "MY WORK FOR PHASE X IS COMPLETE".

---

## 2. BRANCH MAP

| Member | Owns | Branch |
|---|---|---|
| Garv Nain | Team Lead + AI & Full-Stack | garv-main |
| Rajveer Dhiman | Backend | rajveer-main |
| Gunjan Yadav | Frontend | gunjan-main |
| Lokesh Malik | QA + DevOps + Integration | lokesh-main |

Rules:
- Never work directly on `main`.
- Never force push.
- Never rewrite Git history.
- Never merge into `main` without Garv's approval.

---

## 3. PRE-WORK CHECKLIST (run before starting)

- [ ] `git branch --show-current` returns MY branch
- [ ] `git status` shows clean working tree (or only my own uncommitted changes)
- [ ] `git pull` fetches latest without conflicts
- [ ] I have read CAMPUSFIX_ARCHITECTURE.md (at least the sections relevant to my task)
- [ ] I know which folders I own
- [ ] I have not touched another member's folder
- [ ] If my task changes an API contract, DB schema, or auth model, I have raised it with Garv FIRST (§32)
- [ ] I know which phase I am in
- [ ] I have not started work on a phase that is not yet approved by Garv

---

## 4. BEFORE COMMITTING

- [ ] `git diff` reviewed — every changed file is one I own or was approved to change
- [ ] No `.env` file staged
- [ ] No secret strings (eyJ..., AIza..., service_role=...) staged
- [ ] Commit message is focused and descriptive
- [ ] Commit touches ONE logical change (not "misc fixes")
- [ ] No unrelated files (IDE configs, personal notes, temp files)
- [ ] No `node_modules/`, `dist/`, `build/` accidentally staged
- [ ] No large binary files committed

---

## 5. BEFORE PUSHING

- [ ] `git status` shows only my intended commits ahead of remote
- [ ] Commit history is clean (no "fix fix fix" spam)
- [ ] I am NOT force-pushing
- [ ] I am NOT rewriting history
- [ ] My branch is up to date with remote (or I have rebased locally, not on shared branches)
- [ ] I am pushing to MY branch (rajveer-main / gunjan-main / garv-main / lokesh-main)

---

## 6. BEFORE REPORTING COMPLETION

Report only after ALL of these are true:

- [ ] My code/documentation is committed and pushed to MY branch
- [ ] I have run the relevant tests locally
- [ ] I am not claiming any test PASSED that I did not execute
- [ ] I have not declared another member's work complete
- [ ] I have not declared a phase approved
- [ ] I have flagged any blocker using the BLOCKER format (§31)
- [ ] I have not silently worked around an architectural conflict
- [ ] I have reported in the Completion Report format

The correct report phrase is:

    MY WORK FOR PHASE X IS COMPLETE

The incorrect phrase is:

    PHASE X APPROVED

Only Garv can approve a phase (§29).

---

## 7. OWNERSHIP MATRIX — WHO OWNS WHAT

| Folder | Owner | Who may modify |
|---|---|---|
| frontend/ | Gunjan Yadav | Gunjan only (Garv approves cross-changes) |
| backend/ | Rajveer Dhiman | Rajveer only (Garv approves cross-changes) |
| ai/ | Garv Nain | Garv only |
| testing/ | Lokesh Malik | Lokesh only |
| docs/ | Lokesh Malik | Lokesh only |
| CAMPUSFIX_ARCHITECTURE.md | Garv | Garv only |
| README.md | Garv | Garv only |

Violations:
- Touching another member's folder without written approval = unauthorized change.
- QA does not patch another member's code to make a test pass.

---

## 8. FORBIDDEN ACTIONS

Never do any of the following:

- Commit a real `.env` file
- Commit any API key, token, or password
- Force push to any branch
- Rewrite history (`git rebase -i` on shared branches, `git commit --amend` on pushed commits)
- Delete someone else's branch
- Push to `main` directly
- Merge without Garv's approval
- Mark a phase approved
- Claim a test passed without running it
- Modify another member's folder without written approval
- Invent endpoints, DB fields, or contracts
- Guess at ambiguous architecture — report the ambiguity instead (§35)

---

## 9. BLOCKER REPORTING FORMAT (§31)

If something is blocked, use exactly this format:

    BLOCKER
    What I was trying to do:
    What failed:
    Exact error:
    What I inspected:
    What I believe is missing:
    What decision is required:

Do not silently work around it. Do not modify other members' code to work
around it.

---

## 10. COMPLETION REPORT FORMAT

Every member reports in this shape:

    WORK COMPLETED
    Tests added:
    Tests executed:
    Passed:
    Failed:
    Blocked:
    Regression status:
    Integration status:
    Environment status:
    Deployment status:
    Files changed:
    Git status:
    Commit:
    Branch:

Never claim a test passed unless it was actually executed.

---

## 11. TEAM VERIFICATION (Garv only, at phase boundaries)

At the end of each phase, Garv verifies:

- [ ] Every member reports their work complete
- [ ] No unauthorized files were modified
- [ ] No secrets were committed
- [ ] Branch state is clean
- [ ] Required tests exist and pass (or are explicitly BLOCKED with reason)
- [ ] No phase was started before the previous one was approved

Only after these checks does Garv declare:

    PHASE X APPROVED

No other member may declare this.

---

## 12. QUICK-REFERENCE COMMANDS

    git branch --show-current        # what branch am I on?
    git status                       # what have I changed?
    git diff                         # what is different?
    git diff --cached                # what is staged?
    git log --oneline -10            # recent commits
    git remote -v                    # where am I pushing?

Before every push:

    git status --short
    git diff --cached --name-only

If anything unexpected appears, STOP and inspect before pushing.

---

## 13. SIGN-OFF

This is a reference document, not a phase deliverable. It does not require a
phase-level signature. It is reviewed and updated by Lokesh when team
practices change.

Last reviewed: Phase 1
Next review: Phase 3 (integration)