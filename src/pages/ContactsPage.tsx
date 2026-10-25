import React, { useState } from 'react'
import {
  Users, Plus, Trash2, Edit3, Phone, Mail, ChevronLeft,
  Shield, Bell, Map, X, Check, User, Send, ExternalLink
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn, getInitials } from '@/lib/utils'
import type { TrustedContact } from '@/types'

const relations = ['Family', 'Friend', 'Partner', 'Colleague', 'Neighbour', 'Other']

function ContactCard({ contact, onEdit, onDelete }: {
  contact: TrustedContact
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow-violet/30">
            <span className="text-white font-bold text-sm">{getInitials(contact.name)}</span>
          </div>
          <div>
            <p className="font-semibold text-[--text-primary]">{contact.name}</p>
            <p className="text-xs text-[--text-muted] mt-0.5">{contact.relation}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 text-[--text-muted] hover:text-violet-600 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-emergency-50 dark:hover:bg-emergency-950/30 text-[--text-muted] hover:text-emergency-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-[--text-secondary]">
          <Phone className="w-3.5 h-3.5 shrink-0 text-[--text-muted]" />
          <span>{contact.phone}</span>
        </div>
        {contact.email && (
          <div className="flex items-center gap-2 text-sm text-[--text-secondary]">
            <Mail className="w-3.5 h-3.5 shrink-0 text-[--text-muted]" />
            <span>{contact.email}</span>
          </div>
        )}
        {contact.telegramChatId && (
          <div className="flex items-center gap-2 text-sm text-[--text-secondary]">
            <Send className="w-3.5 h-3.5 shrink-0 text-sky-500" />
            <span className="text-sky-600 dark:text-sky-400">Telegram linked</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {contact.notifyOnSOS && (
          <span className="badge-red">
            <Shield className="w-3 h-3" /> SOS Alert
          </span>
        )}
        {contact.notifyOnTrip && (
          <span className="badge-violet">
            <Map className="w-3 h-3" /> Trip Updates
          </span>
        )}
        {contact.telegramChatId && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-medium">
            <Send className="w-2.5 h-2.5" /> Telegram
          </span>
        )}
      </div>
    </div>
  )
}

function ContactModal({ contact, onSave, onClose }: {
  contact?: TrustedContact
  onSave: (data: Omit<TrustedContact, 'id' | 'createdAt'>) => Promise<void>
  onClose: () => void
}) {
  const [name, setName] = useState(contact?.name || '')
  const [phone, setPhone] = useState(contact?.phone || '')
  const [email, setEmail] = useState(contact?.email || '')
  const [relation, setRelation] = useState(contact?.relation || 'Family')
  const [notifyOnSOS, setNotifyOnSOS] = useState(contact?.notifyOnSOS ?? true)
  const [notifyOnTrip, setNotifyOnTrip] = useState(contact?.notifyOnTrip ?? true)
  const [telegramChatId, setTelegramChatId] = useState(contact?.telegramChatId || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone number are required.')
      return
    }
    setSaving(true)
    try {
      await onSave({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined, relation, notifyOnSOS, notifyOnTrip, telegramChatId: telegramChatId.trim() || undefined })
      onClose()
    } catch {
      setError('Failed to save contact. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md card p-6 space-y-5 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-[--text-primary]">
            {contact ? 'Edit Contact' : 'Add Trusted Contact'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-[--text-muted]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="input-label">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input pl-10" placeholder="Contact name" id="contact-name" />
            </div>
          </div>

          <div>
            <label className="input-label">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input pl-10" placeholder="+91 98765 43210" id="contact-phone" />
            </div>
          </div>

          <div>
            <label className="input-label">Email (optional)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input pl-10" placeholder="email@example.com" id="contact-email" />
            </div>
          </div>

          <div>
            <label className="input-label">Relationship</label>
            <select value={relation} onChange={e => setRelation(e.target.value)} className="input" id="contact-relation">
              {relations.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[--text-primary]">Notify this contact when:</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setNotifyOnSOS(v => !v)}
                id="notify-sos"
                className={cn('w-5 h-5 rounded flex items-center justify-center transition-colors', notifyOnSOS ? 'bg-violet-600' : 'border-2 border-gray-300 dark:border-gray-600')}
              >
                {notifyOnSOS && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-[--text-secondary]">I activate SOS emergency</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setNotifyOnTrip(v => !v)}
                id="notify-trip"
                className={cn('w-5 h-5 rounded flex items-center justify-center transition-colors', notifyOnTrip ? 'bg-violet-600' : 'border-2 border-gray-300 dark:border-gray-600')}
              >
                {notifyOnTrip && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-[--text-secondary]">I start a Safe Trip</span>
            </label>
          </div>

          {/* Telegram Chat ID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="input-label mb-0">Telegram Chat ID <span className="text-[--text-muted] font-normal">(optional)</span></label>
              <a
                href="https://t.me/userinfobot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> Get Chat ID
              </a>
            </div>
            <div className="relative">
              <Send className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
              <input
                type="text"
                value={telegramChatId}
                onChange={e => setTelegramChatId(e.target.value)}
                className="input pl-10"
                placeholder="e.g. 123456789"
                id="contact-telegram-chat-id"
              />
            </div>
            <div className="px-3 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 space-y-1">
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <Send className="w-3 h-3" /> How to link Telegram:
              </p>
              <ol className="text-xs text-sky-600/90 dark:text-sky-400/80 space-y-0.5 list-decimal list-inside">
                <li>Your contact opens Telegram and messages <strong>@userinfobot</strong></li>
                <li>The bot replies with their Chat ID (a number)</li>
                <li>They share that number with you — paste it above</li>
                <li>They also need to start a chat with your SHEild bot</li>
              </ol>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-emergency-600 dark:text-emergency-400 bg-emergency-50 dark:bg-emergency-950/30 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1" id="save-contact-btn">
            {saving ? 'Saving…' : contact ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ContactsPage() {
  const { contacts, addContact, removeContact, updateContact } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState<TrustedContact | undefined>()
  const navigate = useNavigate()

  const handleSave = async (data: Omit<TrustedContact, 'id' | 'createdAt'>) => {
    if (editingContact) {
      await updateContact(editingContact.id, data)
    } else {
      await addContact(data)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Remove this trusted contact?')) {
      await removeContact(id)
    }
  }

  const handleEdit = (contact: TrustedContact) => {
    setEditingContact(contact)
    setShowModal(true)
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Trusted Contacts</h1>
          <p className="text-sm text-[--text-secondary]">People who will be notified in an emergency</p>
        </div>
        <button
          onClick={() => { setEditingContact(undefined); setShowModal(true) }}
          className="btn-primary"
          id="add-contact-btn"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-[--text-muted] mx-auto mb-4" />
          <h3 className="font-display font-bold text-[--text-primary] text-lg mb-2">No Contacts Yet</h3>
          <p className="text-[--text-secondary] text-sm mb-6 max-w-sm mx-auto">
            Add trusted people who will be notified when you activate SOS or start a Safe Trip.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[--text-muted]">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</span>
            <span className="text-xs badge-teal">
              {contacts.filter(c => c.notifyOnSOS).length} for SOS
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => handleEdit(contact)}
                onDelete={() => handleDelete(contact.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <ContactModal
          contact={editingContact}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingContact(undefined) }}
        />
      )}
    </div>
  )
}
