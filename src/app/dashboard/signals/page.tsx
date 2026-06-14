import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignalsPage as SignalsClient } from '@/components/dashboard/signals-page'

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
  if (!project) redirect('/dashboard/settings')

  const { data: signals } = await supabase
    .from('signals')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  return <SignalsClient signals={signals ?? []} projectId={project.id} />
}
