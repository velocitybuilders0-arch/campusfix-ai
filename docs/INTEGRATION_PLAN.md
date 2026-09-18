# CAMPUSFIX AI — INTEGRATION PLAN

**Owner:** Lokesh Malik (QA + DevOps + Integration Support)
**Phase:** 1 — Foundation
**Source of truth:** CAMPUSFIX_ARCHITECTURE.md
**Status:** PLAN — not yet executed. No integration has been verified.

---

## 1. PURPOSE

This document defines what must be verified when the frontend, backend,
database, AI, auth, and storage are wired together in Phase 3. It exists in
Phase 1 so that:

- Every layer knows the exact contract it must satisfy.
- Integration failures can be diagnosed against a written expectation.
- Contract mismatches surface early, not during the demo.

**This is a plan, not a report.** Nothing here has been tested.

---

## 2. PRIMARY INTEGRATION FLOW

The core user journey crosses all layers:

    Frontend (React + Vite)
            |
            v
    Backend (Node + Express)
            |
            v
    Database (Supabase PostgreSQL)

Every step of this flow is a place integration can break. The following
sections define what "working" means at each arrow.

---

## 3. AI INTEGRATION FLOW

Issue creation triggers AI analysis:

    Issue Input (title, description)
            |
            v
    AI Service (server-side, isolated from CRUD per §18)
            |
            v
    Gemini (primary provider)
            |
            v
    Structured Response
            |
            v
    Output Validation (§19)
            |
            v
    Normalized AI Result
            |
            v
    Issue Creation / DB Persistence

Failure handling on this path is defined in §20: if Gemini is unavailable, a
local deterministic fallback produces a valid structured result. The fallback
must not pretend the external model generated the result.

---

## 4. WHAT MUST BE VERIFIED AT EACH LAYER

### 4.1 Frontend -> Backend

| # | What to verify | How |
|---|---|---|
| 1 | Frontend uses only declared endpoints | grep for fetch/axios base URLs |
| 2 | Request bodies match backend contract | compare payload shapes |
| 3 | Response parsing expects { success, data } envelope | inspect response handlers |
| 4 | Error responses read { success:false, error:{message} } | inspect catch blocks |
| 5 | No hardcoded fallback data in production paths | search for mock arrays |
| 6 | Loading / empty / error states exist for every fetch | UI walkthrough |
| 7 | API base URL comes from env, not hardcoded | inspect config |
| 8 | Auth token (once implemented) attached to protected calls | inspect request interceptor |

### 4.2 Backend -> Database

| # | What to verify | How |
|---|---|---|
| 1 | All queries use Supabase client or parameterized SQL (§15) | code review |
| 2 | Row returned matches §14 schema fields | sample query |
| 3 | Required fields enforced | insert incomplete row, expect error |
| 4 | Foreign keys enforced (user_id, issue_id) | insert invalid FK, expect error |
| 5 | Timestamps auto-populate (created_at, updated_at) | insert, inspect row |
| 6 | Status transitions validated before write | PATCH test |
| 7 | No raw user input concatenated into SQL | grep for string templates |
| 8 | DB errors do not leak raw Postgres messages to client | trigger FK violation, inspect response |

### 4.3 Issue -> AI -> Validation -> Database (end-to-end)

| # | What to verify | How |
|---|---|---|
| 1 | Submitting an issue triggers AI analysis | network tab shows POST /api/ai/analyze or in-process call |
| 2 | AI result validates against §19 (category, priority, summary, department) | inspect stored row |
| 3 | Malformed AI output is rejected, not stored | force malformed output (mock), verify no bad row |
| 4 | AI fallback (Gemini down) still produces a valid stored issue | simulate outage, submit, inspect |
| 5 | AI failure does not abort issue creation | confirm issue still saved |
| 6 | Fallback result is distinguishable from primary result (§20) | inspect metadata / logs |
| 7 | Round-trip time is acceptable for demo | measure manually |

---

## 5. AUTHENTICATION INTEGRATION

Once Supabase Auth is wired (§16):

| # | What to verify |
|---|---|
| 1 | Frontend obtains a session on login |
| 2 | Session token is attached to backend requests |
| 3 | Backend validates the token server-side, not client-side |
| 4 | Backend derives the user identity and role from the token |
| 5 | Role is NEVER trusted from request body |
| 6 | Student sees only own issues (server-filtered) |
| 7 | Staff/Admin see broader list per §16 |
| 8 | Unauthenticated protected call returns 401 with §22 envelope |
| 9 | Unauthorized (wrong role) returns 403 with §22 envelope |
| 10 | Logout clears session and subsequent calls 401 |

