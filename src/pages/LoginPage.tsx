import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[--bg-primary] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-900 via-violet-800 to-purple-900 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 w-64 h-64 rounded-full bg-violet-400 blur-3xl" />
          <div className="absolute bottom-16 right-16 w-48 h-48 rounded-full bg-purple-400 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-display font-bold text-2xl">SHEild</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-display font-bold text-white leading-tight">
            Your safety,<br />
            <span className="text-violet-200">always protected.</span>
          </h2>
          <p className="text-violet-200/80 text-lg leading-relaxed max-w-sm">
            Trusted by thousands of women across India. Emergency SOS, location sharing, and digital safety — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['🛡️ Emergency SOS', '📍 Location Sharing', '🤖 AI Threat Analysis', '🔒 Evidence Vault'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/15 text-white text-sm backdrop-blur">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-violet-300/60 text-sm">
          SHEild — Smart Help, Emergency Intelligence & Location Defense
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center px-8 py-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Shield className="w-6 h-6 text-violet-600" />
            <span className="font-display font-bold text-gradient text-xl">SHEild</span>
          </Link>
          <div className="lg:ml-auto">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8 animate-slide-up">
            <div>
              <h1 className="text-3xl font-display font-bold text-[--text-primary]">Welcome back</h1>
              <p className="text-[--text-secondary] mt-2">Sign in to your SHEild account</p>
            </div>


            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="input-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                  <input
                    id="email"
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
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="input-label mb-0">Password</label>
                  <Link to="/reset-password" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-primary]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-emergency-50 dark:bg-emergency-950/40 border border-emergency-200 dark:border-emergency-800/50">
                  <p className="text-sm text-emergency-700 dark:text-emergency-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="btn-primary w-full h-12 text-base"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[--text-secondary]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
