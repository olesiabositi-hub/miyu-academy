-- 0008: more than one course.
-- Adds a generic, trusted completion RPC for the new courses (Greek keeps its own RPC)
-- and teaches the guard trigger which module ids exist in which course.
-- Safe to run more than once. Run it in Supabase → SQL Editor before a new course goes live.

create or replace function public.miyu_course_module_ok(p_course text, p_module text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when p_course='greek-mythology' then p_module ~ '^module-0[1-8]$'
    when p_course in ('norse-mythology','kalevala','nart-epic','egyptian-mythology')
      then p_module ~ '^module-(0[1-9]|1[0-2])$'
    else false
  end
$$;

create or replace function public.guard_module_progress()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_trusted boolean := coalesce(current_setting('miyu.trusted_write', true),'')='1';
begin
  if not public.miyu_course_module_ok(new.course_id, new.module_id) then
    raise exception 'Unknown module';
  end if;

  if not v_trusted then
    if tg_op='INSERT' then
      if new.status='completed' or new.completed_at is not null then
        raise exception 'Completion must go through the course flow';
      end if;
    else
      if (new.status='completed' and old.status<>'completed')
         or new.completed_at is distinct from old.completed_at
         or (old.status='completed' and new.status<>'completed') then
        raise exception 'Completion must go through the course flow';
      end if;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_module_progress on public.module_progress;
create trigger trg_guard_module_progress
before insert or update on public.module_progress
for each row execute function public.guard_module_progress();

create or replace function public.complete_course_module(p_course_id text, p_module_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_now timestamptz := now();
begin
  if v_user is null then raise exception 'Unauthorized'; end if;
  if p_course_id='greek-mythology' or not public.miyu_course_module_ok(p_course_id,p_module_id) then
    raise exception 'Unknown module';
  end if;

  perform set_config('miyu.trusted_write','1',true);

  insert into public.module_progress(user_id,course_id,module_id,status,started_at,completed_at,last_active_at)
  values(v_user,p_course_id,p_module_id,'completed',v_now,v_now,v_now)
  on conflict (user_id,course_id,module_id) do update
    set status='completed',
        started_at=coalesce(public.module_progress.started_at,excluded.started_at),
        completed_at=coalesce(public.module_progress.completed_at,excluded.completed_at),
        last_active_at=excluded.last_active_at;

  perform set_config('miyu.trusted_write','',true);
end $$;

revoke all on function public.complete_course_module(text,text) from public, anon;
grant execute on function public.complete_course_module(text,text) to authenticated;
