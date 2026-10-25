import React, { useState } from 'react'
import {
  User, Mail, Phone, MessageSquare, Shield, Bell, Moon, Sun,
  LogOut, ChevronLeft, Save, Edit3, Check, Loader2, Laptop
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getInitials, cn } from '@/lib/utils'

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    emergencyMessage: user?.emergencyMessage || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateProfile(form)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Laptop, label: 'System' },
  ] as const

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Profile & Settings</h1>
          <p className="text-sm text-[--text-secondary]">Manage your account and preferences</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="card p-8 mb-6 flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow-violet">
          <span className="text-white font-display font-bold text-2xl">{getInitials(user?.displayName || 'U')}</span>
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-[--text-primary]">{user?.displayName}</h2>
          <p className="text-sm text-[--text-muted]">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-safe" />
          <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Protected</span>
        </div>
      </div>

      {/* Profile info */}
      <div className="card overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--border]">
          <h2 className="font-display font-semibold text-[--text-primary]">Personal Information</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-ghost py-1.5 px-3 text-xs" id="edit-profile-btn">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn-ghost py-1.5 px-3 text-xs">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-1.5 px-3 text-xs" id="save-profile-btn">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save</>}
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-[--border]">
          {[
            { icon: User, label: 'Display Name', key: 'displayName', type: 'text', placeholder: 'Your name' },
            { icon: Mail, label: 'Email', key: 'email', type: 'email', placeholder: 'Email address', readOnly: true },
            { icon: Phone, label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
          ].map(field => (
            <div key={field.key} className="flex items-start gap-4 px-6 py-4">
              <field.icon className="w-4 h-4 text-[--text-muted] mt-3 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[--text-muted] mb-1">{field.label}</p>
                {editing && !field.readOnly ? (
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form] || (field.key === 'email' ? user?.email || '' : '')}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="input py-2 text-sm"
                    placeholder={field.placeholder}
                    id={`profile-${field.key}`}
                  />
                ) : (
                  <p className="text-sm text-[--text-primary]">
                    {field.key === 'email' ? user?.email : form[field.key as keyof typeof form] || <span className="text-[--text-muted] italic">Not set</span>}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Emergency message */}
          <div className="flex items-start gap-4 px-6 py-4">
            <MessageSquare className="w-4 h-4 text-[--text-muted] mt-3 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-[--text-muted] mb-1">Emergency SOS Message</p>
              {editing ? (
                <textarea
                  value={form.emergencyMessage}
                  onChange={e => setForm(f => ({ ...f, emergencyMessage: e.target.value }))}
                  className="input text-sm min-h-[80px] resize-none"
                  id="profile-emergency-message"
                />
              ) : (
                <p className="text-sm text-[--text-primary]">{form.emergencyMessage || <span className="text-[--text-muted] italic">Not set</span>}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* App settings */}
      <div className="card overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[--border]">
          <h2 className="font-display font-semibold text-[--text-primary]">App Settings</h2>
        </div>

        {/* Theme */}
        <div className="px-6 py-5 border-b border-[--border]">
          <p className="text-sm font-medium text-[--text-primary] mb-3">Appearance</p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                id={`theme-${opt.value}`}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  theme === opt.value
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-[--border] text-[--text-secondary] hover:border-violet-300 hover:text-violet-600'
                )}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[--border]">
          <h2 className="font-display font-semibold text-emergency-600 dark:text-emergency-400">Account</h2>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-full btn-danger"
            id="logout-btn"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
