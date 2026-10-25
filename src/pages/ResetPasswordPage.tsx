import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Mail, Loader2, ArrowLeft, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[--bg-primary] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600 shadow-glow-violet mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Reset Password</h1>
          <p className="text-[--text-secondary] mt-2">We'll send a reset link to your email</p>
        </div>

        {sent ? (
          <div className="card p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="font-semibold text-[--text-primary]">Reset Link Sent!</p>
            <p className="text-sm text-[--text-secondary]">Check your email <strong>{email}</strong> for a password reset link.</p>
            <Link to="/login" className="btn-primary w-full">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-emergency-600 dark:text-emergency-400 px-3 py-2 rounded-lg bg-emergency-50 dark:bg-emergency-950/30">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full" id="reset-submit-btn">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-[--text-muted] hover:text-[--text-primary] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
