import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SOSButtonProps {
  compact?: boolean
  className?: string
}

export default function SOSButton({ compact = false, className }: SOSButtonProps) {
  const [pressing, setPressing] = useState(false)
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate('/sos')
  }, [navigate])

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center',
          'bg-emergency-600 text-white shadow-sos',
          'active:scale-95 transition-all duration-100',
          'focus:outline-none focus:ring-4 focus:ring-emergency-300',
          'animate-pulse-ring',
          className
        )}
        aria-label="Emergency SOS"
        id="sos-button-mobile"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full bg-emergency-500/20 animate-ping scale-125" />
        <div className="absolute inset-0 rounded-full bg-emergency-500/10 animate-ping scale-150 [animation-delay:0.5s]" />

        {/* Main button */}
        <button
          onClick={handleClick}
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onTouchStart={() => setPressing(true)}
          onTouchEnd={() => setPressing(false)}
          className={cn(
            'relative w-40 h-40 rounded-full flex flex-col items-center justify-center gap-1',
            'bg-gradient-to-br from-emergency-500 to-emergency-700',
            'text-white font-display font-extrabold',
            'shadow-sos transition-all duration-200',
            'focus:outline-none focus:ring-4 focus:ring-emergency-300 focus:ring-offset-4',
            pressing ? 'scale-95' : 'scale-100 hover:scale-105',
            className
          )}
          aria-label="Activate Emergency SOS"
          id="sos-button-main"
        >
          <Phone className="w-8 h-8 fill-white/30" />
          <span className="text-2xl font-black tracking-tight">SOS</span>
          <span className="text-xs font-medium opacity-80">Tap to Activate</span>
        </button>
      </div>

      <p className="text-xs text-center text-[--text-muted] max-w-[200px]">
        Sends emergency alert to your trusted contacts
      </p>
    </div>
  )
}
