# ARC Learn — UI handoff

Paste this whole file to the agent picking the work up. It is written to be read
cold, with no memory of the sessions that produced the current state.

---

## 1. What this is

ARC Learn is a free course that takes a first-year American Rocketry Challenge
team from knowing nothing to a qualifying flight. Thirteen modules in four
units. Audience is middle- and high-school students, many with no rocketry
background at all.

- **Repo:** `Hrishiv67/arc-learn`, branch `main`
- **Live:** https://arc-learn-three.vercel.app (Vercel production, deploys on
  push to `main`)
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript,
  Tailwind v4 (`@theme` tokens in `app/globals.css`), Supabase auth, MDX
  lessons, vitest + Playwright
- **Local:** `npm run dev` → http://localhost:3200

There is an upcoming introductory call with **NAR** and the **American Rocketry
Challenge**. Brand fidelity is a deliverable, not a detail.

### The state of play

The **homepage is finished and is the quality bar.** It is a scroll-scrubbed
rocket launch that washes into the course listing. Do not redesign it. Read it
to learn the standard, then bring everything else up to it.

Everything behind the homepage — **sign-up, module detail, lesson reader, quiz,
results, account** — is functional but plainly styled, and in places contradicts
the project's own design rules. That is the work.

---

## 2. Hard rules

These are not preferences. They come from the project's own styleguide, which is
a real page in the app at **`/styleguide`** (source:
`app/(app)/styleguide/StyleguideClient.tsx`). It renders every primitive in
every state and states the contract at the top:

> Radius is 0 everywhere except circular controls; no shadow outside the one
> modal/tooltip overlay use; one red element per screen in real product context.

1. **Radius 0.** The only exceptions are genuinely circular controls — progress
   rings, icon buttons, radio dots.
2. **No shadows.** Use a hairline border (`--color-mist-500` on light) instead.
3. **One red element per screen.** ARC red is the action colour. If a screen has
   two red things, one of them is wrong. Red is never decoration.
4. **No gradients** except the atmospheric ones already in the hero.
5. Motion is **interaction-driven**, 0.2–0.45s, no bounce, no spring, no
   ambient/looping animation. Respect `prefers-reduced-motion`.

The owner has rejected, by name and more than once: cartoon/illustrated rockets,
animated loaders, dashed "blueprint" graphics, anything that reads as
AI-generated or templated. A previous loading state was an animated rocket with
twinkling stars and an exhaust flame; it was deleted. Do not reintroduce that
register anywhere.

---

## 3. Brand facts (measured from rocketrychallenge.org — do not re-derive)

| Token | Value | Use |
|---|---|---|
| `--color-arc-navy` | `#113d55` | headings, chrome |
| `--color-arc-red` | `#b42025` | the one action per screen |
| `--color-arc-sky` | `#7db4d1` | accents, part labels |
| `--color-arc-mist` | `#dbeaf2` | fills, rules |
| `--color-arc-paper` | `#f5f5f5` | ground |
| `--color-read` | `#14181b` | reading copy |
| `--color-read-dim` | `#4a5560` | secondary copy |

ARC sets headings in **Futura PT** and body in **Museo Sans** (Adobe Typekit).
Those are not free, so the app ships **Jost** (an open Futura revival) and
**Nunito Sans** (nearest open face to Museo Sans), wired through
`--font-heading` and `--font-body` in `app/globals.css`. If a Typekit kit ever
becomes available, swapping is a two-line change — keep all type going through
those two variables so that stays true.

Prose is set in near-black (`--color-read`), not blue-grey, because that is how
ARC's own site sets body copy. Navy is for headings and chrome.

---

## 4. Read these first

Spend fifteen minutes here before writing anything.

```
app/page.tsx                      the finished homepage: hero → course → gate
components/hero/Hero.tsx          the launch: one rAF loop, all DOM writes batched
lib/hero/launchSequence.ts        pure fn: scroll progress → every animated value
components/course/ModuleTrack.tsx the course listing — this is the quality bar
                                  for every list/table you are about to build
lib/rocket/sections.ts            which module earns which part of the rocket
app/globals.css                   @theme tokens + legacy component CSS
app/hero.css                      homepage-only styles, well commented
app/(app)/styleguide/…            the primitive contract, rendered at /styleguide
components/ui/*                   Button, Input, Callout, Badge, StatTile, etc.
```

