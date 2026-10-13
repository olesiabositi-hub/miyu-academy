-- 0009: runes (Norse course gamification).
-- Each finished module (and the Yggdrasil game) gives the learner one random rune out of 24, never a repeat.
-- The draw happens only on the server (RPC), so a rune cannot be chosen or forged from the browser.
-- Safe to run more than once. Run it in Supabase → SQL Editor before the rune feature goes live.

create table if not exists public.rune_draws (
  user_id   uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  source    text not null,
  rune      text not null,
  drawn_at  timestamptz not null default now(),
  primary key (user_id, course_id, source),
  unique (user_id, course_id, rune)
);

alter table public.rune_draws enable row level security;

drop policy if exists "rune_draws_select_own" on public.rune_draws;
create policy "rune_draws_select_own" on public.rune_draws
  for select to authenticated using (user_id = auth.uid());

revoke all on public.rune_draws from anon, authenticated;
grant select on public.rune_draws to authenticated;

create or replace function public.draw_rune(p_course_id text, p_source text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_pool text[] := array['fehu','uruz','thurisaz','ansuz','raidho','kenaz','gebo','wunjo','hagalaz','naudhiz','isa','jera','eihwaz','perthro','algiz','sowilo','tiwaz','berkano','ehwaz','mannaz','laguz','ingwaz','dagaz','othala'];
  v_left text[];
  v_rune text;
begin
  if v_user is null then raise exception 'Unauthorized'; end if;
  if p_course_id <> 'norse-mythology' then raise exception 'No runes in this course'; end if;
  if p_source !~ '^(module-0[1-9]|game-yggdrasil)$' then raise exception 'Unknown source'; end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user::text || p_course_id, 0));

  select rune into v_rune from public.rune_draws
   where user_id = v_user and course_id = p_course_id and source = p_source;
  if found then return v_rune; end if;

  if p_source like 'module-%' and not exists (
    select 1 from public.module_progress
     where user_id = v_user and course_id = p_course_id and module_id = p_source and status = 'completed'
  ) then
    raise exception 'Module not completed';
  end if;

  select coalesce(array_agg(x), '{}') into v_left
    from unnest(v_pool) as x
   where x not in (select rune from public.rune_draws where user_id = v_user and course_id = p_course_id);
  if coalesce(array_length(v_left, 1), 0) = 0 then raise exception 'No runes left'; end if;

  v_rune := v_left[1 + floor(random() * array_length(v_left, 1))::int];
  insert into public.rune_draws(user_id, course_id, source, rune) values (v_user, p_course_id, p_source, v_rune);
  return v_rune;
end $$;

revoke all on function public.draw_rune(text, text) from public, anon;
grant execute on function public.draw_rune(text, text) to authenticated;
