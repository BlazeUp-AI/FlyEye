import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IssueDetail } from '@/components/dashboard/issue-detail'

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const db = createServiceSupabase()

  const { data: issue } = await db
    .from('issues')
    .select('*, issue_feedback(*)')
    .eq('id', id)
    .single()

  if (!issue) redirect('/dashboard/issues')

  const { data: project } = await db
    .from('projects')
    .select('id')
    .eq('id', issue.project_id)
    .eq('user_id', user.id)
    .single()

  if (!project) redirect('/dashboard/issues')

  return <IssueDetail issue={issue} />
}
