import React, { useState, useEffect, useRef } from 'react'
import {
  HeartHandshake, Bot, Users, MapPin, ChevronLeft,
  Mic, MicOff, Video, VideoOff, Phone, PhoneOff,
  Send, Shield, Star, Clock, CheckCircle, AlertTriangle,
  Navigation, UserCheck, Loader2, Volume2, MessageCircle, Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn, generateId } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

// ─── Types ──────────────────────────────────────────────
type Mode = 'home' | 'ai-chat' | 'guardian' | 'journey'
type GuardianStatus = 'available' | 'busy' | 'connecting' | 'connected'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: Date
}

interface Guardian {
  id: string
  name: string
  initials: string
  rating: number
  sessions: number
  languages: string[]
  status: GuardianStatus
  distance: string
  responseTime: string
  verified: boolean
  specializations: string[]
}

interface JourneyUser {
  id: string
  name: string
  initials: string
  distance: string
  mode: 'virtual' | 'physical'
  rating: number
  verified: boolean
}

// ─── Demo data ───────────────────────────────────────────
const GUARDIANS: Guardian[] = [
  { id: 'g1', name: 'Ananya S.', initials: 'AS', rating: 4.9, sessions: 312, languages: ['English', 'Hindi', 'Kannada'], status: 'available', distance: '0.4 km', responseTime: '< 1 min', verified: true, specializations: ['Night safety', 'Transit'] },
  { id: 'g2', name: 'Meera R.', initials: 'MR', rating: 4.8, sessions: 189, languages: ['English', 'Telugu'], status: 'available', distance: '1.2 km', responseTime: '< 2 min', verified: true, specializations: ['Harassment', 'Workplace'] },
  { id: 'g3', name: 'Preethi K.', initials: 'PK', rating: 5.0, sessions: 421, languages: ['English', 'Tamil', 'Hindi'], status: 'busy', distance: '2.1 km', responseTime: '< 5 min', verified: true, specializations: ['Crisis support', 'Legal guidance'] },
]

const JOURNEY_USERS: JourneyUser[] = [
  { id: 'j1', name: 'Kavya M.', initials: 'KM', distance: '200 m', mode: 'physical', rating: 4.9, verified: true },
  { id: 'j2', name: 'Sneha T.', initials: 'ST', distance: '650 m', mode: 'virtual', rating: 4.7, verified: true },
  { id: 'j3', name: 'Divya P.', initials: 'DP', distance: '1.1 km', mode: 'virtual', rating: 4.8, verified: true },
]

// ─── AI Companion responses ──────────────────────────────
const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hi! I'm your SHEild AI companion. I'm here with you. Are you currently walking somewhere or do you need immediate support?",
    "Hello! I'm right here with you. Tell me what's going on — are you feeling unsafe right now?",
  ],
  unsafe: [
    "I hear you. Stay calm — I'm with you. Can you tell me where you are right now? Are you near any shops, a police station, or a crowded area?",
    "Your safety is the priority. Let's figure this out together. Are you moving or are you in one place right now?",
  ],
  location: [
    "Good. Keep moving toward well-lit, crowded places. If you feel followed, enter the nearest shop and stay there. Want me to alert your emergency contacts?",
    "Got it. Head toward the nearest crowded area — a restaurant, mall, or petrol station. I can trigger your SOS if you need. Just say 'send SOS'.",
  ],
  sos: [
    "🚨 I'm alerting your trusted contacts now. Stay on this chat. You are not alone.",
  ],
  safe: [
    "I'm really glad you're safe! 💜 You can end this session anytime. Is there anything else I can help you with?",
    "That's great news! Remember, your SOS contacts are always ready and this companion is always available. Stay safe!",
  ],
  default: [
    "I'm right here with you. Keep talking to me — tell me more about your situation.",
    "You're doing well. What else can you share about where you are or what's happening?",
    "Stay calm, I'm listening. Would you like me to alert your emergency contacts or help you find a safe place nearby?",
    "I understand. Keep moving if you can, stay in well-lit areas, and talk to me. Do you want me to trigger SOS?",
  ],
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('sos') || lower.includes('help') || lower.includes('danger') || lower.includes('scared')) {
    return AI_RESPONSES.unsafe[Math.floor(Math.random() * AI_RESPONSES.unsafe.length)]
  }
  if (lower.includes('safe') || lower.includes('home') || lower.includes('ok') || lower.includes('fine')) {
    return AI_RESPONSES.safe[Math.floor(Math.random() * AI_RESPONSES.safe.length)]
  }
  if (lower.includes('location') || lower.includes('near') || lower.includes('street') || lower.includes('walking')) {
    return AI_RESPONSES.location[Math.floor(Math.random() * AI_RESPONSES.location.length)]
  }
  if (lower.includes('send sos') || lower.includes('alert')) {
    return AI_RESPONSES.sos[0]
  }
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)]
}

