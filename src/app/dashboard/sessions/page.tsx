import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SessionsList } from '@/components/dashboard/sessions-list'

export default async function SessionsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const project = projects?.[0]
  if (!project) redirect('/dashboard/settings')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('project_id', project.id)
    .order('start_time', { ascending: false })
    .limit(50)

  return <SessionsList sessions={sessions ?? []} projectId={project.id} />
}
