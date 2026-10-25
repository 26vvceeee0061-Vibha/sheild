import React, { useState } from 'react'
import { Bot, AlertTriangle, Shield, ExternalLink, Loader2, ChevronLeft, MessageSquare, Link, Mail, AtSign, History, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn, generateId, formatRelativeTime } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import type { ThreatAnalysis, RiskLevel } from '@/types'

const analysisTypes = [
  { id: 'message', icon: MessageSquare, label: 'Message / Text' },
  { id: 'url', icon: Link, label: 'URL / Link' },
  { id: 'email', icon: Mail, label: 'Email Content' },
  { id: 'social', icon: AtSign, label: 'Social Media Post' },
] as const

// Demo analysis logic (rule-based pattern matching as proxy for LLM)
function analyzeContent(content: string, type: string): ThreatAnalysis['result'] {
  const lower = content.toLowerCase()
  const flags: string[] = []
  let score = 0

  // URL patterns
  if (type === 'url') {
    if (/bit\.ly|tinyurl|t\.co|goo\.gl/i.test(content)) { flags.push('Shortened URL — destination unknown'); score += 20 }
    if (/free|win|prize|click here|claim now/i.test(content)) { flags.push('Potential clickbait or prize scam language'); score += 30 }
    if (/\.ru|\.cn|\.xyz|\.tk/i.test(content)) { flags.push('Unusual top-level domain'); score += 25 }
    if (/paypal|amazon|google|microsoft/i.test(content) && /[^a-z](paypal|amazon|google|microsoft)\./i.test(content) === false) {
      flags.push('Brand name appears in suspicious context'); score += 35
    }
  }

  // Message patterns
  if (type === 'message' || type === 'social') {
    if (/urgent|immediately|act now|limited time|expires/i.test(content)) { flags.push('Urgency language — a common manipulation tactic'); score += 25 }
    if (/password|otp|pin|account details|cvv|card number/i.test(content)) { flags.push('Requests sensitive financial/account information'); score += 45 }
    if (/click here|tap here|open link|visit/i.test(content)) { flags.push('Prompts user to click an unknown link'); score += 15 }
    if (/you have won|congratulations|selected|lucky winner/i.test(content)) { flags.push('Lottery or prize scam indicator'); score += 35 }
    if (/i.{0,10}(know|saw|have|watched).{0,15}you/i.test(content)) { flags.push('Potential blackmail or sextortion language'); score += 50 }
    if (/nude|intimate|explicit|video of you/i.test(content)) { flags.push('Possible sextortion or harassment content'); score += 55 }
  }

  // Email patterns
  if (type === 'email') {
    if (/from.*@.*\.(ru|cn|xyz)/i.test(content)) { flags.push('Sender domain appears suspicious'); score += 30 }
    if (/verify.{0,20}account|confirm.{0,20}email|suspended account/i.test(content)) { flags.push('Phishing — account verification request'); score += 40 }
    if (/dear (customer|user|friend)/i.test(content)) { flags.push('Generic greeting (not personalized) — likely mass phishing'); score += 20 }
  }

  // Common across all
  if (/your account (has been|will be) (suspended|closed|locked)/i.test(lower)) { flags.push('Account suspension threat — classic phishing'); score += 45 }

  const cappedScore = Math.min(score, 100)
  let riskLevel: RiskLevel = 'safe'
  if (cappedScore >= 70) riskLevel = 'critical'
  else if (cappedScore >= 45) riskLevel = 'high'
  else if (cappedScore >= 20) riskLevel = 'suspicious'

  const recommendations: string[] = []
  if (riskLevel === 'safe') {
    recommendations.push('No significant threats detected, but always be cautious online.')
    recommendations.push('Never share passwords or OTPs, even if a message seems legitimate.')
  } else {
    if (flags.some(f => f.includes('password') || f.includes('OTP') || f.includes('card'))) {
      recommendations.push('Do not share any financial or account information.')
    }
    recommendations.push('Do not click any links in this message.')
    recommendations.push('Report this to the platform (block/report).')
    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Consider reporting to cybercrime.gov.in or calling 1930.')
      recommendations.push('Save this message as evidence before deleting.')
    }
  }

  const explanations: Record<RiskLevel, string> = {
    safe: 'This content appears safe. No major threat patterns detected. Stay alert online.',
    suspicious: 'This content has some suspicious patterns. Be cautious and verify the sender through official channels.',
    high: 'This content contains multiple high-risk patterns consistent with phishing, scams, or harassment. Do not engage.',
    critical: 'This content is highly likely to be malicious — a phishing attempt, scam, or harassment. Take immediate protective action.',
  }

  return {
    riskLevel,
    score: cappedScore,
    flags: flags.length ? flags : ['No specific threat patterns detected'],
    explanation: explanations[riskLevel],
    recommendations,
  }
}