// ─── Sub-components ──────────────────────────────────────

function AIModeIcon({ active }: { active: boolean }) {
  return (
    <div className={cn(
      'w-14 h-14 rounded-2xl flex items-center justify-center transition-all',
      active ? 'bg-violet-600 shadow-glow-violet' : 'bg-violet-100 dark:bg-violet-950/50'
    )}>
      <Bot className={cn('w-7 h-7', active ? 'text-white' : 'text-violet-600 dark:text-violet-400')} />
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn('w-3 h-3', i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300')} />
      ))}
      <span className="text-xs text-[--text-muted] ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── AI Chat Mode ────────────────────────────────────────
function AICompanionChat({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'ai', text: AI_RESPONSES.greeting[0], timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setSessionTime(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const sendMessage = async () => {
    if (!input.trim() || thinking) return
    const userMsg: ChatMessage = { id: generateId(), role: 'user', text: input.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input.trim()
    setInput('')
    setThinking(true)

    // Check for SOS trigger
    if (currentInput.toLowerCase().includes('send sos') || currentInput.toLowerCase().includes('trigger sos')) {
      navigate('/sos')
      return
    }

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
    const aiMsg: ChatMessage = { id: generateId(), role: 'ai', text: getAIResponse(currentInput), timestamp: new Date() }
    setMessages(prev => [...prev, aiMsg])
    setThinking(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl mb-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">SHEild AI Companion</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs text-violet-200">Active · {formatTime(sessionTime)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(m => !m)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency quick-actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => navigate('/sos')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emergency-600 text-white text-sm font-semibold hover:bg-emergency-700 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" /> Trigger SOS
        </button>
        <button
          onClick={() => { setInput("I'm safe now, heading home.") }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" /> I'm Safe
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
            )}
            <div className={cn(
              'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
              msg.role === 'ai'
                ? 'bg-[--bg-secondary] text-[--text-primary] rounded-tl-sm'
                : 'bg-violet-600 text-white rounded-tr-sm'
            )}>
              {msg.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="bg-[--bg-secondary] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="input pr-12 w-full"
            placeholder="Tell me what's happening…"
            id="ai-companion-input"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || thinking}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-violet-600 text-white disabled:opacity-40 hover:bg-violet-700 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="p-3 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 hover:bg-violet-200 transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ─── Guardian Network Mode ───────────────────────────────
function GuardianNetwork() {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connected, setConnected] = useState<string | null>(null)
  const [callTime, setCallTime] = useState(0)

  useEffect(() => {
    if (!connected) return
    const t = setInterval(() => setCallTime(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [connected])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const connect = async (guardianId: string) => {
    setConnecting(guardianId)
    await new Promise(r => setTimeout(r, 2500))
    setConnecting(null)
    setConnected(guardianId)
    setCallTime(0)
  }

  const disconnect = () => {
    setConnected(null)
    setCallTime(0)
  }

  const activeGuardian = GUARDIANS.find(g => g.id === connected)

  if (connected && activeGuardian) {
    return (
      <div className="space-y-4">
        {/* Active call UI */}
        <div className="card p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-teal-200 dark:border-teal-800/50 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">{activeGuardian.initials}</span>
          </div>
          <p className="font-display font-bold text-xl text-[--text-primary]">{activeGuardian.name}</p>
          <p className="text-sm text-teal-600 dark:text-teal-400 mt-0.5">Verified Guardian · {activeGuardian.distance} away</p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Connected · {formatTime(callTime)}</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="p-4 rounded-full bg-white dark:bg-black/20 border border-[--border] shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <Mic className="w-5 h-5 text-[--text-primary]" />
            </button>
            <button className="p-4 rounded-full bg-white dark:bg-black/20 border border-[--border] shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <Video className="w-5 h-5 text-[--text-primary]" />
            </button>
            <button onClick={disconnect} className="p-4 rounded-full bg-emergency-600 text-white shadow-lg hover:bg-emergency-700 transition-colors">
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-xs text-[--text-muted] text-center">
            🔒 This call is end-to-end encrypted. Your guardian will stay on the line until you reach safety.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        <p className="text-sm text-[--text-muted]">{GUARDIANS.filter(g => g.status === 'available').length} guardians available nearby</p>
      </div>

      {GUARDIANS.map(guardian => (
        <div key={guardian.id} className="card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{guardian.initials}</span>
                </div>
                <span className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[--bg-primary]',
                  guardian.status === 'available' ? 'bg-teal-500' : 'bg-amber-400'
                )} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-[--text-primary] text-sm">{guardian.name}</p>
                  {guardian.verified && <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                </div>
                <StarRating rating={guardian.rating} />
              </div>
            </div>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              guardian.status === 'available'
                ? 'bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
            )}>
              {guardian.status === 'available' ? 'Available' : 'Busy'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {guardian.specializations.map(s => (
              <span key={s} className="badge-violet text-xs">{s}</span>
            ))}
            {guardian.languages.map(l => (
              <span key={l} className="badge-gray text-xs">{l}</span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[--text-muted]">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{guardian.distance}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Responds {guardian.responseTime}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{guardian.sessions} sessions</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => connect(guardian.id)}
              disabled={guardian.status !== 'available' || !!connecting}
              className={cn('flex-1 btn-primary text-sm py-2', guardian.status !== 'available' && 'opacity-40 cursor-not-allowed')}
              id={`connect-guardian-${guardian.id}`}
            >
              {connecting === guardian.id
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</>
                : <><Phone className="w-4 h-4" /> Audio Call</>
              }
            </button>
            <button
              disabled={guardian.status !== 'available' || !!connecting}
              className={cn('px-4 py-2 rounded-xl border border-[--border] text-sm font-medium text-[--text-secondary] hover:bg-[--bg-secondary] transition-colors', guardian.status !== 'available' && 'opacity-40 cursor-not-allowed')}
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Shared Journey Mode ─────────────────────────────────
function SharedJourney() {
  const [requesting, setRequesting] = useState<string | null>(null)
  const [requested, setRequested] = useState<string | null>(null)
  const [destination, setDestination] = useState('')

  const requestJourney = async (userId: string) => {
    setRequesting(userId)
    await new Promise(r => setTimeout(r, 2000))
    setRequesting(null)
    setRequested(userId)
  }

  const activeUser = JOURNEY_USERS.find(u => u.id === requested)

  return (
    <div className="space-y-5">
      {/* Destination input */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-[--text-primary] flex items-center gap-2">
          <Navigation className="w-4 h-4 text-violet-600" /> Where are you heading?
        </h3>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="input pl-10"
            placeholder="Enter your destination…"
            id="journey-destination"
          />
        </div>
      </div>

      {/* Active journey */}
      {requested && activeUser && (
        <div className="card p-5 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{activeUser.initials}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[--text-primary]">{activeUser.name}</p>
              <p className="text-sm text-teal-600 dark:text-teal-400">
                {activeUser.mode === 'physical' ? '🚶 Physically accompanying you' : '📱 Virtually watching over you'}
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 btn-secondary text-sm py-2">
              <MessageCircle className="w-4 h-4" /> Message
            </button>
            <button onClick={() => setRequested(null)} className="flex-1 btn-ghost text-sm py-2 text-emergency-600">
              <PhoneOff className="w-4 h-4" /> End Journey
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-[--text-primary] mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-600" /> Nearby verified companions
        </p>
        <div className="space-y-3">
          {JOURNEY_USERS.map(jUser => (
            <div key={jUser.id} className="card p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">{jUser.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-[--text-primary]">{jUser.name}</p>
                  {jUser.verified && <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-[--text-muted] mt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{jUser.distance}</span>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded-full font-medium',
                    jUser.mode === 'physical'
                      ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                      : 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                  )}>
                    {jUser.mode === 'physical' ? '🚶 Physical' : '📱 Virtual'}
                  </span>
                </div>
                <StarRating rating={jUser.rating} />
              </div>
              <button
                onClick={() => requestJourney(jUser.id)}
                disabled={!!requesting || !!requested}
                className="btn-primary text-xs px-4 py-2 shrink-0"
                id={`request-journey-${jUser.id}`}
              >
                {requesting === jUser.id
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : requested === jUser.id ? 'Active' : 'Request'
                }
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-violet-50/50 dark:bg-violet-950/20">
        <p className="text-xs text-[--text-muted] leading-relaxed">
          <Shield className="w-3.5 h-3.5 inline mr-1 text-violet-600" />
          All companions are identity-verified female volunteers. Your location is only shared for the duration of the journey.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────
export default function VirtualCompanionPage() {
  const [mode, setMode] = useState<Mode>('home')
  const navigate = useNavigate()
  const { user } = useAuth()

  if (mode === 'ai-chat') {
    return (
      <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setMode('home')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
          </button>
          <h1 className="text-xl font-display font-bold text-[--text-primary]">AI Companion</h1>
        </div>
        <AICompanionChat onBack={() => setMode('home')} />
      </div>
    )
  }

  if (mode === 'guardian') {
    return (
      <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('home')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-[--text-primary]">Guardian Network</h1>
            <p className="text-sm text-[--text-secondary]">Connect with a verified female volunteer</p>
          </div>
        </div>
        <GuardianNetwork />
      </div>
    )
  }

  if (mode === 'journey') {
    return (
      <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('home')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-[--text-primary]">Shared Journey</h1>
            <p className="text-sm text-[--text-secondary]">Get a companion for your walk or commute</p>
          </div>
        </div>
        <SharedJourney />
      </div>
    )
  }

  // Home / mode picker
  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Virtual Companion</h1>
          <p className="text-sm text-[--text-secondary]">You are never alone — choose your support mode</p>
        </div>
      </div>

      {/* Hero banner */}
      <div className="card p-6 mb-6 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-6 -translate-x-6" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-lg">Guardian Network</p>
              <p className="text-violet-200 text-sm">3 volunteers available nearby</p>
            </div>
          </div>
          <p className="text-violet-100 text-sm leading-relaxed">
            Connect instantly with trained female volunteers or our AI companion. They'll stay with you until you're safe.
          </p>
        </div>
      </div>

      {/* Mode cards */}
      <div className="space-y-4">
        {/* AI Companion */}
        <button
          onClick={() => setMode('ai-chat')}
          id="start-ai-companion"
          className="card-hover w-full p-5 text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0 group-hover:bg-violet-600 transition-colors">
              <Bot className="w-7 h-7 text-violet-600 dark:text-violet-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display font-bold text-[--text-primary]">AI Companion</p>
                <span className="badge-violet text-xs">Always on</span>
              </div>
              <p className="text-sm text-[--text-muted] leading-relaxed">
                Chat naturally with our AI — it gives situational prompts, keeps you calm, and escalates to SOS when needed.
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[--text-muted]">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-violet-500" /> Instant</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Text & voice</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SOS escalation</span>
              </div>
            </div>
          </div>
        </button>

        {/* Guardian Network */}
        <button
          onClick={() => setMode('guardian')}
          id="start-guardian-network"
          className="card-hover w-full p-5 text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
              <Users className="w-7 h-7 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display font-bold text-[--text-primary]">Guardian Network</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> 3 online
                </span>
              </div>
              <p className="text-sm text-[--text-muted] leading-relaxed">
                Audio or video call a trained, verified female volunteer who stays on the line until you reach safety.
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[--text-muted]">
                <span className="flex items-center gap-1"><UserCheck className="w-3 h-3 text-teal-500" /> Verified</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Audio / Video</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9 avg</span>
              </div>
            </div>
          </div>
        </button>

        {/* Shared Journey */}
        <button
          onClick={() => setMode('journey')}
          id="start-shared-journey"
          className="card-hover w-full p-5 text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors">
              <Navigation className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display font-bold text-[--text-primary]">Shared Journey</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium">New</span>
              </div>
              <p className="text-sm text-[--text-muted] leading-relaxed">
                Request a nearby verified user to virtually or physically accompany you for short distances.
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[--text-muted]">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> Nearby match</span>
                <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> Physical or virtual</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Safety note */}
      <div className="mt-6 card p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40">
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          <Shield className="w-3.5 h-3.5 inline mr-1" />
          All guardians are verified female volunteers trained in safety protocols. Sessions are confidential. For life-threatening emergencies, always call <strong>100</strong>.
        </p>
      </div>
    </div>
  )
}
