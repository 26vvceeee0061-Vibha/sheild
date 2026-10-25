import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, X, MapPin, Phone, Check, Loader2, Users,
  RefreshCw, ChevronLeft, Shield, Clock, Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn, formatTime } from '@/lib/utils'
import type { SOSAlert } from '@/types'

const COUNTDOWN_SECONDS = 5

export default function SOSPage() {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'locating' | 'sending' | 'sent' | 'cancelled'>('ready')
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [alert, setAlert] = useState<SOSAlert | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [locationError, setLocationError] = useState('')
  const [shareLocation, setShareLocation] = useState(true)
  const [customMessage, setCustomMessage] = useState('')
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { user, contacts, triggerSOS, cancelSOS, activeAlerts } = useAuth()
  const navigate = useNavigate()

  const sosContacts = contacts.filter(c => c.notifyOnSOS)

  useEffect(() => {
    setCustomMessage(user?.emergencyMessage || 'I need assistance. Please contact me as soon as possible.')
  }, [user])

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [])

  const requestLocation = (): Promise<{ lat: number; lng: number; address?: string } | null> => {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser.')
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          setLocationError('Location access denied or unavailable. Alert will be sent without location.')
          resolve(null)
        },
        { timeout: 8000, maximumAge: 30000 }
      )
    })
  }

  const startCountdown = () => {
    setPhase('countdown')
    setCountdown(COUNTDOWN_SECONDS)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          handleActivate()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleActivate = async () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    setPhase('locating')
    let loc = null
    if (shareLocation) {
      loc = await requestLocation()
    }
    setLocation(loc)
    setPhase('sending')
    const sentAlert = await triggerSOS({
      locationShared: !!loc,
      location: loc || undefined,
    })
    setAlert(sentAlert)
    setPhase('sent')
  }

  const handleCancel = async () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (alert) await cancelSOS(alert.id)
    setPhase('cancelled')
    setTimeout(() => setPhase('ready'), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Emergency SOS</h1>
          <p className="text-sm text-[--text-secondary]">Alert your trusted contacts immediately</p>
        </div>
      </div>


      <div className="space-y-4">
        {/* Main SOS Card */}
        <div className="card overflow-hidden">
          {/* Phase: Ready */}
          {phase === 'ready' && (
            <div className="p-8 flex flex-col items-center gap-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emergency-500/20 animate-ping scale-125" />
                <button
                  onClick={startCountdown}
                  id="sos-activate-btn"
                  className="relative w-44 h-44 rounded-full bg-gradient-to-br from-emergency-500 to-emergency-700 text-white flex flex-col items-center justify-center gap-2 shadow-sos hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emergency-300"
                >
                  <Phone className="w-10 h-10 fill-white/30" />
                  <span className="font-display font-black text-3xl">SOS</span>
                  <span className="text-xs opacity-80">Tap to Activate</span>
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-[--text-primary]">
                  {COUNTDOWN_SECONDS}-second cancellation window
                </p>
                <p className="text-xs text-[--text-muted] mt-1">
                  You can cancel the alert during the countdown
                </p>
              </div>
            </div>
          )}

          {/* Phase: Countdown */}
          {phase === 'countdown' && (
            <div className="p-8 flex flex-col items-center gap-6 text-center bg-emergency-50/50 dark:bg-emergency-950/20">
              <div className="w-32 h-32 rounded-full bg-emergency-600 flex items-center justify-center shadow-sos animate-pulse">
                <span className="font-display font-black text-6xl text-white">{countdown}</span>
              </div>
              <div>
                <p className="text-lg font-display font-bold text-emergency-700 dark:text-emergency-400">
                  Sending SOS in {countdown}s…
                </p>
                <p className="text-sm text-[--text-secondary] mt-1">
                  Alerting {sosContacts.length} contact{sosContacts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={handleCancel}
                id="sos-cancel-countdown-btn"
                className="btn-secondary gap-2 text-emergency-600 border-emergency-200 hover:bg-emergency-50"
              >
                <X className="w-4 h-4" /> Cancel Alert
              </button>
            </div>
          )}

          {/* Phase: Locating */}
          {phase === 'locating' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
              <p className="font-semibold text-[--text-primary]">Getting your location…</p>
              <p className="text-sm text-[--text-muted]">This helps your contacts find you faster</p>
            </div>
          )}

          {/* Phase: Sending */}
          {phase === 'sending' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <Loader2 className="w-12 h-12 text-emergency-600 animate-spin" />
              <p className="font-semibold text-[--text-primary]">Sending emergency alert…</p>
              <p className="text-sm text-[--text-muted]">Notifying your trusted contacts</p>
            </div>
          )}

          {/* Phase: Sent */}
          {phase === 'sent' && alert && (
            <div className="p-8 flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center">
                <Check className="w-10 h-10 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-[--text-primary]">Alert Sent!</p>
                <p className="text-sm text-[--text-secondary] mt-1">
                  Your contacts have been notified at {formatTime(new Date(alert.triggeredAt))}.
                </p>
                {alert.locationShared && location && (
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-teal-600 dark:text-teal-400">
                    <MapPin className="w-4 h-4" />
                    <span>Location included: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                  </div>
                )}
                {locationError && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{locationError}</p>
                )}
              </div>

              {/* Contacts notified */}
              <div className="w-full space-y-2">
                {sosContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[--bg-secondary]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">{contact.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[--text-primary]">{contact.name}</p>
                        <p className="text-xs text-[--text-muted]">{contact.phone}</p>
                      </div>
                    </div>
                    <span className="badge-teal text-xs">Notified</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 w-full">
                <button onClick={handleCancel} className="btn-ghost flex-1">
                  <X className="w-4 h-4" /> Cancel Alert
                </button>
                <button onClick={() => setPhase('ready')} className="btn-secondary flex-1">
                  <RefreshCw className="w-4 h-4" /> Done
                </button>
              </div>
            </div>
          )}

          {/* Phase: Cancelled */}
          {phase === 'cancelled' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-8 h-8 text-gray-500" />
              </div>
              <p className="font-semibold text-[--text-primary]">Alert Cancelled</p>
              <p className="text-sm text-[--text-muted]">No contacts were notified. You are safe.</p>
            </div>
          )}
        </div>

        {/* Settings */}
        {(phase === 'ready') && (
          <>
            {/* Location toggle */}
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[--text-primary]">Include location</p>
                    <p className="text-xs text-[--text-muted]">Share your GPS location with contacts</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShareLocation(v => !v)}
                  id="location-toggle"
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors duration-200',
                    shareLocation ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 m-0.5',
                    shareLocation ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </button>
              </div>
            </div>

            {/* Contacts being notified */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[--text-primary] mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" />
                Contacts to be notified ({sosContacts.length})
              </h3>
              {sosContacts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-[--text-muted] mb-2">No contacts configured for SOS.</p>
                  <button onClick={() => navigate('/contacts')} className="btn-secondary text-xs px-4 py-2">
                    Add Contacts
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {sosContacts.map(contact => (
                    <div key={contact.id} className="flex items-center gap-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">{contact.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[--text-primary]">{contact.name}</p>
                        <p className="text-xs text-[--text-muted]">{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message preview */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[--text-primary] mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-violet-600" />
                Emergency Message
              </h3>
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                className="input min-h-[80px] resize-none text-sm"
                id="sos-custom-message"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
