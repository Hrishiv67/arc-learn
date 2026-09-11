# Live configuration verification

Verified September 10, 2026 against Supabase project `awxevxswxofwstrvtwsp` and Vercel project `hrishiv/arc-learn`.

- Root cause: Vercel had no environment variables; Supabase had the initial schema but no module rows.
- Configured the project URL and publishable key in all Vercel environments. No secret or service-role key is exposed to the app.
- Changed Supabase Site URL from localhost to `https://arc-learn-hrishiv.vercel.app` and allowed its exact `/auth/callback` URL and the named review branch callback.
- Inserted the 13 module metadata rows from the repository with conflict-safe inserts. Did not seed nonexistent PDF resources.
- Applied the progress-preservation function/trigger and restricted profile updates to email. The migration is replay-safe for the trigger already applied through the dashboard.
- Ran a transaction with two synthetic identities and rolled it back. Verified auth-to-profile trigger, owner progress insert/update, best-score retention, cross-account read isolation, and denied cross-account writes.
- All public tables have RLS enabled. Actual email delivery requires a learner to register and follow the confirmation email; no email was sent during these database checks.

The live dashboard SQL query is saved privately for audit. The repository SETUP.md retains steps for configuring a fresh project.
