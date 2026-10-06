-- MIYU Academy — initial schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  preferred_locale text not null default 'en' check (preferred_locale in ('en','ru')),
  age_16_plus_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  started_at timestamptz,
  last_active_at timestamptz,
  primary key (user_id,course_id)
);

create table if not exists public.module_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  module_id text not null,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  last_active_at timestamptz,
  resume_block_id text,
  scroll_ratio numeric check (scroll_ratio is null or (scroll_ratio>=0 and scroll_ratio<=1)),
  check_state jsonb not null default '{}'::jsonb,
  primary key (user_id,course_id,module_id)
);

create table if not exists public.final_decoder_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  content_version text not null,
  attempt_number integer not null check (attempt_number>0),
  status text not null default 'in_progress' check (status in ('in_progress','submitted')),
  question_order jsonb not null,
  option_order jsonb not null,
  selected_answers jsonb not null default '{}'::jsonb,
  current_question_index integer not null default 0 check (current_question_index between 0 and 14),
  score integer,
  percent integer,
  category_scores jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id,course_id,attempt_number)
);

create table if not exists public.final_decoder_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  attempts_count integer not null default 0,
  latest_score integer,
  latest_percent integer,
  best_score integer,
  passed boolean not null default false,
  first_passed_at timestamptz,
  active_attempt_id uuid references public.final_decoder_attempts(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key(user_id,course_id)
);

create sequence if not exists public.miyu_certificate_seq start 1;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  student_name text not null,
  completed_at timestamptz not null,
  certificate_id text not null unique,
  verification_token text not null unique,
  language text not null check (language in ('en','ru')),
  visibility text not null default 'unlisted' check (visibility in ('public','unlisted','private')),
  status text not null default 'valid' check (status in ('valid','revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,course_id)
);

create index if not exists idx_module_progress_course on public.module_progress(user_id,course_id,status);
create index if not exists idx_final_attempts_user on public.final_decoder_attempts(user_id,course_id,status);
create index if not exists idx_cert_token on public.certificates(verification_token);
