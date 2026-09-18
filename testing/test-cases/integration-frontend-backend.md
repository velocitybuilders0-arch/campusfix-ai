# PHASE 2 INTEGRATION TEST CASES — FRONTEND ↔ BACKEND

**Covers required area:** 17 (Frontend ↔ backend integration)
**Owners of implementation:** Gunjan Yadav (frontend), Rajveer Dhiman (backend)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §18 (AI flow), §22 (error envelope), §23 (UX requirements), §24 (admin dashboard)

**Scope note:** These tests verify the *contract between FE and BE* — that the
frontend sends what the backend expects, parses what the backend returns, and
does not invent its own shapes. They complement the endpoint tests in
integration-issues / integration-ai, which focus on the backend side.

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-FEBE-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. CONFIGURATION & TRANSPORT

### QA-INT-FEBE-001 — FE reads API base URL from environment

    Purpose:      Verify the API base URL is not hardcoded in the bundle.
    Preconditions: frontend/ exists.
    Steps:
      1. Inspect frontend source for the API base URL.
      2. Confirm it references an environment variable (VITE_API_BASE_URL or equivalent).
    Expected:     No hardcoded "http://localhost:5000" or production URL in committed source.
    Actual:
    Status:       NOT RUN

### QA-INT-FEBE-002 — FE sends Content-Type: application/json on POST/PATCH

    Purpose:      Verify request headers match backend expectations.
    Preconditions: FE running; BE running.
    Steps:
      1. Submit an issue via the UI.
      2. Inspect the request in the browser Network tab.
    Expected:     Content-Type: application/json on POST/PATCH requests.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-003 — FE attaches auth token to protected calls

    Purpose:      Verify §16 token transport matches the assumption.
    Preconditions: FE running; user logged in.
    Steps:
      1. Perform a protected action.
      2. Inspect the Authorization header.
    Expected:     Authorization: Bearer <token> present. If different mechanism, record and update plan.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-004 — FE does not attach token to public calls

    Purpose:      Verify minimal-auth surface.
    Preconditions: FE running; not logged in.
    Steps:
      1. Hit GET /api/health from FE.
      2. Inspect headers.
    Expected:     No Authorization header present on the health call (or an empty one, not a stale token).
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-005 — CORS is correctly configured for FE origin

    Purpose:      Verify cross-origin requests succeed in dev.
    Preconditions: FE on one port; BE on another.
    Steps:
      1. Submit an issue from FE.
      2. Inspect response headers and console.
    Expected:     Access-Control-Allow-Origin reflects the FE origin; no CORS error in browser console.
    Actual:
    Status:       BLOCKED

---

## B. REQUEST SHAPES (FE → BE)

### QA-INT-FEBE-010 — Issue creation payload matches contract

    Purpose:      Verify FE sends the fields the backend expects.
    Preconditions: FE form for issue creation.
    Steps:
      1. Fill the form with a valid issue.
      2. Submit.
      3. Inspect the request body.
    Expected:     Body contains title and description at minimum; no fields the backend rejects. If client supplies priority/category/department (flagged ambiguity), record and confirm with Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-011 — FE does not send client-controlled user_id

    Purpose:      Verify §16 — frontend does not attempt to set identity.
    Preconditions: FE logged in.
    Steps:
      1. Submit issue.
      2. Inspect body for user_id.
    Expected:     Body does not contain user_id (identity comes from session).
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-012 — FE does not send client-controlled status

    Purpose:      Verify §13 — status is server-controlled on create.
    Preconditions: FE logged in.
    Steps:
      1. Submit issue.
      2. Inspect body for status.
    Expected:     Body does not contain a status field, or contains only "OPEN".
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-013 — PATCH payload includes only changed fields

    Purpose:      Verify partial update pattern (minimal PATCH bodies).
    Preconditions: FE has a PATCH UI.
    Steps:
      1. Change only priority via UI.
      2. Inspect PATCH body.
    Expected:     Body contains only changed fields (e.g. { "priority": "HIGH" }), not a full issue dump. If full dump, confirm with Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-014 — Update message payload matches contract

    Purpose:      Verify POST /api/issues/:id/updates shape.
    Preconditions: FE has an updates UI.
    Steps:
      1. Post a progress update via UI.
      2. Inspect body.
    Expected:     Body is { "message": "<string>" } (and optionally status). No extra keys the backend rejects.
    Actual:
    Status:       BLOCKED

