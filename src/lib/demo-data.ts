import type { Issue, Session, Signal } from './types'

export const demoProjectId = 'demo-project'

export const demoSessions: Session[] = [
  {
    id: 'demo-session-checkout-rage-click',
    project_id: demoProjectId,
    posthog_recording_id: 'ph-demo-rec-001',
    duration: 184,
    user_distinct_id: 'user_7421',
    start_time: '2026-06-14T09:42:00.000Z',
    event_summary: {
      total_events: 68,
      clicks: 31,
      rage_clicks: 4,
      dead_clicks: 6,
      page_views: ['/pricing', '/checkout', '/checkout/payment'],
      key_actions: ['Plan Selected', 'Checkout Started', 'Payment Submit Clicked', 'Coupon Applied'],
    },
    console_errors: [
      {
        level: 'error',
        message: 'PaymentIntent confirmation failed: client_secret is missing after promo retry',
        timestamp: '2026-06-14T09:44:13.000Z',
        source: 'checkout/payment-form.tsx',
      },
    ],
    network_failures: [
      {
        method: 'POST',
        url: '/api/billing/confirm',
        status: 500,
        timestamp: '2026-06-14T09:44:12.000Z',
      },
    ],
    analysis_status: 'done',
    synced_at: '2026-06-14T09:47:00.000Z',
  },
  {
    id: 'demo-session-save-settings',
    project_id: demoProjectId,
    posthog_recording_id: 'ph-demo-rec-002',
    duration: 96,
    user_distinct_id: 'workspace_admin_19',
    start_time: '2026-06-14T10:18:00.000Z',
    event_summary: {
      total_events: 42,
      clicks: 18,
      rage_clicks: 2,
      dead_clicks: 3,
      page_views: ['/dashboard/settings'],
      key_actions: ['Open Settings', 'Save Sources Clicked', 'Save Sources Clicked', 'Toast Dismissed'],
    },
    console_errors: [
      {
        level: 'warn',
        message: 'Settings save returned 200 but form state was not refreshed',
        timestamp: '2026-06-14T10:19:04.000Z',
        source: 'settings-form.tsx',
      },
    ],
    network_failures: [],
    analysis_status: 'done',
    synced_at: '2026-06-14T10:21:00.000Z',
  },
  {
    id: 'demo-session-slow-replay',
    project_id: demoProjectId,
    posthog_recording_id: 'ph-demo-rec-003',
    duration: 241,
    user_distinct_id: 'trial_user_884',
    start_time: '2026-06-14T11:03:00.000Z',
    event_summary: {
      total_events: 55,
      clicks: 12,
      rage_clicks: 0,
      dead_clicks: 1,
      page_views: ['/dashboard', '/dashboard/issues', '/dashboard/issues/demo-loop-checkout'],
      key_actions: ['Open Loop Detail', 'Generate PR Clicked', 'Back To Loops'],
    },
    console_errors: [],
    network_failures: [
      {
        method: 'GET',
        url: '/api/issues/demo-loop-checkout',
        status: 408,
        timestamp: '2026-06-14T11:05:48.000Z',
      },
    ],
    analysis_status: 'pending',
    synced_at: '2026-06-14T11:07:00.000Z',
  },
]

