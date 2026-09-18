# PHASE 2 INTEGRATION TEST CASES — SECURITY & ENVIRONMENT

**Covers required areas:** 18 (Security checks), 19 (Environment / secrets checks)
**Owners of implementation:** Garv Nain (team lead), Rajveer Dhiman (backend), Gunjan Yadav (frontend), Lokesh Malik (QA + DevOps)
**Test author / executor:** Lokesh Malik
**Architecture ref:** §15 (DB safety), §16 (auth), §17 (image upload), §21 (env vars), §26 (security), §27 (deployment)

**Scope note:** These tests verify the security posture of the integrated
system as a whole. They overlap intentionally with the Phase 1 security tests
in test-cases/auth-future.md §D. Where overlap exists, the Phase 1 test remains
authoritative for its specific check; this file adds integration-level coverage.

**All tests start at NOT RUN or BLOCKED. No PASS exists in this file.**

---

## FORMAT

    TEST ID:      QA-INT-SEC-NNN / QA-INT-ENV-NNN
    Purpose:      what is being verified
    Preconditions: what must be true
    Steps:        numbered reproduction steps
    Expected:     exact expected result
    Actual:       (blank — filled at execution)
    Status:       NOT RUN | BLOCKED

---

## A. SECRET HYGIENE — Area 18

### QA-INT-SEC-001 — No .env file is tracked in Git

    Purpose:      Verify the primary secret file is never committed.
    Preconditions: Repo cloned; full history available.
    Steps:
      1. git ls-files | Select-String "\.env"
      2. git log --all --full-history -- .env
    Expected:     Only .env.example listed; no history entry for a real .env file.
    Actual:
    Status:       NOT RUN

### QA-INT-SEC-002 — .gitignore still ignores .env and .env.*

    Purpose:      Verify ignore rules are intact.
    Preconditions: Repo cloned.
    Steps:
      1. git check-ignore -v .env
      2. Confirm .env.example is NOT ignored.
    Expected:     .gitignore rule shown for .env; .env.example not ignored.
    Actual:
    Status:       NOT RUN

### QA-INT-SEC-003 — No API key strings in source

    Purpose:      Verify no leaked Gemini / Supabase keys in code.
    Preconditions: Repo cloned.
    Steps:
      1. Search repo for "AIza" (Gemini prefix).
      2. Search repo for "eyJ" (JWT prefix).
      3. Search repo for "service_role".
    Expected:     No matches outside .env.example and documentation.
    Actual:
    Status:       NOT RUN

### QA-INT-SEC-004 — .env.example contains placeholders only

    Purpose:      Verify the shared example file is safe.
    Preconditions: .env.example exists.
    Steps:
      1. Open .env.example.
      2. Inspect each variable's value.
    Expected:     Every secret-bearing variable has an empty or obvious placeholder value.
    Actual:
    Status:       NOT RUN

### QA-INT-SEC-005 — No service role key in frontend bundle

    Purpose:      Verify server-only secret is not bundled to client.
    Preconditions: frontend build performed.
    Steps:
      1. Search frontend build output for "SERVICE_ROLE" or "service_role".
      2. Search for the actual value if known.
    Expected:     No matches.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-006 — No Gemini key in frontend bundle

    Purpose:      Verify AI key is server-only.
    Preconditions: frontend build performed.
    Steps:
      1. Search frontend build output for "GEMINI" or "AIza".
    Expected:     No matches.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-007 — Server-only vars not prefixed VITE_

    Purpose:      Verify Vite exposure rule.
    Preconditions: frontend env files inspected.
    Steps:
      1. Inspect frontend/.env.example and any VITE_ variables.
    Expected:     No server secret uses the VITE_ prefix.
    Actual:
    Status:       NOT RUN

---

## B. INPUT VALIDATION & INJECTION — Area 18

