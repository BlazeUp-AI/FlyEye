import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignalsPage as SignalsClient } from '@/components/dashboard/signals-page'
import { demoProjectId, demoSignals } from '@/lib/demo-data'

export default async function SignalsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const project = projects?.[0]
  if (!project) return <SignalsClient signals={demoSignals} projectId={demoProjectId} demoMode />

  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  const realSignals = signals ?? []
  return (
    <SignalsClient
      signals={realSignals.length > 0 ? realSignals : demoSignals}
      projectId={realSignals.length > 0 ? project.id : demoProjectId}
      demoMode={realSignals.length === 0}
    />
  )
}
