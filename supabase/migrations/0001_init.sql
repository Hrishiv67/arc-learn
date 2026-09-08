-- ARC Learn — initial schema.
-- Written against the Supabase JS v2 / Postgres conventions. Never run
-- against a live project from this build — no Supabase project exists yet.
-- RLS is enabled on every table; policies restrict rows to their owner
-- except the content tables, which are public-read (course content, not
-- user data) and writable only by the service role (content publishing is
-- an admin/CI operation, not an end-user one).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Content tables — public read, service-role write only.
-- ---------------------------------------------------------------------

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  is_current boolean not null default false,
  parameters jsonb not null, -- { targetAltitude, durationWindow, payload }
  rules_url text not null,
  created_at timestamptz not null default now()
);

create table public.modules (
  id text primary key, -- e.g. 'this-years-challenge'
  slug text not null unique,
  "order" integer not null check ("order" between 1 and 13),
  unit integer not null check (unit between 1 and 4),
  unit_title text not null,
  title text not null,
  summary text not null,
  estimated_minutes integer not null,
  video_id text, -- null = video placeholder shown, never a blocker
  is_timeless boolean not null default true,
  prerequisite_ids text[] not null default '{}',
  ngss_codes text[] not null default '{}',
  status text not null check (status in ('live', 'soon')),
  needs_review boolean not null default true
);

create table public.lessons (
  module_id text primary key references public.modules(id) on delete cascade,
  mdx_path text not null,
  last_reviewed_at timestamptz,
  reviewed_by text,
  needs_review boolean not null default true
);

create table public.citations (
  id text primary key, -- e.g. '1', 'HANDBOOK', 'NAR-SC'
  season integer references public.seasons(year),
  rule_number text not null,
  topic text not null,
  quoted_text text, -- null/empty = not yet verified, never invented
  source_url text not null,
  verified_at timestamptz
);

create table public.quizzes (
  module_id text primary key references public.modules(id) on delete cascade,
  questions jsonb not null, -- QuizQuestion[] — see lib/schemas/quiz.ts
  pass_rate numeric not null default 0.7 check (pass_rate between 0 and 1)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  module_id text not null references public.modules(id) on delete cascade,
  type text not null check (type in ('handout', 'instructor', 'worksheet')),
  file_path text not null,
  title text not null,
  pages integer
);

alter table public.seasons enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.citations enable row level security;
alter table public.quizzes enable row level security;
alter table public.resources enable row level security;

create policy "public read seasons" on public.seasons for select using (true);
create policy "public read modules" on public.modules for select using (true);
create policy "public read lessons" on public.lessons for select using (true);
create policy "public read citations" on public.citations for select using (true);
create policy "public read quizzes" on public.quizzes for select using (true);
create policy "public read resources" on public.resources for select using (true);
-- No insert/update/delete policies for anon/authenticated: content is
-- published via the service role key (CI/admin), never from the client.

-- ---------------------------------------------------------------------
-- Tier 2 — user accounts. Minimal by design: email only, nothing else.
-- Never add a required profile field here — see the auth section in the
-- build brief on why (COPPA exposure for a service aimed at minors).
-- ---------------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users read own row" on public.users
  for select using (auth.uid() = id);
create policy "users update own row" on public.users
  for update using (auth.uid() = id);

-- Populate public.users from auth.users on signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- Progress — the sensitive one. Owner-only, no exceptions.
-- ---------------------------------------------------------------------

create table public.progress (
  user_id uuid not null references public.users(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'complete')),
  video_position_seconds integer,
  quiz_score integer,
  quiz_total integer,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.progress enable row level security;

create policy "users read own progress" on public.progress
  for select using (auth.uid() = user_id);
create policy "users write own progress" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "users update own progress" on public.progress
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Tier 3 — team/classroom. Schema now, screens later (per the brief).
-- A teacher sees per-module completion only, never quiz answers.
-- ---------------------------------------------------------------------

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid not null references public.users(id) on delete cascade,
  join_code text not null unique,
  season_id uuid not null references public.seasons(id),
  created_at timestamptz not null default now()
);

create table public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  display_name text not null, -- student-chosen, scoped to the team, never a real name requirement
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

alter table public.teams enable row level security;
alter table public.team_members enable row level security;

create policy "teachers manage own teams" on public.teams
  for all using (auth.uid() = teacher_id);

create policy "members read their team" on public.team_members
  for select using (
    auth.uid() = user_id
    or auth.uid() = (select teacher_id from public.teams where id = team_id)
  );
create policy "users join a team as themselves" on public.team_members
  for insert with check (auth.uid() = user_id);

-- Teachers can read their team's module-completion status, never quiz
-- answers or scores — a narrower view than public.progress itself.
create view public.team_module_completion as
  select
    tm.team_id,
    tm.user_id,
    tm.display_name,
    p.module_id,
    p.status,
    p.completed_at
  from public.team_members tm
  join public.progress p on p.user_id = tm.user_id;

alter view public.team_module_completion set (security_invoker = true);
