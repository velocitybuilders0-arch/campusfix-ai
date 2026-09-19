# CampusFix AI — Database

This folder defines the backend PostgreSQL schema. The schema is written for
**Supabase** (Postgres 15+) and is applied manually by the Supabase project
owner (Garv). The backend never creates or migrates tables at runtime.

## Files

- `schema.sql` — full DDL for enums, tables, indexes, and triggers.

## Logical entities

- `users` — application profile, keyed by Supabase Auth `uid`. Credentials
  live in Supabase Auth (`auth.users`), **not** in this table.
- `issues` — reported campus issues.
- `issue_updates` — chronological progress notes attached to an issue.

## Enums

- `user_role`: `STUDENT`, `ADMIN`, `STAFF`
- `issue_status`: `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REJECTED`
- `issue_priority`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

## Applying the schema

1. Open the Supabase project dashboard.
2. Go to **SQL Editor**.
3. Paste the full contents of `schema.sql`.
4. Run it once. It is idempotent (`IF NOT EXISTS`, `DROP TRIGGER IF EXISTS`),
   so re-running is safe.
5. Confirm in **Table Editor** that `users`, `issues`, `issue_updates` exist
   with the expected columns and enums.

## Runtime access

The backend reads three environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` — used only for verifying user JWTs.
- `SUPABASE_SERVICE_ROLE_KEY` — used for server-side reads/writes that must
  bypass row-level security. **Never expose this key to the frontend.**

See `backend/.env.example` for the variable names. No secrets are committed.

## Row Level Security (RLS)

RLS is **not** enabled by this schema. The backend is the only writer and it
uses the service-role key; the frontend must never talk to Supabase directly
for issue CRUD. If RLS is added later, do so via a separate migration.
