import { createServiceSupabase } from './supabase/server'
import type { PromptExample, DetectionConfig } from './types'

export async function getExamplesForProject(projectId: string, category?: string): Promise<PromptExample[]> {
  const supabase = createServiceSupabase()

  let query = supabase
    .from('prompt_examples')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query
  return data ?? []
}

export async function recordFeedback(
  projectId: string,
  issueId: string,
  userId: string,
  verdict: 'confirmed' | 'rejected' | 'partial',
  comment: string | null
) {
  const supabase = createServiceSupabase()

  await supabase.from('issue_feedback').insert({
    issue_id: issueId,
    user_id: userId,
    verdict,
    comment,
  })

  const { data: issue } = await supabase
    .from('issues')
    .select('*, sessions(*)')
    .eq('id', issueId)
    .single()

  if (!issue) return

  const newStatus = verdict === 'confirmed' ? 'confirmed' : verdict === 'rejected' ? 'rejected' : 'open'
  await supabase.from('issues').update({ status: newStatus }).eq('id', issueId)

  await supabase.from('prompt_examples').insert({
    project_id: projectId,
    category: issue.type,
    session_context: {
      event_summary: issue.sessions?.event_summary,
      console_errors: issue.sessions?.console_errors,
      network_failures: issue.sessions?.network_failures,
    },
    finding: {
      type: issue.type,
      severity: issue.severity,
      title: issue.title,
      description: issue.description,
      root_cause: issue.root_cause,
    },
    is_positive: verdict === 'confirmed',
  })

  await updateDetectionConfig(projectId, issue.type, verdict === 'confirmed')
}

async function updateDetectionConfig(projectId: string, category: string, wasConfirmed: boolean) {
  const supabase = createServiceSupabase()

  const { data: config } = await supabase
    .from('detection_config')
    .select('*')
    .eq('project_id', projectId)
    .eq('category', category)
    .single()

  if (config) {
    const totalFlagged = config.total_flagged + 1
    const totalConfirmed = config.total_confirmed + (wasConfirmed ? 1 : 0)
    const precisionRate = totalConfirmed / totalFlagged

    let sensitivity = config.sensitivity
    if (precisionRate < 0.4) sensitivity = Math.min(1, sensitivity + 0.1)
    else if (precisionRate > 0.8) sensitivity = Math.max(0.3, sensitivity - 0.05)

    await supabase
      .from('detection_config')
      .update({
        total_flagged: totalFlagged,
        total_confirmed: totalConfirmed,
        precision_rate: precisionRate,
        sensitivity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', config.id)
  } else {
    await supabase.from('detection_config').insert({
      project_id: projectId,
      category,
      sensitivity: 0.7,
      precision_rate: wasConfirmed ? 1 : 0,
      total_flagged: 1,
      total_confirmed: wasConfirmed ? 1 : 0,
      updated_at: new Date().toISOString(),
    })
  }
}

export async function getDetectionConfigs(projectId: string): Promise<DetectionConfig[]> {
  const supabase = createServiceSupabase()
  const { data } = await supabase
    .from('detection_config')
    .select('*')
    .eq('project_id', projectId)
  return data ?? []
}
