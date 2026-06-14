import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SessionsList } from '@/components/dashboard/sessions-list'
import { demoProjectId, demoSessions } from '@/lib/demo-data'

export default async function SessionsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const db = createServiceSupabase()

  const { data: projects } = await db
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const project = projects?.[0]
  if (!project) return <SessionsList sessions={demoSessions} projectId={demoProjectId} demoMode />

  const { data: sessions } = await db
    .from('sessions')
    .select('*')
    .eq('project_id', project.id)
    .order('start_time', { ascending: false })
    .limit(50)

  const realSessions = sessions ?? []
  return (
    <SessionsList
      sessions={realSessions.length > 0 ? realSessions : demoSessions}
      projectId={realSessions.length > 0 ? project.id : demoProjectId}
      demoMode={realSessions.length === 0}
    />
  )
}
