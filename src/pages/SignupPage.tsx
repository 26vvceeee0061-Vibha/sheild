import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const passwordRequirements = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (!agreed) {
      setError('Please accept the privacy terms to continue.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signup(email, password, name)
      navigate('/onboarding')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[--bg-primary] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600 shadow-glow-violet mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-[--text-primary]">Create your account</h1>
          <p className="text-[--text-secondary] mt-2">Start protecting yourself with SHEild</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="input-label">Full name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input pl-10"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="input-label">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="input-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input pl-10 pr-10"
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-primary]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicators */}
            {password && (
              <div className="mt-2.5 space-y-1.5">
                {passwordRequirements.map(req => (
                  <div key={req.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.test(password) ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {req.test(password) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-xs ${req.test(password) ? 'text-teal-600 dark:text-teal-400' : 'text-[--text-muted]'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy consent */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setAgreed(v => !v)}
              id="privacy-consent"
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-violet-600 border-violet-600' : 'border-2 border-gray-300 dark:border-gray-600'}`}
            >
              {agreed && <Check className="w-3 h-3 text-white" />}
            </button>
            <p className="text-sm text-[--text-secondary]">
              I agree that SHEild will use my data only for safety features as described in the{' '}
              <span className="text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">Privacy Policy</span>.
              I can withdraw consent at any time.
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-emergency-50 dark:bg-emergency-950/40 border border-emergency-200 dark:border-emergency-800/50">
              <p className="text-sm text-emergency-700 dark:text-emergency-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="signup-submit-btn"
            className="btn-primary w-full h-12 text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[--text-secondary]">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
