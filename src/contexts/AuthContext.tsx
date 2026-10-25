import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { User, TrustedContact, SOSAlert, SafetyActivity } from '@/types'
import { generateId } from '@/lib/utils'
import { isDemoMode } from '@/lib/firebase'
import { sendTelegramSOSToAll } from '@/lib/telegram'

// ────────────────────────────────────────────────
// Demo data
// ────────────────────────────────────────────────
const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@sheild.app',
  displayName: 'Priya Sharma',
  phone: '+91 98765 43210',
  emergencyMessage: 'I need assistance. Please contact me as soon as possible. My last available location is attached.',
  onboardingComplete: true,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
}

const DEMO_CONTACTS: TrustedContact[] = [
  { id: 'c1', name: 'Aarav (Brother)', phone: '+91 99887 76655', relation: 'Family', notifyOnSOS: true, notifyOnTrip: true, createdAt: new Date() },
  { id: 'c2', name: 'Nisha (Best Friend)', phone: '+91 88776 65544', relation: 'Friend', notifyOnSOS: true, notifyOnTrip: false, createdAt: new Date() },
  { id: 'c3', name: 'Mom', phone: '+91 77665 54433', relation: 'Family', notifyOnSOS: true, notifyOnTrip: true, createdAt: new Date() },
]