Two ideas hold the product together and must survive your changes:

- **The rocket is the curriculum.** Each unit builds a section of the airframe;
  finishing the course flies it. `lib/rocket/sections.ts` is the single source
  of truth for that mapping — both the homepage blow-up and the course-index
  build card read it, and they must never disagree.
- **The course is the point; the rocket is retention.** The modules are the
  substance. The assembling rocket exists so a fourteen-year-old comes back for
  module four. Keep it present but quiet — never let it outshine the content.

---

## 5. The work, in priority order

### Phase 0 — Clear the contradictions (do this first, it is fast)

**0a. Dead CSS.** `app/globals.css` carries styles from a homepage that no
longer exists. These classes have **zero references** in the codebase — verify
with grep, then delete them and their rules:

`.hero-photo` · `.hero-photo-caption` · `.hero-mission-card` ·
`.hero-mission-pulse` · `.hero-flight-tag` · `.home-hero` ·
`.home-hero-section` · `.hero-title` · `.hero-eyebrow` · `.hero-proof` ·
`.rocket-workshop` · `.rocket-workshop-level` · `.rocket-blueprint` ·
`.rocket-drawing` · `.rocket-orbit-line` · `.rocket-center-line` ·
`.rocket-ground-line` · `.rocket-paint`

That removes most of the file's `border-radius` and `box-shadow` declarations in
one pass.

**0b. Live rule violations.** These *are* rendered and *do* break the contract —
they are why the account page looks rounded and floaty next to the homepage:

| Class | Problem | Fix |
|---|---|---|
| `.auth-card` | `border-radius: 18px` + `box-shadow` | radius 0, 1px `--color-mist-500` border |
| `.auth-card input` | `border-radius: 8px` | radius 0 |
| `.auth-mode-switch` / `button` | radius 10px / 7px + shadow on active | radius 0, active state via border-bottom |
| `.account-benefits` | `border-radius: 14px` | radius 0 |
| `.learning-card` | `border-radius: 16px` | radius 0 |
| `components/lesson/GlossaryTerm.tsx` | `rounded-[4px]`, `rounded-[10px]` | radius 0 |
| `components/quiz/DragMatchQuestion.tsx`, `DragLabelDiagram.tsx` | `rounded-lg` ×2 each | radius 0 |

`rounded-full` in `components/ui/Button.tsx` (IconButton) and
`components/ui/RadioGroup.tsx` is **correct** — those are circular controls.

**0c. Stale copy that now lies.** An account is **required** before any module —
`app/(app)/modules/[slug]/layout.tsx` redirects signed-out visitors to
`/account?next=…`, and this is live in production. But the account screen still
says **"OPTIONAL ACCOUNT"** and offers **"Keep learning without an account"**,
which goes nowhere useful. Rewrite that screen's framing: the account is
required, the course is free forever, and say both plainly.

**0d. Two wordmarks.** The homepage nav renders `ARC / LEARN`
(`components/hero/HeroNav.tsx`); every other page renders `ARC Learn` above
`UNOFFICIAL COURSE` (`components/nav/SiteHeader.tsx`). Pick one lockup and use
it in both. Keep the "unofficial" disclosure somewhere — it is a legal nicety,
not decoration — but it does not have to live in the wordmark.

### Phase 1 — Sign-up and account (`app/(app)/account/AccountClient.tsx`, 401 lines)

This is the first gate every student hits and currently the weakest screen.