### QA-INT-SEC-020 — SQL injection attempt via search param

    Purpose:      Verify §15 safe query rule.
    Preconditions: Search endpoint implemented.
    Steps:
      1. GET /api/issues?search=' OR 1=1 --
      2. GET /api/issues?search=;DROP TABLE issues;--
    Expected:     Safe response (empty or 400); no DB damage; no 500.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-021 — SQL injection attempt via title field

    Purpose:      Verify parameterized queries on create.
    Preconditions: Backend running; authenticated.
    Steps:
      1. POST /api/issues with title = "'; DROP TABLE issues;--"
      2. Query the issues table.
    Expected:     Issue created with literal text; table intact.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-022 — XSS attempt via title stored safely

    Purpose:      Verify stored XSS is mitigated.
    Preconditions: Backend running; frontend rendering.
    Steps:
      1. POST /api/issues with title = "<script>alert(1)</script>"
      2. Open the issue detail in the frontend.
    Expected:     Script does not execute; text rendered as literal.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-023 — Prototype pollution attempt

    Purpose:      Verify __proto__ payload does not mutate backend objects.
    Preconditions: Backend running.
    Steps:
      1. POST /api/issues with body { "__proto__": { "admin": true }, "title": "x", "description": "y" }.
      2. Inspect backend process state.
    Expected:     400 OR field ignored; no prototype mutation.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-024 — NoSQL / template injection attempt

    Purpose:      Verify no template engine evaluates user input.
    Preconditions: Backend running.
    Steps:
      1. POST /api/issues with title = "${7*7}".
    Expected:     Stored as literal "${7*7}"; not evaluated to "49".
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-025 — Path traversal attempt in image_url

    Purpose:      Verify URL field validation.
    Preconditions: Backend running; issue creation accepts image_url.
    Steps:
      1. POST with image_url = "../../../etc/passwd".
    Expected:     Rejected 400 OR stored as literal and never fetched server-side.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-026 — Oversized payload rejected

    Purpose:      Verify body size limits.
    Preconditions: Backend running.
    Steps:
      1. POST with a 50 MB body.
    Expected:     Rejected by body-size limit; no memory crash; no 500.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-027 — Content-Type enforcement

    Purpose:      Verify non-JSON content rejected on JSON routes.
    Preconditions: Backend running.
    Steps:
      1. POST /api/issues with Content-Type: text/plain and JSON-looking body.
    Expected:     400; §22 envelope; no parse confusion.
    Actual:
    Status:       BLOCKED

---

## C. AUTH & AUTHORIZATION INTEGRATION — Area 18

### QA-INT-SEC-040 — Role cannot be escalated via request body

    Purpose:      Cross-check of integration-auth QA-INT-AUTH-008.
    Preconditions: Student authenticated.
    Steps:
      1. POST /api/issues with body { "role": "ADMIN", ... }.
      2. Inspect what role the backend treated the caller as.
    Expected:     Student role used regardless of body.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-041 — user_id cannot be spoofed

    Purpose:      Cross-check of integration-auth QA-INT-AUTH-009.
    Preconditions: Student authenticated.
    Steps:
      1. POST /api/issues with body { "user_id": "<other-user>", ... }.
      2. Inspect created row's user_id.
    Expected:     Row's user_id = caller, not body value.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-042 — Expired token rejected

    Purpose:      Cross-check of integration-auth QA-INT-AUTH-006.
    Preconditions: Expired or forged token available.
    Steps:
      1. Call protected route.
    Expected:     401; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-043 — Token signature verified

    Purpose:      Verify JWT signature is verified, not just decoded.
    Preconditions: Ability to craft a JWT with a modified payload but original signature.
    Steps:
      1. Send the tampered token.
    Expected:     401; no trust granted.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-044 — Frontend guards not used as backend substitute

    Purpose:      Verify §16: frontend-only permission is not the real gate.
    Preconditions: Student authenticated; admin-only route exists in FE.
    Steps:
      1. Bypass the FE guard (navigate directly / modify DOM).
      2. Attempt admin API call.
    Expected:     Backend rejects with 403; §22 envelope.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-045 — Auth errors do not leak user existence

    Purpose:      Verify no user enumeration via different 401/403 messages.
    Preconditions: Backend running.
    Steps:
      1. Login attempt with existing email + wrong password.
      2. Login attempt with non-existent email.
    Expected:     Same generic error for both (or documented decision). Note if different.
    Actual:
    Status:       BLOCKED

---

## D. IMAGE UPLOAD SECURITY — Area 18 (§17)

### QA-INT-SEC-060 — Upload rejects disallowed file type

    Purpose:      Verify §17 file type validation.
    Preconditions: Upload route live.
    Steps:
      1. Attempt to upload a .exe, .sh, or other disallowed type.
    Expected:     Rejected; not stored.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-061 — Upload rejects oversized file

    Purpose:      Verify §17 size limit.
    Preconditions: Same as above.
    Steps:
      1. Attempt to upload a 50 MB image.
    Expected:     Rejected; not stored; no partial row.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-062 — Filename is not trusted as path

    Purpose:      Verify §17 rule: do not trust filename.
    Preconditions: Same as above.
    Steps:
      1. Upload a file named "../../evil.jpg".
    Expected:     Server generates its own storage key; original filename never used as a path component.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-063 — No image binary stored in Postgres

    Purpose:      Verify §17 rule.
    Preconditions: Same as above; DB accessible.
    Steps:
      1. Inspect issues table schema.
      2. Confirm image_url is a URL/path, not a bytea/binary column.
    Expected:     No image binary column.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-064 — No fake placeholder URLs

    Purpose:      Verify §17 rule: no fake image URLs in final app.
    Preconditions: Code review of FE and BE.
    Steps:
      1. Grep for "placeholder", "example.com", "via.placeholder", "dummy".
    Expected:     No fake URLs used in production paths.
    Actual:
    Status:       NOT RUN

