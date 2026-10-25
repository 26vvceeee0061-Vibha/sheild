// SHEild Types

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  phone?: string
  emergencyMessage?: string
  onboardingComplete: boolean
  createdAt: Date
}

export interface TrustedContact {
  id: string
  name: string
  phone: string
  email?: string
  relation: string
  avatar?: string
  notifyOnSOS: boolean
  notifyOnTrip: boolean
  telegramChatId?: string   // Telegram Chat ID for SOS bot notifications
  createdAt: Date
}

export interface SOSAlert {
  id: string
  triggeredAt: Date
  status: 'pending' | 'sent' | 'cancelled' | 'failed'
  contacts: string[]
  location?: { lat: number; lng: number; address?: string }
  message: string
  locationShared: boolean
}

export interface SafeTrip {
  id: string
  name: string
  origin: string
  destination: string
  startedAt: Date
  estimatedArrival: Date
  actualArrival?: Date
  status: 'active' | 'completed' | 'missed' | 'cancelled'
  checkInInterval: number // minutes
  lastCheckIn?: Date
  nextCheckIn?: Date
  shareWith: string[]
  notes?: string
}

export interface CheckIn {
  id: string
  tripId?: string
  timestamp: Date
  status: 'safe' | 'missed'
  location?: { lat: number; lng: number }
}

export interface ThreatAnalysis {
  id: string
  content: string
  type: 'message' | 'url' | 'email' | 'social'
  analyzedAt: Date
  result: {
    riskLevel: 'safe' | 'suspicious' | 'high' | 'critical'
    score: number
    flags: string[]
    explanation: string
    recommendations: string[]
  }
}

export interface EvidenceItem {
  id: string
  type: 'screenshot' | 'audio' | 'document' | 'note' | 'location'
  title: string
  description?: string
  fileUrl?: string
  fileSize?: number
  timestamp: Date
  tags: string[]
  isEncrypted: boolean
  caseId?: string
}

export interface SafetyActivity {
  id: string
  type: 'sos' | 'check_in' | 'trip' | 'analysis' | 'contact'
  title: string
  description: string
  timestamp: Date
  status?: 'success' | 'warning' | 'danger' | 'info'
}

export type Theme = 'light' | 'dark' | 'system'
export type RiskLevel = 'safe' | 'suspicious' | 'high' | 'critical'
