'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'maatwork-announcement-closed'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  // Set launch date to 7 days from now for demo purposes
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 7)
  launchDate.setHours(23, 59, 59, 999)

  const difference = launchDate.getTime() - Date.now()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function CountdownTimer({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className={cn('flex items-center gap-1 text-sm', className)}>
      <span className="bg-white/10 px-2 py-0.5 rounded font-mono font-semibold">
        {formatNumber(timeLeft.days)}
      </span>
      <span className="text-white/60">d</span>
      <span className="bg-white/10 px-2 py-0.5 rounded font-mono font-semibold">
        {formatNumber(timeLeft.hours)}
      </span>
      <span className="text-white/60">h</span>
      <span className="bg-white/10 px-2 py-0.5 rounded font-mono font-semibold">
        {formatNumber(timeLeft.minutes)}
      </span>
      <span className="text-white/60">m</span>
      <span className="bg-white/10 px-2 py-0.5 rounded font-mono font-semibold animate-pulse">
        {formatNumber(timeLeft.seconds)}
      </span>
      <span className="text-white/60">s</span>
    </div>
  )
}

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const wasClosed = localStorage.getItem(STORAGE_KEY)
    if (wasClosed) {
      setIsVisible(false)
      return
    }
    // Trigger entrance animation
    setIsAnimating(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsAnimating(false)
    // Wait for exit animation to complete
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }, 300)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-out',
        isAnimating
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
      )}
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950"
        aria-hidden="true"
      />

      {/* Glass effect overlay */}
      <div
        className="absolute inset-0 bg-white/[0.02] backdrop-blur-[1px]"
        aria-hidden="true"
      />

      {/* Decorative gradient orbs */}
      <div
        className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[64px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[64px]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            {/* Badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                <Rocket className="w-3 h-3" />
                Beta
              </span>
            </div>

            {/* Main text with countdown */}
            <p className="text-white text-center text-sm sm:text-base font-medium">
              Primeras 5 apps con precio especial de lanzamiento —{' '}
              <span className="text-amber-300 font-semibold">cupos limitados</span>
            </p>

            {/* Countdown timer */}
            <div className="hidden md:flex items-center gap-2 text-white/80">
              <span className="text-xs uppercase tracking-wider">Termina en:</span>
              <CountdownTimer />
            </div>

            {/* CTA Button */}
            <a
              href="#pricing"
              className={cn(
                'flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full',
                'bg-gradient-to-r from-amber-500 to-orange-500',
                'text-white text-sm font-bold',
                'shadow-lg shadow-amber-500/25',
                'hover:from-amber-400 hover:to-orange-400',
                'hover:shadow-amber-500/40',
                'hover:scale-105',
                'transition-all duration-200'
              )}
            >
              Reservar lugar
              <span aria-hidden="true">→</span>
            </a>

            {/* Close button */}
            <button
              onClick={handleClose}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'sm:relative sm:right-auto sm:top-auto sm:translate-y-0',
                'p-1.5 rounded-full',
                'text-white/60 hover:text-white',
                'hover:bg-white/10',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
              )}
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile countdown (visible on small screens) */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-2 text-white/80">
            <span className="text-xs uppercase tracking-wider">Termina en:</span>
            <CountdownTimer className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}
