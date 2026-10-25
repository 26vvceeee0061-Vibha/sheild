import React, { useState } from 'react'
import { Lock, MapPin, Bell, Eye, Trash2, Download, ChevronLeft, Check, Shield, AlertTriangle, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface PrivacySetting {
  id: string
  category: string
  title: string
  description: string
  enabled: boolean
  icon: React.ElementType
  riskLevel?: 'low' | 'medium' | 'high'
}

export default function PrivacyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'location-sos',
      category: 'Location',
      title: 'Share location during SOS',
      description: 'Attach your GPS coordinates to emergency alerts sent to trusted contacts.',
      enabled: true,
      icon: MapPin,
      riskLevel: 'low',
    },
    {
      id: 'location-trip',
      category: 'Location',
      title: 'Share location during Safe Trips',
      description: 'Share your real-time location with contacts when a Safe Trip is active.',
      enabled: true,
      icon: MapPin,
      riskLevel: 'low',
    },
    {
      id: 'location-background',
      category: 'Location',
      title: 'Background location tracking',
      description: 'Allow SHEild to access location when the app is in the background. Required for missed check-in detection.',
      enabled: false,
      icon: MapPin,
      riskLevel: 'medium',
    },
    {
      id: 'notif-sos',
      category: 'Notifications',
      title: 'Emergency SOS alerts',
      description: 'Receive notifications when you or your contacts activate SOS.',
      enabled: true,
      icon: Bell,
      riskLevel: 'low',
    },
    {
      id: 'notif-checkin',
      category: 'Notifications',
      title: 'Check-in reminders',
      description: 'Get push notifications reminding you to check in during Safe Trips.',
      enabled: true,
      icon: Bell,
      riskLevel: 'low',
    },
    {
      id: 'notif-analysis',
      category: 'Notifications',
      title: 'Threat analysis alerts',
      description: 'Receive alerts when Digital Shield detects a high-risk threat.',
      enabled: true,
      icon: AlertTriangle,
      riskLevel: 'low',
    },
    {
      id: 'analytics',
      category: 'Data & Privacy',
      title: 'Usage analytics',
      description: 'Help improve SHEild by sharing anonymous usage statistics. No personal data is included.',
      enabled: false,
      icon: Eye,
      riskLevel: 'low',
    },
    {
      id: 'crash-reports',
      category: 'Data & Privacy',
      title: 'Crash reports',
      description: 'Automatically send crash logs to help fix bugs. Logs contain no personal data.',
      enabled: true,
      icon: Shield,
      riskLevel: 'low',
    },
  ])

  const toggle = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const categories = [...new Set(settings.map(s => s.category))]

  const riskColors = {
    low: 'text-teal-600 dark:text-teal-400',
    medium: 'text-amber-600 dark:text-amber-400',
    high: 'text-emergency-600 dark:text-emergency-400',
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Privacy Controls</h1>
          <p className="text-sm text-[--text-secondary]">Your data, your choices</p>
        </div>
      </div>

      {/* Privacy summary */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-glow-violet/30 shrink-0">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[--text-primary] mb-1">Privacy First</h2>
            <p className="text-sm text-[--text-secondary] leading-relaxed">
              SHEild collects only what's needed for safety features. We never sell your data, and you can export or delete your data at any time.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-violet-200 dark:border-violet-800/50">
          {[
            { label: 'Enabled', value: settings.filter(s => s.enabled).length, color: 'text-teal-600' },
            { label: 'Disabled', value: settings.filter(s => !s.enabled).length, color: 'text-[--text-secondary]' },
            { label: 'Total Controls', value: settings.length, color: 'text-violet-600' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className={cn('text-2xl font-display font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-[--text-muted]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings by category */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-[--border] bg-[--bg-secondary]">
              <h2 className="font-display font-semibold text-[--text-primary] text-sm uppercase tracking-wider">{category}</h2>
            </div>
            <div className="divide-y divide-[--border]">
              {settings.filter(s => s.category === category).map(setting => {
                const Icon = setting.icon
                return (
                  <div key={setting.id} className="flex items-start gap-4 px-6 py-5">
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                      setting.enabled ? 'bg-violet-100 dark:bg-violet-950/50' : 'bg-gray-100 dark:bg-gray-800'
                    )}>
                      <Icon className={cn('w-4 h-4', setting.enabled ? 'text-violet-600 dark:text-violet-400' : 'text-[--text-muted]')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[--text-primary]">{setting.title}</p>
                        {setting.riskLevel && setting.riskLevel !== 'low' && (
                          <span className={cn('text-xs font-medium', riskColors[setting.riskLevel])}>
                            {setting.riskLevel === 'medium' ? '⚠️ Medium' : '🔴 High'} sensitivity
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[--text-muted] mt-0.5 leading-relaxed">{setting.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(setting.id)}
                      id={`toggle-${setting.id}`}
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
                        setting.enabled ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
                      )}
                      aria-label={`${setting.enabled ? 'Disable' : 'Enable'} ${setting.title}`}
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 m-0.5',
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Data rights */}
      <div className="card p-6 mt-6 space-y-3">
        <h2 className="font-display font-bold text-[--text-primary]">Your Data Rights</h2>
        <p className="text-sm text-[--text-secondary]">Under applicable data protection laws, you have the right to:</p>
        <div className="space-y-2">
          {[
            { label: 'Export your data', desc: 'Download all your data in JSON format', action: 'Export Data', icon: Download },
            { label: 'Delete your account', desc: 'Permanently delete your account and all data', action: 'Delete Account', icon: Trash2, danger: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-[--border] hover:bg-[--bg-secondary] transition-colors">
              <div className="flex items-center gap-3">
                <item.icon className={cn('w-4 h-4', item.danger ? 'text-emergency-600' : 'text-violet-600')} />
                <div>
                  <p className="text-sm font-medium text-[--text-primary]">{item.label}</p>
                  <p className="text-xs text-[--text-muted]">{item.desc}</p>
                </div>
              </div>
              <button
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
                  item.danger
                    ? 'text-emergency-600 hover:bg-emergency-50 dark:hover:bg-emergency-950/30'
                    : 'text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30'
                )}
                id={`data-${item.action.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
