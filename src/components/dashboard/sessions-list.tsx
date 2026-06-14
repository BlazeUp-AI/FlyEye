'use client'

import { useState } from 'react'
import { Monitor, Clock, AlertCircle, Play } from 'lucide-react'
import type { Session } from '@/lib/types'
import { clsx } from 'clsx'

export function SessionsList({ sessions, projectId }: { sessions: Session[]; projectId: string }) {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  async function analyzeSession(sessionId: string) {
    setAnalyzingId(sessionId)
    await fetch(`/api/analyze/${sessionId}`, { method: 'POST' })
    setAnalyzingId(null)
    window.location.reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-zinc-400 text-sm mt-1">{sessions.length} sessions from PostHog</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <Monitor size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No sessions synced yet. Click &quot;Sync Sessions&quot; on the dashboard.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4"
            >
              <Monitor size={16} className="text-zinc-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {session.user_distinct_id || 'Anonymous'}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {Math.round(session.duration)}s
                  </span>
                  <span>{session.event_summary?.total_events ?? 0} events</span>
                  {(session.console_errors?.length ?? 0) > 0 && (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {session.console_errors.length} errors
                    </span>
                  )}
                  {(session.event_summary?.rage_clicks ?? 0) > 0 && (
                    <span className="text-orange-400">
                      {session.event_summary.rage_clicks} rage clicks
                    </span>
                  )}
                </div>
              </div>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded',
                session.analysis_status === 'done' && 'bg-green-500/10 text-green-400',
                session.analysis_status === 'pending' && 'bg-yellow-500/10 text-yellow-400',
                session.analysis_status === 'analyzing' && 'bg-blue-500/10 text-blue-400',
                session.analysis_status === 'skipped' && 'bg-zinc-700/50 text-zinc-500',
              )}>
                {session.analysis_status}
              </span>
              {session.analysis_status === 'pending' && (
                <button
                  onClick={() => analyzeSession(session.id)}
                  disabled={analyzingId === session.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs rounded-lg transition-colors"
                >
                  <Play size={12} />
                  {analyzingId === session.id ? 'Analyzing...' : 'Analyze'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
