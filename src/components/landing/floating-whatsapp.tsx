'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks'
import { useState, useEffect, useRef, useCallback } from 'react'

interface FloatingWhatsAppProps {
  phoneNumber?: string
  message?: string
  position?: 'bottom-right' | 'bottom-left'
}

export function FloatingWhatsApp({
  phoneNumber = '542994569840',
  message = 'Hola%2C%20me%20interesa%20automatizar%20mi%20local',
  position = 'bottom-right',
}: FloatingWhatsAppProps) {
  const reducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(!reducedMotion) // Start visible if motion OK, hidden otherwise
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number; size: number }>>([])
  const lastScrollY = useRef(0)
  const rippleIdRef = useRef(0)
  const hasAnimatedRef = useRef(false)

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  // Entry animation on mount - only trigger if motion is allowed
  useEffect(() => {
    if (reducedMotion) return
    if (hasAnimatedRef.current) return

    const timer = setTimeout(() => {
      setIsVisible(true)
      hasAnimatedRef.current = true
    }, 300)
    return () => clearTimeout(timer)
  }, [reducedMotion])

  // Scroll direction detection - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      const isAtTop = currentScrollY < 100

      if (isAtTop || !scrollingDown) {
        setIsVisible(true)
      } else if (currentScrollY > 300) {
        setIsVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ripple cleanup
  useEffect(() => {
    if (ripples.length === 0) return
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1))
    }, 600)
    return () => clearTimeout(timer)
  }, [ripples])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 1.5
    const id = rippleIdRef.current++

    setRipples((prev) => [...prev, { x, y, id, size }])
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
  }, [reducedMotion])

  const positionClasses = position === 'bottom-right'
    ? 'bottom-8 right-8'
    : 'bottom-8 left-8'

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'fixed z-50',
        positionClasses,
        'group',
        // Base button styling
        'flex items-center justify-center w-[72px] h-[72px] rounded-full',
        'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600',
        'text-white',
        // Enhanced shadows with glow
        'shadow-[0_4px_6px_-1px_rgba(34,197,94,0.3),0_10px_20px_-5px_rgba(34,197,94,0.25),0_25px_50px_-12px_rgba(34,197,94,0.25)]',
        // Hover glow effect
        'hover:shadow-[0_8px_16px_-4px_rgba(34,197,94,0.5),0_20px_40px_-10px_rgba(34,197,94,0.4),0_30px_60px_-15px_rgba(34,197,94,0.3),0_0_30px_rgba(34,197,94,0.4)]',
        'active:scale-95',
        // Transitions
        'transition-all duration-300 ease-out',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2',
        // Visibility and entry animation
        isVisible
          ? reducedMotion
            ? 'translate-y-0 opacity-100'
            : 'translate-y-0 opacity-100 animate-whatsapp-enter'
          : 'translate-y-20 opacity-0 pointer-events-none'
      )}
      aria-label="Contactar por WhatsApp"
      role="button"
    >
      {/* Pulse ring */}
      {!reducedMotion && (
        <span className="absolute inset-0 rounded-full bg-green-400/25 animate-whatsapp-pulse-1" />
      )}

      {/* Floating animation when visible */}
      {!reducedMotion && isVisible && (
        <span className="absolute inset-0 rounded-full animate-whatsapp-float" />
      )}

      {/* Inner glass highlight */}
      <span className="absolute inset-1 rounded-full bg-gradient-to-br from-white/25 via-white/10 to-transparent pointer-events-none" />

      {/* Top shine effect */}
      <span className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Pressed overlay */}
      <span
        className={cn(
          'absolute inset-0 rounded-full bg-black/20',
          'transition-opacity duration-150',
          isPressed ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Ripple effects */}
      {ripples.map(({ x, y, id, size }) => (
        <span
          key={id}
          className="absolute rounded-full bg-white/40 animate-whatsapp-ripple pointer-events-none"
          style={{
            left: x,
            top: y,
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
          }}
        />
      ))}

      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Icon glow on hover */}
        <span className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Message icon */}
        <MessageCircle
          className={cn(
            'relative w-8 h-8 transition-transform duration-300',
            !reducedMotion && 'group-hover:animate-whatsapp-bounce'
          )}
          strokeWidth={2}
        />
      </div>

      {/* Tooltip */}
      <span
        className={cn(
          'absolute pointer-events-none',
          position === 'bottom-right' ? 'right-full mr-5' : 'left-full ml-5',
          'flex items-center',
          // Animation
          'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
          reducedMotion
            ? 'translate-x-0'
            : 'translate-x-2 group-hover:translate-x-0',
          'transition-all duration-300 ease-out'
        )}
      >
        <span
          className={cn(
            'relative px-5 py-3',
            'bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900',
            'text-white text-[15px] font-medium',
            'rounded-2xl',
            'shadow-2xl shadow-black/30',
            'whitespace-nowrap',
            // Arrow
            'before:absolute before:top-1/2 before:-translate-y-1/2',
            position === 'bottom-right'
              ? 'before:right-full before:border-r-8 before:border-r-transparent before:border-t-[10px] before:border-t-transparent before:border-b-[10px] before:border-b-transparent'
              : 'before:left-full before:border-l-8 before:border-l-transparent before:border-t-[10px] before:border-t-transparent before:border-b-[10px] before:border-b-transparent',
            // Inner highlight
            'after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-r after:from-white/5 after:to-transparent after:pointer-events-none'
          )}
        >
          Escribinos por WhatsApp
        </span>

        {/* Sparkle indicator */}
        {!reducedMotion && (
          <span
            className={cn(
              'absolute -top-1 w-2 h-2 bg-white/60 rounded-full',
              position === 'bottom-right' ? '-right-1' : '-left-1',
              'animate-ping'
            )}
            style={{ animationDuration: '2s' }}
          />
        )}
      </span>

      {/* Screen reader announcement */}
      <span className="sr-only" role="status">
        Abre WhatsApp para contactarnos
      </span>
    </a>
  )
}