---

## C. RESPONSE PARSING (BE → FE)

### QA-INT-FEBE-020 — FE correctly parses success envelope

    Purpose:      Verify FE reads { success, data } shape.
    Preconditions: FE running; BE running.
    Steps:
      1. Trigger a successful action.
      2. Confirm the UI reflects data from the response.
    Expected:     No parsing error; the UI uses response.data, not the raw body.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-021 — FE correctly parses error envelope

    Purpose:      Verify FE reads { success: false, error: { message } }.
    Preconditions: FE running; a 400 triggerable via UI.
    Steps:
      1. Submit an invalid form.
      2. Confirm the UI shows backend's error.message.
    Expected:     UI displays the message from error.message, not "[object Object]" or undefined.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-022 — FE handles list response as array

    Purpose:      Verify list rendering expects an array, not an object.
    Preconditions: FE list page exists; some issues exist.
    Steps:
      1. Open the issue list.
    Expected:     All issues render; no crash if list is empty (empty state shows).
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-023 — FE handles empty list without crash

    Purpose:      Verify empty-state UI path.
    Preconditions: Logged in as a user with no issues.
    Steps:
      1. Open list.
    Expected:     Empty state displayed; no error; no blank panel.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-024 — FE handles 404 gracefully

    Purpose:      Verify detail page for a missing issue.
    Preconditions: FE running; known invalid id.
    Steps:
      1. Navigate to /issues/not-real or equivalent.
    Expected:     User-friendly "not found" state; no crash.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-025 — FE handles 401 by redirecting to login

    Purpose:      Same as integration-errors.md QA-INT-ERR-022, cross-referenced here for FE-specific behavior.
    Preconditions: FE running with an invalid/expired token.
    Steps:
      1. Attempt a protected action.
    Expected:     Redirect to login or show re-auth prompt.
    Actual:
    Status:       BLOCKED

---

## D. AI FEEDBACK IN THE UI (Area 5 + §23)

### QA-INT-FEBE-030 — FE displays AI classification after submit

    Purpose:      Verify AI feedback is visible to the user after creating an issue.
    Preconditions: FE has a post-submit view showing AI results.
    Steps:
      1. Submit a fan-not-working issue.
      2. Inspect the resulting view.
    Expected:     Category, priority, summary, department visible and match the stored issue.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-031 — FE does not fake AI analysis

    Purpose:      Verify §34 principle: no mock AI in final UI.
    Preconditions: Code review.
    Steps:
      1. Grep frontend/ for hardcoded category/priority/summary values that show in production paths.
    Expected:     No hardcoded AI responses in production paths. Test fixtures marked clearly if present.
    Actual:
    Status:       NOT RUN

### QA-INT-FEBE-032 — FE shows loading state during analysis

    Purpose:      Verify §23 loading state requirement.
    Preconditions: FE has a submit flow.
    Steps:
      1. Submit an issue (or use network throttling).
    Expected:     Loading indicator shown while awaiting response; disabled submit; no double submission.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-033 — FE shows AI fallback indicator (if applicable)

    Purpose:      Verify the UI does not misrepresent fallback as Gemini output.
    Preconditions: Fallback engaged; UI displays AI source information if implemented.
    Steps:
      1. Force fallback.
      2. Submit issue.
      3. Inspect UI.
    Expected:     If UI shows a source label, it correctly indicates fallback. If UI shows no source at all, note this and confirm with Garv.
    Actual:
    Status:       BLOCKED

---

## E. ISSUE LIST & DETAIL IN UI

