import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/dashboard/settings-form'

export default async function SettingsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, posthog_project_id, github_repo, sync_enabled')
    .eq('user_id', user.id)
    .limit(1)

  const project = projects?.[0] ?? null

  return <SettingsForm userId={user.id} project={project} />
}
