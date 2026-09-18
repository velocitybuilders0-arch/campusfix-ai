# PHASE 2 INTEGRATION TEST CASES — AI CLASSIFICATION & FALLBACK

**Covers required areas:** 5 (AI classification), 16 (AI failure / fallback)
**Owner of implementation:** Garv Nain
**Test author / executor:** Lokesh Malik
**Architecture ref:** §18 (AI architecture), §19 (AI validation), §20 (AI failure handling), §22 (errors)

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-AI-NNN / QA-INT-AIFB-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. AI CLASSIFICATION (Area 5)

### QA-INT-AI-001 — Analyze valid issue input

    Purpose:      Verify POST /api/ai/analyze returns a structured classification.
    Preconditions: Backend running; AI route mounted; Gemini configured OR fallback available.
    Steps:
      1. curl -X POST http://localhost:5000/api/ai/analyze \
           -H "Content-Type: application/json" \
           -d '{"title":"Ceiling fan not working","description":"Room 204 ceiling fan is not turning on"}'
      2. Inspect response.
    Expected:     200; { success: true, data: { category, priority, summary, department } }.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-002 — data object has exactly four keys

    Purpose:      Verify AI response shape is exactly as specified in §18.
    Preconditions: Same as above.
    Steps:
      1. Analyze a valid issue.
      2. Inspect Object.keys(data).
    Expected:     Exactly: ["category", "priority", "summary", "department"]. No extras, no missing.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-003 — priority is a valid enum

    Purpose:      Verify §19 priority enum enforcement.
    Preconditions: Same as above.
    Steps:
      1. Analyze.
      2. Compare data.priority to allowed set.
    Expected:     One of: LOW, MEDIUM, HIGH, CRITICAL.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-004 — category is from approved list

    Purpose:      Verify §19 category validation.
    Preconditions: Same as above.
    Steps:
      1. Analyze.
      2. Compare data.category to the approved category list.
    Expected:     Approved value. Report exact approved list to Garv if not documented.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-005 — department is from approved list or fallback

    Purpose:      Verify §19 department validation.
    Preconditions: Same as above.
    Steps:
      1. Analyze.
      2. Compare data.department to the approved list.
    Expected:     Approved value or a documented fallback value.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-006 — summary is a non-empty string

    Purpose:      Verify §19 summary constraint.
    Preconditions: Same as above.
    Steps:
      1. Analyze.
      2. Inspect data.summary.
    Expected:     typeof === "string"; length > 0; not "null" or "undefined".
    Actual:
    Status:       BLOCKED

### QA-INT-AI-007 — Electrical example classified correctly

    Purpose:      Verify reference example from §18 matches reality.
    Preconditions: Same as above.
    Steps:
      1. Analyze "ceiling fan is not functioning in Room 204".
    Expected:     category === "Electrical"; department === "Electrical Maintenance".
    Actual:
    Status:       BLOCKED

### QA-INT-AI-008 — Plumbing issue classified correctly

    Purpose:      Verify a second category works end-to-end.
    Preconditions: Same as above.
    Steps:
      1. Analyze "leaking tap in girls hostel bathroom".
    Expected:     category reflects plumbing; department reflects plumbing maintenance.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-009 — Wi-Fi issue classified correctly

    Purpose:      Verify a third category works end-to-end.
    Preconditions: Same as above.
    Steps:
      1. Analyze "Wi-Fi not working in library block".
    Expected:     category reflects network/Wi-Fi; department reflects IT/Network.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-010 — Empty body rejected

    Purpose:      Verify input validation on AI endpoint.
    Preconditions: Same as above.
    Steps:
      1. POST /api/ai/analyze with {}.
    Expected:     400; §22 envelope; no AI call performed.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-011 — Non-string title rejected

    Purpose:      Verify type validation.
    Preconditions: Same as above.
    Steps:
      1. POST with { "title": 123, "description": "..." }.
    Expected:     400; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-012 — Extremely long description handled

    Purpose:      Verify no 500 on oversized input.
    Preconditions: Same as above.
    Steps:
      1. POST with a 10,000-character description.
    Expected:     Accepted and analyzed OR cleanly rejected 400; never 500.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-013 — GET method not allowed

    Purpose:      Verify method enforcement.
    Preconditions: Backend running.
    Steps:
      1. curl http://localhost:5000/api/ai/analyze.
    Expected:     404 or 405.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-014 — AI classification persists to created issue

    Purpose:      Verify AI result flows into issue creation (§18 end-to-end).
    Preconditions: POST /api/issues triggers AI; backend running.
    Steps:
      1. POST /api/issues with a fan-not-working payload.
      2. Inspect the created issue row.
    Expected:     category, priority, ai_summary, department reflect the AI output for that issue.
    Actual:
    Status:       BLOCKED

---

## B. AI VALIDATION (§19)

### QA-INT-AI-020 — Invalid category is rejected

    Purpose:      Verify validation rejects a category outside the approved list.
    Preconditions: Ability to force AI to return an invalid category (mock hook or test flag).
    Steps:
      1. Force AI to return category = "Banana".
      2. Analyze.
    Expected:     Either normalized to a valid category, or 400. Never persisted as "Banana".
    Actual:
    Status:       BLOCKED