- Apply Phase 0b and 0c.
- The page is a marketing column plus a form card. Since the account is now
  required, cut the persuasion down hard — the homepage already sold it. Lead
  with the form. Keep "free forever" and the privacy list ("we only need an
  email"), which are genuinely reassuring to a student and to a teacher.
- The headline currently breaks awkwardly across two lines with a large gap.
  Set an explicit `line-height` on it; do not rely on the default.
- **Google sign-in is built but hidden.** `signInWithGoogle` exists in
  `lib/supabase/auth.ts` and the button renders only when
  `NEXT_PUBLIC_GOOGLE_AUTH === "1"`. It needs a Google OAuth client in Google
  Cloud and the credentials pasted into Supabase → Auth → Providers. **Ask the
  owner before assuming it is configured.** Email + password must remain
  complete on its own.
- Error and pending states need real design, not default text. Use `Callout`.
- **Flag to the owner, do not silently implement:** requiring an account means
  collecting email addresses from students who may be under 13, which is what
  COPPA governs, and there is no age gate. A birth-year field or an "I am 13 or
  older" confirmation is a one-line addition. `lib/supabase/auth.ts` also still
  documents a since-reversed "no OAuth, nothing that could fingerprint a minor"
  policy — update that comment to match reality either way.

### Phase 2 — The lesson reader (`app/(app)/modules/[slug]/lesson/LessonClient.tsx` + `components/lesson/*`)

This is where students spend the most time, so it matters most and should change
least dramatically. It is already decent: navy headings, a left-barred callout
for draft content, a right rail with progress and an in-page table of contents.

- **Two red elements.** "ALL MODULES" and "OPEN QUIZ" are both red text buttons.
  One red per screen: "Open quiz" is the action, so it keeps red — make "All
  modules" navy or a plain text link.
- **Measure.** Body is 17px/1.85 running to roughly 80 characters. Bring it to
  66–72ch with a `max-width` on `.prose-lesson`; it is the single biggest
  readability win available and costs one line.
- Style the MDX primitives deliberately, not by default: `h2`/`h3` rhythm,
  lists, `Parameter`, `Citation`, `GlossaryTerm`, `TermList`, `ReviewFlag`,
  blockquote. There are five real diagram components in `components/diagrams/` —
  check they sit on the page with proper captions and spacing rather than
  floating.
- The right rail is good. Make it sticky if it is not, and make the active TOC
  item track scroll position.
- Give the end of a lesson a deliberate hand-off into the quiz. Right now it
  simply stops.

### Phase 3 — The quiz (`components/quiz/QuizRunner.tsx`, `ChoiceQuestion.tsx`, `DragMatchQuestion.tsx`, `DragLabelDiagram.tsx`)

- The segmented progress bar across the top is a good idea, kept.
- Answer options are flat mist fills with no borders and no visible hover,
  focus, or selected state. Design all four states plus correct/incorrect
  feedback. They must be keyboard-operable and screen-reader-correct — these are
  radio semantics; use `components/ui/RadioGroup.tsx` rather than reinventing.
- Question text is set very large relative to the options; tighten that
  relationship.
- "Check my answer" is the one red action on the screen. Its disabled state
  currently reads as broken rather than as waiting — make the difference
  between disabled and enabled unmistakable.
- Feedback after answering is the teaching moment in the whole product. A wrong
  answer should explain *why*, and point back to the section of the reading it
  came from. Check what `quiz.ts` content already provides before designing.
- The two drag questions are the most fragile things in the app. They need
  visible drag affordances, a keyboard alternative, and touch support. Test on a
  real phone viewport.

### Phase 4 — Results (`app/(app)/modules/results/ResultsClient.tsx`)

**This screen is the biggest missed opportunity in the product.** It is where a
student lands after finishing a module — and there is no rocket on it at all.
The entire retention mechanic ("every module finishes a part") pays off nowhere.

- Put the earned part on this screen. Reuse `components/rocket/RocketBuild.tsx`
  and `lib/rocket/sections.ts`; do not invent a second rocket.
- Name what was just earned, and what the next module earns. The parts are
  rendered from `public/rocket/cad-*.png` by `scripts/render_rocket.py`.
- Completing the **final** module should be a real moment — the whole rocket,
  assembled, and then flown. The launch engine already exists and is reusable:
  `lib/hero/launchSequence.ts` + `lib/hero/smokeRenderer.ts`. Confirm scope with
  the owner before building it; it is the kind of thing that should be its own
  task.

### Phase 5 — Module detail, index, chrome

- `ModuleDetailClient.tsx` (112 lines) is a thin screen between the index and
  the lesson. Decide whether it earns its place at all, or whether "Start"
  should go straight to the reading.
- `ModulesIndexClient.tsx` (251 lines) predates the homepage's `ModuleTrack`.
  They now show the same information twice in two different designs. Either make
  the index reuse `ModuleTrack`, or make the two visually consistent on purpose.
- `SiteHeader` / `SiteFooter` / `TabBar` — the header's progress bar is good.
  The footer is untouched. The mobile `TabBar` needs checking against the new
  type.
- `app/(app)/legal/page.tsx` and `offline/page.tsx` are unstyled leftovers.

---

## 6. How to run and verify

```bash
npm install
npm run dev        # http://localhost:3200
npm run lint       # must be clean, zero warnings
npm run typecheck  # must be clean
npm run test       # vitest, 17 tests, must stay green
npm run build      # must succeed before any push
npm run assets     # regenerates public/hero/* (needs Pillow + numpy)
python scripts/render_rocket.py   # regenerates public/rocket/*
```

**Verification is not optional and reading code is not evidence.** For every
screen you touch:

1. Open it in a real browser at **1600×900 and 390×844**. The styleguide
   specifies review at 375px and 1240px — hit those too.
2. Screenshot it and actually look at the screenshot.
3. Check the console is clean.
4. Check contrast numerically — 4.5:1 minimum, measured against *the darkest
   surface the colour actually sits on*, not against white.
5. Tab through it. Every control reachable, focus always visible.
6. Check `prefers-reduced-motion`.

**Signed-in states cannot be tested locally without credentials.** There is no
`.env.local` in the repo. Anything behind auth — sign-up, sign-in, the module
gate, progress sync — must either be tested against a real Supabase project or
reported honestly as unverified. Do not claim a sign-in flow works because the
code looks right.

To fake progress locally (the gate falls through when Supabase is unconfigured):

```js
localStorage.setItem("arc-learn:progress:v1", JSON.stringify({
  "this-years-challenge": { quiz: { score: 10, total: 10 } }
}));
```

Module ids are in `content/modules/registry.ts`. A module counts as complete at
≥70% (`lib/schemas/progress.ts`).

---

## 7. Gotchas that will cost you an hour each

- **The service worker caches documents and CSS.** It is disabled in development
  (`components/PwaRegister.tsx`) but if you ever see an edit that has already
  rebuilt on the server still rendering the old version — through hard reloads,
  `.next` deletion, and server restarts alike — this is why. Unregister it and
  clear `caches` in the console.
- **Tailwind preflight sets `img { max-width: 100% }`.** An image inside a
  zero-width parent collapses to nothing. Give the parent an explicit width.
- **Size rocket parts by width in body diameters**, never by image aspect ratio.
  The fin can's image is taller than one diameter because the fins overhang, so
  sizing by aspect shrinks its tube by a third. `widthD` in
  `lib/rocket/sections.ts` is the correct field; `scripts/render_rocket.py`
  reports it.
- **Route groups.** App chrome lives in `app/(app)/layout.tsx`; the homepage sits
  outside it so it can run full-bleed. Route groups do not change URLs. Absolute
  imports pointing *into* `app/` break when files move — prefer relative imports
  between sibling route files.
- **Windows paths with spaces break `npm --prefix`.** If you use a launch config,
  use the 8.3 short path.

---

## 8. Definition of done

A screen is finished when:

- It obeys all five hard rules in §2, verified by looking at it.
- It uses only tokens from `app/globals.css` — no hex literals in components.
- It reads as the same product as the homepage: same type scale logic, same
  hairline rules, same restraint, same micro-caps for labels
  (10px / 600 / `0.2em` tracking).
- Lint, typecheck, tests and build are all clean.
- You have screenshotted it at desktop and mobile and looked at both.
- Anything you could not verify — notably anything behind sign-in — is stated
  plainly as unverified rather than glossed.

Work in small commits on a branch, open a PR, and let Vercel build a preview
before merging to `main`. `main` deploys straight to the live site, and there is
a call with NAR and ARC coming.

## 9. Out of scope

- **The homepage.** `components/hero/*`, `lib/hero/*`, `components/course/ModuleTrack.tsx`,
  `components/rocket/CourseGate.tsx`, `app/hero.css`. Reuse them, read them for
  the standard, do not redesign them.
- **Writing module content.** Twelve of the thirteen modules are unwritten
  (`status: "soon"` in `content/modules/registry.ts`). That is a separate job
  requiring subject-matter review — the "Draft lesson text" callouts you will
  see are deliberate and must stay until a human clears them.
