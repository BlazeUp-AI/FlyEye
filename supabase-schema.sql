-- FlyEye Database Schema
-- Run this in your Supabase SQL Editor

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null default 'My Project',
  posthog_api_key text,
  posthog_project_id text,
  openai_api_key text,
  github_token text,
  github_repo text,
  sync_enabled boolean default true,
  created_at timestamptz default now()
);

alter table projects enable row level security;
create policy "Users can manage own projects" on projects
  for all using (auth.uid() = user_id);

-- Sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  posthog_recording_id text not null,
  duration integer,
  user_distinct_id text,
  start_time timestamptz,
  event_summary jsonb default '{}'::jsonb,
  console_errors jsonb default '[]'::jsonb,
  network_failures jsonb default '[]'::jsonb,
  analysis_status text default 'pending',
  synced_at timestamptz default now()
);

alter table sessions enable row level security;
create policy "Users can view own sessions" on sessions
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Issues
create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  session_id uuid references sessions on delete set null,
  type text not null,
  severity text not null,
  title text not null,
  description text,
  reproduction_steps text,
  affected_component text,
  root_cause text,
  suggested_fix text,
  confidence float default 0,
  pr_url text,
  pr_status text,
  status text default 'open',
  created_at timestamptz default now()
);

alter table issues enable row level security;
create policy "Users can manage own issues" on issues
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Issue feedback
create table if not exists issue_feedback (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references issues on delete cascade not null,
  user_id uuid references auth.users not null,
  verdict text not null,
  comment text,
  created_at timestamptz default now()
);

alter table issue_feedback enable row level security;
create policy "Users can manage own feedback" on issue_feedback
  for all using (auth.uid() = user_id);

-- Prompt examples (self-improvement)
create table if not exists prompt_examples (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  category text not null,
  session_context jsonb default '{}'::jsonb,
  finding jsonb default '{}'::jsonb,
  is_positive boolean default true,
  created_at timestamptz default now()
);

alter table prompt_examples enable row level security;
create policy "Users can view own examples" on prompt_examples
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Detection config (self-tuning)
create table if not exists detection_config (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  category text not null,
  sensitivity float default 0.7,
  precision_rate float,
  total_flagged integer default 0,
  total_confirmed integer default 0,
  updated_at timestamptz default now()
);

alter table detection_config enable row level security;
create policy "Users can manage own config" on detection_config
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Signals
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade not null,
  name text not null,
  description text,
  trigger_conditions jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table signals enable row level security;
create policy "Users can manage own signals" on signals
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Indexes
create index if not exists idx_sessions_project_status on sessions(project_id, analysis_status);
create index if not exists idx_issues_project on issues(project_id, created_at desc);
create index if not exists idx_issues_status on issues(project_id, status);
create index if not exists idx_prompt_examples_project on prompt_examples(project_id, category);
