'use client'

import { useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090a08] px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-zinc-400">We sent a confirmation link to {email}</p>
          <Link href="/login" className="mt-4 inline-block text-sm text-[var(--ev-acid)] hover:text-[#e3ff81]">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090a08] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">ExterVision</h1>
          <p className="mt-2 text-zinc-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/[0.09] bg-[#11120f] px-3 py-2 text-white placeholder-zinc-500 focus:border-[var(--ev-acid)] focus:outline-none focus:ring-2 focus:ring-[rgba(215,255,95,0.2)]"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-white/[0.09] bg-[#11120f] px-3 py-2 text-white placeholder-zinc-500 focus:border-[var(--ev-acid)] focus:outline-none focus:ring-2 focus:ring-[rgba(215,255,95,0.2)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--ev-acid)] py-2.5 font-semibold text-[#11130b] transition-colors hover:bg-[#e3ff81] disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--ev-acid)] hover:text-[#e3ff81]">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