const riskConfig = {
  safe: { label: 'Safe', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/50', badge: 'badge-teal', icon: Shield },
  suspicious: { label: 'Suspicious', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50', badge: 'badge-gray', icon: AlertTriangle },
  high: { label: 'High Risk', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50', badge: 'badge-red', icon: AlertTriangle },
  critical: { label: 'Critical Threat', color: 'text-emergency-600 dark:text-emergency-400', bg: 'bg-emergency-50 dark:bg-emergency-950/30 border-emergency-200 dark:border-emergency-800/50', badge: 'badge-red', icon: AlertTriangle },
}

export default function DigitalShieldPage() {
  const [input, setInput] = useState('')
  const [type, setType] = useState<'message' | 'url' | 'email' | 'social'>('message')
  const [result, setResult] = useState<ThreatAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<ThreatAnalysis[]>([])
  const { addActivity } = useAuth()
  const navigate = useNavigate()

  const analyze = async () => {
    if (!input.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500)) // Simulate AI analysis delay
    const analysisResult = analyzeContent(input, type)
    const analysis: ThreatAnalysis = {
      id: generateId(),
      content: input,
      type,
      analyzedAt: new Date(),
      result: analysisResult,
    }
    setResult(analysis)
    setHistory(prev => [analysis, ...prev].slice(0, 10))
    addActivity({
      type: 'analysis',
      title: 'Threat Analysis Complete',
      description: `${type} analyzed — Risk: ${analysisResult.riskLevel.toUpperCase()}`,
      timestamp: new Date(),
      status: analysisResult.riskLevel === 'safe' ? 'success' : analysisResult.riskLevel === 'suspicious' ? 'warning' : 'danger',
    })
    setLoading(false)
  }

  const risk = result ? riskConfig[result.result.riskLevel] : null

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Digital Shield</h1>
          <p className="text-sm text-[--text-secondary]">AI-powered threat analysis for messages and links</p>
        </div>
      </div>


      {/* Analysis form */}
      <div className="card p-6 space-y-5 mb-6">
        <h2 className="font-display font-bold text-[--text-primary]">Analyze Content</h2>

        {/* Type selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {analysisTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              id={`type-${t.id}`}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                type === t.id
                  ? 'bg-violet-600 text-white border-violet-600 shadow-glow-violet/30'
                  : 'border-[--border] text-[--text-secondary] hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-700'
              )}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="input-label">Paste the content to analyze</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input min-h-[120px] resize-none"
            placeholder={
              type === 'url' ? 'Paste a URL or link here...' :
              type === 'email' ? 'Paste the email content here...' :
              'Paste the message or post content here...'
            }
            id="threat-input"
          />
        </div>

        <button
          onClick={analyze}
          disabled={!input.trim() || loading}
          className="btn-primary w-full"
          id="analyze-btn"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
          ) : (
            <><Bot className="w-4 h-4" /> Analyze with AI</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && risk && (
        <div className={cn('card border p-6 space-y-5 mb-6 animate-slide-up', risk.bg)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Risk Assessment</p>
              <div className="flex items-center gap-2 mt-1">
                <risk.icon className={cn('w-5 h-5', risk.color)} />
                <h3 className={cn('text-xl font-display font-bold', risk.color)}>{risk.label}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[--text-muted]">Risk Score</p>
              <p className={cn('text-3xl font-display font-black', risk.color)}>{result.result.score}</p>
              <p className="text-xs text-[--text-muted]">out of 100</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="progress-bar">
            <div
              className={cn('h-full rounded-full transition-all duration-700', {
                'bg-teal-500': result.result.riskLevel === 'safe',
                'bg-amber-500': result.result.riskLevel === 'suspicious',
                'bg-orange-500': result.result.riskLevel === 'high',
                'bg-emergency-600': result.result.riskLevel === 'critical',
              })}
              style={{ width: `${result.result.score}%` }}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[--text-primary] mb-1">Analysis Summary</p>
            <p className="text-sm text-[--text-secondary]">{result.result.explanation}</p>
          </div>

          {/* Flags */}
          {result.result.flags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[--text-primary] mb-2">Detected Patterns</p>
              <ul className="space-y-1.5">
                {result.result.flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[--text-secondary]">
                    <AlertTriangle className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', risk.color)} />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <p className="text-sm font-medium text-[--text-primary] mb-2">Recommendations</p>
            <ul className="space-y-1.5">
              {result.result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[--text-secondary]">
                  <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-600" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.result.riskLevel !== 'safe' && (
            <div className="flex gap-3 pt-2">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-sm py-2"
              >
                <ExternalLink className="w-4 h-4" /> Report to Cybercrime
              </a>
              <button onClick={() => navigate('/evidence-vault')} className="btn-ghost flex-1 text-sm py-2">
                <History className="w-4 h-4" /> Save as Evidence
              </button>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-[--border]">
            <h2 className="font-display font-semibold text-[--text-primary] flex items-center gap-2">
              <History className="w-4 h-4 text-violet-600" /> Analysis History
            </h2>
          </div>
          <div className="divide-y divide-[--border]">
            {history.map(h => {
              const rc = riskConfig[h.result.riskLevel]
              return (
                <button
                  key={h.id}
                  onClick={() => setResult(h)}
                  className="w-full flex items-start gap-3 px-6 py-4 hover:bg-[--bg-secondary] transition-colors text-left"
                >
                  <rc.icon className={cn('w-4 h-4 shrink-0 mt-0.5', rc.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--text-primary] truncate">{h.content.slice(0, 60)}{h.content.length > 60 ? '…' : ''}</p>
                    <p className="text-xs text-[--text-muted] mt-0.5">{h.type} · {formatRelativeTime(h.analyzedAt)}</p>
                  </div>
                  <span className={cn(rc.badge, 'text-xs shrink-0')}>{rc.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
