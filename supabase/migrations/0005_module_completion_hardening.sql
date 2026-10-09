-- 0005: a learner can no longer mark modules completed by writing to the table directly.
-- Completion goes through complete_greek_mythology_module(); a trigger rejects any other
-- attempt to set status='completed' / completed_at, and rejects unknown module ids.
-- Safe to run more than once.

-- 1) Remove rows with module ids that are not part of the course (cannot be legitimate).
delete from public.module_progress
 where course_id='greek-mythology'
   and module_id not in ('module-01','module-02','module-03','module-04','module-05','module-06','module-07','module-08');

-- 2) Guard trigger
create or replace function public.guard_module_progress()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_trusted boolean := coalesce(current_setting('miyu.trusted_write', true),'')='1';
begin
  if new.course_id='greek-mythology'
     and new.module_id not in ('module-01','module-02','module-03','module-04','module-05','module-06','module-07','module-08') then
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

-- 3) The one trusted way to complete a module
create or replace function public.complete_greek_mythology_module(p_module_id text)
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
  if p_module_id not in ('module-01','module-02','module-03','module-04','module-05','module-06','module-07','module-08') then
    raise exception 'Unknown module';
  end if;

  perform set_config('miyu.trusted_write','1',true);

  insert into public.module_progress(user_id,course_id,module_id,status,started_at,completed_at,last_active_at)
  values(v_user,'greek-mythology',p_module_id,'completed',v_now,v_now,v_now)
  on conflict (user_id,course_id,module_id) do update
    set status='completed',
        started_at=coalesce(public.module_progress.started_at,excluded.started_at),
        completed_at=coalesce(public.module_progress.completed_at,excluded.completed_at),
        last_active_at=excluded.last_active_at;

  perform set_config('miyu.trusted_write','',true);
end $$;

revoke all on function public.complete_greek_mythology_module(text) from public, anon;
grant execute on function public.complete_greek_mythology_module(text) to authenticated;

-- 4) Certificate name length enforced in the database too
do $$
begin
  if not exists (select 1 from pg_constraint where conname='certificates_student_name_len') then
    alter table public.certificates add constraint certificates_student_name_len
      check (char_length(student_name)<=60) not valid;
  end if;
end $$;
