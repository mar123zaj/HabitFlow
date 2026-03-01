# Database

## Initial Setup

Apply `schema.sql` via Supabase Dashboard → SQL Editor → New query. This creates all tables, indexes, and RLS policies.

## Migrations

Migrations live in `supabase/migrations/` and are numbered sequentially (`001_`, `002_`, ...).

**How to apply a migration:**

1. Open Supabase Dashboard → SQL Editor → New query
2. Paste the contents of the migration file
3. Click **Run**
4. Verify "Success" message

**Rules:**
- Always apply migrations in order
- Never re-run a migration that was already applied
- Each migration file has a comment at the top describing what it does
- Keep migrations small and focused on one change

## Applied Migrations

Track which migrations have been applied:

- [x] `001_expand_daily_target.sql` — Expand daily_target range from 1-3 to 1-99
