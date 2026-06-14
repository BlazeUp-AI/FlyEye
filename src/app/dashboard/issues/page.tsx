import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IssuesList } from '@/components/dashboard/issues-list'
import { demoIssues } from '@/lib/demo-data'

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
  if (!project) return <IssuesList issues={demoIssues} demoMode />

  const { data: issues } = await db
    .from('issues')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const realIssues = issues ?? []
  return <IssuesList issues={realIssues.length > 0 ? realIssues : demoIssues} demoMode={realIssues.length === 0} />
}
