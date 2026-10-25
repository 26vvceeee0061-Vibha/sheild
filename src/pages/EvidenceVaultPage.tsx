import React, { useState, useRef } from 'react'
import {
  Archive, Plus, Camera, FileText, Mic, MapPin, StickyNote,
  Trash2, Download, Lock, Tag, ChevronLeft, X, Search, Filter
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn, generateId, formatDate, formatRelativeTime } from '@/lib/utils'
import type { EvidenceItem } from '@/types'

const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'e1',
    type: 'screenshot',
    title: 'Threatening Message Screenshot',
    description: 'Screenshot of threatening messages received on WhatsApp on Oct 20.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ['harassment', 'whatsapp'],
    isEncrypted: true,
    caseId: 'CASE-2026-001',
  },
  {
    id: 'e2',
    type: 'note',
    title: 'Incident Timeline',
    description: 'Detailed notes about the timeline of events starting from October 15th.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['timeline', 'stalking'],
    isEncrypted: true,
  },
  {
    id: 'e3',
    type: 'location',
    title: 'Incident Location',
    description: 'GPS coordinates of where the incident occurred near Jubilee Hills.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['location', 'incident'],
    isEncrypted: true,
    caseId: 'CASE-2026-001',
  },
]

const typeConfig = {
  screenshot: { icon: Camera, label: 'Screenshot', color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
  audio: { icon: Mic, label: 'Audio', color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
  document: { icon: FileText, label: 'Document', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  note: { icon: StickyNote, label: 'Note', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  location: { icon: MapPin, label: 'Location', color: 'text-emergency-600 bg-emergency-50 dark:bg-emergency-950/40' },
}

function EvidenceCard({ item, onDelete }: { item: EvidenceItem; onDelete: () => void }) {
  const config = typeConfig[item.type]
  const Icon = config.icon
  return (
    <div className="card-hover p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1">
          {item.isEncrypted && (
            <span className="badge-violet text-xs">
              <Lock className="w-2.5 h-2.5" /> Encrypted
            </span>
          )}
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-emergency-50 dark:hover:bg-emergency-950/30 text-[--text-muted] hover:text-emergency-600 transition-colors ml-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-[--text-primary] text-sm">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-[--text-muted] mt-1 line-clamp-2">{item.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span key={tag} className="badge-gray text-xs">#{tag}</span>
          ))}
        </div>
        <span className="text-xs text-[--text-muted] shrink-0">{formatRelativeTime(item.timestamp)}</span>
      </div>

      {item.caseId && (
        <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">{item.caseId}</div>
      )}
    </div>
  )
}

export default function EvidenceVaultPage() {
  const [items, setItems] = useState<EvidenceItem[]>(DEMO_EVIDENCE)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<EvidenceItem['type'] | 'all'>('all')
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'note' as EvidenceItem['type'],
    tags: '',
    caseId: '',
  })
  const navigate = useNavigate()

  const filtered = items.filter(item => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()) || item.tags.some(t => t.includes(search.toLowerCase()))
    const matchesType = filter === 'all' || item.type === filter
    return matchesSearch && matchesType
  })

  const addItem = () => {
    if (!form.title.trim()) return
    const newItem: EvidenceItem = {
      id: generateId(),
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      timestamp: new Date(),
      tags: form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      isEncrypted: true,
      caseId: form.caseId.trim() || undefined,
    }
    setItems(prev => [newItem, ...prev])
    setShowForm(false)
    setForm({ title: '', description: '', type: 'note', tags: '', caseId: '' })
  }

  const deleteItem = (id: string) => {
    if (confirm('Delete this evidence? This cannot be undone.')) {
      setItems(prev => prev.filter(i => i.id !== id))
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Evidence Vault</h1>
          <p className="text-sm text-[--text-secondary]">Securely preserve evidence of harassment or threats</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary" id="add-evidence-btn">
          <Plus className="w-4 h-4" /> Add Evidence
        </button>
      </div>

      {/* Security notice */}
      <div className="card p-4 mb-6 bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/50">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">All Evidence is Encrypted</p>
            <p className="text-xs text-violet-600/80 dark:text-violet-400/80 mt-0.5">
              Evidence is encrypted with AES-256 and stored securely. Only you can access your evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(Object.keys(typeConfig) as EvidenceItem['type'][]).map(type => {
          const config = typeConfig[type]
          const count = items.filter(i => i.type === type).length
          return (
            <div key={type} className="card p-4 text-center">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2', config.color)}>
                <config.icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-display font-bold text-[--text-primary]">{count}</p>
              <p className="text-xs text-[--text-muted]">{config.label}s</p>
            </div>
          )
        })}
      </div>

      {/* Search and filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search evidence…"
            id="evidence-search"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as typeof filter)}
          className="input w-40"
          id="evidence-filter"
        >
          <option value="all">All Types</option>
          {(Object.keys(typeConfig) as EvidenceItem['type'][]).map(type => (
            <option key={type} value={type}>{typeConfig[type].label}</option>
          ))}
        </select>
      </div>

      {/* Add form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md card p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-[--text-primary]">Add Evidence</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-[--text-muted]" />
              </button>
            </div>

            <div>
              <label className="input-label">Evidence Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(typeConfig) as [EvidenceItem['type'], typeof typeConfig[keyof typeof typeConfig]][]).map(([t, cfg]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    id={`type-${t}`}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                      form.type === t
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'border-[--border] text-[--text-secondary] hover:border-violet-300'
                    )}
                  >
                    <cfg.icon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="Brief description of evidence" id="evidence-title" />
            </div>

            <div>
              <label className="input-label">Details (optional)</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input min-h-[80px] resize-none" placeholder="Additional notes or context…" id="evidence-description" />
            </div>

            <div>
              <label className="input-label">Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input" placeholder="harassment, date, platform" id="evidence-tags" />
            </div>

            <div>
              <label className="input-label">Case ID (optional)</label>
              <input type="text" value={form.caseId} onChange={e => setForm(f => ({ ...f, caseId: e.target.value }))} className="input" placeholder="e.g. CASE-2026-001" id="evidence-case-id" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={addItem} disabled={!form.title.trim()} className="btn-primary flex-1" id="save-evidence-btn">
                <Lock className="w-4 h-4" /> Save Encrypted
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Archive className="w-12 h-12 text-[--text-muted] mx-auto mb-4" />
          <h3 className="font-display font-bold text-[--text-primary] text-lg mb-2">
            {search || filter !== 'all' ? 'No matching evidence' : 'Evidence Vault is Empty'}
          </h3>
          <p className="text-sm text-[--text-muted] max-w-sm mx-auto mb-6">
            {search || filter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Preserve screenshots, notes, and other evidence of harassment or threats securely.'
            }
          </p>
          {!search && filter === 'all' && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Add First Evidence
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(item => (
            <EvidenceCard key={item.id} item={item} onDelete={() => deleteItem(item.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