### QA-INT-AI-021 — Invalid priority is rejected

    Purpose:      Verify priority enum enforcement.
    Preconditions: Same as above.
    Steps:
      1. Force AI to return priority = "URGENT".
    Expected:     Rejected or normalized to LOW/MEDIUM/HIGH/CRITICAL.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-022 — Empty summary is rejected

    Purpose:      Verify §19 summary validation.
    Preconditions: Same as above.
    Steps:
      1. Force AI to return summary = "".
    Expected:     400 or fallback engaged; nothing persisted with empty summary.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-023 — Non-JSON AI output handled

    Purpose:      Verify no 500 when AI returns garbage.
    Preconditions: Same as above.
    Steps:
      1. Force AI to return "not json at all".
    Expected:     Handled; §22 envelope OR fallback; never 500.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-024 — Partial AI object handled

    Purpose:      Verify validation when a required key is missing.
    Preconditions: Same as above.
    Steps:
      1. Force AI to return { category, priority, summary } with no department.
    Expected:     Rejected or fallback engaged; never persisted incomplete.
    Actual:
    Status:       BLOCKED

### QA-INT-AI-025 — Malformed AI never reaches DB

    Purpose:      Verify §19 rule: malformed output must never directly enter DB.
    Preconditions: Ability to force malformed output.
    Steps:
      1. Force malformed output.
      2. Attempt an issue create.
      3. Query the issues table.
    Expected:     No row created with malformed AI fields; either creation fails cleanly or fallback result used.
    Actual:
    Status:       BLOCKED

---

## C. AI FAILURE & FALLBACK (§20)

### QA-INT-AIFB-001 — Missing Gemini key still yields valid response

    Purpose:      Verify fallback engages when Gemini credentials are absent.
    Preconditions: GEMINI_API_KEY unset or blank.
    Steps:
      1. Restart backend with empty key.
      2. POST /api/ai/analyze with valid input.
    Expected:     200; valid structured data; no 500 to client.
    Actual:
    Status:       BLOCKED

### QA-INT-AIFB-002 — Fallback does not claim Gemini generated result

    Purpose:      Verify §20 rule: fallback must not pretend to be the external model.
    Preconditions: Fallback engaged.
    Steps:
      1. Inspect response body and any metadata / logs.
    Expected:     No field or message implies Gemini produced the output. Fallback may set a source indicator.
    Actual:
    Status:       BLOCKED

### QA-INT-AIFB-003 — Fallback output passes §19 validation

    Purpose:      Verify the fallback result is valid under the same rules as Gemini's result.
    Preconditions: Fallback engaged.
    Steps:
      1. Analyze.
      2. Check category / priority / summary / department against allowed sets.
    Expected:     All four pass §19.
    Actual:
    Status:       BLOCKED

### QA-INT-AIFB-004 — Fallback result flows into issue creation

    Purpose:      Verify end-to-end still works under fallback.
    Preconditions: Fallback engaged; POST /api/issues triggers AI.
    Steps:
      1. Create an issue.
      2. Inspect DB row.
    Expected:     Row persisted with fallback-derived category / priority / department / ai_summary.
    Actual:
    Status:       BLOCKED

### QA-INT-AIFB-005 — Gemini 500 triggers fallback

    Purpose:      Verify upstream 500 is masked by fallback.
    Preconditions: Ability to simulate Gemini 500 (mock or network block).
    Steps:
      1. Force Gemini 500.
      2. Analyze.
    Expected:     200; fallback result; no error surfaced to client.
    Actual:
    Status:       BLOCKED

### QA-INT-AIFB-006 — Gemini timeout triggers fallback

    Purpose:      Verify timeout handling.
    Preconditions: Ability to simulate Gemini timeout.
    Steps:
      1. Force timeout.
      2. Analyze.
    Expected:     Fallback engages within acceptable timeout window; no indefinite hang.
    Actual:
    Status:       BLOCKED

### QA-INT-AIFB-007 — Fallback is separated from Gemini path

    Purpose:      Verify §20 rule: fallback clearly separated from primary AI implementation.
    Preconditions: Code review.
    Steps:
      1. Inspect ai/ directory.
      2. Identify primary Gemini path and fallback path.
    Expected:     Two distinct modules / functions; not entangled; easy to identify which ran.
    Actual:
    Status:       NOT RUN

### QA-INT-AIFB-008 — AI failure does not destroy issue workflow

    Purpose:      Verify §20 rule: AI failure must not break issue creation.
    Preconditions: Ability to force both Gemini and fallback to fail.
    Steps:
      1. Simulate full AI outage.
      2. POST /api/issues.
    Expected:     Either issue is created with safe default AI fields OR a clear §22 error; the workflow does not deadlock.
    Actual:
    Status:       BLOCKED

---

## D. NOTES

- Every test is BLOCKED pending AI route implementation and any mock hook that
  lets QA force malformed / failing AI output.
- QA-INT-AIFB-007 is executable by code review alone — could be marked NOT RUN
  immediately and executed once ai/ exists.
- QA-INT-AI-020 through QA-INT-AI-025 and all QA-INT-AIFB-005 through 008
  require a forceable failure mechanism. If Garv does not provide one, mark
  BLOCKED and report — do not modify ai/ code.
- §20 enforcement: QA-INT-AIFB-002 is the primary check that the fallback does
  not misrepresent itself.
- No PASS status exists in this file.