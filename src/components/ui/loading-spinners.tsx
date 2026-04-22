'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks'

// ==========================================
// SPINNER BASE SIZES
// ==========================================

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const containerSizes: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24'
}

const dotSizes: Record<SpinnerSize, string> = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5'
}

const barHeights: Record<SpinnerSize, string[]> = {
  xs: ['h-1', 'h-2', 'h-3', 'h-2', 'h-1'],
  sm: ['h-2', 'h-4', 'h-5', 'h-4', 'h-2'],
  md: ['h-3', 'h-6', 'h-8', 'h-6', 'h-3'],
  lg: ['h-4', 'h-8', 'h-10', 'h-8', 'h-4'],
  xl: ['h-5', 'h-10', 'h-12', 'h-10', 'h-5'],
  '2xl': ['h-6', 'h-12', 'h-16', 'h-12', 'h-6']
}

const ringWidths: Record<SpinnerSize, string> = {
  xs: 'border',
  sm: 'border',
  md: 'border-2',
  lg: 'border-2',
  xl: 'border-[3px]',
  '2xl': 'border-4'
}

// ==========================================
// PREMIUM GRADIENT SPINNER
// ==========================================

interface GradientSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function GradientSpinner({ size = 'md', className = '' }: GradientSpinnerProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #a78bfa, #c4b5fd, #6366f1)',
          animationDuration: reduced ? '0ms' : '1.5s',
          animationTimingFunction: 'linear'
        }}
      />
      <div
        className="absolute inset-1 rounded-full animate-pulse"
        style={{
          background: '#04040e',
          animationDuration: reduced ? '0ms' : '2s'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full animate-pulse"
          style={{
            width: '33%',
            height: '33%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.8), rgba(99,102,241,0.4))',
            filter: 'blur(3px)',
            animationDuration: reduced ? '0ms' : '1.8s'
          }}
        />
      </div>
    </div>
  )
}

// ==========================================
// PULSE RING SPINNER
// ==========================================

interface PulseRingSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function PulseRingSpinner({ size = 'md', className = '' }: PulseRingSpinnerProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2"
          style={{
            animation: reduced ? 'none' : `pulse-ring 1.4s ease-out infinite`,
            animationDelay: `${i * 0.2}s`,
            opacity: reduced ? 0.3 : 1,
            borderColor: i === 1 ? '#8b5cf6' : '#6366f1'
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full"
          style={{
            width: '25%',
            height: '25%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(139,92,246,0.3)',
            animation: reduced ? 'none' : 'pulse 1.4s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}

// Alias for backward compatibility
export { PulseRingSpinner as PulseDots }

// ==========================================
// WAVE BARS SPINNER
// ==========================================

interface WaveBarsProps {
  size?: SpinnerSize
  className?: string
  barCount?: number
}

export function WaveBars({ size = 'md', className = '', barCount = 5 }: WaveBarsProps) {
  const reduced = useReducedMotion()
  const bars = barHeights[size]

  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: bars[i]?.replace('h-', '') + 'px' || '24px',
            background: `linear-gradient(to top, #6366f1 ${i % 2 === 0 ? '0%' : '50%'}, #8b5cf6 100%)`,
            animation: reduced ? 'none' : `wave-bar 0.8s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            boxShadow: '0 0 8px rgba(139,92,246,0.4)'
          }}
        />
      ))}
    </div>
  )
}

// ==========================================
// DUAL RING SPINNER
// ==========================================

interface DualRingProps {
  size?: SpinnerSize
  className?: string
}

export function DualRing({ size = 'md', className = '' }: DualRingProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full border-primary/20 ${ringWidths[size]} animate-spin`}
        style={{ animationDuration: reduced ? '0ms' : '1.8s' }}
      />
      <div
        className={`absolute inset-2 rounded-full border-accent-purple/30 ${ringWidths[size]} animate-spin`}
        style={{ animationDuration: reduced ? '0ms' : '1.2s', animationDirection: 'reverse' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full"
          style={{
            width: '25%',
            height: '25%',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5))',
            animation: reduced ? 'none' : 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}

// ==========================================
// DOTS BOUNCE SPINNER
// ==========================================

interface BounceDotsProps {
  size?: SpinnerSize
  className?: string
  dotCount?: number
}

export function BounceDots({ size = 'md', className = '', dotCount = 3 }: BounceDotsProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {Array.from({ length: dotCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: dotSizes[size].replace('w-', '') + 'px',
            height: dotSizes[size].replace('h-', '') + 'px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            animation: reduced ? 'none' : `bounce-dot 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
            boxShadow: '0 0 12px rgba(139,92,246,0.6)'
          }}
        />
      ))}
    </div>
  )
}

// ==========================================
// SYNC DOTS SPINNER
// ==========================================

interface SyncDotsProps {
  size?: SpinnerSize
  className?: string
}

export function SyncDots({ size = 'md', className = '' }: SyncDotsProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: dotSizes[size].replace('w-', '') + 'px',
            height: dotSizes[size].replace('h-', '') + 'px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            animation: reduced ? 'none' : `sync-dot 1s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
            boxShadow: '0 0 10px rgba(99,102,241,0.5)'
          }}
        />
      ))}
    </div>
  )
}

