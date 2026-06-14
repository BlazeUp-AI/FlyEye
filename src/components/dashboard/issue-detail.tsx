'use client'

import { useState } from 'react'
import { ArrowLeft, GitPullRequest, ThumbsUp, ThumbsDown, Wrench, ExternalLink } from 'lucide-react'
import type { Issue } from '@/lib/types'
import { clsx } from 'clsx'
import Link from 'next/link'

export function IssueDetail({ issue }: { issue: Issue & { issue_feedback: { verdict: string }[] } }) {
  const [feedbackGiven, setFeedbackGiven] = useState(issue.issue_feedback?.length > 0)
  const [fixing, setFixing] = useState(false)
  const [prUrl, setPrUrl] = useState(issue.pr_url)

  async function submitFeedback(verdict: 'confirmed' | 'rejected') {
    await fetch(`/api/issues/${issue.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verdict }),
    })
    setFeedbackGiven(true)
  }

  async function triggerFix() {
    setFixing(true)
    const res = await fetch(`/api/fix/${issue.id}`, { method: 'POST' })
    const data = await res.json()
    if (data.pr_url) setPrUrl(data.pr_url)
    setFixing(false)
  }

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/issues" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to issues
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={clsx(
              'px-2 py-0.5 rounded text-xs font-medium',
              issue.severity === 'critical' && 'bg-red-500/10 text-red-400',
              issue.severity === 'high' && 'bg-orange-500/10 text-orange-400',
              issue.severity === 'medium' && 'bg-yellow-500/10 text-yellow-400',
              issue.severity === 'low' && 'bg-zinc-700/50 text-zinc-400',
            )}>
              {issue.severity}
            </span>
            <span className="text-xs text-zinc-500">{issue.type}</span>
            <span className="text-xs text-zinc-500">{Math.round(issue.confidence * 100)}% confidence</span>
          </div>
          <h1 className="text-xl font-bold text-white">{issue.title}</h1>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Description">
          <p className="text-zinc-300 text-sm">{issue.description}</p>
        </Section>

        <Section title="Root Cause">
          <p className="text-zinc-300 text-sm">{issue.root_cause}</p>
        </Section>

        <Section title="Reproduction Steps">
          <p className="text-zinc-300 text-sm whitespace-pre-wrap">{issue.reproduction_steps}</p>
        </Section>

        <Section title="Affected Component">
          <code className="text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{issue.affected_component}</code>
        </Section>

        <Section title="Suggested Fix">
          <pre className="text-sm text-zinc-300 bg-zinc-800 p-4 rounded-lg overflow-x-auto">{issue.suggested_fix}</pre>
        </Section>

        {prUrl && (
          <Section title="Pull Request">
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm"
            >
              <GitPullRequest size={16} />
              {prUrl}
              <ExternalLink size={12} />
            </a>
          </Section>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
          {!feedbackGiven ? (
            <>
              <span className="text-sm text-zinc-400 mr-2">Is this issue real?</span>
              <button
                onClick={() => submitFeedback('confirmed')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 text-sm rounded-lg transition-colors border border-green-600/20"
              >
                <ThumbsUp size={14} />
                Confirm
              </button>
              <button
                onClick={() => submitFeedback('rejected')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-sm rounded-lg transition-colors border border-red-600/20"
              >
                <ThumbsDown size={14} />
                Reject
              </button>
            </>
          ) : (
            <span className="text-sm text-zinc-500">Feedback recorded — AI will learn from this.</span>
          )}

          {!prUrl && (
            <button
              onClick={triggerFix}
              disabled={fixing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors ml-auto"
            >
              <Wrench size={14} />
              {fixing ? 'Generating fix...' : 'Generate Fix & Push PR'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-400 mb-2">{title}</h3>
      {children}
    </div>
  )
}
