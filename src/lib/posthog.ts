import type { Session, SessionEventSummary, ConsoleError, NetworkFailure } from './types'

type PostHogRecording = {
  id: string
  viewed: boolean
  recording_duration: number
  distinct_id: string
  start_time: string
  end_time: string
}

type PostHogEvent = {
  event: string
  timestamp: string
  properties: Record<string, unknown>
}

export class PostHogClient {
  private baseUrl: string
  private apiKey: string
  private projectId: string

  constructor(apiKey: string, projectId: string) {
    this.baseUrl = 'https://app.posthog.com'
    this.apiKey = apiKey
    this.projectId = projectId
  }

  private async fetch<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}/api/projects/${this.projectId}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    })
    if (!res.ok) {
      throw new Error(`PostHog API error: ${res.status} ${await res.text()}`)
    }
    return res.json() as Promise<T>
  }

  async listRecordings(limit = 20): Promise<PostHogRecording[]> {
    const data = await this.fetch<{ results: PostHogRecording[] }>(
      '/session_recordings',
      { limit: String(limit), order: '-start_time' }
    )
    return data.results
  }

  async getRecordingEvents(recordingId: string): Promise<PostHogEvent[]> {
    const data = await this.fetch<{ results: PostHogEvent[] }>(
      `/session_recordings/${recordingId}/events`,
      { limit: '200' }
    )
    return data.results ?? []
  }

  async getRecordingSnapshots(recordingId: string): Promise<unknown[]> {
    const data = await this.fetch<{ results: unknown[] }>(
      `/session_recordings/${recordingId}/snapshots`
    )
    return data.results ?? []
  }

  async syncRecordings(existingIds: Set<string>): Promise<Omit<Session, 'id' | 'project_id' | 'analysis_status' | 'synced_at'>[]> {
    const recordings = await this.listRecordings(50)
    const newRecordings = recordings.filter(r => !existingIds.has(r.id))

    const sessions = await Promise.all(
      newRecordings.map(async (recording) => {
        const events = await this.getRecordingEvents(recording.id)
        return {
          posthog_recording_id: recording.id,
          duration: recording.recording_duration,
          user_distinct_id: recording.distinct_id,
          start_time: recording.start_time,
          event_summary: this.summarizeEvents(events),
          console_errors: this.extractConsoleErrors(events),
          network_failures: this.extractNetworkFailures(events),
        }
      })
    )

    return sessions
  }

  private summarizeEvents(events: PostHogEvent[]): SessionEventSummary {
    const clicks = events.filter(e => e.event === '$click' || e.event === '$autocapture').length
    const pageViews = events
      .filter(e => e.event === '$pageview')
      .map(e => String(e.properties?.$current_url ?? e.properties?.$pathname ?? ''))
      .filter(Boolean)

    const rageClicks = events.filter(e => e.event === '$rageclick').length
    const deadClicks = events.filter(e => e.event === '$dead_click').length

    const keyActions = events
      .filter(e => !e.event.startsWith('$'))
      .slice(0, 20)
      .map(e => e.event)

    return {
      total_events: events.length,
      clicks,
      rage_clicks: rageClicks,
      dead_clicks: deadClicks,
      page_views: [...new Set(pageViews)],
      key_actions: keyActions,
    }
  }

  private extractConsoleErrors(events: PostHogEvent[]): ConsoleError[] {
    return events
      .filter(e => e.event === '$console_log' && (e.properties?.level === 'error' || e.properties?.level === 'warn'))
      .map(e => ({
        message: String(e.properties?.message ?? ''),
        timestamp: e.timestamp,
        level: e.properties?.level as 'error' | 'warn',
        source: e.properties?.source as string | undefined,
      }))
  }

  private extractNetworkFailures(events: PostHogEvent[]): NetworkFailure[] {
    return events
      .filter(e => {
        if (e.event !== '$network_request') return false
        const status = Number(e.properties?.status ?? 0)
        return status >= 400 || status === 0
      })
      .map(e => ({
        url: String(e.properties?.url ?? ''),
        method: String(e.properties?.method ?? 'GET'),
        status: Number(e.properties?.status ?? 0),
        timestamp: e.timestamp,
      }))
  }
}
