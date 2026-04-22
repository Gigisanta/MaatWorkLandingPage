'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks'

// ==========================================
// ANIMATION CLASSES HELPER
// ==========================================

function getAnimationClasses(base: string, reducedMotion: boolean): string {
  if (reducedMotion) return ''
  return base
}

// ==========================================
// ERROR ICON COMPONENTS (SVG)
// ==========================================

function ErrorCircleIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-32 h-32 mx-auto">
      <defs>
        <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="32" fill="url(#errorGrad)" opacity="0.12" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <circle cx="40" cy="40" r="26" fill="none" stroke="url(#errorGrad)" strokeWidth="3" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <g className={getAnimationClasses('animate-fade-in-scale', reducedMotion)} style={{ animationDelay: '0.2s' }}>
        <line x1="30" y1="30" x2="50" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="30" x2="30" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="18" cy="18" r="2" fill="#ef4444" opacity="0.3" className={getAnimationClasses('animate-sparkle', reducedMotion)} />
      <circle cx="62" cy="24" r="1.5" fill="#ef4444" opacity="0.2" className={getAnimationClasses('animate-sparkle', reducedMotion)} style={{ animationDelay: '0.3s' }} />
    </svg>
  )
}

function NetworkErrorIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-32 h-32 mx-auto">
      <defs>
        <linearGradient id="networkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <g className={getAnimationClasses('animate-pulse', reducedMotion)}>
        <line x1="24" y1="40" x2="34" y2="40" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <line x1="46" y1="40" x2="56" y2="40" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      </g>
      <g className={getAnimationClasses('animate-float-gentle', reducedMotion)}>
        <circle cx="16" cy="40" r="10" fill="url(#networkGrad)" opacity="0.8" />
        <line x1="10" y1="36" x2="22" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="10" y1="40" x2="20" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="10" y1="44" x2="22" y2="44" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </g>
      <g className={getAnimationClasses('animate-float-gentle', reducedMotion)} style={{ animationDelay: '0.3s' }}>
        <circle cx="64" cy="40" r="10" fill="url(#networkGrad)" opacity="0.8" />
        <line x1="58" y1="36" x2="70" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="60" y1="40" x2="68" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="58" y1="44" x2="70" y2="44" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </g>
      <g className={getAnimationClasses('animate-fade-in-scale', reducedMotion)} style={{ animationDelay: '0.2s' }}>
        <line x1="36" y1="36" x2="44" y2="44" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function ServerErrorIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-32 h-32 mx-auto">
      <defs>
        <linearGradient id="serverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <g className={getAnimationClasses('animate-float-gentle', reducedMotion)}>
        <rect x="16" y="12" width="48" height="56" rx="4" fill="url(#serverGrad)" opacity="0.8" />
        <rect x="20" y="18" width="40" height="12" rx="2" fill="#1e1b4b" />
        <rect x="20" y="34" width="40" height="12" rx="2" fill="#1e1b4b" />
        <rect x="20" y="50" width="40" height="12" rx="2" fill="#1e1b4b" />
        <circle cx="28" cy="24" r="2.5" fill="#22c55e" className={getAnimationClasses('animate-pulse', reducedMotion)} />
        <circle cx="36" cy="24" r="2.5" fill="#22c55e" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.2s' }} />
        <circle cx="28" cy="40" r="2.5" fill="#ef4444" className={getAnimationClasses('animate-pulse', reducedMotion)} />
        <circle cx="36" cy="40" r="2.5" fill="#f97316" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.3s' }} />
        <circle cx="28" cy="56" r="2.5" fill="#22c55e" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.4s' }} />
      </g>
      <g className={getAnimationClasses('animate-fade-in-scale', reducedMotion)} style={{ animationDelay: '0.3s' }}>
        <circle cx="40" cy="72" r="8" fill="#f97316" className={getAnimationClasses('animate-pulse', reducedMotion)} />
        <text x="40" y="75" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">!</text>
      </g>
    </svg>
  )
}

function AuthErrorIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-32 h-32 mx-auto">
      <defs>
        <linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <g className={getAnimationClasses('animate-float-gentle', reducedMotion)}>
        <path d="M40 8 L68 20 L68 42 Q68 64 40 74 Q12 64 12 42 L12 20 Z" fill="url(#authGrad)" opacity="0.8" />
        <path d="M40 16 L62 26 L62 42 Q62 58 40 66 Q18 58 18 42 L18 26 Z" fill="#1e1b4b" opacity="0.5" />
      </g>
      <g className={getAnimationClasses('animate-fade-in-scale', reducedMotion)} style={{ animationDelay: '0.2s' }}>
        <rect x="32" y="36" width="16" height="14" rx="2" fill="#a78bfa" />
        <path d="M35 36 L35 30 Q35 22 40 22 Q45 22 45 30 L45 36" fill="none" stroke="#a78bfa" strokeWidth="3" />
        <circle cx="40" cy="43" r="2.5" fill="#1e1b4b" />
        <line x1="40" y1="46" x2="40" y2="49" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className={getAnimationClasses('animate-fade-in', reducedMotion)} style={{ animationDelay: '0.4s' }}>
        <line x1="26" y1="22" x2="54" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <line x1="54" y1="22" x2="26" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  )
}

// ==========================================
// ERROR TYPES & CONFIG
// ==========================================

export type ErrorType = 'generic' | 'network' | 'server' | 'auth' | 'not-found' | 'validation'

interface Suggestion {
  icon?: ReactNode
  text: string
}

interface ErrorStateProps {
  type?: ErrorType
  title?: string
  message?: string
  suggestions?: Suggestion[]
  error?: Error | null
  onRetry?: () => void
  retryText?: string
  action?: ReactNode
  className?: string
}

const errorTypeConfig: Record<ErrorType, {
  title: string
  message: string
  defaultSuggestions: Suggestion[]
}> = {
  generic: {
    title: 'Algo salio mal',
    message: 'Ocurrio un error inesperado. Por favor intenta de nuevo.',
    defaultSuggestions: [
      { text: 'Recarga la pagina' },
      { text: 'Intenta en unos minutos' },
      { text: 'Si el problema persiste, contacta a soporte' },
    ],
  },
  network: {
    title: 'Sin conexion',
    message: 'No pudimos conectarnos al servidor. Verifica tu conexion a internet.',
    defaultSuggestions: [
      { text: 'Revisa tu conexion WiFi o de datos' },
      { text: 'Verifica que el cable de red este conectado' },
      { text: 'Intenta recargar la pagina' },
    ],
  },
  server: {
    title: 'Error del servidor',
    message: 'El servidor esta experimentando problemas. Nuestro equipo ya fue notificado.',
    defaultSuggestions: [
      { text: 'Intenta en unos minutos' },
      { text: 'El problema generalmente se resuelve rapido' },
    ],
  },
  auth: {
    title: 'Sin autorizacion',
    message: 'No tienes permisos para acceder a este contenido.',
    defaultSuggestions: [
      { text: 'Inicia sesion con tus credenciales' },
      { text: 'Verifica que tu cuenta este activa' },
      { text: 'Contacta a soporte si crees que es un error' },
    ],
  },
  'not-found': {
    title: 'No encontrado',
    message: 'El contenido que buscas no existe o fue movido.',
    defaultSuggestions: [
      { text: 'Verifica que la URL sea correcta' },
      { text: 'Regresa a la pagina principal' },
      { text: 'Usa el buscador para encontrarlo' },
    ],
  },
  validation: {
    title: 'Datos invalidos',
    message: 'Por favor verifica la informacion ingresada.',
    defaultSuggestions: [
      { text: 'Revisa los campos obligatorios' },
      { text: 'Verifica el formato de los datos' },
    ],
  },
}

