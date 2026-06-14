import { createServerSupabase } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encrypt'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    redirect('/dashboard?error=github_auth_failed')
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  if (!accessToken) {
    redirect('/dashboard?error=github_token_failed')
  }

  // Get user info to find their repos
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const githubUser = await userRes.json()

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Store the token in the project
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  if (projects && projects[0]) {
    await supabase
      .from('projects')
      .update({
        github_token: encrypt(accessToken),
        github_username: githubUser.login,
      })
      .eq('id', projects[0].id)
  } else {
    await supabase.from('projects').insert({
      user_id: user.id,
      name: 'My Project',
      github_token: encrypt(accessToken),
      github_username: githubUser.login,
      sync_enabled: true,
    })
  }

  redirect('/dashboard?connected=github')
}
