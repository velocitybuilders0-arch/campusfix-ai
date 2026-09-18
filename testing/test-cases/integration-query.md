# PHASE 2 INTEGRATION TEST CASES — LISTING, SEARCH, FILTER

**Covers required areas:** 6 (Issue listing), 11 (Search / filter)
**Owners of implementation:** Rajveer Dhiman (backend), Gunjan Yadav (frontend consumers)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §13 (issue listing), §16 (auth-filtered results), §22 (errors)

**Note:** Search/filter support is described as "when implemented" in the
architecture. Tests below are split into ALWAYS-ON tests (list behavior) and
CONDITIONAL tests (search/filter behavior). CONDITIONAL tests stay BLOCKED
until Rajveer confirms which filters are implemented, and which fields are
searchable.

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-QUERY-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. LISTING — GET /api/issues (Area 6)

### QA-INT-QUERY-001 — List returns array

    Purpose:      Verify GET /api/issues returns a JSON array under data.
    Preconditions: Backend running; authenticated token; at least one issue exists.
    Steps:
      1. curl -H "Authorization: Bearer <token>" http://localhost:5000/api/issues
      2. Inspect body.
    Expected:     200; { success: true, data: [ ... ] }.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-002 — Empty list returns [] not 404

    Purpose:      Verify no-issues case returns an empty array.
    Preconditions: Authenticated token of a user with zero issues.
    Steps:
      1. GET /api/issues.
    Expected:     200; data === [].
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-003 — Each item has §14 core fields

    Purpose:      Verify list items are shaped like issue objects.
    Preconditions: Multiple issues exist.
    Steps:
      1. GET /api/issues.
      2. Inspect one item's keys.
    Expected:     id, user_id, title, description, image_url, category, priority, ai_summary, department, status, assigned_to, created_at, updated_at. Or a documented subset for list view — confirm with Garv.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-004 — Student list is filtered to own issues

    Purpose:      Verify §16 read filter.
    Preconditions: Student A logged in; issues exist from students A and B.
    Steps:
      1. GET /api/issues as student A.
      2. Inspect user_id of every returned item.
    Expected:     Every item.user_id === student A's id.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-005 — Admin list is not filtered by ownership

    Purpose:      Verify ADMIN sees all issues.
    Preconditions: Admin logged in; multiple issues exist.
    Steps:
      1. GET /api/issues as admin.
    Expected:     Issues from multiple users visible.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-006 — Staff list scope per policy

    Purpose:      Verify STAFF sees authorized set.
    Preconditions: Staff logged in.
    Steps:
      1. GET /api/issues as staff.
    Expected:     Per §16 policy. Confirm scope with Garv if unclear.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-007 — Wrong method on /api/issues

    Purpose:      Verify DELETE / PATCH / etc. are not allowed on the collection.
    Preconditions: Backend running.
    Steps:
      1. curl -X DELETE http://localhost:5000/api/issues.
      2. curl -X PATCH http://localhost:5000/api/issues.
    Expected:     404 or 405 for both.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-008 — Pagination (if implemented)

    Purpose:      Verify paging on large list.
    Preconditions: More than one page of issues exists.
    Steps:
      1. GET /api/issues?page=1&limit=10.
      2. GET /api/issues?page=2&limit=10.
    Expected:     No overlap; consistent ordering; metadata if contract includes it. If pagination not implemented, mark BLOCKED and confirm with Rajveer.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-009 — Ordering is stable and defined

    Purpose:      Verify deterministic ordering (e.g. newest first).
    Preconditions: Multiple issues.
    Steps:
      1. GET /api/issues twice.
      2. Compare order.
    Expected:     Same order both times. Ordering rule confirmed with Rajveer.
    Actual:
    Status:       BLOCKED

---

## B. SEARCH (Area 11 — conditional)

