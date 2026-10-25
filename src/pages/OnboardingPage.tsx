import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Users, MapPin, Bell, Check, ArrowRight, ArrowLeft,
  Phone, MessageSquare, Lock, Zap
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 'welcome',
    icon: Shield,
    title: 'Welcome to SHEild',
    subtitle: 'Your safety companion',
    description: 'SHEild helps you stay safe with emergency alerts, location sharing, and digital security tools. Let\'s set up your account in just a few steps.',
  },
  {
    id: 'contacts',
    icon: Users,
    title: 'Trusted Contacts',
    subtitle: 'Who should we alert?',
    description: 'Add people you trust. In an emergency, we\'ll notify them with your location and a safety message. You can always add or change contacts later.',
  },
  {
    id: 'location',
    icon: MapPin,
    title: 'Location Sharing',
    subtitle: 'Your location, your choice',
    description: 'SHEild can share your location with trusted contacts during emergencies or safe trips. You can turn this on or off at any time. We never share your location without your permission.',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Safety Notifications',
    subtitle: 'Stay informed',
    description: 'Get check-in reminders, safety alerts, and updates from your trusted contacts. You control exactly what notifications you receive.',
  },
  {
    id: 'message',
    icon: MessageSquare,
    title: 'Emergency Message',
    subtitle: 'What should we say?',
    description: 'Customize the message sent to your contacts in an emergency. Make it personal and clear.',
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [locationConsent, setLocationConsent] = useState(false)
  const [notifConsent, setNotifConsent] = useState(false)
  const [emergencyMsg, setEmergencyMsg] = useState('I need assistance. Please contact me as soon as possible. My last available location is attached if I have enabled location sharing.')
  const [contactAdded, setContactAdded] = useState(false)

  const { updateProfile, addContact } = useAuth()
  const navigate = useNavigate()

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const handleNext = async () => {
    if (currentStep === 1 && contactName && contactPhone && !contactAdded) {
      await addContact({
        name: contactName,
        phone: contactPhone,
        relation: 'Trusted Contact',
        notifyOnSOS: true,
        notifyOnTrip: true,
      })
      setContactAdded(true)
    }
    if (isLast) {
      await updateProfile({
        emergencyMessage: emergencyMsg,
        onboardingComplete: true,
      })
      navigate('/dashboard')
    } else {
      setCurrentStep(s => s + 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-[--bg-primary] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[--text-muted]">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 space-y-6">
          {/* Step icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
              <step.icon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">{step.subtitle}</p>
            <h2 className="text-2xl font-display font-bold text-[--text-primary]">{step.title}</h2>
            <p className="text-[--text-secondary] mt-2 leading-relaxed">{step.description}</p>
          </div>

          {/* Step-specific content */}
          {step.id === 'welcome' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🆘', label: 'Emergency SOS' },
                { icon: '📍', label: 'Location Sharing' },
                { icon: '🤖', label: 'AI Threat Analysis' },
                { icon: '🔒', label: 'Evidence Vault' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2 p-3 rounded-xl bg-[--bg-secondary]">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-medium text-[--text-primary]">{f.label}</span>
                </div>
              ))}
            </div>
          )}

          {step.id === 'contacts' && (
            <div className="space-y-4">
              <div>
                <label className="input-label">Contact name</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="input pl-10"
                    placeholder="e.g. Mom, Sister, Best Friend"
                    id="onboarding-contact-name"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="input pl-10"
                    placeholder="+91 98765 43210"
                    id="onboarding-contact-phone"
                  />
                </div>
              </div>
              {contactAdded && (
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Contact saved! You can add more from the Contacts page.</span>
                </div>
              )}
              <p className="text-xs text-[--text-muted]">You can skip this and add contacts later.</p>
            </div>
          )}

          {step.id === 'location' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[--border] bg-[--bg-secondary]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[--text-primary]">Privacy First</p>
                    <p className="text-xs text-[--text-secondary] mt-0.5">Location is only shared when you choose. It's never shared in the background without your knowledge.</p>
                  </div>
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setLocationConsent(v => !v)}
                  id="location-consent"
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    locationConsent ? 'bg-violet-600' : 'border-2 border-gray-300 dark:border-gray-600'
                  )}
                >
                  {locationConsent && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className="text-sm text-[--text-secondary]">
                  I consent to SHEild accessing my location when I choose to share it during emergencies or safe trips.
                </span>
              </label>
            </div>
          )}

          {step.id === 'notifications' && (
            <div className="space-y-4">
              {[
                { id: 'notif-sos', label: 'Emergency SOS alerts', desc: 'When your trusted contacts send you a safety alert' },
                { id: 'notif-checkin', label: 'Check-in reminders', desc: 'Reminders to check in during safe trips' },
                { id: 'notif-activity', label: 'Account activity', desc: 'Sign-ins, contact changes, and privacy updates' },
              ].map(item => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-[--bg-secondary] transition-colors">
                  <button
                    type="button"
                    id={item.id}
                    onClick={() => setNotifConsent(v => !v)}
                    className={cn(
                      'w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      notifConsent ? 'bg-violet-600' : 'border-2 border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {notifConsent && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-[--text-primary]">{item.label}</p>
                    <p className="text-xs text-[--text-muted]">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {step.id === 'message' && (
            <div>
              <label className="input-label">Emergency message</label>
              <textarea
                value={emergencyMsg}
                onChange={e => setEmergencyMsg(e.target.value)}
                className="input min-h-[100px] resize-none"
                placeholder="Customize your emergency message..."
                id="emergency-message"
              />
              <p className="text-xs text-[--text-muted] mt-1.5">This message is sent to your trusted contacts when you activate SOS.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => currentStep > 0 && setCurrentStep(s => s - 1)}
              className={cn('btn-ghost gap-1', currentStep === 0 && 'invisible')}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              id="onboarding-next-btn"
              className="btn-primary gap-1"
            >
              {isLast ? (
                <><Zap className="w-4 h-4" /> Get Started</>
              ) : (
                <>Next <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[--text-muted] mt-4">
          You can change any of these settings later in Privacy Controls.
        </p>
      </div>
    </div>
  )
}
