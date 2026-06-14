'use client'

import { Bug, GitPullRequest, ExternalLink } from 'lucide-react'
import type { Issue } from '@/lib/types'
import { clsx } from 'clsx'
import Link from 'next/link'

export function IssuesList({ issues }: { issues: Issue[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Issues</h1>
          <p className="text-zinc-400 text-sm mt-1">{issues.length} issues detected by AI</p>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <Bug size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No issues found yet. Analyze some sessions first.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map(issue => (
            <Link
              key={issue.id}
              href={`/dashboard/issues/${issue.id}`}
              className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
            >
              <span className={clsx(
                'px-2 py-0.5 rounded text-xs font-medium shrink-0',
                issue.severity === 'critical' && 'bg-red-500/10 text-red-400',
                issue.severity === 'high' && 'bg-orange-500/10 text-orange-400',
                issue.severity === 'medium' && 'bg-yellow-500/10 text-yellow-400',
                issue.severity === 'low' && 'bg-zinc-700/50 text-zinc-400',
              )}>
                {issue.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{issue.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{issue.description}</p>
              </div>
              <span className="text-xs text-zinc-500 shrink-0">{issue.type}</span>
              <span className="text-xs text-zinc-500 shrink-0">{Math.round(issue.confidence * 100)}%</span>
              {issue.pr_url && (
                <a
                  href={issue.pr_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-green-400 hover:text-green-300 shrink-0"
                >
                  <GitPullRequest size={16} />
                </a>
              )}
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded shrink-0',
                issue.status === 'open' && 'bg-blue-500/10 text-blue-400',
                issue.status === 'confirmed' && 'bg-green-500/10 text-green-400',
                issue.status === 'rejected' && 'bg-zinc-700/50 text-zinc-400',
                issue.status === 'fixed' && 'bg-purple-500/10 text-purple-400',
              )}>
                {issue.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
