## UI and progress reliability update

The homepage starts directly in the reading. The course index offers a resume action; lesson actions work on mobile; diagrams and matching questions also support select controls. Quiz retries preserve the highest score. Print / save lesson replaces the placeholder PDF links.

### Connect Supabase

1. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Configure these same values in your hosting environment and rebuild. The service-role key is not needed by the app.
2. On a new project, apply `supabase/migrations/0001_init.sql`, then `0002_progress_reliability.sql`. On an existing project with the initial schema, apply only the new migration. Run `supabase/seed.sql` to populate module records; progress writes reference these rows.
3. In Supabase Authentication URL Configuration, set your actual Site URL and allow `https://YOUR-DOMAIN/auth/callback` plus `http://localhost:3100/auth/callback` for local testing. Keep the default confirmation email template using `ConfirmationURL`.
4. Register a test account, follow its confirmation link in the same browser, and complete a quiz. Sign in on a second browser and verify the same score appears. Disconnect the network, complete a quiz, reconnect, and verify synchronization retries. Sign out and verify another account cannot see the previous account's device progress.

The app handles PKCE confirmation, reports errors, retries synchronization, keeps account storage separate, and continues serving lessons when authentication is unavailable. The database migration preserves best scores across concurrent writes. The hosted project has been configured and its profile trigger, progress ownership rules, score preservation, and cross-account isolation were verified with rolled-back test records. A real learner should still complete the email-confirmation flow before launch.

References: [Supabase SSR setup](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls).

Only module 1 currently contains lesson and quiz content. Modules 2–13 remain clearly marked coming soon. Existing subject-matter review notices remain in place.
