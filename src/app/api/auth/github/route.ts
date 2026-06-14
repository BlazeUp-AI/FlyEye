import { redirect } from 'next/navigation'

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) return Response.json({ error: 'GitHub OAuth not configured' }, { status: 500 })

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
  })

  redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
}
