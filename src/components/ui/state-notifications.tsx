'use client'

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks'

// ==========================================
// NETWORK STATUS TYPES
// ==========================================

type NetworkStatus = 'online' | 'offline' | 'reconnecting'

interface NetworkNotification {
  id: string
  status: NetworkStatus
  message: string
  timestamp: number
}

// ==========================================
// NETWORK STATUS CONTEXT & HOOK
// ==========================================

interface NetworkContextValue {
  isOnline: boolean
  wasOffline: boolean
  showNotification: (status: NetworkStatus, message: string) => void
  notifications: NetworkNotification[]
  dismissNotification: (id: string) => void
}

const NetworkContext = createContext<NetworkContextValue | null>(null)

export function useNetworkStatus() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetworkStatus must be used within NetworkProvider')
  }
  return context
}

// ==========================================
// NETWORK STATUS PROVIDER
// ==========================================

interface NetworkProviderProps {
  children: ReactNode
  enableNotifications?: boolean
  reconnectTimeout?: number
}

export function NetworkProvider({
  children,
  enableNotifications = true,
  reconnectTimeout = 3000
}: NetworkProviderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)
  const [notifications, setNotifications] = useState<NetworkNotification[]>([])

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline && enableNotifications) {
        showNotification('online', 'Conexion restaurada')
      }
      setWasOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      if (enableNotifications) {
        showNotification('offline', 'Conexion perdida. Trabajando en reconectar...')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline, enableNotifications])

  const showNotification = useCallback((status: NetworkStatus, message: string) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: NetworkNotification = {
      id,
      status,
      message,
      timestamp: Date.now(),
    }

    setNotifications(prev => [...prev, notification])

    if (status !== 'offline') {
      setTimeout(() => {
        dismissNotification(id)
      }, 4000)
    }
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const value: NetworkContextValue = {
    isOnline,
    wasOffline,
    showNotification,
    notifications,
    dismissNotification,
  }

  return (
    <NetworkContext.Provider value={value}>
      {children}
      {enableNotifications && <NetworkToastContainer />}
    </NetworkContext.Provider>
  )
}

// ==========================================
// TOAST ICONS WITH GLOW
// ==========================================

