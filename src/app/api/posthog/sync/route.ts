import { createServerSupabase } from '@/lib/supabase/server'
import { PostHogClient } from '@/lib/posthog'
import { decrypt } from '@/lib/encrypt'

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await request.json()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return Response.json({ error: 'Project not found' }, { status: 404 })

  const posthogKey = decrypt(project.posthog_api_key)
  const client = new PostHogClient(posthogKey, project.posthog_project_id)

  const { data: existingSessions } = await supabase
    .from('sessions')
    .select('posthog_recording_id')
    .eq('project_id', projectId)

  const existingIds = new Set((existingSessions ?? []).map(s => s.posthog_recording_id))
  const newSessions = await client.syncRecordings(existingIds)

  if (newSessions.length > 0) {
    const rows = newSessions.map(s => ({
      ...s,
      project_id: projectId,
      analysis_status: 'pending',
      synced_at: new Date().toISOString(),
    }))

    await supabase.from('sessions').insert(rows)
  }

  return Response.json({ synced: newSessions.length })
}
