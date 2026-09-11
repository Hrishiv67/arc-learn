-- Preserve best results even when two devices submit concurrently.
-- Apply after 0001_init.sql and seed the module rows with supabase/seed.sql.
create or replace function public.preserve_progress()
returns trigger language plpgsql set search_path = public as $$
begin
  if TG_OP = 'UPDATE' then
    if old.quiz_total > 0 and (new.quiz_total is null or new.quiz_total <= 0
      or old.quiz_score::numeric / old.quiz_total > new.quiz_score::numeric / new.quiz_total) then
      new.quiz_score := old.quiz_score;
      new.quiz_total := old.quiz_total;
      new.status := old.status;
      new.completed_at := old.completed_at;
    end if;
    if old.status = 'complete' then
      new.status := 'complete';
      new.completed_at := old.completed_at;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create or replace trigger preserve_best_progress before insert or update on public.progress
for each row execute function public.preserve_progress();

-- A user may edit their email, but cannot grant themselves a teacher role.
revoke update on public.users from authenticated;
grant update (email) on public.users to authenticated;