// ==========================================
// GEAR SPINNER
// ==========================================

interface GearSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function GearSpinner({ size = 'md', className = '' }: GearSpinnerProps) {
  const reduced = useReducedMotion()
  const dimMap: Record<SpinnerSize, number> = {
    xs: 12,
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64,
    '2xl': 96
  }
  const dim = dimMap[size]

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      {[0, 1].map((i) => (
        <svg
          key={i}
          className="absolute"
          style={{
            width: `${dim - i * 8}px`,
            height: `${dim - i * 8}px`,
            top: `${i * 4}px`,
            left: `${i * 4}px`,
            animation: reduced ? 'none' : `spin ${2 + i * 0.5}s linear infinite`,
            animationDirection: i === 0 ? 'normal' : 'reverse'
          }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#gearGrad)"
            strokeWidth="8"
            strokeDasharray={`${100 / (8 + i * 4) * 0.5} ${100 / (8 + i * 4) * 0.5}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full"
          style={{
            width: '33%',
            height: '33%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 16px rgba(99,102,241,0.6)',
            animation: reduced ? 'none' : 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}

// ==========================================
// ORBITING DOTS SPINNER
// ==========================================

interface OrbitSpinnerProps {
  size?: SpinnerSize
  className?: string
  dotCount?: number
}

const orbitSizes: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
  '2xl': 96
}

export function OrbitSpinner({ size = 'md', className = '', dotCount = 3 }: OrbitSpinnerProps) {
  const reduced = useReducedMotion()
  const dim = orbitSizes[size]
  const dotSize = Math.max(4, dim / 8)

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      <div
        className="absolute rounded-full"
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 0 8px rgba(99,102,241,0.6)'
        }}
      />
      {Array.from({ length: dotCount }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            background: i % 2 === 0 ? '#6366f1' : '#8b5cf6',
            boxShadow: `0 0 ${6 + i * 2}px ${i % 2 === 0 ? 'rgba(99,102,241,0.6)' : 'rgba(139,92,246,0.6)'}`,
            animation: reduced ? 'none' : `orbit ${1.2 + i * 0.3}s linear infinite`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}

// ==========================================
// LIQUID SPINNER (Morphing blob)
// ==========================================

interface LiquidSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function LiquidSpinner({ size = 'md', className = '' }: LiquidSpinnerProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
          animation: reduced ? 'none' : 'liquid-morph 2s ease-in-out infinite',
          filter: 'blur(0px)'
        }}
      />
      <div
        className="absolute inset-1 rounded-lg"
        style={{
          background: 'rgba(4,4,14,0.4)',
          animation: reduced ? 'none' : 'liquid-inner 2s ease-in-out infinite'
        }}
      />
    </div>
  )
}

// ==========================================
// MESH SPINNER (Concentric dashed rings)
// ==========================================

interface MeshSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function MeshSpinner({ size = 'md', className = '' }: MeshSpinnerProps) {
  const reduced = useReducedMotion()

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      <div
        className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin"
        style={{ animationDuration: reduced ? '0ms' : '4s' }}
      />
      <div
        className="absolute inset-1 border border-dashed border-accent-purple/30 rounded-full animate-spin"
        style={{ animationDuration: reduced ? '0ms' : '3s', animationDirection: 'reverse' }}
      />
      <div
        className="absolute inset-2 border border-primary/40 rounded-full animate-spin"
        style={{ animationDuration: reduced ? '0ms' : '2s' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full"
          style={{
            width: '25%',
            height: '25%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 16px rgba(99,102,241,0.5)',
            animation: reduced ? 'none' : 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}

// ==========================================
// PRESET SPINNER COMPONENTS
// ==========================================

export function BrandSpinner({ size = 'md', className = '' }: { size?: SpinnerSize; className?: string }) {
  return <GradientSpinner size={size} className={className} />
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: SpinnerSize; className?: string }) {
  return <PulseRingSpinner size={size} className={className} />
}

// ==========================================
// LOADING OVERLAY
// ==========================================

type SpinnerType = 'gradient' | 'pulse' | 'wave' | 'dual' | 'bounce' | 'sync' | 'gear' | 'orbit' | 'liquid' | 'mesh'

interface LoadingOverlayProps {
  isLoading: boolean
  children: ReactNode
  spinner?: SpinnerType
  message?: string
  className?: string
  blur?: boolean
}

const spinnerComponents: Record<SpinnerType, React.ComponentType<{ size?: SpinnerSize; className?: string }>> = {
  gradient: GradientSpinner,
  pulse: PulseRingSpinner,
  wave: WaveBars,
  dual: DualRing,
  bounce: BounceDots,
  sync: SyncDots,
  gear: GearSpinner,
  orbit: OrbitSpinner,
  liquid: LiquidSpinner,
  mesh: MeshSpinner
}

export function LoadingOverlay({
  isLoading,
  children,
  spinner = 'gradient',
  message,
  className = '',
  blur = true
}: LoadingOverlayProps) {
  const SpinnerComponent = spinnerComponents[spinner]

  if (!isLoading) return <>{children}</>

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-300 ${
          blur ? 'bg-[#04040e]/80 backdrop-blur-sm' : 'bg-[#04040e]/60'
        } rounded-xl`}
        role="status"
        aria-label={message || 'Loading'}
      >
        <SpinnerComponent size="lg" />
        {message && (
          <p
            className="mt-4 text-sm text-white/60"
            style={{ animation: 'fade-in-up 0.3s ease-out forwards' }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// ==========================================
// INLINE LOADING
// ==========================================

interface InlineLoadingProps {
  message?: string
  spinner?: SpinnerType
  className?: string
  size?: SpinnerSize
}

export function InlineLoading({
  message,
  spinner = 'sync',
  className = '',
  size = 'sm'
}: InlineLoadingProps) {
  const SpinnerComponent = spinnerComponents[spinner]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SpinnerComponent size={size} />
      {message && <span className="text-sm text-white/50">{message}</span>}
    </div>
  )
}

// ==========================================
// PROGRESS BAR
// ==========================================

interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const progressHeights: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2'
}

export function ProgressBar({
  progress,
  size = 'md',
  showLabel = false,
  className = ''
}: ProgressBarProps) {
  const reduced = useReducedMotion()
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/50">Progreso</span>
          <span className="text-xs font-medium text-white/70">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${progressHeights[size]}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${clampedProgress}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
            transition: reduced ? 'none' : 'width 0.5s ease-out',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {!reduced && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer-sweep 1.5s ease-in-out infinite'
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// CSS KEYFRAMES INJECTOR (for components used outside Next.js context)
// ==========================================

export function SpinnerKeyframes() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) return

    const styleId = 'premium-spinner-keyframes'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes wave-bar {
          0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes sync-dot {
          0%, 100% { transform: translateX(-4px); opacity: 0.4; }
          50% { transform: translateX(4px); opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes liquid-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; transform: rotate(180deg); }
          75% { border-radius: 60% 40% 60% 30% / 60% 30% 50% 60%; }
        }
        @keyframes liquid-inner {
          0%, 100% { opacity: 0.6; transform: scale(0.9); }
          50% { opacity: 0.3; transform: scale(1); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `
      document.head.appendChild(style)
    }

    setMounted(true)
    return () => {}
  }, [mounted])

  return null
}
