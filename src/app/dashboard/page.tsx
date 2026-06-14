import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/overview'
import { demoIssues, demoProjectId, demoStats } from '@/lib/demo-data'

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const db = createServiceSupabase()

  const { data: projects } = await db
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)

  const project = projects?.[0]

  if (!project) {
    return <DashboardOverview stats={demoStats} recentIssues={demoIssues} projectId={demoProjectId} demoMode />
  }

  const { data: issues } = await db
    .from('issues')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: sessions } = await db
    .from('sessions')
    .select('id, analysis_status')
    .eq('project_id', project.id)

  const realIssues = issues ?? []
  const realSessions = sessions ?? []
  const useDemoData = realIssues.length === 0 && realSessions.length === 0

  const stats = useDemoData ? demoStats : {
    totalSessions: realSessions.length,
    analyzedSessions: realSessions.filter(s => s.analysis_status === 'done').length,
    totalIssues: realIssues.length,
    openIssues: realIssues.filter(i => i.status === 'open').length,
    criticalIssues: realIssues.filter(i => i.severity === 'critical').length,
    prsCreated: realIssues.filter(i => i.pr_url).length,
  }

  return (
    <DashboardOverview
      stats={stats}
      recentIssues={useDemoData ? demoIssues : realIssues}
      projectId={useDemoData ? demoProjectId : project.id}
      demoMode={useDemoData}
    />
  )
}
