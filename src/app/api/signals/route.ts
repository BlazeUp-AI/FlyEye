import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId, name, description } = await request.json()

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })

  const { data: signal } = await supabase
    .from('signals')
    .insert({
      project_id: projectId,
      name,
      description,
      trigger_conditions: { description },
      is_active: true,
    })
    .select()
    .single()

  return Response.json({ signal })
}

export async function GET(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  if (!projectId) return Response.json({ error: 'projectId required' }, { status: 400 })

  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return Response.json({ signals: signals ?? [] })
}
