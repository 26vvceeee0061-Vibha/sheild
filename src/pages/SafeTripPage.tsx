import React, { useState, useEffect } from 'react'
import { Map, Plus, Clock, MapPin, Check, ChevronLeft, X, Play, StopCircle, Bell, Users, AlertTriangle, Timer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn, formatTime, generateId } from '@/lib/utils'
import type { SafeTrip } from '@/types'

const DEMO_TRIPS: SafeTrip[] = [
  {
    id: 't1',
    name: 'Work to Home',
    origin: 'Hitech City, Hyderabad',
    destination: 'Kondapur, Hyderabad',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    estimatedArrival: new Date(Date.now() - 90 * 60 * 1000),
    actualArrival: new Date(Date.now() - 90 * 60 * 1000),
    status: 'completed',
    checkInInterval: 15,
    shareWith: [],
    notes: '',
  },
]

function TripCard({ trip, onCheckIn, onEnd }: { trip: SafeTrip; onCheckIn?: () => void; onEnd?: () => void }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (trip.status !== 'active' || !trip.nextCheckIn) return
    const update = () => {
      const diff = new Date(trip.nextCheckIn!).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Check in now!'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [trip])

  const statusColors = {
    active: 'badge-teal',
    completed: 'badge-gray',
    missed: 'badge-red',
    cancelled: 'badge-gray',
  }

  return (
    <div className={cn('card p-5 space-y-4', trip.status === 'active' && 'border-teal-300 dark:border-teal-700')}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-[--text-primary]">{trip.name}</h3>
          <p className="text-xs text-[--text-muted] mt-0.5">{formatTime(new Date(trip.startedAt))}</p>
        </div>
        <span className={statusColors[trip.status]}>
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-teal-500 mt-0.5 shrink-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </div>
          <p className="text-sm text-[--text-secondary]">{trip.origin}</p>
        </div>
        <div className="w-px h-4 bg-[--border] ml-2" />
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <p className="text-sm text-[--text-secondary]">{trip.destination}</p>
        </div>
      </div>

      {trip.status === 'active' && trip.nextCheckIn && (
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Next check-in in</span>
            </div>
            <span className="font-display font-bold text-teal-700 dark:text-teal-300 text-lg">{timeLeft}</span>
          </div>
        </div>
      )}

      {trip.status === 'active' && (
        <div className="flex gap-2">
          <button onClick={onCheckIn} className="btn-teal flex-1 py-2 text-sm" id={`checkin-${trip.id}`}>
            <Check className="w-4 h-4" /> I'm Safe
          </button>
          <button onClick={onEnd} className="btn-ghost flex-1 py-2 text-sm text-emergency-600 hover:bg-emergency-50 dark:hover:bg-emergency-950/30" id={`end-trip-${trip.id}`}>
            <StopCircle className="w-4 h-4" /> End Trip
          </button>
        </div>
      )}
    </div>
  )
}

export default function SafeTripPage() {
  const [trips, setTrips] = useState<SafeTrip[]>(DEMO_TRIPS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    origin: '',
    destination: '',
    interval: 15,
    eta: '',
  })
  const { contacts, addActivity } = useAuth()
  const navigate = useNavigate()

  const activeTrip = trips.find(t => t.status === 'active')

  const startTrip = () => {
    if (!form.origin || !form.destination) return
    const now = new Date()
    const newTrip: SafeTrip = {
      id: generateId(),
      name: form.name || `${form.origin} → ${form.destination}`,
      origin: form.origin,
      destination: form.destination,
      startedAt: now,
      estimatedArrival: form.eta ? new Date(form.eta) : new Date(now.getTime() + 60 * 60 * 1000),
      status: 'active',
      checkInInterval: form.interval,
      nextCheckIn: new Date(now.getTime() + form.interval * 60 * 1000),
      shareWith: contacts.filter(c => c.notifyOnTrip).map(c => c.id),
    }
    setTrips(prev => [newTrip, ...prev])
    addActivity({
      type: 'trip',
      title: 'Safe Trip Started',
      description: `Trip to ${form.destination} started. Check-in every ${form.interval} minutes.`,
      timestamp: new Date(),
      status: 'info',
    })
    setShowForm(false)
    setForm({ name: '', origin: '', destination: '', interval: 15, eta: '' })
  }

  const handleCheckIn = (tripId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t
      return {
        ...t,
        lastCheckIn: new Date(),
        nextCheckIn: new Date(Date.now() + t.checkInInterval * 60 * 1000),
      }
    }))
    addActivity({
      type: 'check_in',
      title: 'Safe Check-in',
      description: 'You checked in safely during your trip.',
      timestamp: new Date(),
      status: 'success',
    })
  }

  const handleEndTrip = (tripId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'completed', actualArrival: new Date() } : t))
    addActivity({
      type: 'trip',
      title: 'Trip Completed',
      description: 'Safe Trip ended successfully.',
      timestamp: new Date(),
      status: 'success',
    })
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Safe Trip</h1>
          <p className="text-sm text-[--text-secondary]">Share your journey and check in safely</p>
        </div>
        {!activeTrip && (
          <button onClick={() => setShowForm(v => !v)} className="btn-teal" id="start-trip-btn">
            <Play className="w-4 h-4" /> Start Trip
          </button>
        )}
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: MapPin, label: 'Enter route', color: 'text-violet-600' },
          { icon: Clock, label: 'Set check-in interval', color: 'text-teal-600' },
          { icon: Bell, label: 'Contacts notified if missed', color: 'text-emergency-600' },
        ].map(item => (
          <div key={item.label} className="card p-4 text-center">
            <item.icon className={cn('w-5 h-5 mx-auto mb-2', item.color)} />
            <p className="text-xs text-[--text-secondary]">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Trip form */}
      {showForm && (
        <div className="card p-6 mb-6 animate-slide-down space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[--text-primary]">New Safe Trip</h3>
            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
              <X className="w-4 h-4 text-[--text-muted]" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="input-label">Trip name (optional)</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. Work to Home" id="trip-name" />
            </div>
            <div>
              <label className="input-label">Check-in interval</label>
              <select value={form.interval} onChange={e => setForm(f => ({ ...f, interval: +e.target.value }))} className="input" id="trip-interval">
                {[5, 10, 15, 20, 30, 45, 60].map(n => (
                  <option key={n} value={n}>Every {n} minutes</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Starting from *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                <input type="text" value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} className="input pl-10" placeholder="Your current location" id="trip-origin" />
              </div>
            </div>
            <div>
              <label className="input-label">Going to *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600" />
                <input type="text" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} className="input pl-10" placeholder="Your destination" id="trip-destination" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Estimated arrival (optional)</label>
              <input type="datetime-local" value={form.eta} onChange={e => setForm(f => ({ ...f, eta: e.target.value }))} className="input" id="trip-eta" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-xs text-violet-700 dark:text-violet-300 flex items-start gap-2">
            <Users className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {contacts.filter(c => c.notifyOnTrip).length} contact(s) will be notified if you miss a check-in.
            </span>
          </div>

          <button onClick={startTrip} className="btn-teal w-full" id="confirm-trip-btn">
            <Play className="w-4 h-4" /> Start Safe Trip
          </button>
        </div>
      )}

      {/* Active trip */}
      {activeTrip && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="status-safe" /> Active Trip
          </h2>
          <TripCard
            trip={activeTrip}
            onCheckIn={() => handleCheckIn(activeTrip.id)}
            onEnd={() => handleEndTrip(activeTrip.id)}
          />
        </div>
      )}

      {/* Past trips */}
      <div>
        <h2 className="section-title mb-3">Past Trips</h2>
        <div className="space-y-3">
          {trips.filter(t => t.status !== 'active').map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          {trips.filter(t => t.status !== 'active').length === 0 && (
            <div className="card p-8 text-center">
              <Map className="w-10 h-10 text-[--text-muted] mx-auto mb-3" />
              <p className="text-sm text-[--text-muted]">No past trips yet. Start your first Safe Trip!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