function OnlineIcon({ glowing }: { glowing?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${glowing ? 'animate-icon-glow' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={glowing ? { filter: 'drop-shadow(0 0 6px currentColor)' } : undefined}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function OfflineIcon({ glowing }: { glowing?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${glowing ? 'animate-icon-pulse' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={glowing ? { filter: 'drop-shadow(0 0 6px currentColor)' } : undefined}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
    </svg>
  )
}

function ReconnectingIcon({ glowing }: { glowing?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 animate-spin ${glowing ? 'animate-icon-glow' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      style={glowing ? { filter: 'drop-shadow(0 0 6px currentColor)' } : undefined}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

// ==========================================
// INDIVIDUAL TOAST COMPONENT
// ==========================================

interface ToastProps {
  notification: NetworkNotification
  onDismiss: (id: string) => void
}

function Toast({ notification, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 20)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onDismiss(notification.id), reducedMotion ? 100 : 300)
  }, [notification.id, onDismiss, reducedMotion])

  const statusConfig = {
    online: {
      icon: <OnlineIcon glowing />,
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-100',
      progressColor: 'bg-emerald-500/40',
      glowColor: 'rgba(52, 211, 153, 0.5)',
    },
    offline: {
      icon: <OfflineIcon glowing />,
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/40',
      iconColor: 'text-red-400',
      textColor: 'text-red-100',
      progressColor: 'bg-red-500/40',
      glowColor: 'rgba(248, 113, 113, 0.5)',
    },
    reconnecting: {
      icon: <ReconnectingIcon glowing />,
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/40',
      iconColor: 'text-orange-400',
      textColor: 'text-orange-100',
      progressColor: 'bg-orange-500/40',
      glowColor: 'rgba(251, 146, 60, 0.5)',
    },
  }

  const config = statusConfig[notification.status]
  const animationDuration = notification.status === 'offline' ? 'none' : '4000ms'

  const getAnimationClass = () => {
    if (reducedMotion) {
      return isExiting ? 'opacity-0' : 'opacity-100'
    }
    if (isExiting) return 'toast-exit'
    if (!isVisible) return 'toast-enter'
    return 'toast-visible'
  }

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md
        shadow-lg shadow-black/30 overflow-hidden
        ${config.bgColor} ${config.borderColor}
        ${getAnimationClass()}
        min-w-[300px] max-w-[400px]
      `}
      role="alert"
      aria-live="polite"
      style={{
        boxShadow: `0 4px 24px ${config.glowColor}20, 0 0 0 1px ${config.glowColor}30`,
      }}
    >
      {/* Progress bar */}
      {notification.status !== 'offline' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
          <div
            className={`h-full ${config.progressColor} ${reducedMotion ? '' : 'animate-progress'}`}
            style={{
              animationDuration: reducedMotion ? 'none' : animationDuration,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
              animationPlayState: isExiting ? 'paused' : 'running',
            }}
          />
        </div>
      )}

      {/* Glow effect behind icon */}
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full blur-xl ${config.iconColor} opacity-30`}
      />

      {/* Icon */}
      <div className={`relative flex-shrink-0 ${config.iconColor}`}>
        {config.icon}
      </div>

      {/* Message */}
      <p className={`relative flex-1 text-sm font-medium ${config.textColor}`}>
        {notification.message}
      </p>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className={`
          relative flex-shrink-0 p-1.5 rounded-xl
          ${config.iconColor} hover:bg-white/10
          transition-all duration-200 hover:scale-110 active:scale-95
        `}
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ==========================================
// TOAST CONTAINER
// ==========================================

function NetworkToastContainer() {
  const { notifications, dismissNotification } = useNetworkStatus()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto ${reducedMotion ? '' : 'toast-container-enter'}`}
        >
          <Toast notification={notification} onDismiss={dismissNotification} />
        </div>
      ))}
    </div>
  )
}

// ==========================================
// CONNECTION QUALITY INDICATOR
// ==========================================

interface ConnectionIndicatorProps {
  className?: string
  showLabel?: boolean
}

export function ConnectionIndicator({ className = '', showLabel = false }: ConnectionIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setIsReconnecting(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const indicatorColor = isOnline ? 'bg-emerald-500' : isReconnecting ? 'bg-orange-500 animate-pulse' : 'bg-red-500'
  const labelText = isOnline ? 'Conectado' : isReconnecting ? 'Reconectando...' : 'Sin conexion'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${indicatorColor}`} />
      {showLabel && (
        <span className="text-xs text-white/60">{labelText}</span>
      )}
    </div>
  )
}

// ==========================================
// REALTIME STATUS BANNER
// ==========================================

interface RealtimeStatusBannerProps {
  className?: string
}

export function RealtimeStatusBanner({ className = '' }: RealtimeStatusBannerProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const [bannerType, setBannerType] = useState<'offline' | 'reconnecting' | 'restored'>('offline')
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setBannerType('restored')
      setShowBanner(true)
      if (!reducedMotion) {
        setTimeout(() => setShowBanner(false), 3000)
      } else {
        setTimeout(() => setShowBanner(false), 500)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setBannerType('offline')
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [reducedMotion])

  if (!showBanner) return null

  const bannerConfig = {
    offline: {
      bgColor: 'bg-red-500/95',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      ),
      message: 'Sin conexion a internet',
    },
    reconnecting: {
      bgColor: 'bg-orange-500/95',
      icon: (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ),
      message: 'Reconectando...',
    },
    restored: {
      bgColor: 'bg-emerald-500/95',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      message: 'Conexion restaurada',
    },
  }

  const config = bannerConfig[bannerType]

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[9999]
        flex items-center justify-center gap-2 px-4 py-2.5
        ${config.bgColor} text-white text-sm font-medium
        ${reducedMotion ? '' : 'banner-enter'}
        ${className}
      `}
    >
      {config.icon}
      <span>{config.message}</span>
    </div>
  )
}

// ==========================================
// ANIMATIONS
// ==========================================

const styleId = 'network-toast-animations-v2'
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    /* Toast enter/exit animations */
    @keyframes toast-slide-in {
      from {
        transform: translateX(100%) scale(0.9);
        opacity: 0;
      }
      to {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }

    @keyframes toast-slide-out {
      from {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      to {
        transform: translateX(100%) scale(0.9);
        opacity: 0;
      }
    }

    @keyframes toast-fade-in {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast-enter {
      animation: toast-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .toast-exit {
      animation: toast-slide-out 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
    }

    .toast-visible {
      animation: none;
      transform: translateX(0) scale(1);
      opacity: 1;
    }

    .toast-container-enter {
      animation: toast-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Banner animation */
    @keyframes banner-slide-in {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .banner-enter {
      animation: banner-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Progress bar animation */
    @keyframes progress-shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .animate-progress {
      animation: progress-shrink 4s linear forwards;
    }

    /* Icon glow animation */
    @keyframes icon-glow {
      0%, 100% {
        filter: drop-shadow(0 0 4px currentColor);
      }
      50% {
        filter: drop-shadow(0 0 10px currentColor);
      }
    }

    .animate-icon-glow {
      animation: icon-glow 2s ease-in-out infinite;
    }

    .animate-icon-pulse {
      animation: icon-glow 1.5s ease-in-out infinite;
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .toast-enter,
      .toast-exit,
      .toast-container-enter,
      .banner-enter,
      .animate-progress,
      .animate-icon-glow,
      .animate-icon-pulse {
        animation: none;
      }
    }
  `
  document.head.appendChild(style)
}
