# CAMPUSFIX AI — ENVIRONMENT CHECKLIST

**Owner:** Lokesh Malik (QA + DevOps)
**Phase:** 1 — Foundation
**Source of truth:** §21 Environment Variables, §26 Security
**Status:** DOCUMENTED — not yet verified against a running environment.

---

## 1. PURPOSE

This document defines every environment variable, secret, and configuration
category that CampusFix AI requires. It exists so that:

- No secret is ever committed to Git.
- Every developer knows exactly which variables they need.
- `.env.example` stays in sync with actual requirements.
- Deployment can be reproduced from a written spec, not from memory.

**Nothing here has been verified against a live deployment yet.**

---

## 2. ENVIRONMENT CATEGORIES

### 2.1 Supabase configuration

Required for: database, auth, storage.

| Variable | Purpose | Where used | Required? |
|---|---|---|---|
| SUPABASE_URL | Supabase project endpoint | Backend | yes |
| SUPABASE_ANON_KEY | Public anon key for client-side auth | Frontend, Backend | yes |
| SUPABASE_SERVICE_ROLE_KEY | Admin key for privileged backend operations | Backend ONLY | yes (backend) |

Rules (§26):
- [ ] SUPABASE_SERVICE_ROLE_KEY is used only in the backend
- [ ] SERVICE_ROLE_KEY is never sent to the browser
- [ ] ANON_KEY is the only Supabase key exposed to frontend (if any)
- [ ] All three values live in `.env`, never in source code

### 2.2 Gemini configuration

Required for: primary AI analysis.

| Variable | Purpose | Where used | Required? |
|---|---|---|---|
| GEMINI_API_KEY | Gemini API access | Backend ONLY | yes |

Rules (§20, §26):
- [ ] Key is used only server-side
- [ ] Key is never exposed to the frontend bundle
- [ ] Missing or invalid key triggers the local deterministic fallback
- [ ] Fallback path does NOT pretend Gemini was used

### 2.3 Backend configuration

| Variable | Purpose | Default | Required? |
|---|---|---|---|
| PORT | HTTP port for Express server | 5000 | yes |
| NODE_ENV | Runtime environment (development / production) | development | recommended |
| FRONTEND_ORIGIN | CORS allowed origin for the frontend | (dev URL) | yes (deployed) |

Rules:
- [ ] PORT matches what `.env.example` documents
- [ ] CORS origin is restrictive in production (not `*`)
- [ ] NODE_ENV=production disables verbose error output

### 2.4 Frontend configuration

Only variables that are safe to expose publicly may live in the frontend env.

| Variable | Purpose | Required? |
|---|---|---|
| VITE_API_BASE_URL | Backend base URL for API calls | yes |
| VITE_SUPABASE_URL | Supabase project URL (public) | yes |
| VITE_SUPABASE_ANON_KEY | Public anon key (safe to expose) | yes |

Rules:
- [ ] Frontend env NEVER contains SERVICE_ROLE_KEY or GEMINI_API_KEY
- [ ] Vite only exposes variables prefixed `VITE_` — verify no secret uses that prefix

---

## 3. GITIGNORE VERIFICATION

Current `.gitignore` MUST contain (confirmed in Phase 0):

    .env
    .env.*
    !.env.example

- [ ] `.env` is ignored
- [ ] `.env.local`, `.env.production`, etc. are ignored
- [ ] `.env.example` is intentionally NOT ignored
- [ ] No `!.env` reverse-exception exists that would un-ignore a real `.env`

Verify with:

    git check-ignore -v .env

Expected: prints `.gitignore` rule that ignores `.env`.

Also verify no real env file is tracked:

    git ls-files | Select-String ".env"

Expected: only `.env.example` appears (if it appears at all).

---

## 4. .ENV.EXAMPLE VERIFICATION

`.env.example` must contain variable NAMES with EMPTY or PLACEHOLDER values.

- [ ] `SUPABASE_URL=` (empty)
- [ ] `SUPABASE_ANON_KEY=` (empty)
- [ ] `SUPABASE_SERVICE_ROLE_KEY=` (empty)
- [ ] `GEMINI_API_KEY=` (empty)
- [ ] `PORT=5000` (non-secret default is fine)
- [ ] No real keys, tokens, URLs pointing at a live project, or passwords
- [ ] File is committed to Git (this is the one env file that should be)

Open question for Garv:
- Should `VITE_*` frontend variables also appear in `.env.example`, or does
  the frontend have its own example file? Decide before Phase 3.

---

## 5. SECRET HYGIENE VERIFICATION

Run these before every commit that touches config:

### 5.1 Check no .env file is staged

    git status --short
    git diff --cached --name-only

- [ ] No `.env` file listed

### 5.2 Check no known key patterns leaked into source

Search the repo for:

- `eyJ` (JWT prefix common in Supabase keys)
- `AIza` (Google/Gemini API key prefix)
- `service_role`
- `SUPABASE_SERVICE_ROLE_KEY=` followed by a non-empty value

- [ ] No matches outside `.env.example` and documentation

### 5.3 Check client bundle does not contain server secrets

After a frontend build:

    Get-ChildItem -Recurse frontend\dist | Select-String "SERVICE_ROLE"
    Get-ChildItem -Recurse frontend\dist | Select-String "GEMINI"

- [ ] No matches

---

## 6. LOCAL SETUP STEPS (for new team members)

    1. Clone the repository.
    2. Copy .env.example to .env.
    3. Fill in real values from the team's secure channel.
    4. Confirm .env is ignored (git status should not list it).
    5. Install dependencies (backend and frontend separately).
    6. Start backend and frontend.
    7. Confirm GET /api/health responds.

- [ ] Steps documented in README
- [ ] Steps reproducible from scratch by a new member

---

## 7. DEPLOYMENT ENVIRONMENT (Phase 5)

Anticipated target (§27):

    Frontend  ->  Vercel / Netlify
    Backend   ->  Render / equivalent free-tier
    Database  ->  Supabase
    Storage   ->  Supabase Storage
    AI        ->  Gemini free-tier where available

For each platform, verify:

- [ ] Environment variables set in the platform dashboard, not committed to repo
- [ ] Frontend build uses production API URL
- [ ] Backend allows the deployed frontend origin via CORS
- [ ] HTTPS enforced (§26)
- [ ] No server secret is bundled into the frontend build
- [ ] Fallback AI path still works if the deployed Gemini key is rate-limited

**Status:** BLOCKED — begins in Phase 5.

---

## 8. PRE-COMMIT ENVIRONMENT CHECKLIST

Run this list before every commit that touches config or environment:

- [ ] `git status` shows no `.env` file
- [ ] No secret strings appear in `git diff`
- [ ] `.env.example` updated if new variables were added
- [ ] No server-only variable leaked into frontend code
- [ ] No hardcoded fallback secret exists in source
- [ ] CORS config still restricts to known origins

---

## 9. SIGN-OFF (to be completed only after Phase 5)

- [ ] All required variables documented
- [ ] `.env.example` matches actual requirements
- [ ] No secret in Git history (verify with `git log -p --all -- .env`)
- [ ] Deployment platform env set correctly
- [ ] HTTPS enforced
- [ ] Frontend bundle clean of server secrets

**Environment verified by (Lokesh):** _________________ Date: _________
**Phase approved by (Garv):** _________________________ Date: _________

Note: this checklist does NOT approve a phase. Only Garv approves phases per §29.