# TEST CASES — BACKEND FOUNDATION

**Scope:** GET /api/health
**Owner of implementation:** Rajveer Dhiman
**Test author / executor:** Lokesh Malik
**Architecture ref:** Master Prompt API Contract; §22 Error Handling

All tests start at NOT RUN. Nothing here has been executed.

---

| Test ID | Area | Preconditions | Action | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| QA-HLTH-001 | Backend / Health | Backend server running locally; no DB dependency required | GET /api/health | HTTP 200 | | NOT RUN |
| QA-HLTH-002 | Backend / Health | Server running | GET /api/health | Body is valid JSON | | NOT RUN |
| QA-HLTH-003 | Backend / Health | Server running | GET /api/health | success === true | | NOT RUN |
| QA-HLTH-004 | Backend / Health | Server running | GET /api/health | message === "CampusFix API is running" (exact string) | | NOT RUN |
| QA-HLTH-005 | Backend / Health | Server running | POST /api/health | Rejected with 404 or 405 | | NOT RUN |
| QA-HLTH-006 | Backend / Health | Server running | GET /api/health/extra | Rejected with 404 | | NOT RUN |
| QA-HLTH-007 | Backend / Health | Server running | GET /api/health with Accept: application/json | Content-Type response header includes application/json | | NOT RUN |
| QA-HLTH-008 | Backend / Health | Server running | GET /api/health twice in a row | Both return identical body; no state mutation | | NOT RUN |
| QA-HLTH-009 | Backend / Health | Server NOT running | GET /api/health | Connection refused (client-side error, not a 200) | | NOT RUN |
| QA-HLTH-010 | Backend / Error envelope | Server running | GET /api/unknown-route | Body matches { success: false, error: { message: <string> } } per §22 | | NOT RUN |

---

## Notes

- QA-HLTH-001 through QA-HLTH-010 are executable as soon as a health route
  exists. They have no DB, AI, or auth dependency.
- QA-HLTH-010 depends on the global error envelope from §22. If the backend
  has not yet implemented the envelope, mark BLOCKED and report to Rajveer —
  do not fabricate a PASS.
- The health message string is treated as a locked contract. Any deviation
  (extra whitespace, different casing) is a FAIL, not a minor issue.