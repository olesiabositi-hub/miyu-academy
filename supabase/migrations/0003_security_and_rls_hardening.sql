-- MIYU Academy — security/performance hardening

revoke execute on function public.issue_greek_mythology_certificate(text,text) from public, anon;
grant execute on function public.issue_greek_mythology_certificate(text,text) to authenticated;

drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles select own" on public.profiles for select using ((select auth.uid())=id);
create policy "profiles insert own" on public.profiles for insert with check ((select auth.uid())=id);
create policy "profiles update own" on public.profiles for update using ((select auth.uid())=id) with check ((select auth.uid())=id);

drop policy if exists "course progress select own" on public.course_progress;
drop policy if exists "course progress insert own" on public.course_progress;
drop policy if exists "course progress update own" on public.course_progress;
create policy "course progress select own" on public.course_progress for select using ((select auth.uid())=user_id);
create policy "course progress insert own" on public.course_progress for insert with check ((select auth.uid())=user_id);
create policy "course progress update own" on public.course_progress for update using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

drop policy if exists "module progress select own" on public.module_progress;
drop policy if exists "module progress insert own" on public.module_progress;
drop policy if exists "module progress update own" on public.module_progress;
create policy "module progress select own" on public.module_progress for select using ((select auth.uid())=user_id);
create policy "module progress insert own" on public.module_progress for insert with check ((select auth.uid())=user_id);
create policy "module progress update own" on public.module_progress for update using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

drop policy if exists "attempts select own" on public.final_decoder_attempts;
create policy "attempts select own" on public.final_decoder_attempts for select using ((select auth.uid())=user_id);

drop policy if exists "final progress select own" on public.final_decoder_progress;
create policy "final progress select own" on public.final_decoder_progress for select using ((select auth.uid())=user_id);

drop policy if exists "certificates select own" on public.certificates;
create policy "certificates select own" on public.certificates for select using ((select auth.uid())=user_id);

create index if not exists idx_final_decoder_progress_active_attempt
  on public.final_decoder_progress(active_attempt_id);