export const demoIssues: Issue[] = [
  {
    id: 'demo-loop-checkout',
    project_id: demoProjectId,
    session_id: 'demo-session-checkout-rage-click',
    type: 'bug',
    severity: 'critical',
    title: 'Checkout fails after promo retry',
    description: 'A user applies a coupon, returns to payment, and repeatedly clicks Pay without completing checkout.',
    reproduction_steps: '1. Open /pricing.\n2. Select Starter.\n3. Apply a promo code.\n4. Return to payment and click Pay.\n5. Observe the failed confirmation request and repeated clicks.',
    affected_component: 'checkout/payment-form.tsx',
    root_cause: 'The payment form reuses stale checkout state after coupon recalculation and submits without a fresh client secret.',
    suggested_fix: '+ invalidate checkout intent after coupon updates\n+ request a fresh client_secret before confirmation\n+ show a blocking inline error when billing state is incomplete',
    confidence: 0.94,
    pr_url: 'https://github.com/BlazeUp-AI/FlyEye/pull/128',
    pr_status: 'open',
    status: 'open',
    created_at: '2026-06-14T09:48:00.000Z',
  },
  {
    id: 'demo-loop-settings-save',
    project_id: demoProjectId,
    session_id: 'demo-session-save-settings',
    type: 'ux_friction',
    severity: 'high',
    title: 'Settings save appears to do nothing',
    description: 'An admin saves integration keys, but the form keeps showing the previous empty state, causing repeated clicks.',
    reproduction_steps: '1. Open /dashboard/settings.\n2. Enter PostHog and GitHub values.\n3. Click Save settings.\n4. Notice the readiness state does not refresh until a full reload.',
    affected_component: 'components/dashboard/settings-form.tsx',
    root_cause: 'The client form shows a transient saved state but does not refresh project readiness after the API write.',
    suggested_fix: '+ call router.refresh after successful settings save\n+ keep masked configured fields stable\n+ disable repeated saves while the refresh is pending',
    confidence: 0.88,
    pr_url: null,
    pr_status: null,
    status: 'confirmed',
    created_at: '2026-06-14T10:22:00.000Z',
  },
  {
    id: 'demo-loop-issue-timeout',
    project_id: demoProjectId,
    session_id: 'demo-session-slow-replay',
    type: 'performance',
    severity: 'medium',
    title: 'Loop detail intermittently times out',
    description: 'Opening a loop detail page waits on a slow joined issue query and occasionally returns a timeout.',
    reproduction_steps: '1. Open /dashboard/issues.\n2. Select a recently generated loop.\n3. Navigate back and reopen the detail page several times.\n4. Observe a delayed or failed issue detail load.',
    affected_component: 'app/dashboard/issues/[id]/page.tsx',
    root_cause: 'The detail page blocks on a joined issue feedback query with no fallback shell or loading state.',
    suggested_fix: '+ split feedback loading from the critical issue payload\n+ add a route loading state\n+ keep the detail shell renderable while feedback streams in',
    confidence: 0.76,
    pr_url: null,
    pr_status: null,
    status: 'open',
    created_at: '2026-06-14T11:08:00.000Z',
  },
]

export const demoIssueDetails = demoIssues.map(issue => ({
  ...issue,
  issue_feedback: issue.status === 'confirmed' ? [{ verdict: 'confirmed' }] : [],
}))

export const demoSignals: Signal[] = [
  {
    id: 'demo-signal-checkout-abandonment',
    project_id: demoProjectId,
    name: 'Checkout abandonment after pricing',
    description: 'User visits pricing, starts checkout, hits billing failure, and never completes purchase.',
    trigger_conditions: {
      pages: ['/pricing', '/checkout'],
      requires_failure: true,
    },
    is_active: true,
    created_at: '2026-06-14T09:30:00.000Z',
  },
  {
    id: 'demo-signal-dead-save',
    project_id: demoProjectId,
    name: 'Repeated save without visible state change',
    description: 'User clicks a save button multiple times within one minute without a visible confirmation or state update.',
    trigger_conditions: {
      clicks: 3,
      window_seconds: 60,
    },
    is_active: true,
    created_at: '2026-06-14T10:00:00.000Z',
  },
  {
    id: 'demo-signal-console-before-rage-click',
    project_id: demoProjectId,
    name: 'Console error before rage click',
    description: 'A console error or failed request occurs immediately before a rage-click sequence.',
    trigger_conditions: {
      console_error: true,
      rage_clicks_min: 2,
    },
    is_active: true,
    created_at: '2026-06-14T10:30:00.000Z',
  },
]

export const demoStats = {
  totalSessions: demoSessions.length,
  analyzedSessions: demoSessions.filter(session => session.analysis_status === 'done').length,
  totalIssues: demoIssues.length,
  openIssues: demoIssues.filter(issue => issue.status === 'open').length,
  criticalIssues: demoIssues.filter(issue => issue.severity === 'critical').length,
  prsCreated: demoIssues.filter(issue => issue.pr_url).length,
}

export function getDemoIssueById(id: string) {
  return demoIssueDetails.find(issue => issue.id === id)
}
