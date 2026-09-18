# TEST CASES — AI ANALYSIS

**Scope:** POST /api/ai/analyze, AI output validation, AI fallback
**Owner of implementation:** Garv Nain
**Test author / executor:** Lokesh Malik
**Architecture ref:** §18 AI Architecture, §19 AI Validation, §20 AI Failure Handling, §22 Error Handling

All tests start at NOT RUN. Nothing here has been executed.

---

## A. Request contract — POST /api/ai/analyze

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AI-001 | AI / Request | Server running; AI route mounted | POST /api/ai/analyze with { "title": "Fan not working", "description": "Ceiling fan in Room 204 not turning on" } | HTTP 200 | | NOT RUN |
| QA-AI-002 | AI / Request | Server running | same as above | Response body is valid JSON | | NOT RUN |
| QA-AI-003 | AI / Request | Server running | same as above | success === true | | NOT RUN |
| QA-AI-004 | AI / Request | Server running | same as above | data object present | | NOT RUN |
| QA-AI-005 | AI / Request | Server running | POST /api/ai/analyze with empty body {} | Rejected (4xx) with §22 error envelope | | NOT RUN |
| QA-AI-006 | AI / Request | Server running | POST /api/ai/analyze with title only, no description | Rejected OR handled per agreed contract (flag ambiguity to Garv) | | NOT RUN |
| QA-AI-007 | AI / Request | Server running | POST /api/ai/analyze with title: 123 (non-string) | Rejected (4xx) with §22 error envelope | | NOT RUN |
| QA-AI-008 | AI / Request | Server running | POST /api/ai/analyze with very long description (e.g. 10k chars) | Either accepted and analyzed, or rejected cleanly; no 500 | | NOT RUN |
| QA-AI-009 | AI / Request | Server running | GET /api/ai/analyze | Rejected (404/405) | | NOT RUN |

---

## B. Response shape — data object

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AI-010 | AI / Response | Valid request | Inspect data.category | Non-empty string from approved category list | | NOT RUN |
| QA-AI-011 | AI / Response | Valid request | Inspect data.priority | One of: LOW, MEDIUM, HIGH, CRITICAL (§19) | | NOT RUN |
| QA-AI-012 | AI / Response | Valid request | Inspect data.summary | Non-empty string | | NOT RUN |
| QA-AI-013 | AI / Response | Valid request | Inspect data.department | Non-empty string from approved department list or supported fallback (§19) | | NOT RUN |
| QA-AI-014 | AI / Response | Valid request | Inspect full data object | Exactly the four keys: category, priority, summary, department — no extra, no missing | | NOT RUN |
| QA-AI-015 | AI / Response | Electrical example (ceiling fan not working in Room 204) | Inspect output | category === "Electrical" and department === "Electrical Maintenance" (per §18 example) | | NOT RUN |

---

## C. AI output validation (§19) — malformed output must never reach DB

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AIVAL-001 | AI / Validation | Mocked AI returns category "Banana" (not in approved list) | Call analyze | Rejected or normalized; invalid category never persisted | | NOT RUN |
| QA-AIVAL-002 | AI / Validation | Mocked AI returns priority "URGENT" (not in enum) | Call analyze | Rejected or normalized to a valid enum value | | NOT RUN |
| QA-AIVAL-003 | AI / Validation | Mocked AI returns summary "" (empty) | Call analyze | Rejected; empty summary never persisted | | NOT RUN |
| QA-AIVAL-004 | AI / Validation | Mocked AI returns summary null | Call analyze | Rejected; null summary never persisted | | NOT RUN |
| QA-AIVAL-005 | AI / Validation | Mocked AI returns department "Unknown Dept" (not in list, no fallback) | Call analyze | Rejected or mapped to supported fallback | | NOT RUN |
| QA-AIVAL-006 | AI / Validation | Mocked AI returns non-JSON string | Call analyze | Handled; no 500; §22 error envelope OR fallback used | | NOT RUN |
| QA-AIVAL-007 | AI / Validation | Mocked AI returns partial object (missing priority) | Call analyze | Rejected or completed via fallback; never persisted incomplete | | NOT RUN |
| QA-AIVAL-008 | AI / Validation | Malformed output occurs | Inspect DB | No malformed row was written to issues | | NOT RUN |

---

## D. AI fallback (§20)

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-AIFB-001 | AI / Fallback | Gemini API key invalid or network blocked | POST /api/ai/analyze with valid input | Still HTTP 200; success === true; valid structured data returned | | NOT RUN |
| QA-AIFB-002 | AI / Fallback | Gemini unavailable | Inspect response | Result comes from local deterministic fallback; response does NOT claim Gemini generated it (§20) | | NOT RUN |
| QA-AIFB-003 | AI / Fallback | Gemini unavailable | Inspect response metadata (if any) | Fallback is distinguishable from primary AI (e.g. a source field) — flag to Garv if absent | | NOT RUN |
| QA-AIFB-004 | AI / Fallback | Gemini unavailable | Call analyze | Fallback output still passes §19 validation (valid category, priority, summary, department) | | NOT RUN |
| QA-AIFB-005 | AI / Fallback | Gemini unavailable | Create issue end-to-end | Issue workflow is NOT destroyed by AI failure | | NOT RUN |
| QA-AIFB-006 | AI / Fallback | Gemini times out (simulated) | Call analyze | Fallback engages within acceptable time; no indefinite hang | | NOT RUN |
| QA-AIFB-007 | AI / Fallback | Gemini returns 500 | Call analyze | Fallback engages; no 500 propagated to client | | NOT RUN |
| QA-AIFB-008 | AI / Fallback | Fallback used | Check logs / response | Fallback is clearly separated from primary AI implementation (§20) | | NOT RUN |

---

## Notes

- QA-AIVAL-* tests require either a mock hook in the AI service or an
  environment flag to force malformed output. If no such hook exists, mark
  BLOCKED and report to Garv — do not modify the AI code.
- QA-AIFB-* tests require the ability to simulate Gemini being down. If no
  mechanism exists, mark BLOCKED and report to Garv.
- Per §20: "The fallback must not pretend that an unavailable external model
  generated the result." QA-AIFB-002 and QA-AIFB-003 enforce this.