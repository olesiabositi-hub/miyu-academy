-- MIYU Academy — RLS and trusted credential functions
alter table public.profiles enable row level security;
alter table public.course_progress enable row level security;
alter table public.module_progress enable row level security;
alter table public.final_decoder_attempts enable row level security;
alter table public.final_decoder_progress enable row level security;
alter table public.certificates enable row level security;

create policy "profiles select own" on public.profiles for select using (auth.uid()=id);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid()=id);
create policy "profiles update own" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);

create policy "course progress select own" on public.course_progress for select using (auth.uid()=user_id);
create policy "course progress insert own" on public.course_progress for insert with check (auth.uid()=user_id);
create policy "course progress update own" on public.course_progress for update using (auth.uid()=user_id) with check (auth.uid()=user_id);

create policy "module progress select own" on public.module_progress for select using (auth.uid()=user_id);
create policy "module progress insert own" on public.module_progress for insert with check (auth.uid()=user_id);
create policy "module progress update own" on public.module_progress for update using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Attempts and assessment summary are readable by the learner, but credential-critical writes are server-only.
create policy "attempts select own" on public.final_decoder_attempts for select using (auth.uid()=user_id);
create policy "final progress select own" on public.final_decoder_progress for select using (auth.uid()=user_id);
create policy "certificates select own" on public.certificates for select using (auth.uid()=user_id);

create or replace function public.issue_greek_mythology_certificate(p_student_name text,p_language text)
returns public.certificates
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user uuid := auth.uid();
  v_existing public.certificates;
  v_modules integer;
  v_passed boolean;
  v_completed_at timestamptz;
  v_seq bigint;
  v_id text;
  v_cert public.certificates;
begin
  if v_user is null then raise exception 'Unauthorized'; end if;
  if length(trim(p_student_name))=0 then raise exception 'Name required'; end if;
  if p_language not in ('en','ru') then raise exception 'Invalid language'; end if;

  select * into v_existing from public.certificates
   where user_id=v_user and course_id='greek-mythology';
  if found then return v_existing; end if;

  select count(*) into v_modules from public.module_progress
   where user_id=v_user and course_id='greek-mythology' and status='completed';
  if v_modules<>8 then raise exception 'Complete all 8 modules first'; end if;

  select passed,first_passed_at into v_passed,v_completed_at
   from public.final_decoder_progress where user_id=v_user and course_id='greek-mythology';
  if coalesce(v_passed,false)=false or v_completed_at is null then raise exception 'Final Myth Decoder must be passed'; end if;

  v_seq:=nextval('public.miyu_certificate_seq');
  v_id:='MIYU-GM-'||extract(year from now())::int||'-'||lpad(v_seq::text,6,'0');

  begin
    insert into public.certificates(user_id,course_id,student_name,completed_at,certificate_id,verification_token,language,visibility,status)
    values(v_user,'greek-mythology',trim(p_student_name),v_completed_at,v_id,encode(gen_random_bytes(24),'hex'),p_language,'unlisted','valid')
    returning * into v_cert;
  exception when unique_violation then
    select * into v_cert from public.certificates where user_id=v_user and course_id='greek-mythology';
  end;
  return v_cert;
end $$;

revoke all on function public.issue_greek_mythology_certificate(text,text) from public;
grant execute on function public.issue_greek_mythology_certificate(text,text) to authenticated;

create or replace function public.verify_certificate(p_token text)
returns table(student_name text,course_id text,completed_at timestamptz,certificate_id text,status text)
language sql
security definer
set search_path=public
stable
as $$
  select c.student_name,c.course_id,c.completed_at,c.certificate_id,c.status
  from public.certificates c
  where c.verification_token=p_token and c.visibility in ('unlisted','public')
  limit 1
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon,authenticated;
