'use client'

import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'

type ExistingProject = {
  id: string
  name: string
  posthog_project_id: string
  github_repo: string
  sync_enabled: boolean
} | null

export function SettingsForm({ userId, project }: { userId: string; project: ExistingProject }) {
  const [name, setName] = useState(project?.name ?? '')
  const [posthogKey, setPosthogKey] = useState('')
  const [posthogProjectId, setPosthogProjectId] = useState(project?.posthog_project_id ?? '')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [githubRepo, setGithubRepo] = useState(project?.github_repo ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    const body: Record<string, string> = {
      userId,
      name: name || 'My Project',
      posthog_project_id: posthogProjectId,
      github_repo: githubRepo,
    }
    if (posthogKey) body.posthog_api_key = posthogKey
    if (anthropicKey) body.anthropic_api_key = anthropicKey
    if (githubToken) body.github_token = githubToken
    if (project?.id) body.projectId = project.id

    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-zinc-400 text-sm mb-8">Connect your services. Keys are encrypted at rest.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Project Name" value={name} onChange={setName} placeholder="My App" />

        <div className="border-t border-zinc-800 pt-6">
          <h2 className="text-sm font-medium text-white mb-4">PostHog</h2>
          <div className="space-y-4">
            <Field
              label="Personal API Key"
              value={posthogKey}
              onChange={setPosthogKey}
              placeholder={project ? '••••••••  (already set)' : 'phx_...'}
              type="password"
            />
            <Field
              label="Project ID"
              value={posthogProjectId}
              onChange={setPosthogProjectId}
              placeholder="12345"
            />
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h2 className="text-sm font-medium text-white mb-4">Anthropic</h2>
          <Field
            label="API Key"
            value={anthropicKey}
            onChange={setAnthropicKey}
            placeholder={project ? '••••••••  (already set)' : 'sk-ant-...'}
            type="password"
          />
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h2 className="text-sm font-medium text-white mb-4">GitHub</h2>
          <div className="space-y-4">
            <Field
              label="Personal Access Token"
              value={githubToken}
              onChange={setGithubToken}
              placeholder={project ? '••••••••  (already set)' : 'ghp_...'}
              type="password"
            />
            <Field
              label="Repository"
              value={githubRepo}
              onChange={setGithubRepo}
              placeholder="owner/repo"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm"
      />
    </div>
  )
}
