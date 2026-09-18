# CAMPUSFIX AI — API CONTRACT CHECKLIST

**Owner:** Lokesh Malik (QA)
**Purpose:** Verify that the backend implementation respects the locked API contract.
**Source of truth:** CAMPUSFIX_ARCHITECTURE.md + Master Prompt API Contract.
**Rule:** Never invent endpoints. Never invent fields. If the implementation adds something not listed here, that is a CHANGE REQUEST to Garv, not a QA pass.

**Status:** NOT RUN — no backend endpoints have been verified yet.

---

## How to use this checklist

For each row, mark:
- [x] PASS — implementation matches contract exactly
- [ ] FAIL — implementation deviates; file a BLOCKER to the owner
- [ ] BLOCKED — endpoint not implemented yet
- [ ] N/A — endpoint explicitly deferred by Garv

Do NOT mark a row PASS without observing real output.

---

## 1. Endpoint Paths and Methods

| # | Method | Path | Contract source | Implemented? | Matches? |
|---|---|---|---|---|---|
| 1 | GET | /api/health | Master Prompt | | |
| 2 | POST | /api/ai/analyze | §18 | | |
| 3 | POST | /api/issues | §13 | | |
| 4 | GET | /api/issues | §13 | | |
| 5 | GET | /api/issues/:id | §13 | | |
| 6 | PATCH | /api/issues/:id | §13 | | |
| 7 | POST | /api/issues/:id/updates | §13 | | |
| 8 | DELETE | /api/issues/:id | §13 | | |

