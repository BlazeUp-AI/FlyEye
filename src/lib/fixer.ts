import OpenAI from 'openai'
import { GitHubClient } from './github'
import type { Issue } from './types'

export class CodeFixer {
  private ai: OpenAI
  private github: GitHubClient

  constructor(openaiKey: string, githubToken: string, githubRepo: string) {
    this.ai = new OpenAI({ apiKey: openaiKey })
    this.github = new GitHubClient(githubToken, githubRepo)
  }

  async fixAndPush(issue: Issue): Promise<string | null> {
    const tree = await this.github.getRepoTree()
    const relevantPaths = this.findRelevantFiles(tree, issue)
    const fileContents = await this.github.getMultipleFiles(relevantPaths)

    const fix = await this.generateFix(issue, fileContents)
    if (!fix || fix.length === 0) return null

    const prUrl = await this.github.createBranchAndPR(issue, fix)
    return prUrl
  }

  private findRelevantFiles(
    tree: { path: string; sha: string; type: string }[],
    issue: Issue
  ): string[] {
    const component = issue.affected_component.toLowerCase()
    const rootCause = issue.root_cause.toLowerCase()
    const combined = `${component} ${rootCause} ${issue.description.toLowerCase()}`

    const codeFiles = tree.filter(f => {
      const ext = f.path.split('.').pop() ?? ''
      return ['ts', 'tsx', 'js', 'jsx', 'py', 'rb', 'go', 'rs'].includes(ext)
    })

    const scored = codeFiles.map(f => {
      const pathParts = f.path.toLowerCase().split('/')
      let score = 0
      for (const part of pathParts) {
        if (combined.includes(part)) score += 2
      }
      if (f.path.toLowerCase().includes(component)) score += 5
      return { ...f, score }
    })

    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 10).map(f => f.path)
  }

  private async generateFix(
    issue: Issue,
    files: Record<string, string>
  ): Promise<{ path: string; content: string }[] | null> {
    const fileContext = Object.entries(files)
      .map(([path, content]) => `### ${path}\n\`\`\`\n${content}\n\`\`\``)
      .join('\n\n')

    const response = await this.ai.chat.completions.create({
      model: 'gpt-5.5',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: 'You are a senior software engineer fixing a bug detected in production. Write minimal, correct fixes. Return only valid JSON.' },
        {
          role: 'user',
          content: `# Bug Fix Request

## Issue
- **Title:** ${issue.title}
- **Type:** ${issue.type}
- **Severity:** ${issue.severity}
- **Description:** ${issue.description}
- **Root Cause:** ${issue.root_cause}
- **Affected Component:** ${issue.affected_component}
- **Reproduction Steps:** ${issue.reproduction_steps}

## Relevant Files
${fileContext}

## Instructions
Generate the minimal fix for this bug. Return JSON with the files to change:

{
  "changes": [
    {
      "path": "path/to/file.ts",
      "content": "full updated file content"
    }
  ]
}

Only include files that need changes. Write the COMPLETE file content (not a diff). If you cannot determine a confident fix, return {"changes": []}.`,
        },
      ],
    })

    const text = response.choices[0]?.message?.content ?? ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    try {
      const result = JSON.parse(jsonMatch[0]) as { changes: { path: string; content: string }[] }
      return result.changes.length > 0 ? result.changes : null
    } catch {
      return null
    }
  }
}