### QA-INT-SEC-065 — Upload failure does not break issue creation

    Purpose:      Verify image is optional per §17.
    Preconditions: Ability to force upload failure.
    Steps:
      1. Force upload failure.
      2. Submit issue with image.
    Expected:     Either issue created without image, OR clear error. Not a deadlock.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-066 — Uploaded images served over HTTPS in deployed env

    Purpose:      Verify §26 HTTPS requirement.
    Preconditions: Deployed environment.
    Steps:
      1. Inspect an image URL from a deployed issue.
    Expected:     https:// scheme.
    Actual:
    Status:       BLOCKED

---

## E. ENVIRONMENT VARIABLES — Area 19

### QA-INT-ENV-001 — Backend requires necessary env vars

    Purpose:      Verify missing env causes clear failure, not silent misbehavior.
    Preconditions: Able to start backend with .env removed.
    Steps:
      1. Start backend with no .env.
    Expected:     Clear startup error naming the missing var; process exits, not silently running with undefined config.
    Actual:
    Status:       BLOCKED

### QA-INT-ENV-002 — Frontend requires necessary env vars

    Purpose:      Verify missing VITE_ vars cause clear failure.
    Preconditions: FE env removed.
    Steps:
      1. Start FE with missing VITE_API_BASE_URL.
    Expected:     Clear build/runtime error or explicit fallback documented.
    Actual:
    Status:       BLOCKED

### QA-INT-ENV-003 — PORT env respected

    Purpose:      Verify backend binds to PORT from env.
    Preconditions: Set PORT=5055 and start backend.
    Steps:
      1. curl http://localhost:5055/api/health.
    Expected:     200; original port free.
    Actual:
    Status:       BLOCKED

### QA-INT-ENV-004 — NODE_ENV affects error verbosity

    Purpose:      Verify production mode hides stack traces.
    Preconditions: Backend startable with NODE_ENV=production.
    Steps:
      1. Trigger a 500 in production mode.
      2. Inspect response.
    Expected:     No stack trace in response. Confirm §26.
    Actual:
    Status:       BLOCKED

### QA-INT-ENV-005 — CORS origin is restrictive in production

    Purpose:      Verify §26 — no wildcard CORS in production.
    Preconditions: Backend deployed or startable with production config.
    Steps:
      1. Inspect Access-Control-Allow-Origin from a non-allowed origin.
    Expected:     Not "*"; specific origin(s) only.
    Actual:
    Status:       BLOCKED

### QA-INT-ENV-006 — .env.example is in sync with code

    Purpose:      Verify every env var the code reads is documented.
    Preconditions: Code review.
    Steps:
      1. Grep backend/ and frontend/ for process.env / import.meta.env references.
      2. Compare against .env.example.
    Expected:     Every referenced var is in .env.example; no extra unused vars.
    Actual:
    Status:       NOT RUN

### QA-INT-ENV-007 — No default secret fallback in code

    Purpose:      Verify code does not default to a hardcoded key if env is missing.
    Preconditions: Code review.
    Steps:
      1. Grep for patterns like `process.env.KEY || "sk-..."` or similar.
    Expected:     No hardcoded secret fallback exists.
    Actual:
    Status:       NOT RUN

### QA-INT-ENV-008 — Deployment environment vars set outside repo

    Purpose:      Phase 5 readiness check.
    Preconditions: Deployed environment.
    Steps:
      1. Inspect platform env config (Vercel/Netlify/Render dashboards).
    Expected:     All required vars set in platform, not read from a committed file.
    Actual:
    Status:       BLOCKED

---

## F. RATE LIMITING & ABUSE — Area 18

### QA-INT-SEC-080 — Login rate limiting (if implemented)

    Purpose:      Verify brute force resistance.
    Preconditions: Login endpoint; rate limiting policy confirmed with Garv.
    Steps:
      1. Attempt 20 wrong logins rapidly.
    Expected:     Rate limit OR documented non-implementation decision. Not an unbounded open endpoint in production.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-081 — Issue creation rate limiting (if implemented)

    Purpose:      Verify abuse resistance.
    Preconditions: Authenticated; policy confirmed.
    Steps:
      1. Create 50 issues rapidly.
    Expected:     Rate limit OR documented decision.
    Actual:
    Status:       BLOCKED

### QA-INT-SEC-082 — AI endpoint rate limiting (if implemented)

    Purpose:      Verify Gemini cost protection.
    Preconditions: AI endpoint; policy confirmed.
    Steps:
      1. Call /api/ai/analyze 50 times rapidly.
    Expected:     Rate limit OR documented decision. Fallback engages if Gemini quota exhausted.
    Actual:
    Status:       BLOCKED

---

## G. NOTES

- Many tests are executable today by code review (SEC-001 to SEC-007, ENV-006,
  ENV-007, SEC-064) without a running system. Mark NOT RUN until executed.
- Runtime tests remain BLOCKED until the corresponding implementation is live.
- Rate limiting is not specified in the architecture. Tests SEC-080..082 remain
  BLOCKED pending a Garv decision on whether rate limiting is in scope for the
  hackathon deliverable.
- Image upload tests (SEC-060..066) require Supabase Storage bucket provisioned.
- No PASS status exists in this file.