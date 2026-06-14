import Link from 'next/link'
import { Bug, GitPullRequest, Monitor, Zap, ArrowRight, Brain } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-white">FlyVision</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI-powered autonomous bug fixing
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
            Bugs get fixed while<br />
            <span className="text-blue-400">you sleep</span>
          </h1>
          <p className="text-lg text-zinc-400 mt-6 max-w-xl mx-auto">
            Connect PostHog. AI watches your session replays 24/7. Bugs get detected, fixed, and PRs get pushed — automatically.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link href="/signup" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
              Start for free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Three steps. Fully autonomous.</h2>
          <div className="grid grid-cols-3 gap-8">
            <Step
              number="1"
              icon={Monitor}
              title="Connect PostHog"
              description="Paste your API key. FlyVision pulls session replays automatically."
            />
            <Step
              number="2"
              icon={Brain}
              title="AI watches 24/7"
              description="Claude analyzes every session — detects bugs, UX issues, errors, and rage clicks."
            />
            <Step
              number="3"
              icon={GitPullRequest}
              title="PRs get pushed"
              description="For high-confidence bugs, a fix is generated and a PR is opened on your repo."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Self-improving AI</h2>
          <div className="grid grid-cols-2 gap-6">
            <Feature
              icon={Bug}
              title="Bug Detection"
              description="Finds real bugs from session data — console errors, network failures, broken interactions."
            />
            <Feature
              icon={Zap}
              title="Custom Signals"
              description="Define what matters: 'user abandoned checkout', 'rage-clicked the save button'."
            />
            <Feature
              icon={Brain}
              title="Learns from Feedback"
              description="Confirm or reject findings. The AI remembers and gets better at detecting real issues."
            />
            <Feature
              icon={GitPullRequest}
              title="Auto-Fix & PR"
              description="Reads your codebase, generates a fix, and pushes a PR with full context."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to stop hunting bugs manually?</h2>
          <p className="text-zinc-400 mb-8">Bring your PostHog + Anthropic + GitHub keys. FlyVision does the rest.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-zinc-500">FlyVision</span>
          <span className="text-sm text-zinc-600">Autonomous bug detection & fixing</span>
        </div>
      </footer>
    </div>
  )
}

function Step({ number, icon: Icon, title, description }: { number: string; icon: typeof Monitor; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mx-auto mb-4">
        <Icon size={20} className="text-blue-400" />
      </div>
      <div className="text-xs text-zinc-500 mb-1">Step {number}</div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}

function Feature({ icon: Icon, title, description }: { icon: typeof Monitor; title: string; description: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <Icon size={20} className="text-blue-400 mb-3" />
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}