const DEMO_ACTIVITY: SafetyActivity[] = [
  { id: 'a1', type: 'check_in', title: 'Safe Check-in', description: 'You checked in safely during your trip to HITECH City.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'success' },
  { id: 'a2', type: 'analysis', title: 'Threat Analysis', description: 'Analyzed a suspicious message — flagged as phishing attempt.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'warning' },
  { id: 'a3', type: 'contact', title: 'Contact Added', description: 'Nisha added as a trusted contact.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'info' },
  { id: 'a4', type: 'trip', title: 'Trip Completed', description: 'Safe Trip to MG Road completed successfully.', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), status: 'success' },
]

// ────────────────────────────────────────────────
// Context types
// ────────────────────────────────────────────────
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isDemoMode: boolean
  contacts: TrustedContact[]
  recentActivity: SafetyActivity[]
  activeAlerts: SOSAlert[]
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  addContact: (contact: Omit<TrustedContact, 'id' | 'createdAt'>) => Promise<void>
  removeContact: (id: string) => Promise<void>
  updateContact: (id: string, data: Partial<TrustedContact>) => Promise<void>
  addActivity: (activity: Omit<SafetyActivity, 'id'>) => void
  triggerSOS: (options: { locationShared: boolean; location?: { lat: number; lng: number; address?: string } }) => Promise<SOSAlert>
  cancelSOS: (alertId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contacts, setContacts] = useState<TrustedContact[]>([])
  const [recentActivity, setRecentActivity] = useState<SafetyActivity[]>([])
  const [activeAlerts, setActiveAlerts] = useState<SOSAlert[]>([])

  // Initialize from localStorage in demo mode
  useEffect(() => {
    const stored = localStorage.getItem('sheild_session')
    if (stored) {
      try {
        const session = JSON.parse(stored)
        if (session.user) {
          setUser({ ...session.user, createdAt: new Date(session.user.createdAt) })
          setContacts(session.contacts || DEMO_CONTACTS)
          setRecentActivity((session.activity || DEMO_ACTIVITY).map((a: SafetyActivity) => ({ ...a, timestamp: new Date(a.timestamp) })))
        }
      } catch {}
    }
    setIsLoading(false)
  }, [])

  const saveSession = useCallback((u: User | null, c: TrustedContact[], a: SafetyActivity[]) => {
    if (u) {
      localStorage.setItem('sheild_session', JSON.stringify({ user: u, contacts: c, activity: a }))
    } else {
      localStorage.removeItem('sheild_session')
    }
  }, [])

  const login = async (email: string, _password: string) => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200))
    const u = { ...DEMO_USER, email, displayName: email.split('@')[0] }
    setUser(u)
    setContacts(DEMO_CONTACTS)
    setRecentActivity(DEMO_ACTIVITY)
    saveSession(u, DEMO_CONTACTS, DEMO_ACTIVITY)
    setIsLoading(false)
  }

  const signup = async (email: string, _password: string, name: string) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const u: User = {
      id: generateId(),
      email,
      displayName: name,
      emergencyMessage: 'I need assistance. Please contact me as soon as possible.',
      onboardingComplete: false,
      createdAt: new Date(),
    }
    setUser(u)
    setContacts([])
    setRecentActivity([])
    saveSession(u, [], [])
    setIsLoading(false)
  }

  const logout = async () => {
    await new Promise(r => setTimeout(r, 300))
    setUser(null)
    setContacts([])
    setRecentActivity([])
    setActiveAlerts([])
    localStorage.removeItem('sheild_session')
  }

  const resetPassword = async (email: string) => {
    await new Promise(r => setTimeout(r, 1000))
    console.log(`[DEMO] Password reset email would be sent to ${email}`)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    saveSession(updated, contacts, recentActivity)
  }

  const addContact = async (contact: Omit<TrustedContact, 'id' | 'createdAt'>) => {
    const newContact: TrustedContact = { ...contact, id: generateId(), createdAt: new Date() }
    const updated = [...contacts, newContact]
    setContacts(updated)
    const activity: SafetyActivity = {
      id: generateId(),
      type: 'contact',
      title: 'Contact Added',
      description: `${contact.name} added as a trusted contact.`,
      timestamp: new Date(),
      status: 'info',
    }
    const updatedActivity = [activity, ...recentActivity]
    setRecentActivity(updatedActivity)
    saveSession(user, updated, updatedActivity)
  }

  const removeContact = async (id: string) => {
    const updated = contacts.filter(c => c.id !== id)
    setContacts(updated)
    saveSession(user, updated, recentActivity)
  }

  const updateContact = async (id: string, data: Partial<TrustedContact>) => {
    const updated = contacts.map(c => c.id === id ? { ...c, ...data } : c)
    setContacts(updated)
    saveSession(user, updated, recentActivity)
  }

  const addActivity = useCallback((activity: Omit<SafetyActivity, 'id'>) => {
    const newItem: SafetyActivity = { ...activity, id: generateId() }
    setRecentActivity(prev => {
      const updated = [newItem, ...prev].slice(0, 20)
      if (user) saveSession(user, contacts, updated)
      return updated
    })
  }, [user, contacts, saveSession])

  const triggerSOS = async (options: { locationShared: boolean; location?: { lat: number; lng: number; address?: string } }): Promise<SOSAlert> => {
    const sosContacts = contacts.filter(c => c.notifyOnSOS)
    const alert: SOSAlert = {
      id: generateId(),
      triggeredAt: new Date(),
      status: 'pending',
      contacts: sosContacts.map(c => c.id),
      location: options.location,
      message: user?.emergencyMessage || 'I need assistance. Please contact me as soon as possible.',
      locationShared: options.locationShared,
    }
    setActiveAlerts(prev => [alert, ...prev])

    // Send Telegram notifications to contacts who have a Chat ID linked
    const telegramContacts = sosContacts.filter(c => c.telegramChatId)
    if (telegramContacts.length > 0) {
      const chatIds = telegramContacts.map(c => c.telegramChatId!)
      sendTelegramSOSToAll(chatIds, {
        contactName: '',
        senderName: user?.displayName || 'SHEild User',
        message: alert.message,
        location: options.location,
        triggeredAt: alert.triggeredAt,
      }).catch(err => console.error('[SHEild] Telegram SOS error:', err))
    }

    // Simulate backend processing delay
    await new Promise(r => setTimeout(r, 1500))
    const sent = { ...alert, status: 'sent' as const }
    setActiveAlerts(prev => prev.map(a => a.id === alert.id ? sent : a))

    addActivity({
      type: 'sos',
      title: 'SOS Alert Sent',
      description: `Emergency alert sent to ${alert.contacts.length} contact(s)${
        telegramContacts.length > 0 ? ` (${telegramContacts.length} via Telegram)` : ''
      }.`,
      timestamp: new Date(),
      status: 'danger',
    })

    return sent
  }

  const cancelSOS = async (alertId: string) => {
    setActiveAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'cancelled' as const } : a))
    addActivity({
      type: 'sos',
      title: 'SOS Cancelled',
      description: 'Emergency alert was cancelled.',
      timestamp: new Date(),
      status: 'warning',
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      isDemoMode,
      contacts,
      recentActivity,
      activeAlerts,
      login,
      signup,
      logout,
      resetPassword,
      updateProfile,
      addContact,
      removeContact,
      updateContact,
      addActivity,
      triggerSOS,
      cancelSOS,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