### QA-INT-FEBE-040 — Issue list renders from live data

    Purpose:      Verify list is not from a mock.
    Preconditions: FE running; known issues in DB.
    Steps:
      1. Open list.
      2. Compare against direct GET /api/issues.
    Expected:     Same set.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-041 — Issue detail matches list entry

    Purpose:      Verify drill-down consistency.
    Preconditions: Same as above.
    Steps:
      1. Click an issue from the list.
      2. Compare displayed fields to the list entry and the API.
    Expected:     Consistent.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-042 — Status visualization reflects real status

    Purpose:      Verify badges/colors match §13 lifecycle.
    Preconditions: Issues at multiple statuses exist.
    Steps:
      1. Inspect each status's visual representation.
    Expected:     Each status has a distinct, stable visual; matches the enum value.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-043 — Search box calls backend (not client-side filter only)

    Purpose:      Verify search is not a client-side only illusion.
    Preconditions: Search implemented in FE.
    Steps:
      1. Type in search.
      2. Inspect network calls.
    Expected:     A request to the backend (or documented client-only policy with pagination consideration). Confirm with Gunjan/Rajveer.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-044 — Filter controls hit backend

    Purpose:      Same as above for filters.
    Preconditions: Filter controls implemented.
    Steps:
      1. Apply a filter.
      2. Inspect network.
    Expected:     Backend filter query sent; results match.
    Actual:
    Status:       BLOCKED

---

## F. ADMIN DASHBOARD (§24)

### QA-INT-FEBE-050 — Dashboard stats come from backend

    Purpose:      Verify §24: stats must come from real DB, not hardcoded.
    Preconditions: Admin logged in; multiple issues exist.
    Steps:
      1. Open dashboard.
      2. Cross-check counts against direct DB.
    Expected:     Counts match DB. No hardcoded numbers visible in source.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-051 — Status counts reflect real distribution

    Purpose:      Verify per-status tile counts.
    Preconditions: Same as above.
    Steps:
      1. Inspect each status tile.
    Expected:     Each number matches DB count for that status.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-052 — Admin status change updates UI immediately

    Purpose:      Verify optimistic or re-fetched update.
    Preconditions: Admin logged in; an issue exists.
    Steps:
      1. Change status via UI.
      2. Observe UI.
    Expected:     UI reflects new status; no stale value shown; no manual refresh needed (or documented refresh pattern).
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-053 — Admin assignment updates UI immediately

    Purpose:      Same as above for assignment.
    Preconditions: Same as above; a STAFF user exists.
    Steps:
      1. Assign issue via UI.
    Expected:     Assigned staff visible; status indicator changes if lifecycle auto-advances.
    Actual:
    Status:       BLOCKED

---

## G. RESPONSIVE / UX (§23)

### QA-INT-FEBE-060 — Layout is responsive down to mobile width

    Purpose:      Verify §23 responsive requirement.
    Preconditions: FE running.
    Steps:
      1. Open on desktop width.
      2. Resize to 375px width.
    Expected:     No horizontal scroll; navigation accessible; forms usable.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-061 — Empty states exist

    Purpose:      Verify §23 empty state on lists.
    Preconditions: A user with no issues.
    Steps:
      1. Open list.
    Expected:     A distinct empty state, not a blank panel.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-062 — Error states exist

    Purpose:      Verify §23 error state on lists/detail.
    Preconditions: Force an error (stop backend).
    Steps:
      1. Open list with backend down.
    Expected:     Error state visible; retry affordance present.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-063 — Loading states exist

    Purpose:      Verify §23 loading state on lists/detail.
    Preconditions: Network throttling.
    Steps:
      1. Open list under slow network.
    Expected:     Loading indicator visible.
    Actual:
    Status:       BLOCKED

### QA-INT-FEBE-064 — No console errors on normal flow

    Purpose:      Verify no silent FE failures.
    Preconditions: FE and BE running.
    Steps:
      1. Complete a normal user journey (login -> submit -> view list -> view detail).
      2. Inspect browser console.
    Expected:     No red errors. Warnings reviewed.
    Actual:
    Status:       BLOCKED

---

## H. NOTES

- Every test is BLOCKED pending real FE and BE implementations.
- QA-INT-FEBE-001 and QA-INT-FEBE-031 are executable by code review only
  (no runtime required).
- If FE uses a mechanism other than Bearer header, update QA-INT-FEBE-003 and
  the note at the top of integration-auth.md.
- QA-INT-FEBE-043 / 044 need a policy decision: is search/filter server-side
  or client-side only? §6 (Architecture authority) says decide before
  implementing.
- No PASS status exists in this file.