**Status:** BLOCKED — depends on Phase 2 auth implementation.

---

## 6. IMAGE UPLOAD INTEGRATION

Per §17:

    Frontend
       |
       v
    Supabase Storage
       |
       v
    Stored image (URL/path)
       |
       v
    Issue references image URL

| # | What to verify |
|---|---|
| 1 | Frontend sends file to Supabase Storage (or backend proxy) |
| 2 | File type validated before upload |
| 3 | File size validated before upload |
| 4 | Filename is not trusted as-is (no path traversal) |
| 5 | Stored URL/path is what gets saved in issues.image_url |
| 6 | No image binary stored inside PostgreSQL |
| 7 | Upload failure does not block issue submission (image is optional) |
| 8 | No fake placeholder URLs in final app |

**Status:** BLOCKED — depends on Storage bucket provisioning.

---

## 7. FAILURE-MODE CHECKLIST

When any layer fails, the app must degrade gracefully, not crash.

### 7.1 AI failures

| Scenario | Expected behavior |
|---|---|
| Gemini API key missing | Fallback engages; issue still creates |
| Gemini returns 500 | Fallback engages; no 500 to client |
| Gemini times out | Fallback engages within timeout |
| Gemini returns malformed JSON | Validation rejects; fallback engages |
| Fallback itself fails | Clear §22 error; issue creation blocked or degraded per Garv decision |

### 7.2 API failures

| Scenario | Expected behavior |
|---|---|
| Backend unreachable | Frontend shows network error state |
| Backend returns 500 | Frontend shows generic error, no stack trace |
| Backend returns 4xx | Frontend shows specific message from §22 envelope |
| Endpoint 404 (contract drift) | Frontend logs + surfaces friendly message |

### 7.3 Database failures

| Scenario | Expected behavior |
|---|---|
| DB unreachable | Backend returns §22 envelope, not a raw driver error |
| Constraint violation | Backend returns 400 with clear message |
| FK violation | Backend returns 400 with clear message |
| Query timeout | Backend returns 503 or 500 with §22 envelope |

### 7.4 Auth failures

| Scenario | Expected behavior |
|---|---|
| Missing token | 401 with §22 envelope |
| Expired token | 401 with §22 envelope |
| Wrong role | 403 with §22 envelope |
| Supabase Auth down | Frontend shows auth-unavailable state; no silent bypass |

---

## 8. INTEGRATION TEST CASE IDS

Integration test cases use the `QA-INT-` prefix. They are authored in Phase 3
once endpoints are live. Reserved IDs:

| Range | Area |
|---|---|
| QA-INT-001..019 | Frontend -> Backend contract |
| QA-INT-020..039 | Backend -> Database |
| QA-INT-040..059 | Issue -> AI -> DB end-to-end |
| QA-INT-060..079 | Auth integration |
| QA-INT-080..099 | Upload integration |
| QA-INT-100..119 | Failure modes |

No QA-INT-* case exists yet. None has been executed.

---

## 9. INTEGRATION ORDER

Recommended wiring order for Phase 3 to minimize cascade failures:

1. Health (FE can reach BE at all)
2. Issue create (no AI) — proves FE -> BE -> DB
3. Issue list + detail — proves read path
4. AI analyze called during create — proves AI path
5. Fallback path — proves degradation
6. Update / delete / updates — proves write paths
7. Auth — proves protected routes
8. Upload — proves storage path
9. Full end-to-end sweep

Each step must pass before the next begins. Failures at step N must not be
papered over to reach step N+1.

---

## 10. SIGN-OFF (to be completed only after Phase 3 execution)

- [ ] Frontend -> Backend verified
- [ ] Backend -> Database verified
- [ ] Issue -> AI -> Validation -> DB verified
- [ ] Fallback path verified
- [ ] Auth integration verified
- [ ] Upload integration verified
- [ ] All failure modes exercised
- [ ] No open blockers

**Integration verified by (Lokesh):** _________________ Date: _________
**Phase approved by (Garv):** _______________________ Date: _________

Note: signing off integration does NOT approve a phase. Only Garv approves
phases per §29.