import postgres from 'postgres'

const sql = postgres('postgresql://postgres.xweavxfjmumoyuonnmpx:mefriz-Fosbo2-qotxep@aws-0-us-east-1.pooler.supabase.com:6543/postgres', {
  ssl: 'require',
})

async function migrate() {
  console.log('Connecting to database...')

  await sql`SELECT 1`
  console.log('Connected!')

  console.log('Creating tables...')

  await sql`
    create table if not exists projects (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null,
      name text not null default 'My Project',
      posthog_api_key text,
      posthog_project_id text,
      anthropic_api_key text,
      github_token text,
      github_repo text,
      sync_enabled boolean default true,
      created_at timestamptz default now()
    )
  `
  console.log('  ✓ projects')

  await sql`
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
    )
  `
  console.log('  ✓ sessions')

  await sql`
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
    )
  `
  console.log('  ✓ issues')

  await sql`
    create table if not exists issue_feedback (
      id uuid primary key default gen_random_uuid(),
      issue_id uuid references issues on delete cascade not null,
      user_id uuid not null,
      verdict text not null,
      comment text,
      created_at timestamptz default now()
    )
  `
  console.log('  ✓ issue_feedback')

  await sql`
    create table if not exists prompt_examples (
      id uuid primary key default gen_random_uuid(),
      project_id uuid references projects on delete cascade not null,
      category text not null,
      session_context jsonb default '{}'::jsonb,
      finding jsonb default '{}'::jsonb,
      is_positive boolean default true,
      created_at timestamptz default now()
    )
  `
  console.log('  ✓ prompt_examples')

  await sql`
    create table if not exists detection_config (
      id uuid primary key default gen_random_uuid(),
      project_id uuid references projects on delete cascade not null,
      category text not null,
      sensitivity float default 0.7,
      precision_rate float,
      total_flagged integer default 0,
      total_confirmed integer default 0,
      updated_at timestamptz default now()
    )
  `
  console.log('  ✓ detection_config')

  await sql`
    create table if not exists signals (
      id uuid primary key default gen_random_uuid(),
      project_id uuid references projects on delete cascade not null,
      name text not null,
      description text,
      trigger_conditions jsonb default '{}'::jsonb,
      is_active boolean default true,
      created_at timestamptz default now()
    )
  `
  console.log('  ✓ signals')

  // Enable RLS
  await sql`alter table projects enable row level security`
  await sql`alter table sessions enable row level security`
  await sql`alter table issues enable row level security`
  await sql`alter table issue_feedback enable row level security`
  await sql`alter table prompt_examples enable row level security`
  await sql`alter table detection_config enable row level security`
  await sql`alter table signals enable row level security`
  console.log('  ✓ RLS enabled')

  // Create policies (drop first to be idempotent)
  await sql`drop policy if exists "Users can manage own projects" on projects`
  await sql`create policy "Users can manage own projects" on projects for all using (auth.uid() = user_id)`

  await sql`drop policy if exists "Users can view own sessions" on sessions`
  await sql`create policy "Users can view own sessions" on sessions for all using (project_id in (select id from projects where user_id = auth.uid()))`

  await sql`drop policy if exists "Users can manage own issues" on issues`
  await sql`create policy "Users can manage own issues" on issues for all using (project_id in (select id from projects where user_id = auth.uid()))`

  await sql`drop policy if exists "Users can manage own feedback" on issue_feedback`
  await sql`create policy "Users can manage own feedback" on issue_feedback for all using (auth.uid() = user_id)`

  await sql`drop policy if exists "Users can view own examples" on prompt_examples`
  await sql`create policy "Users can view own examples" on prompt_examples for all using (project_id in (select id from projects where user_id = auth.uid()))`

  await sql`drop policy if exists "Users can manage own config" on detection_config`
  await sql`create policy "Users can manage own config" on detection_config for all using (project_id in (select id from projects where user_id = auth.uid()))`

  await sql`drop policy if exists "Users can manage own signals" on signals`
  await sql`create policy "Users can manage own signals" on signals for all using (project_id in (select id from projects where user_id = auth.uid()))`
  console.log('  ✓ RLS policies')

  // Indexes
  await sql`create index if not exists idx_sessions_project_status on sessions(project_id, analysis_status)`
  await sql`create index if not exists idx_issues_project on issues(project_id, created_at desc)`
  await sql`create index if not exists idx_issues_status on issues(project_id, status)`
  await sql`create index if not exists idx_prompt_examples_project on prompt_examples(project_id, category)`
  console.log('  ✓ indexes')

  console.log('\nDone! Database schema is ready.')
  await sql.end()
}

migrate().catch(e => {
  console.error('Migration failed:', e.message)
  process.exit(1)
})