Additional rules:
- [ ] No undeclared endpoints exist under /api/* (except documented 404 handler)
- [ ] No endpoint uses a method not listed above
- [ ] Route paths are case-sensitive as written
- [ ] :id params are validated (not passed raw to DB)

---

## 2. Health Response Structure

| # | Check | Expected | Verified? |
|---|---|---|---|
| 1 | HTTP status | 200 | |
| 2 | Content-Type | application/json | |
| 3 | Top-level key success | boolean, true | |
| 4 | Top-level key message | string, exactly "CampusFix API is running" | |
| 5 | No extra top-level keys | (strict) | |
| 6 | Body is stable across repeated calls | identical every time | |

---

## 3. AI Response Structure

Endpoint: POST /api/ai/analyze

| # | Check | Expected | Verified? |
|---|---|---|---|
| 1 | HTTP status on valid input | 200 | |
| 2 | Top-level success | true | |
| 3 | Top-level data | object | |
| 4 | data.category | non-empty string, from approved list | |
| 5 | data.priority | one of LOW / MEDIUM / HIGH / CRITICAL | |
| 6 | data.summary | non-empty string | |
| 7 | data.department | non-empty string, approved list or supported fallback | |
| 8 | No extra keys inside data | (strict — exactly 4 keys) | |
| 9 | Error on invalid input uses §22 envelope | see section 5 | |
| 10 | Provider failure does not return 500 | falls back to local deterministic result | |
| 11 | Fallback result passes checks 4-8 | valid structure | |

---

## 4. Issue Endpoints Response Structure

For each issue endpoint, verify the response envelope:

| # | Check | Expected | Verified? |
|---|---|---|---|
| 1 | Successful single-issue response | { success: true, data: <issue> } | |
| 2 | Successful list response | { success: true, data: [<issues>] } | |
| 3 | Successful create response | { success: true, data: <created issue with id> } | |
| 4 | Successful update response | { success: true, data: <updated issue> } | |
| 5 | Successful delete response | { success: true } OR { success: true, data: <deleted id> } per contract | |
| 6 | No mixed envelopes (some success, some raw) | consistent across all 6 endpoints | |

---

## 5. Error Response Structure (§22)

The locked error shape:

    {
      "success": false,
      "error": {
        "message": "<human-readable string>"
      }
    }

| # | Check | Expected | Verified? |
|---|---|---|---|
| 1 | All 4xx responses use this shape | no deviation | |
| 2 | All 5xx responses use this shape | no deviation | |
| 3 | error.message is always a string | never null, never object | |
| 4 | No stack trace exposed to client | message is safe | |
| 5 | 404 on unknown route uses this shape | including /api/* | |
| 6 | Malformed JSON body uses this shape | not a raw Express error | |

---

## 6. Allowed Enum Values

### 6a. Issue status (from lifecycle — README + §13)

    OPEN
    ASSIGNED
    IN_PROGRESS
    RESOLVED
    CLOSED
    REJECTED

- [ ] Backend accepts exactly these values
- [ ] Backend rejects any other status
- [ ] Frontend only displays these values
- [ ] DB constraint (if any) matches this list

### 6b. Priority (§19)

    LOW
    MEDIUM
    HIGH
    CRITICAL

- [ ] Backend accepts exactly these values
- [ ] Backend rejects any other priority
- [ ] AI output validated against this list
- [ ] DB constraint matches

### 6c. Category

- [ ] Backend defines an approved category list (ask Rajveer where it lives)
- [ ] AI output category validated against that list
- [ ] Any category outside the list is rejected
- [ ] List is documented in the repo (not only in code)

### 6d. Department (§19)

- [ ] Backend defines an approved department list
- [ ] AI output department validated against that list
- [ ] Explicit supported fallback exists if AI returns unknown department
- [ ] Fallback is documented

### 6e. User roles (§14)

    STUDENT
    ADMIN
    STAFF

- [ ] Only these three roles exist
- [ ] Role is never trusted from request body (§16)

---

## 7. Required Fields and Validation

| Field | Required on create? | Type | Max length (if defined) | Verified? |
|---|---|---|---|---|
| title | yes | string | ask Rajveer | |
| description | yes | string | ask Rajveer | |
| image_url | no | string (URL) | per §17 | |
| category | (server-derived or client?) | string | enum | |
| priority | (server-derived or client?) | string | enum | |
| department | (server-derived) | string | enum | |
| status | no (server sets OPEN) | string | enum | |
| assigned_to | no | UUID | FK to users | |

Open contract questions to flag to Garv:
- Is category / priority / department accepted from the client on POST /api/issues, or derived server-side from AI? Architecture is ambiguous.
- Is description required, or can title-only submissions go through?

Do not guess. If still ambiguous at execution time, mark BLOCKED and report.

---

## 8. HTTP Status Code Expectations

| Situation | Expected status |
|---|---|
| Successful GET /api/health | 200 |
| Successful POST (create issue) | 201 (or 200 if contract says so — confirm) |
| Successful GET /api/issues | 200 |
| Successful GET /api/issues/:id | 200 |
| Successful PATCH /api/issues/:id | 200 |
| Successful POST /api/issues/:id/updates | 201 (or 200 — confirm) |
| Successful DELETE /api/issues/:id | 200 or 204 — confirm |
| Validation failure | 400 |
| Unauthenticated (once auth exists) | 401 |
| Unauthorized (once auth exists) | 403 |
| Not found | 404 |
| Method not allowed | 405 |
| AI provider failure with fallback | 200 (fallback result) |
| Unhandled server error | 500 with §22 envelope |

- [ ] Backend status codes match this table
- [ ] Any deviation is documented and approved by Garv

---

## 9. Contract Change Log

Any deviation discovered during QA that requires a contract update must be recorded here — NOT silently accepted.

| Date | Deviation | Raised by | Decision (Garv) | Applied? |
|---|---|---|---|---|
| | | | | |

---

## 10. Sign-Off (to be completed only after execution)

- [ ] All 8 endpoint rows in section 1 verified
- [ ] Health response verified (section 2)
- [ ] AI response verified (section 3)
- [ ] Issue envelopes verified (section 4)
- [ ] Error envelope verified (section 5)
- [ ] All enums verified (section 6)
- [ ] Required fields verified (section 7)
- [ ] Status codes verified (section 8)
- [ ] No deviations outstanding

**Signed off by:** _________________  **Date:** _________
**Approved by (Garv):** _____________  **Date:** _________

Note: signing off this checklist does NOT approve a phase. Only Garv approves phases per §29.