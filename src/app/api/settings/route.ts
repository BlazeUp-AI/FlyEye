import { createServerSupabase } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encrypt'

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { projectId, name, posthog_api_key, posthog_project_id, anthropic_api_key, github_token, github_repo } = body

  const update: Record<string, unknown> = {
    name: name || 'My Project',
    posthog_project_id,
    github_repo,
  }

  if (posthog_api_key) update.posthog_api_key = encrypt(posthog_api_key)
  if (anthropic_api_key) update.anthropic_api_key = encrypt(anthropic_api_key)
  if (github_token) update.github_token = encrypt(github_token)

  if (projectId) {
    await supabase.from('projects').update(update).eq('id', projectId).eq('user_id', user.id)
  } else {
    await supabase.from('projects').insert({ ...update, user_id: user.id, sync_enabled: true })
  }

  return Response.json({ success: true })
}