### QA-INT-QUERY-020 — Search by title keyword

    Purpose:      Verify ?search= matches title content.
    Preconditions: Search implemented; issues with distinctive title keywords exist.
    Steps:
      1. GET /api/issues?search=fan.
    Expected:     Only issues whose title (or documented searchable fields) contain "fan".
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-021 — Search is case-insensitive

    Purpose:      Verify case handling.
    Preconditions: Same as above.
    Steps:
      1. GET ?search=fan and ?search=FAN.
    Expected:     Same result set both times.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-022 — Search with no matches returns []

    Purpose:      Verify empty search result is clean.
    Preconditions: Same as above.
    Steps:
      1. GET ?search=xyznotarealwordzzz.
    Expected:     200; data === [].
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-023 — Search does not cross ownership boundary

    Purpose:      Verify §16: search still respects authorization filter.
    Preconditions: Student A logged in; issues from A and B, some matching the query.
    Steps:
      1. GET ?search=<query matching B's issues> as student A.
    Expected:     Only A's matches returned; B's issues never leak.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-024 — Search does not SQL-inject

    Purpose:      Verify §15 safe query rule.
    Preconditions: Search implemented.
    Steps:
      1. GET ?search=' OR 1=1 --.
      2. GET ?search=;DROP TABLE issues;--.
    Expected:     200 with empty or safe result; no DB damage; no 500.
    Actual:
    Status:       BLOCKED

---

## C. FILTER (Area 11 — conditional)

### QA-INT-QUERY-040 — Filter by status

    Purpose:      Verify ?status= filters correctly.
    Preconditions: Filter implemented; issues with mixed statuses exist.
    Steps:
      1. GET /api/issues?status=OPEN.
    Expected:     Only OPEN issues returned.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-041 — Filter by priority

    Purpose:      Verify ?priority= filters correctly.
    Preconditions: Same as above.
    Steps:
      1. GET /api/issues?priority=HIGH.
    Expected:     Only HIGH issues returned.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-042 — Filter by category

    Purpose:      Verify ?category= filters correctly.
    Preconditions: Same as above.
    Steps:
      1. GET /api/issues?category=Electrical.
    Expected:     Only Electrical issues returned.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-043 — Filter by assigned_to

    Purpose:      Verify assignment filter.
    Preconditions: Same as above.
    Steps:
      1. GET /api/issues?assigned_to=<staff-id>.
    Expected:     Only issues assigned to that staff member.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-044 — Invalid enum in filter handled

    Purpose:      Verify filter value validation.
    Preconditions: Same as above.
    Steps:
      1. GET ?status=BANANA.
    Expected:     400 OR treated as "no filter" — confirm with Rajveer which policy applies. Never silently return all issues without a §22 error where the value is invalid.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-045 — Multiple filters combine with AND

    Purpose:      Verify combining filters behaves predictably.
    Preconditions: Multiple filters implemented.
    Steps:
      1. GET ?status=OPEN&priority=HIGH.
    Expected:     Only issues matching both.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-046 — Filter does not cross ownership boundary

    Purpose:      Verify §16: filters do not weaken auth scope.
    Preconditions: Student A logged in; issues from A and B, matching the filter.
    Steps:
      1. GET ?status=OPEN as student A.
    Expected:     Only A's OPEN issues returned; B's OPEN issues do not leak.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-047 — Filter by date range (if implemented)

    Purpose:      Verify temporal filtering.
    Preconditions: Date filter implemented.
    Steps:
      1. GET ?from=2026-01-01&to=2026-12-31.
    Expected:     Only issues created within range.
    Actual:
    Status:       BLOCKED

---

## D. COMBINED BEHAVIOR

### QA-INT-QUERY-060 — Search + filter + pagination together

    Purpose:      Verify combined query does not break any layer.
    Preconditions: All three implemented.
    Steps:
      1. GET /api/issues?search=fan&status=OPEN&page=1&limit=10.
    Expected:     Consistent, correct, single-tenant result. No 500.
    Actual:
    Status:       BLOCKED

### QA-INT-QUERY-061 — Malformed query string handled

    Purpose:      Verify parser robustness.
    Preconditions: Backend running.
    Steps:
      1. GET /api/issues?status[]=OPEN&priority=.
      2. GET /api/issues?limit=abc.
    Expected:     Either ignored (fallback to defaults) OR 400 with §22 envelope. No 500.
    Actual:
    Status:       BLOCKED

---

## E. NOTES

- Conditional tests (search/filter/pagination) remain BLOCKED until Rajveer
  confirms which are implemented. Do not guess.
- QA-INT-QUERY-023 / 046 enforce the §16 rule that filtering must not weaken
  authorization.
- QA-INT-QUERY-024 enforces §15 (no SQL injection via query params).
- Contract ambiguity: query parameter names are not locked in the
  architecture. If Rajveer uses different names (e.g. `q` instead of `search`),
  update these tests and record the change in
  testing/API_CONTRACT_CHECKLIST.md §9.
- No PASS status exists in this file.