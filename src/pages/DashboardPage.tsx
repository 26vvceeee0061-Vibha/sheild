import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, AlertTriangle, Users, Map, Bot, Archive, Lock,
  Phone, ChevronRight, Clock, TrendingUp, Activity,
  MapPin, CheckCircle, XCircle, Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatRelativeTime, cn } from '@/lib/utils'
import SOSButton from '@/components/SOSButton'
import type { SafetyActivity } from '@/types'

const quickActions = [
  { to: '/safe-trip', icon: Map, label: 'Start Safe Trip', color: 'teal', desc: 'Share your journey' },
  { to: '/digital-shield', icon: Bot, label: 'Digital Shield', color: 'violet', desc: 'Analyze threats' },
  { to: '/contacts', icon: Users, label: 'Contacts', color: 'purple', desc: 'Manage trusted contacts' },
  { to: '/evidence-vault', icon: Archive, label: 'Evidence', color: 'indigo', desc: 'Secure your evidence' },
]

const colorMap = {
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
}

function ActivityIcon({ type, status }: { type: SafetyActivity['type'], status?: SafetyActivity['status'] }) {
  const icons = {
    sos: AlertTriangle,
    check_in: CheckCircle,
    trip: Map,
    analysis: Bot,
    contact: Users,
  }
  const Icon = icons[type] || Activity
  const colors = {
    success: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
    danger: 'text-emergency-600 dark:text-emergency-400 bg-emergency-50 dark:bg-emergency-950/30',
    info: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30',
  }
  return (
    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', colors[status || 'info'])}>
      <Icon className="w-4 h-4" />
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user, contacts, recentActivity } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] || 'there'

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[--text-primary]">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-[--text-secondary] mt-1">You are protected. Stay safe today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50">
          <span className="status-safe" />
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">Protected</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOS Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 flex flex-col items-center text-center space-y-4 border-emergency-200/50 dark:border-emergency-900/50">
            <h2 className="font-display font-bold text-[--text-primary] text-lg">Emergency SOS</h2>
            <SOSButton />
            <div className="w-full pt-2 border-t border-[--border]">
              <Link to="/sos" className="text-xs text-[--text-muted] hover:text-violet-600 dark:hover:text-violet-400 flex items-center justify-center gap-1 transition-colors">
                Configure SOS settings <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Status + Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <div className="text-2xl font-display font-bold text-violet-600 dark:text-violet-400">{contacts.length}</div>
              <div className="text-xs text-[--text-muted] mt-0.5">Trusted Contacts</div>
            </div>
            <div className="card p-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="status-safe" />
              </div>
              <div className="text-xs text-[--text-muted] mt-1">Safe Status</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-display font-bold text-teal-600 dark:text-teal-400">{recentActivity.length}</div>
              <div className="text-xs text-[--text-muted] mt-0.5">Recent Activities</div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <Link
                key={action.to}
                to={action.to}
                className="card-hover p-4 flex items-center gap-3 group"
                id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', colorMap[action.color as keyof typeof colorMap])}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[--text-primary]">{action.label}</p>
                  <p className="text-xs text-[--text-muted] truncate">{action.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[--text-muted] ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>

          {/* Privacy indicator */}
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[--text-primary]">Privacy Status</p>
                  <p className="text-xs text-[--text-muted]">Your data is protected</p>
                </div>
              </div>
              <Link to="/privacy" className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">Manage</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--border]">
          <h2 className="section-title">Recent Activity</h2>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[--text-muted]" />
            <span className="text-xs text-[--text-muted]">Last 7 days</span>
          </div>
        </div>
        <div className="divide-y divide-[--border]">
          {recentActivity.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Activity className="w-10 h-10 text-[--text-muted] mx-auto mb-3" />
              <p className="text-sm text-[--text-muted]">No recent activity yet. Stay safe!</p>
            </div>
          ) : (
            recentActivity.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-start gap-3 px-6 py-4 hover:bg-[--bg-secondary] transition-colors">
                <ActivityIcon type={item.type} status={item.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[--text-primary]">{item.title}</p>
                  <p className="text-xs text-[--text-muted] mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs text-[--text-muted] shrink-0">{formatRelativeTime(new Date(item.timestamp))}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Emergency Resources shortcut */}
      <div className="card p-5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[--text-primary]">Emergency Resources</p>
              <p className="text-xs text-[--text-muted]">Helplines, shelters, and legal aid</p>
            </div>
          </div>
          <Link to="/resources" className="btn-secondary text-xs px-4 py-2">
            View Resources
          </Link>
        </div>
      </div>
    </div>
  )
}
