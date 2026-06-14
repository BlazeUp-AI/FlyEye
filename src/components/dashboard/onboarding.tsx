'use client'

import { useState } from 'react'
import { Github, BarChart3, Brain, Check, ArrowRight, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

type ConnectionState = {
  github: boolean
  posthog: boolean
  openai: boolean
  github_username?: string
  github_repo?: string
}

export function Onboarding({ initial, projectId }: { initial: ConnectionState; projectId: string | null }) {
  const [state, setState] = useState(initial)
  const [posthogKey, setPosthogKey] = useState('')
  const [posthogProjectId, setPosthogProjectId] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [githubRepo, setGithubRepo] = useState(initial.github_repo ?? '')
  const [savingPosthog, setSavingPosthog] = useState(false)
  const [savingOpenai, setSavingOpenai] = useState(false)
  const [savingRepo, setSavingRepo] = useState(false)

  const allConnected = state.github && state.posthog && state.openai && githubRepo

  async function saveKey(field: string, value: string, extra?: Record<string, string>) {
    const body: Record<string, string> = { ...extra }
    body[field] = value
    if (projectId) body.projectId = projectId

    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  async function connectPosthog() {
    if (!posthogKey || !posthogProjectId) return
    setSavingPosthog(true)
    await saveKey('posthog_api_key', posthogKey, { posthog_project_id: posthogProjectId })
    setState(s => ({ ...s, posthog: true }))
    setSavingPosthog(false)
  }

  async function connectOpenai() {
    if (!openaiKey) return
    setSavingOpenai(true)
    await saveKey('openai_api_key', openaiKey)
    setState(s => ({ ...s, openai: true }))
    setSavingOpenai(false)
  }

  async function saveRepo() {
    if (!githubRepo) return
    setSavingRepo(true)
    await saveKey('github_repo', '', { github_repo: githubRepo })
    setSavingRepo(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">Set up FlyVision</h1>
        <p className="text-zinc-400 mt-2">Connect your services to start detecting and fixing bugs automatically.</p>
      </div>

      <div className="space-y-4">
        {/* GitHub OAuth */}
        <ConnectionCard
          icon={Github}
          title="GitHub"
          description={state.github ? `Connected as @${state.github_username ?? 'user'}` : 'Connect to push auto-fix PRs to your repo'}
          connected={state.github}
          action={
            state.github ? (
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={e => setGithubRepo(e.target.value)}
                    placeholder="owner/repo"
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    onClick={saveRepo}
                    disabled={savingRepo || !githubRepo}
                    className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                  >
                    {savingRepo ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/api/auth/github"
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-100 text-black text-sm font-medium rounded-lg transition-colors"
              >
                <Github size={16} />
                Connect GitHub
              </a>
            )
          }
        />

        {/* PostHog */}
        <ConnectionCard
          icon={BarChart3}
          title="PostHog"
          description={state.posthog ? 'Connected — session replays will sync' : 'Connect to pull session replays'}
          connected={state.posthog}
          action={
            !state.posthog ? (
              <div className="space-y-3 w-full">
                <input
                  type="password"
                  value={posthogKey}
                  onChange={e => setPosthogKey(e.target.value)}
                  placeholder="Personal API Key (phx_...)"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={posthogProjectId}
                    onChange={e => setPosthogProjectId(e.target.value)}
                    placeholder="Project ID"
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    onClick={connectPosthog}
                    disabled={savingPosthog || !posthogKey || !posthogProjectId}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                  >
                    {savingPosthog ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}
                  </button>
                </div>
              </div>
            ) : null
          }
        />

        {/* OpenAI */}
        <ConnectionCard
          icon={Brain}
          title="OpenAI"
          description={state.openai ? 'Connected — GPT-5.5 ready for analysis' : 'Add your API key to enable AI analysis'}
          connected={state.openai}
          action={
            !state.openai ? (
              <div className="flex gap-2 w-full">
                <input
                  type="password"
                  value={openaiKey}
                  onChange={e => setOpenaiKey(e.target.value)}
                  placeholder="API Key (sk-...)"
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={connectOpenai}
                  disabled={savingOpenai || !openaiKey}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                  {savingOpenai ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}
                </button>
              </div>
            ) : null
          }
        />
      </div>

      {allConnected && (
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Launch Dashboard
            <ArrowRight size={16} />
          </a>
        </div>
      )}
    </div>
  )
}

function ConnectionCard({ icon: Icon, title, description, connected, action }: {
  icon: typeof Github
  title: string
  description: string
  connected: boolean
  action: React.ReactNode
}) {
  return (
    <div className={clsx(
      'border rounded-xl p-5 transition-colors',
      connected ? 'border-green-500/30 bg-green-500/5' : 'border-zinc-800 bg-zinc-900'
    )}>
      <div className="flex items-start gap-4">
        <div className={clsx(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          connected ? 'bg-green-500/10' : 'bg-zinc-800'
        )}>
          {connected ? <Check size={20} className="text-green-400" /> : <Icon size={20} className="text-zinc-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium">{title}</h3>
            {connected && <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">connected</span>}
          </div>
          <p className="text-sm text-zinc-400 mb-3">{description}</p>
          {action}
        </div>
      </div>
    </div>
  )
}
