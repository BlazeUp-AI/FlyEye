import OpenAI from 'openai'
import type { Session, AnalysisResult, PromptExample } from './types'

export class SessionAnalyzer {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async analyze(session: Session, examples: PromptExample[] = []): Promise<AnalysisResult> {
    const prompt = this.buildPrompt(session, examples)

    const response = await this.client.chat.completions.create({
      model: 'gpt-5.5',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: 'You are an expert QA engineer analyzing user session recordings to detect bugs, UX issues, and errors. You are thorough, precise, and only flag real issues — not minor inconveniences. Return your findings as valid JSON.' },
        { role: 'user', content: prompt },
      ],
    })

    const text = response.choices[0]?.message?.content ?? ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { findings: [] }

    try {
      const result = JSON.parse(jsonMatch[0]) as AnalysisResult
      return { findings: result.findings ?? [] }
    } catch {
      return { findings: [] }
    }
  }

  private buildPrompt(session: Session, examples: PromptExample[]): string {
    const parts: string[] = []

    parts.push(`# Session Analysis Request

## Session Overview
- Duration: ${session.duration}s
- User: ${session.user_distinct_id}
- Started: ${session.start_time}
- Total events: ${session.event_summary.total_events}
- Clicks: ${session.event_summary.clicks}
- Rage clicks: ${session.event_summary.rage_clicks}
- Dead clicks: ${session.event_summary.dead_clicks}

## Pages Visited
${session.event_summary.page_views.map(p => `- ${p}`).join('\n')}

## Key Actions
${session.event_summary.key_actions.map(a => `- ${a}`).join('\n')}`)

    if (session.console_errors.length > 0) {
      parts.push(`\n## Console Errors
${session.console_errors.map(e => `- [${e.level}] ${e.message}`).join('\n')}`)
    }

    if (session.network_failures.length > 0) {
      parts.push(`\n## Network Failures
${session.network_failures.map(n => `- ${n.method} ${n.url} → ${n.status}`).join('\n')}`)
    }

    if (examples.length > 0) {
      const positive = examples.filter(e => e.is_positive).slice(0, 5)
      const negative = examples.filter(e => !e.is_positive).slice(0, 5)

      if (positive.length > 0) {
        parts.push(`\n## Examples of CONFIRMED issues (flag similar patterns):
${positive.map(e => `- ${JSON.stringify(e.finding)}`).join('\n')}`)
      }

      if (negative.length > 0) {
        parts.push(`\n## Examples of REJECTED issues (do NOT flag similar patterns):
${negative.map(e => `- ${JSON.stringify(e.finding)}`).join('\n')}`)
      }
    }

    parts.push(`\n## Instructions
Analyze this session for bugs, UX friction, errors, and performance issues. Only flag real, actionable issues.

Return JSON in this exact format:
{
  "findings": [
    {
      "type": "bug" | "ux_friction" | "error" | "performance",
      "severity": "critical" | "high" | "medium" | "low",
      "title": "Short descriptive title",
      "description": "What went wrong and impact on user",
      "reproduction_steps": "Step by step how to reproduce",
      "affected_component": "Which part of the app (page/component path)",
      "root_cause": "Likely technical root cause",
      "suggested_fix": "How to fix this in code",
      "confidence": 0.0 to 1.0
    }
  ]
}

If no issues found, return {"findings": []}.`)

    return parts.join('\n')
  }
}
