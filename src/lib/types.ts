export type Project = {
  id: string
  user_id: string
  name: string
  posthog_api_key: string
  posthog_project_id: string
  anthropic_api_key: string
  github_token: string
  github_repo: string
  sync_enabled: boolean
  created_at: string
}

export type Session = {
  id: string
  project_id: string
  posthog_recording_id: string
  duration: number
  user_distinct_id: string
  start_time: string
  event_summary: SessionEventSummary
  console_errors: ConsoleError[]
  network_failures: NetworkFailure[]
  analysis_status: 'pending' | 'analyzing' | 'done' | 'skipped'
  synced_at: string
}

export type SessionEventSummary = {
  total_events: number
  clicks: number
  rage_clicks: number
  dead_clicks: number
  page_views: string[]
  key_actions: string[]
}

export type ConsoleError = {
  message: string
  timestamp: string
  level: 'error' | 'warn'
  source?: string
}

export type NetworkFailure = {
  url: string
  method: string
  status: number
  timestamp: string
}

export type Issue = {
  id: string
  project_id: string
  session_id: string
  type: 'bug' | 'ux_friction' | 'error' | 'performance'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  reproduction_steps: string
  affected_component: string
  root_cause: string
  suggested_fix: string
  confidence: number
  pr_url: string | null
  pr_status: 'open' | 'merged' | 'closed' | null
  status: 'open' | 'confirmed' | 'rejected' | 'fixed'
  created_at: string
}

export type IssueFeedback = {
  id: string
  issue_id: string
  user_id: string
  verdict: 'confirmed' | 'rejected' | 'partial'
  comment: string | null
  created_at: string
}

export type PromptExample = {
  id: string
  project_id: string
  category: string
  session_context: Record<string, unknown>
  finding: Record<string, unknown>
  is_positive: boolean
  created_at: string
}

export type DetectionConfig = {
  id: string
  project_id: string
  category: string
  sensitivity: number
  precision_rate: number | null
  total_flagged: number
  total_confirmed: number
  updated_at: string
}

export type Signal = {
  id: string
  project_id: string
  name: string
  description: string
  trigger_conditions: Record<string, unknown>
  is_active: boolean
  created_at: string
}

export type AnalysisResult = {
  findings: Finding[]
}

export type Finding = {
  type: Issue['type']
  severity: Issue['severity']
  title: string
  description: string
  reproduction_steps: string
  affected_component: string
  root_cause: string
  suggested_fix: string
  confidence: number
}
