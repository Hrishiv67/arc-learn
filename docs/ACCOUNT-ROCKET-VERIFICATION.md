# Account and rocket refinement

The account screen now focuses on free signup and sign-in, with one route back to the course. Email confirmation and resend remain enabled. Google availability is read from Supabase's public auth settings so an unconfigured provider does not present a broken button.

The course, quiz results and results page share a larger rocket build. Each passed module visibly contributes to its syllabus part; part buttons reveal a short explanation. Actual module IDs determine progress, including out-of-order results. The course offers a revisit action after the available module is complete.

Validation: lint, TypeScript, 25 unit tests, and 38 interior desktop/mobile browser tests passed. Account screenshots checked at 1600, 1240, 390 and 375px with no overflow or browser errors; signup confirmation checked with a mocked response (no test account created). Course screenshots include saved progress. The protected hero and its pre-existing contrast issue are outside this change.

Deployment configuration: Google provider was disabled at inspection. The current production callback was missing from Supabase's allowlist, which pointed at an older site. Google Cloud app setup and authentication URL corrections are being completed separately; mocked UI validation does not establish email delivery or a real Google session.
