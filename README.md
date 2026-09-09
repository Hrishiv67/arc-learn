# ARC Learn

An unofficial, free course that takes a first-year American Rocketry
Challenge team from registration to their first qualification flight. Built
with Next.js (App Router), TypeScript, Tailwind CSS v4, and an optional
Supabase backend.

Not affiliated with or endorsed by AIA or NAR. No ARC logo, wordmark, or
official mark appears anywhere in the app — see `/legal`.

## Status

Only **Module 1** ("This Year's Challenge") has real content — full MDX
lesson, five custom SVG diagrams, hover/tap glossary terms, and an
11-question quiz (9 multiple choice + drag-label + drag-match). Modules 2–13
have routing, gating, and metadata wired up but render as "coming soon" —
see `content/modules/registry.ts`.

The app is fully functional with **zero backend configured** (anonymous,
localStorage-only progress). Supabase is optional and adds an account +
cross-device sync; no Supabase project has been created for this build, so
that code is written and typed against the real SDK but has never run
against a live database.

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment
variables are required to run the full app.

Other scripts:

```bash
npm run build         # production build
npm run typecheck     # tsc --noEmit
npm run lint           # eslint
npm run test           # unit tests (vitest)
npm run test:e2e        # Playwright — starts its own dev server on :3100
npm run lint:params    # fails if a season-specific number leaks into timeless content
npm run format          # prettier --write .
```

The Playwright suite (`tests/e2e`, `tests/a11y`) runs against both a desktop
and a mobile-width Chromium project. The a11y suite runs axe-core
(`wcag2a`/`wcag2aa`) against every route.

### Optional: connecting Supabase

Copy `.env.example` to `.env.local` and fill in a real project's values once
one exists:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — enable
  account creation and cross-device progress sync (Tier 2). Apply
  `supabase/migrations/0001_init.sql` to a fresh project first (all 10
  tables, RLS policies, and the `handle_new_user` trigger).
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used only for content
  publishing scripts (`supabase/seed.sql`), never in a user-facing request
  path.

Without these set, `proxy.ts` (the auth-refresh middleware) no-ops, the
account screen (`/account`) says plainly that no backend is connected, and
the app runs entirely on Tier 1 (anonymous, localStorage) progress.

Once they're set, `/account` offers real email+password sign-up and sign-in
(`lib/supabase/auth.ts`), and `components/account/AccountSync.tsx` (mounted
once in `app/layout.tsx`) keeps localStorage and Supabase mirrored in both
directions for whoever's signed in: it pulls remote progress into local
storage on sign-in (merging by whichever side is further along, so signing
in on a new device never erases progress), and pushes local writes up to
Supabase as they happen. Every other component still just reads
`useProgress()` from `lib/progress/local.ts` — none of them need to know
whether the data underneath is local-only or synced.

## Adding or editing a module

Module content lives under `content/modules/<NN-slug>/`:

```
content/modules/
  registry.ts                      # all 13 modules' metadata — routing, unit, order,
                                    # prerequisites, NGSS codes, status: "live" | "soon"
  01-this-years-challenge/
    lesson.mdx                     # the reading, using <Parameter>, <Citation>,
                                    # <GlossaryTerm>, and the diagram components
    quiz.ts                        # a Quiz: choice / drag-label / drag-match questions
```

To bring a "coming soon" module live:

1. Flip its entry in `content/modules/registry.ts` to `status: "live"`.
2. Create `content/modules/<NN-slug>/lesson.mdx` and `quiz.ts` (use Module
   1's as a template — all types are enforced by `lib/schemas/{module,
quiz}.ts`).
3. Wire the new files into `lib/content/loadModule.ts`'s
   `getModuleLesson`/`getModuleQuiz` lookups (a small `slug ===` map, not
   dynamic imports — keeps the MDX content statically analyzable).
4. Run `npm run lint:params` — it fails the build if a number that belongs
   only in `content/seasons/<year>.ts` (an altitude, a duration, a payload
   mass) leaks into a module marked `isTimeless: true`.
5. Any claim you can't cite gets wrapped in `<ReviewFlag />` /
   `needsReview: true` rather than invented — see Module 1 for the pattern.

## Rolling the season config

`content/seasons/<year>.ts` is **the only file in the app allowed to
contain season-specific numbers** — target altitude, duration window,
payload count/mass. Everything else (lesson prose, diagrams, quiz
questions) reads these through `<Parameter>` / `SEASON.parameters` so next
season's rules only need one file changed:

```ts
// content/seasons/2028.ts
export const SEASON = seasonSchema.parse({
  year: 2028,
  isCurrent: true,
  rulesUrl: "https://www.rocketrychallenge.org/resource/...",
  parameters: {
    targetAltitude: { value: 800, unit: "ft", label: "Altitude target" },
    durationWindow: { value: "37–40", unit: "sec", label: "Flight duration" },
    payload: {
      count: 2,
      eachMass: "55–63 g each",
      label: "Payload, uncracked",
    },
  },
});
```

There's no season-resolution indirection yet — `content/seasons/2027.ts` is
imported by its literal filename from the handful of places that need it
(`components/lesson/Parameter.tsx`, the diagram components, and
`lib/content/parameterLint.ts`; run `grep -rl "seasons/2027"` to find them
all). Rolling forward means creating `content/seasons/2028.ts` and
repointing those imports at it — keep `2027.ts` around for historical
reference rather than deleting it. Worth adding a `getCurrentSeason()`
resolver at that point rather than continuing to update imports by hand.
Run `npm run lint:params` afterward to confirm nothing in
`content/modules/**` still hardcodes last season's numbers.

## Design tokens → Tailwind

Tailwind v4's CSS-first `@theme` block in `app/globals.css` is the single
source of truth — there's no `tailwind.config.ts`. Brand tokens map to
Tailwind color/spacing utilities directly:

| Brand token                          | Tailwind utility                | Value                           |
| ------------------------------------ | ------------------------------- | ------------------------------- |
| `--arc-navy`                         | `bg-arc-navy` / `text-arc-navy` | `#113D55`                       |
| `--arc-red`                          | `bg-arc-red` / `text-arc-red`   | `#B42025`                       |
| `--arc-sky`                          | `bg-arc-sky`                    | `#7DB4D1`                       |
| `--arc-mist`                         | `bg-arc-mist`                   | `#DBEAF2`                       |
| `go` / `caution` / `info` / `danger` | `bg-go`, `bg-caution`, ...      | status tints, see `globals.css` |

**Spacing**: the brand scale is 10/20/30/40/60/80px. Rather than custom
spacing keys, `--spacing` is set to `10px` in `@theme`, so Tailwind's
_stock_ numeric utilities land exactly on brand values: `p-1` = 10px,
`p-2` = 20px, `p-4` = 40px, `p-8` = 80px, etc. **This means any `-N` sizing
utility here is 2.5× the number you'd expect from default Tailwind** —
`min-h-8` is 80px, not 32px. Watch for this when sizing something to match
a fixed pixel target (an SVG `foreignObject`, an icon); use an arbitrary
value (`h-[32px]`) there instead of reaching for a numbered utility.

**Radius**: zero everywhere except circular controls — all of `--radius-*`
in `@theme` are set to `0px`; `rounded-full` is untouched by that override
and is the only rounding used (icon buttons, radio indicators, the
progress ring).

**Shadow**: one value, `--shadow-overlay`, used only for the glossary
tooltip and the account-menu-style overlays — nothing else in the app
should have a box-shadow.

**Fonts**: `--font-heading` / `--font-body` (Jost/Nunito Sans fallbacks via
`next/font/google`, matching the brand's Futura PT/Museo Sans intent).

## Testing notes

- **`tests/e2e/course-flow.spec.ts`**: drives the full anonymous flow —
  read the lesson, answer all 11 quiz questions (including both
  drag-and-drop types), retry with no limit, confirm the safety-gate
  prerequisite logic. The `dragOnto` helper drives real `page.mouse`
  events (not `Locator.dragTo()`, which doesn't reliably cross dnd-kit's
  `PointerSensor` activation threshold) and deliberately avoids scrolling
  mid-drag — dnd-kit measures droppable rects once when a drag starts and
  doesn't reliably re-measure them against a page scroll that happens
  mid-drag, so `completeQuiz` sets a tall viewport up front instead.
- **`tests/a11y/axe.spec.ts`**: axe-core (`wcag2a`/`wcag2aa`) against
  every route, both viewports.
- **`tests/unit/`**: parameter-leak lint logic, module-gating logic.

## Known gaps / next steps

- **Supabase is untested against a live project.** The migration, RLS
  policies, auth code, and the two-way local/remote progress sync
  (`components/account/AccountSync.tsx`) are all wired and written
  correctly against the real SDK, but no project exists yet — see "Optional:
  connecting Supabase" above. Creating that project (supabase.com, free
  tier) and pasting its URL/anon key into `.env.local` is the only thing
  standing between this and a genuinely live account backend.
- **The safety-module prerequisite gate is client-side only for anonymous
  users.** There's no server that can see an anonymous user's progress, so
  `lib/progress/gating.ts` is a real route guard but not a cryptographic
  guarantee — someone editing their own `localStorage` could bypass it.
  True server enforcement exists only for signed-in users, once Supabase
  is connected, via Postgres RLS + `proxy.ts`.
- **Modules 2–13** need lesson/quiz content written (see "Adding or editing
  a module" above).
- Video scripts haven't been written yet. If/when they are, keep them
  outside `app/` (e.g. `content/scripts/`) so they never affect the build.
