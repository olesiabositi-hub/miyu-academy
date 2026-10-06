-- MIYU Academy — trusted Final Myth Decoder RPCs

create or replace function public.start_greek_mythology_final_decoder()
returns public.final_decoder_attempts
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user uuid := auth.uid();
  v_modules integer;
  v_progress public.final_decoder_progress;
  v_attempt public.final_decoder_attempts;
  v_attempt_number integer;
  v_option_order jsonb := '[]'::jsonb;
  v_arr jsonb;
  i integer;
  r integer;
begin
  if v_user is null then raise exception 'Unauthorized'; end if;

  select count(*) into v_modules
  from public.module_progress
  where user_id=v_user and course_id='greek-mythology' and status='completed';

  if v_modules<>8 then raise exception 'Complete all 8 modules first'; end if;

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

create or replace function public.save_greek_mythology_final_answer(
  p_attempt_id uuid,
  p_question_id text,
  p_source_index integer,
  p_current_question_index integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_attempt public.final_decoder_attempts;
  v_answers jsonb;
begin
  if v_user is null then raise exception 'Unauthorized'; end if;
  if p_current_question_index < 0 or p_current_question_index > 14 then raise exception 'Invalid question index'; end if;
  if p_source_index is not null and (p_source_index < 0 or p_source_index > 2) then raise exception 'Invalid answer'; end if;
  if p_question_id !~ '^FMD-(0[1-9]|1[0-5])$' then raise exception 'Invalid question ID'; end if;

  select * into v_attempt
  from public.final_decoder_attempts
  where id=p_attempt_id and user_id=v_user;

  if not found or v_attempt.status<>'in_progress' then raise exception 'Attempt unavailable'; end if;

  v_answers:=coalesce(v_attempt.selected_answers,'{}'::jsonb);
  if p_source_index is not null then
    v_answers:=jsonb_set(v_answers,array[p_question_id],to_jsonb(p_source_index),true);
  end if;

  update public.final_decoder_attempts
  set selected_answers=v_answers,
      current_question_index=p_current_question_index,
      updated_at=now()
  where id=p_attempt_id and user_id=v_user;

  return true;
end $$;

revoke all on function public.save_greek_mythology_final_answer(uuid,text,integer,integer) from public, anon;
grant execute on function public.save_greek_mythology_final_answer(uuid,text,integer,integer) to authenticated;

create or replace function public.submit_greek_mythology_final_decoder(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_attempt public.final_decoder_attempts;
  v_expected jsonb := '{"FMD-01":1,"FMD-02":0,"FMD-03":0,"FMD-04":0,"FMD-05":0,"FMD-06":0,"FMD-07":0,"FMD-08":0,"FMD-09":0,"FMD-10":0,"FMD-11":0,"FMD-12":0,"FMD-13":0,"FMD-14":0,"FMD-15":0}'::jsonb;
  v_categories jsonb := '{"recognition":0,"meaning":0,"connection":0}'::jsonb;
  v_score integer := 0;
  v_percent integer;
  v_passed_this boolean;
  v_progress public.final_decoder_progress;
  v_ever_passed boolean;
  v_first_passed timestamptz;
  v_id text;
  v_answer integer;
  v_expected_answer integer;
  v_idx integer;
  v_cat text;
begin
  if v_user is null then raise exception 'Unauthorized'; end if;

  select * into v_attempt
  from public.final_decoder_attempts
  where id=p_attempt_id and user_id=v_user;

  if not found or v_attempt.status<>'in_progress' then raise exception 'Attempt unavailable'; end if;

  if jsonb_object_length(coalesce(v_attempt.selected_answers,'{}'::jsonb))<>15 then
    raise exception 'All 15 answers are required';
  end if;

  for v_idx in 1..15 loop
    v_id:='FMD-'||lpad(v_idx::text,2,'0');
    if not (v_attempt.selected_answers ? v_id) then raise exception 'All 15 answers are required'; end if;
    v_answer:=(v_attempt.selected_answers->>v_id)::integer;
    v_expected_answer:=(v_expected->>v_id)::integer;
    v_cat:=case when v_idx<=5 then 'recognition' when v_idx<=10 then 'meaning' else 'connection' end;
    if v_answer=v_expected_answer then
      v_score:=v_score+1;
      v_categories:=jsonb_set(v_categories,array[v_cat],to_jsonb(((v_categories->>v_cat)::integer)+1),false);
    end if;
  end loop;

  v_percent:=round((v_score::numeric/15)*100)::integer;
  v_passed_this:=v_score>=12;

  update public.final_decoder_attempts
  set status='submitted',score=v_score,percent=v_percent,
      category_scores=v_categories,submitted_at=now(),updated_at=now()
  where id=p_attempt_id and user_id=v_user;

  select * into v_progress
  from public.final_decoder_progress
  where user_id=v_user and course_id='greek-mythology';

  v_ever_passed:=coalesce(v_progress.passed,false) or v_passed_this;
  v_first_passed:=v_progress.first_passed_at;
  if v_first_passed is null and v_passed_this then v_first_passed:=now(); end if;

  insert into public.final_decoder_progress(
    user_id,course_id,attempts_count,latest_score,latest_percent,best_score,
    passed,first_passed_at,active_attempt_id,updated_at
  )
  values(
    v_user,'greek-mythology',coalesce(v_progress.attempts_count,v_attempt.attempt_number),
    v_score,v_percent,greatest(coalesce(v_progress.best_score,0),v_score),
    v_ever_passed,v_first_passed,null,now()
  )
  on conflict(user_id,course_id) do update
  set latest_score=excluded.latest_score,
      latest_percent=excluded.latest_percent,
      best_score=excluded.best_score,
      passed=excluded.passed,
      first_passed_at=excluded.first_passed_at,
      active_attempt_id=null,
      updated_at=excluded.updated_at;

  return jsonb_build_object(
    'score',v_score,
    'percent',v_percent,
    'categories',v_categories,
    'passed',v_ever_passed,
    'passedThisAttempt',v_passed_this
  );
end $$;

revoke all on function public.submit_greek_mythology_final_decoder(uuid) from public, anon;
grant execute on function public.submit_greek_mythology_final_decoder(uuid) to authenticated;
