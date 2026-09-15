-- Development seed data. Mirrors content/seasons/2027.ts, content/citations/
-- registry.ts, and content/modules/registry.ts so a local Supabase instance
-- has something to query against. The content tables are the source of
-- truth for the *file-based* app either way (see lib/content/loadModule.ts)
-- — this seed exists for exercising the Supabase-backed auth/progress code
-- paths in isolation, not for serving lesson content from Postgres.

insert into public.seasons (year, is_current, parameters, rules_url) values (
  2027,
  true,
  '{
    "targetAltitude": { "value": 800, "unit": "ft", "label": "Altitude target" },
    "durationWindow": { "value": "37-40", "unit": "sec", "label": "Flight duration" },
    "payload": { "count": 2, "eachMass": "55-63 g each", "label": "Payload, uncracked" }
  }'::jsonb,
  'https://www.rocketrychallenge.org/resource/2027-american-rocketry-challenge-rules/'
);

insert into public.citations (id, season, rule_number, topic, quoted_text, source_url, verified_at) values
  ('1', 2027, '1', 'Payload',
   'Design a rocket that cradles two raw Grade A Large egg of 55 to 63 grams weight, carried in any orientation that must survive the flight uncracked',
   'https://www.rocketrychallenge.org/resource/2027-american-rocketry-challenge-rules/', '2026-09-07'),
  ('2', 2027, '2', 'Altitude goal', 'Reach an impressive 800 feet.',
   'https://www.rocketrychallenge.org/resource/2027-american-rocketry-challenge-rules/', '2026-09-07'),
  ('3', 2027, '3', 'Flight time', 'Safely return to Earth within 37 to 40 seconds.',
   'https://www.rocketrychallenge.org/resource/2027-american-rocketry-challenge-rules/', '2026-09-07'),
  ('HANDBOOK', 2027, '2027 Team Handbook', 'Scoring, deadlines, qualification procedure - PDF not yet read',
   null, 'https://www.rocketrychallenge.org/resource/2027-team-handbook/', null),
  ('MOTORS', 2027, 'Approved Motors List', 'Permitted motors - PDF not yet read',
   null, 'https://www.rocketrychallenge.org/resource/approved-motors-list/', null),
  ('NAR-SC', null, 'NAR Model Rocket Safety Code', 'Model rocket safety code',
   null, 'https://www.nar.org/safety-information/model-rocket-safety-code/', null);

insert into public.modules (id, slug, "order", unit, unit_title, title, summary, estimated_minutes, is_timeless, prerequisite_ids, ngss_codes, status, needs_review) values
  ('this-years-challenge', 'this-years-challenge', 1, 1, 'Before you build', 'This Year''s Challenge',
   'This season''s flight goal, the parts of a competition rocket, and how a flight is scored.', 22, false, '{}', '{MS-ETS1-1,MS-ETS1-2,MS-PS2-2}', 'live', true),
  ('what-you-signed-up-for', 'what-you-signed-up-for', 2, 1, 'Before you build', 'What You Just Signed Up For',
   'Season overview, team roles, and the time budget ahead.', 11, true, '{}', '{MS-ETS1-1}', 'soon', true),
  ('safety-first', 'safety-first', 3, 1, 'Before you build', 'Safety First',
   'The NAR Model Rocket Safety Code, supervision, and launch sites.', 14, true, '{}', '{}', 'soon', true),
  ('anatomy-of-a-rocket', 'anatomy-of-a-rocket', 4, 2, 'How rockets work', 'Anatomy of a Rocket',
   'Inner systems (motor, altimeter, chute, Nomex, egg case), outer airframe, and OpenRocket.', 24, true, '{}', '{MS-ETS1-2,MS-PS2-1,MS-PS2-2}', 'live', false),
  ('why-rockets-fly-straight', 'why-rockets-fly-straight', 5, 2, 'How rockets work', 'Why Rockets Fly Straight',
   'Center of pressure, center of gravity, and stability margin.', 16, true, '{}', '{MS-PS2-1,MS-PS2-2}', 'soon', true),
  ('thrust-impulse-and-motors', 'thrust-impulse-and-motors', 6, 2, 'How rockets work', 'Thrust, Impulse, and Motors',
   'Thrust curves, motor codes, and delay grains.', 15, true, '{}', '{MS-PS2-1,MS-PS2-2}', 'soon', true),
  ('drag-and-altitude', 'drag-and-altitude', 7, 2, 'How rockets work', 'Drag and Altitude',
   'Why hitting the altitude target is hard.', 13, true, '{}', '{MS-ETS1-2,MS-PS2-1,HS-PS2-1}', 'soon', true),
  ('simulating-in-openrocket', 'simulating-in-openrocket', 8, 3, 'Design and build', 'Simulating in OpenRocket',
   'Building and reading a simulation.', 22, true, '{}', '{MS-ETS1-2,MS-ETS1-4,HS-ETS1-2,HS-ETS1-3,HS-ETS1-4}', 'soon', true),
  ('building-it', 'building-it', 9, 3, 'Design and build', 'Building It',
   'Cutting, fillets, fin alignment, and motor retention.', 26, true, '{safety-first}', '{HS-ETS1-2,HS-ETS1-3}', 'soon', true),
  ('recovery-and-the-egg', 'recovery-and-the-egg', 10, 3, 'Design and build', 'Recovery and the Egg',
   'Parachute sizing, descent rate, and packing.', 18, true, '{}', '{}', 'soon', true),
  ('launch-day', 'launch-day', 11, 4, 'Fly and qualify', 'Launch Day',
   'Pad setup, checklists, wind, and scrub criteria.', 17, true, '{safety-first}', '{}', 'soon', true),
  ('reading-a-flight-and-iterating', 'reading-a-flight-and-iterating', 12, 4, 'Fly and qualify', 'Reading a Flight and Iterating',
   'Altimeter data, and changing one variable at a time.', 19, true, '{}', '{MS-ETS1-3}', 'soon', true),
  ('qualification-and-beyond', 'qualification-and-beyond', 13, 4, 'Fly and qualify', 'Qualification and Beyond',
   'Observer rules, forms, and submission.', 12, true, '{}', '{}', 'soon', true);

insert into public.lessons (module_id, mdx_path, needs_review) values
  ('this-years-challenge', 'content/modules/01-this-years-challenge/lesson.mdx', true),
  ('anatomy-of-a-rocket', 'content/modules/04-anatomy-of-a-rocket/lesson.mdx', false);

insert into public.resources (module_id, type, file_path, title, pages) values
  ('this-years-challenge', 'handout', 'content/modules/01-this-years-challenge/handout.pdf', 'Module 1 student handout', 4),
  ('this-years-challenge', 'worksheet', 'content/modules/01-this-years-challenge/worksheets.pdf', 'Module 1 worksheets', 3),
  ('this-years-challenge', 'instructor', 'content/modules/01-this-years-challenge/instructor-guide.pdf', 'Module 1 instructor guide', 6);
