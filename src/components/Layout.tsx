import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Shield, Home, AlertTriangle, Users, Map, Bot, Archive,
  Lock, Settings, LogOut, Bell, Sun, Moon, Menu, X, ChevronRight,
  Zap, Phone
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getInitials, cn } from '@/lib/utils'
import SOSButton from './SOSButton'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/sos', icon: AlertTriangle, label: 'Emergency SOS' },
  { to: '/contacts', icon: Users, label: 'Trusted Contacts' },
  { to: '/safe-trip', icon: Map, label: 'Safe Trip' },
  { to: '/digital-shield', icon: Bot, label: 'Digital Shield' },
  { to: '/evidence-vault', icon: Archive, label: 'Evidence Vault' },
  { to: '/privacy', icon: Lock, label: 'Privacy Controls' },
  { to: '/resources', icon: Phone, label: 'Emergency Resources' },
]

const bottomNavItems = [
  { to: '/profile', icon: Settings, label: 'Profile & Settings' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      'flex flex-col h-full',
      mobile ? '' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[--border]">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-glow-violet">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-gradient leading-tight">SHEild</h1>
          <p className="text-xs text-[--text-muted] leading-tight">Your Safety. Your Control.</p>
        </div>
      </div>


      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(item => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn('nav-item', active && 'nav-item-active')}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-violet-600 dark:text-violet-400' : '')} />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-violet-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[--border] px-3 py-3 space-y-0.5">
        {bottomNavItems.map(item => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn('nav-item', active && 'nav-item-active')}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button onClick={handleLogout} className="nav-item w-full text-left text-emergency-600 dark:text-emergency-400 hover:bg-emergency-50 dark:hover:bg-emergency-950/30">
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User section */}
      <div className="px-4 py-4 border-t border-[--border]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(user?.displayName || 'U')}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[--text-primary] truncate">{user?.displayName}</p>
            <p className="text-xs text-[--text-muted] truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[--bg-secondary] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[--sidebar-bg] border-r border-[--sidebar-border] shrink-0 fixed h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-[--sidebar-bg] border-r border-[--sidebar-border] flex flex-col z-10 animate-slide-up">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[--bg-primary]/95 backdrop-blur-md border-b border-[--border] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-[--text-secondary]" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                <span className="font-display font-bold text-gradient text-lg">SHEild</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark'
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-violet-600" />
                }
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative">
                <Bell className="w-4 h-4 text-[--text-secondary]" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emergency-500" />
              </button>
              <Link to="/profile" className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{getInitials(user?.displayName || 'U')}</span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-[--text-primary]">{user?.displayName?.split(' ')[0]}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 animate-fade-in">
          {children}
        </main>

        {/* Floating SOS button on mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <SOSButton compact />
        </div>
      </div>
    </div>
  )
}
