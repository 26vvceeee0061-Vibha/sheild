import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, AlertTriangle, MapPin, Bot, Archive, Lock,
  Users, ArrowRight, CheckCircle, Star, Phone, Menu, X,
  Zap, ChevronDown, Globe, Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Emergency SOS',
    description: 'One tap activates an emergency alert to your trusted contacts with your live location. A 5-second window lets you cancel accidental activations.',
    color: 'from-emergency-500 to-rose-600',
    bg: 'bg-emergency-50 dark:bg-emergency-950/30',
    iconColor: 'text-emergency-600 dark:text-emergency-400',
  },
  {
    icon: MapPin,
    title: 'Safe Trip',
    description: 'Plan your journey and set periodic safety check-ins. Missed a check-in? Your trusted contacts are automatically alerted.',
    color: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    icon: Bot,
    title: 'Digital Shield',
    description: 'AI-powered analysis of suspicious messages, phishing URLs, and online harassment. Get instant risk assessments and actionable advice.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: Archive,
    title: 'Evidence Vault',
    description: 'Securely preserve screenshots, notes, and recordings of harassment with AES-256 encryption. Organized by case for legal proceedings.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Users,
    title: 'Trusted Contacts',
    description: 'Build your safety network. Configure who gets notified during emergencies and safe trips, and exactly what information they receive.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: Lock,
    title: 'Privacy Controls',
    description: 'Full transparency and control over your data. Review permissions, export your data, or delete your account at any time.',
    color: 'from-slate-500 to-gray-600',
    bg: 'bg-gray-50 dark:bg-gray-900/30',
    iconColor: 'text-gray-600 dark:text-gray-400',
  },
]

const stats = [
  { value: '1091', label: 'Women Helpline', sub: 'Always available' },
  { value: '1930', label: 'Cyber Crime', sub: 'Report online threats' },
  { value: '100%', label: 'Your Control', sub: 'Privacy first' },
  { value: '24/7', label: 'Protection', sub: 'Always on guard' },
]

const trustPoints = [
  'No location tracking without your explicit consent',
  'Zero third-party data sharing',
  'All evidence encrypted with AES-256',
  'No fake API calls or simulated deliveries',
  'No real emergency calls without verified integration',
  'Full data export and deletion rights',
]

function CounterBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-display font-black text-white mb-1">{value}</div>
      <div className="text-violet-200 text-sm">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme, toggleTheme } = useTheme()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-screen bg-[--bg-primary]">
      {/* Navbar */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-[--bg-primary]/95 backdrop-blur-md border-b border-[--border] shadow-sm' : 'bg-transparent'
      )}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-glow-violet">
              <Shield className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">SHEild</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              ['#features', 'Features'],
              ['#safety', 'Safety'],
              ['#resources', 'Resources'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium text-[--text-secondary] hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
            </button>
            <Link to="/login" className="hidden sm:block btn-ghost text-sm py-2">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[--bg-primary] border-b border-[--border] px-6 pb-4 space-y-3">
            {[['#features', 'Features'], ['#safety', 'Safety'], ['#resources', 'Resources']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block text-sm text-[--text-secondary] py-2">{label}</a>
            ))}
            <Link to="/login" className="block btn-ghost w-full text-center">Sign In</Link>
            <Link to="/signup" className="block btn-primary w-full text-center">Create Free Account</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-8 animate-float">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Smart Help, Emergency Intelligence & Location Defense</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.05] mb-6">
            Your Safety.<br />
            <span className="text-violet-200">Your Control.</span>
          </h1>

          <p className="text-xl text-violet-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            SHEild empowers women with emergency SOS, intelligent location sharing, AI threat analysis, and digital security tools — all in one trusted platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              id="hero-cta-signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-violet-700 font-display font-bold text-lg hover:bg-violet-50 transition-all hover:shadow-glow-violet active:scale-98"
            >
              <Shield className="w-5 h-5" />
              Start Protecting Yourself
            </Link>
            <Link
              to="/login"
              id="hero-cta-login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-display font-bold text-lg hover:bg-white/10 backdrop-blur transition-all"
            >
              Try Demo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex justify-center animate-bounce-subtle">
            <a href="#features" className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <span className="text-xs">Explore Features</span>
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-violet-900 dark:bg-violet-950 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.value} className="text-center">
              <p className="text-3xl font-display font-black text-white mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-violet-200">{stat.label}</p>
              <p className="text-xs text-violet-400">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/50 mb-4">
              <Zap className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wider">All Features</span>
            </div>
            <h2 className="text-4xl font-display font-black text-[--text-primary] mb-4">
              Everything you need to stay safe
            </h2>
            <p className="text-lg text-[--text-secondary] max-w-2xl mx-auto">
              A complete safety ecosystem designed with privacy first. Every feature requires your explicit consent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="card-hover p-6 group"
                >
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110', feature.bg)}>
                    <Icon className={cn('w-6 h-6', feature.iconColor)} />
                  </div>
                  <h3 className="text-lg font-display font-bold text-[--text-primary] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[--text-secondary] leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Safety commitments */}
      <section id="safety" className="py-24 px-6 bg-[--bg-secondary]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-black text-[--text-primary] mb-4">
              Built on trust, not assumptions
            </h2>
            <p className="text-lg text-[--text-secondary]">
              Our safety commitments are non-negotiable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 card p-4">
                <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <p className="text-sm text-[--text-secondary]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency resources callout */}
      <section id="resources" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 bg-gradient-to-br from-violet-600 to-purple-800 border-0 text-white text-center">
            <Phone className="w-10 h-10 mx-auto mb-4 text-violet-200" />
            <h2 className="text-3xl font-display font-bold mb-3">Need immediate help?</h2>
            <p className="text-violet-200 mb-6">Call the Women Helpline at any time, from any phone.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:1091" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-violet-700 font-display font-bold hover:bg-violet-50 transition-all">
                <Phone className="w-5 h-5" /> Call 1091 (Women Helpline)
              </a>
              <a href="tel:1930" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-display font-bold hover:bg-white/10 transition-all">
                <Globe className="w-5 h-5" /> Call 1930 (Cyber Crime)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[--bg-secondary]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-6 shadow-glow-violet">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-display font-black text-[--text-primary] mb-4">
            Your safety starts today
          </h2>
          <p className="text-lg text-[--text-secondary] mb-8">
            Join SHEild for free. No credit card required.
          </p>
          <Link to="/signup" id="footer-cta-btn" className="btn-primary text-base px-10 py-4">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[--border] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-gradient">SHEild</span>
          </div>
          <p className="text-xs text-[--text-muted] flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-emergency-400 fill-emergency-400" /> for safety and dignity
          </p>
          <div className="flex items-center gap-4 text-xs text-[--text-muted]">
            <Link to="/login" className="hover:text-violet-600 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-violet-600 transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
