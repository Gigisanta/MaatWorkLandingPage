'use client'

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks'

// Toast data interface
export interface SocialProofToastData {
  id: string
  userName: string
  userLocation: string
  action: string
  avatarUrl?: string
  avatarFallback?: string
  timestamp: number
}

// Hook to manage toast queue
export function useSocialProofToast() {
  const [toasts, setToasts] = useState<SocialProofToastData[]>([])
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const addToast = useCallback((data: Omit<SocialProofToastData, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: SocialProofToastData = {
      ...data,
      id,
      timestamp: Date.now(),
    }

    setToasts((prev) => [...prev.slice(-2), newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast, isMounted }
}

// Avatar component with gradient background
function ToastAvatar({
  avatarUrl,
  avatarFallback,
}: {
  avatarUrl?: string
  avatarFallback?: string
}) {
  const [hasError, setHasError] = useState(false)
  const avatarRef = useRef<HTMLImageElement>(null)

  if (avatarUrl && !hasError) {
    return (
      <img
        ref={avatarRef}
        src={avatarUrl}
        alt=""
        className="w-11 h-11 rounded-full object-cover ring-2 ring-white/20"
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/20 shadow-lg">
      {avatarFallback || 'U'}
    </div>
  )
}

// Individual toast component with premium animations
function ToastItem({
  toast,
  onDismiss,
  position,
}: {
  toast: SocialProofToastData
  onDismiss: () => void
  position: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const entranceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (shouldReduceMotion) {
      // Defer to avoid setState-in-effect lint warning
      const frameId = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frameId)
    }

    // Staggered entrance based on position
    entranceTimerRef.current = setTimeout(() => {
      setIsVisible(true)
    }, 100 + position * 80)

    // Auto dismiss after 5 seconds (with 300ms exit animation)
    dismissTimerRef.current = setTimeout(() => {
      setIsExiting(true)
    }, 4500)

    return () => {
      if (entranceTimerRef.current) clearTimeout(entranceTimerRef.current)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [shouldReduceMotion, position])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        // Backdrop and background
        'bg-gradient-to-r from-zinc-900/95 via-zinc-800/95 to-zinc-900/95',
        'backdrop-blur-xl',
        // Border with glow effect
        'border border-white/10',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]',
        // Visibility states
        shouldReduceMotion
          ? 'opacity-100 translate-x-0'
          : isExiting
            ? 'opacity-0 translate-x-8 translate-y-0 scale-95'
            : isVisible
              ? 'opacity-100 translate-x-0 translate-y-0 scale-100'
              : 'opacity-0 translate-x-8 translate-y-2 scale-95',
        // Transition
        'transition-all duration-300 ease-out',
        // Focus
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900'
      )}
      style={
        shouldReduceMotion
          ? {}
          : ({
              '--stagger-delay': `${position * 80}ms`,
            } as React.CSSProperties)
      }
      role="alert"
      aria-live="polite"
    >
      {/* Animated gradient border glow */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-shimmer-sweep" />
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/50">
        <div
          className={cn(
            'h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            shouldReduceMotion ? 'w-0' : 'animate-toast-progress'
          )}
        />
      </div>

      {/* Content */}
      <div className="relative p-4 pl-5 flex items-center gap-4">
        {/* Avatar with subtle pulse */}
        <div className="relative flex-shrink-0">
          <ToastAvatar
            avatarUrl={toast.avatarUrl}
            avatarFallback={toast.avatarFallback}
          />
          {/* Online indicator dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-900 animate-pulse" />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-100 font-medium leading-snug">
            <span className="text-white font-semibold">{toast.userName}</span>
            <span className="text-zinc-400"> {toast.action}</span>
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{toast.userLocation}</p>
        </div>

        {/* Dismiss button */}
        <button
          className={cn(
            'flex-shrink-0 w-7 h-7 rounded-full',
            'flex items-center justify-center',
            'text-zinc-500 hover:text-zinc-300',
            'bg-zinc-800/60 hover:bg-zinc-700/80',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
          )}
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1L11 11M1 11L11 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Toast container with portal
export function SocialProofToastContainer({
  toasts,
  onDismiss,
  isMounted,
}: {
  toasts: SocialProofToastData[]
  onDismiss: (id: string) => void
  isMounted: boolean
}) {
  if (!isMounted) return null

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      aria-label="Social proof notifications"
    >
      {toasts.map((toast, index) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
            position={index}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}

// Demo component to showcase the toast system
export function SocialProofToastDemo() {
  const { toasts, addToast, removeToast, isMounted } = useSocialProofToast()

  // Sample data for demo
  const sampleToasts: Omit<SocialProofToastData, 'id' | 'timestamp'>[] = [
    {
      userName: 'Juan',
      userLocation: 'Buenos Aires, Argentina',
      action: 'se unio al programa',
      avatarFallback: 'J',
    },
    {
      userName: 'Maria',
      userLocation: 'Santiago, Chile',
      action: 'comenzo su prueba gratis',
      avatarFallback: 'M',
    },
    {
      userName: 'Carlos',
      userLocation: 'Madrid, Espana',
      action: ' contrato el plan Pro',
      avatarFallback: 'C',
    },
    {
      userName: 'Ana',
      userLocation: 'Lima, Peru',
      action: 'solicito una demo',
      avatarFallback: 'A',
    },
    {
      userName: 'Diego',
      userLocation: 'Bogota, Colombia',
      action: 'se unio desde',
      avatarFallback: 'D',
    },
  ]

  const triggerToast = () => {
    const randomToast = sampleToasts[Math.floor(Math.random() * sampleToasts.length)]
    addToast(randomToast)
  }

  return (
    <>
      <button
        onClick={triggerToast}
        className="fixed bottom-24 right-6 z-50 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        Trigger Social Proof Toast
      </button>
      <SocialProofToastContainer
        toasts={toasts}
        onDismiss={removeToast}
        isMounted={isMounted}
      />
    </>
  )
}
