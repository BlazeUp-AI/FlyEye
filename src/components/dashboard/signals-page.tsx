'use client'

import { useState } from 'react'
import { Zap, Plus, Trash2 } from 'lucide-react'
import type { Signal } from '@/lib/types'

export function SignalsPage({ signals: initialSignals, projectId }: { signals: Signal[]; projectId: string }) {
  const [signals, setSignals] = useState(initialSignals)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function createSignal(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, name, description }),
    })

    if (res.ok) {
      const { signal } = await res.json()
      setSignals(prev => [signal, ...prev])
      setName('')
      setDescription('')
      setShowForm(false)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Signals</h1>
          <p className="text-zinc-400 text-sm mt-1">Custom patterns the AI watches for in sessions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Signal
        </button>
      </div>

      {showForm && (
        <form onSubmit={createSignal} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Signal Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Checkout abandonment"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Description (what to watch for)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="User visits pricing page, clicks upgrade, but never completes checkout within the session"
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
            >
              {saving ? 'Creating...' : 'Create Signal'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {signals.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <Zap size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No signals configured. Create one to teach the AI what to watch for.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {signals.map(signal => (
            <div key={signal.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <Zap size={16} className={signal.is_active ? 'text-yellow-400' : 'text-zinc-600'} />
              <div className="flex-1">
                <p className="text-sm text-white">{signal.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{signal.description}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${signal.is_active ? 'bg-green-500/10 text-green-400' : 'bg-zinc-700/50 text-zinc-500'}`}>
                {signal.is_active ? 'active' : 'paused'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
