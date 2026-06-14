import Link from 'next/link'
import {
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  GitPullRequest,
  MonitorPlay,
  Sparkles,
} from 'lucide-react'

const workflow = [
  {
    icon: MonitorPlay,
    title: 'Connect session data',
    copy: 'Bring in PostHog replays, console errors, rage clicks, dead clicks, and the path the user took.',
  },
  {
    icon: Brain,
    title: 'Understand what broke',
    copy: 'ExterVision groups repeat failures, explains the likely cause, and shows why the issue matters.',
  },
  {
    icon: GitPullRequest,
    title: 'Open a focused PR',
    copy: 'When the signal is clear, it creates a GitHub PR with replay evidence, a fix plan, and regression notes.',
  },
]

const details = [
  ['Input', 'PostHog replays, click behavior, console errors, page paths, and custom team signals.'],
  ['Output', 'A ranked issue, plain-English cause, affected flow, suggested fix, and review-ready PR.'],
  ['Feedback', 'PM, QA, and engineering feedback updates what the agent flags next time.'],
  ['Controls', 'Session limits, filters, retention, priority processing, and deployment options by plan.'],
]

const pricing = [
  {
    name: 'Starter',
    price: '$399',
    detail: 'For one product team wiring its first quality loop.',
    features: ['10,000 sessions / month', '3 active signals', '3 custom filters', '30-day retention', 'All integrations', 'MCP and SDK access'],
  },
  {
    name: 'Pro',
    price: '$799',
    detail: 'For PM, QA, and engineering teams closing the loop together.',
    badge: 'Most popular',
    features: ['30,000 sessions / month', 'Unlimited signals', 'Unlimited filters', '90-day retention', 'Priority processing', 'Multi-project support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    detail: 'For security, scale, and deployment control.',
    features: ['Unlimited sessions', 'SOC 2 and SSO/SAML', 'SLA and audit logs', 'Custom integrations', 'On-prem or VPC option', 'Custom retention'],
  },
]

const signals = [
  'A user visits pricing, starts checkout, and never finishes.',
  'A user clicks Save again and again but nothing changes.',
  'A console error appears right before a rage-click sequence.',
  'A feature is discovered, fails, and later becomes a support ticket.',
]

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090a08] text-[var(--ev-text)]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.07] bg-[#090a08]/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="text-base font-semibold tracking-normal text-white">
            ExterVision
          </Link>
          <div className="hidden items-center gap-7 text-sm text-[var(--ev-muted)] md:flex">
            <a href="#loop" className="transition-colors hover:text-white">Loop</a>
            <a href="#proof" className="transition-colors hover:text-white">Proof</a>
            <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden min-h-9 items-center px-3 text-sm text-[var(--ev-muted)] transition-colors hover:text-white sm:inline-flex">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="ev-focus inline-flex min-h-9 items-center gap-2 rounded-lg bg-[var(--ev-acid)] px-3.5 text-sm font-semibold text-[#11130b] transition-transform hover:-translate-y-0.5"
            >
              Start trial
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative border-b border-white/[0.07] px-5 pt-24 lg:px-8">
        <HeroBackdrop />
        <div className="relative z-10 mx-auto grid min-h-[86vh] max-w-7xl gap-12 pb-14 pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-[620px]">
            <div className="mb-5 inline-flex items-center gap-2 font-data text-[11px] uppercase tracking-normal text-[var(--ev-muted)]">
              <Sparkles size={13} className="text-[var(--ev-acid)]" />
              Closed-loop product quality
            </div>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal text-white md:text-7xl">
              ExterVision
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#d9d5cc] md:text-xl">
              Connect PostHog and GitHub. ExterVision finds real product issues from user sessions and turns them into fix-ready PRs.
            </p>
            <div className="mt-6 grid gap-2 text-sm leading-6 text-[var(--ev-muted)]">
              <p><span className="text-white">For PM:</span> see what users failed to do.</p>
              <p><span className="text-white">For QA:</span> get replay-backed bugs with repro context.</p>
              <p><span className="text-white">For engineering:</span> review a focused code change, not a vague ticket.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="ev-focus inline-flex min-h-12 items-center gap-2 rounded-lg bg-[var(--ev-acid)] px-5 text-sm font-semibold text-[#11130b] transition-transform hover:-translate-y-0.5"
              >
                Start with 400 free sessions
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                className="ev-focus inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/[0.12] bg-black/25 px-5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                View dashboard
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section id="proof" className="border-b border-white/[0.07] bg-[#0d0e0b] px-5 py-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <ProofStat value="$342M -> $744M" label="AI bug detection market projection from 2025 to 2031" />
          <ProofStat value="$821M -> $1.1B" label="Session replay and heatmap market projection from 2024 to 2034" />
          <ProofStat value="400 sessions" label="Free trial, no credit card required" />
        </div>
      </section>

      <section id="loop" className="border-b border-white/[0.07] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-data text-[11px] uppercase tracking-normal text-[var(--ev-muted)]">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-5xl">
              From replay to fix in one workflow.
            </h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {workflow.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="bg-[#0d0e0b] p-6">
                <Icon size={22} className="text-[var(--ev-acid)]" />
                <h3 className="mt-7 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ev-muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-[#0b0c0a] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-data text-[11px] uppercase tracking-normal text-[var(--ev-muted)]">Details</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-5xl">
              Clear inputs. Clear outputs.
            </h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
            {details.map(([title, copy]) => (
              <div key={title} className="bg-[#0d0e0b] p-6">
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--ev-muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-[#0f100d] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="font-data text-[11px] uppercase tracking-normal text-[var(--ev-muted)]">Self-improving</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-5xl">
              Your feedback changes the next run.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--ev-muted)]">
              Confirm a bug, reject a weak signal, or edit the fix direction. ExterVision uses that feedback when it reviews the next batch of sessions.
            </p>
          </div>
          <div className="grid gap-3">
            {signals.map((signal) => (
              <div key={signal} className="flex items-start gap-3 border border-white/[0.08] bg-[#090a08] p-4">
                <Check size={17} className="mt-0.5 shrink-0 text-[var(--ev-success)]" />
                <span className="text-sm leading-6 text-[#ddd8cf]">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-data text-[11px] uppercase tracking-normal text-[var(--ev-muted)]">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white md:text-5xl">Simple plans for real session volume.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[var(--ev-muted)]">Every plan includes PostHog, OpenAI, GitHub, MCP and SDK access, plus a free 400-session trial.</p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
            {pricing.map((plan) => (
              <div key={plan.name} className="relative bg-[#0d0e0b] p-6">
                {plan.badge && (
                  <span className="absolute right-5 top-5 bg-[rgba(215,255,95,0.13)] px-2.5 py-1 font-data text-[10px] uppercase tracking-normal text-[var(--ev-acid)]">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-normal text-white">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="pb-1 text-sm text-[var(--ev-muted)]">/mo</span>}
                </div>
                <p className="mt-4 min-h-12 text-sm leading-6 text-[var(--ev-muted)]">{plan.detail}</p>
                <Link
                  href={plan.name === 'Enterprise' ? '/signup' : '/signup'}
                  className="ev-focus mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
                >
                  {plan.name === 'Enterprise' ? 'Talk to us' : 'Start trial'}
                  <ArrowRight size={15} />
                </Link>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-5 text-[var(--ev-muted)]">
                      <Check size={15} className="mt-0.5 shrink-0 text-[var(--ev-acid)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[var(--ev-muted)] md:flex-row md:items-center md:justify-between">
          <span className="font-semibold text-white">ExterVision</span>
          <span>Closed-loop product quality for PM, QA, and engineering teams.</span>
        </div>
      </footer>
    </main>
  )
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[#090a08]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(215,255,95,0.055)_0%,transparent_34%,rgba(111,227,161,0.035)_100%)]" />
      <div className="absolute inset-x-0 top-16 h-px bg-white/[0.06]" />
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(244,241,234,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,234,0.35)_1px,transparent_1px)] [background-size:80px_80px]" />
    </div>
  )
}

function ProductPreview() {
  const stages = ['Replay', 'Issue', 'Cause', 'Fix', 'Learn']

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="overflow-hidden border border-white/[0.1] bg-[#10120f]/88 shadow-[0_38px_120px_rgba(0,0,0,0.42)]">
        <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--ev-danger)]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--ev-warning)]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--ev-success)]/70" />
          </div>
          <span className="font-data text-[10px] uppercase tracking-normal text-[var(--ev-muted)]">Loop console</span>
        </div>
        <div className="grid gap-px bg-white/[0.07] lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="bg-[#0d0e0b] p-4">
            <p className="font-data text-[10px] uppercase tracking-normal text-[var(--ev-muted)]">Signal intake</p>
            <div className="mt-4 space-y-2">
              {['Rage click cluster', 'Console error', 'Drop-off path'].map((item, index) => (
                <div key={item} className="border border-white/[0.07] bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white">{item}</span>
                    <span className="font-data text-[10px] text-[var(--ev-acid)]">0{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#10120f] p-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_230px]">
              <div className="min-h-[310px] border border-white/[0.07] bg-[#090a08] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-data text-[10px] uppercase tracking-normal text-[var(--ev-muted)]">Evidence</p>
                  <span className="font-data text-[10px] uppercase tracking-normal text-[var(--ev-acid)]">PostHog synced</span>
                </div>
                <div className="mt-4 grid h-[220px] grid-cols-3 gap-3">
                  <div className="border border-white/[0.06] bg-white/[0.025]" />
                  <div className="border border-[rgba(255,92,92,0.42)] bg-[rgba(255,92,92,0.06)]" />
                  <div className="border border-white/[0.06] bg-white/[0.025]" />
                </div>
                <div className="mt-4 grid grid-cols-5 gap-1.5">
                  {stages.map((step) => (
                    <div key={step} className="border border-white/[0.07] bg-black/20 px-1 py-2 text-center font-data text-[9px] uppercase tracking-normal text-[var(--ev-muted)]">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[rgba(111,227,161,0.18)] bg-[rgba(111,227,161,0.055)] p-4">
                <p className="font-data text-[10px] uppercase tracking-normal text-[var(--ev-success)]">PR ready</p>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-white">Keep checkout state after retry</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ev-muted)]">Replay, cause, code diff, and test notes are attached.</p>
                <div className="mt-5 space-y-2 font-data text-[11px]">
                  <p className="text-[var(--ev-success)]">+ keep selected plan</p>
                  <p className="text-[var(--ev-success)]">+ add retry test</p>
                  <p className="text-[var(--ev-danger)]">- reset on network error</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProofStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/[0.08] pl-4">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm leading-5 text-[var(--ev-muted)]">{label}</p>
    </div>
  )
}
