import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IssuesList } from '@/components/dashboard/issues-list'

export default async function IssuesPage() {
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
  if (!project) redirect('/dashboard/settings')

  const { data: issues } = await db
    .from('issues')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return <IssuesList issues={issues ?? []} />
}
