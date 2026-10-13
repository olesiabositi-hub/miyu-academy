-- 0006: open courses. The Final Myth Decoder is optional and can be started at any time
-- (no longer requires all 8 modules), and the certificate functions are switched off.
-- Safe to run more than once.

create or replace function public.start_greek_mythology_final_decoder()
returns public.final_decoder_attempts
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user uuid := auth.uid();
  v_progress public.final_decoder_progress;
  v_attempt public.final_decoder_attempts;
  v_attempt_number integer;
  v_option_order jsonb := '[]'::jsonb;
  v_arr jsonb;
  i integer;
  r integer;
begin
  if v_user is null then raise exception 'Unauthorized'; end if;

  select * into v_progress
  from public.final_decoder_progress
  where user_id=v_user and course_id='greek-mythology';

  if found and v_progress.active_attempt_id is not null then
    select * into v_attempt
    from public.final_decoder_attempts
    where id=v_progress.active_attempt_id and user_id=v_user;
    if found and v_attempt.status='in_progress' then
      return v_attempt;
    end if;
  end if;

  v_attempt_number:=coalesce(v_progress.attempts_count,0)+1;

  for i in 1..15 loop
    r:=floor(random()*6)::int;
    v_arr:=case r
      when 0 then '[0,1,2]'::jsonb
      when 1 then '[0,2,1]'::jsonb
      when 2 then '[1,0,2]'::jsonb
      when 3 then '[1,2,0]'::jsonb
      when 4 then '[2,0,1]'::jsonb
      else '[2,1,0]'::jsonb
    end;
    v_option_order:=v_option_order || jsonb_build_array(v_arr);
  end loop;

  insert into public.final_decoder_attempts(
    user_id,course_id,content_version,attempt_number,status,
    question_order,option_order,selected_answers,current_question_index
  )
  values(
    v_user,'greek-mythology','gm-v2',v_attempt_number,'in_progress',
    '[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]'::jsonb,
    v_option_order,'{}'::jsonb,0
  )
  returning * into v_attempt;

  insert into public.final_decoder_progress(
    user_id,course_id,attempts_count,active_attempt_id,updated_at
  )
  values(v_user,'greek-mythology',v_attempt_number,v_attempt.id,now())
  on conflict(user_id,course_id) do update
  set attempts_count=excluded.attempts_count,
      active_attempt_id=excluded.active_attempt_id,
      updated_at=excluded.updated_at;

  return v_attempt;
end $$;

revoke all on function public.start_greek_mythology_final_decoder() from public, anon;
grant execute on function public.start_greek_mythology_final_decoder() to authenticated;

-- Certificates are discontinued: nobody can issue or look them up any more.
-- (Existing certificate rows, if any, stay in the table and are removed with the account.)
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in ('issue_greek_mythology_certificate','verify_certificate')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
  end loop;
end $$;