const errorIcons: Record<ErrorType, (props: { reducedMotion: boolean }) => React.ReactElement> = {
  generic: (p) => <ErrorCircleIcon {...p} />,
  network: (p) => <NetworkErrorIcon {...p} />,
  server: (p) => <ServerErrorIcon {...p} />,
  auth: (p) => <AuthErrorIcon {...p} />,
  'not-found': (p) => <ErrorCircleIcon {...p} />,
  validation: (p) => <ErrorCircleIcon {...p} />,
}

// ==========================================
// RETRY BUTTON
// ==========================================

interface RetryButtonProps {
  onClick: () => void
  text?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RetryButton({
  onClick,
  text = 'Reintentar',
  variant = 'primary',
  size = 'md',
  className = ''
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = useCallback(() => {
    setIsRetrying(true)
    onClick()
    setTimeout(() => setIsRetrying(false), 1500)
  }, [onClick])

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30 hover:shadow-primary/50',
    secondary: 'bg-white/5 border border-white/12 text-white hover:bg-white/10 hover:border-white/20',
    ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      onClick={handleRetry}
      disabled={isRetrying}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-300 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
        disabled:opacity-70 disabled:cursor-not-allowed
        hover:-translate-y-0.5 hover:scale-[1.02]
        active:scale-[0.98]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isRetrying ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Reintentando...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{text}</span>
        </>
      )}
    </button>
  )
}

// ==========================================
// ERROR STATE COMPONENT
// ==========================================

export function ErrorState({
  type = 'generic',
  title,
  message,
  suggestions,
  error,
  onRetry,
  retryText,
  action,
  className = ''
}: ErrorStateProps) {
  const reducedMotion = useReducedMotion()
  const config = errorTypeConfig[type]
  const Icon = errorIcons[type]

  const displayTitle = title || config.title
  const displayMessage = message || config.message
  const displaySuggestions = suggestions || config.defaultSuggestions

  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-full blur-2xl scale-80 opacity-40" />
        <div className={`relative ${getAnimationClasses('animate-fade-in-scale', reducedMotion)}`}>
          <Icon reducedMotion={reducedMotion} />
        </div>
        <div className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-red-500/60" />
        <div className="absolute -bottom-2 -left-3 w-1 h-1 rounded-full bg-orange-500/50" />
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold text-white mb-2 ${reducedMotion ? '' : 'animate-fade-in-up'}`}>
        {displayTitle}
      </h3>

      {/* Message */}
      <p className={`text-white/50 max-w-sm mb-5 ${reducedMotion ? '' : 'animate-fade-in-up'}`} style={{ animationDelay: '0.1s' }}>
        {displayMessage}
      </p>

      {/* Error details (dev only) */}
      {error && process.env.NODE_ENV === 'development' && (
        <div className={`mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left w-full max-w-sm ${reducedMotion ? '' : 'animate-fade-in-up'}`} style={{ animationDelay: '0.15s' }}>
          <p className="text-xs text-red-400 font-mono break-all">{error.message}</p>
        </div>
      )}

      {/* Suggestions */}
      {displaySuggestions.length > 0 && (
        <div className={`mb-6 text-left w-full max-w-sm ${reducedMotion ? '' : 'animate-fade-in-up'}`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-3 text-sm text-white/60">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <ul className="space-y-1.5">
              {displaySuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  {suggestion.icon && <span className="flex-shrink-0">{suggestion.icon}</span>}
                  <span>{suggestion.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={`flex flex-wrap items-center justify-center gap-3 ${reducedMotion ? '' : 'animate-fade-in-up'}`} style={{ animationDelay: '0.3s' }}>
        {onRetry && <RetryButton onClick={onRetry} text={retryText} />}
        {action}
      </div>
    </div>
  )
}

// ==========================================
// ERROR BOUNDARY FALLBACK
// ==========================================

interface ErrorBoundaryFallbackProps {
  error: Error
  resetError?: () => void
}

export function ErrorBoundaryFallback({ error, resetError }: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <ErrorState
        type="generic"
        error={error}
        onRetry={resetError}
        retryText="Recargar pagina"
      />
    </div>
  )
}
