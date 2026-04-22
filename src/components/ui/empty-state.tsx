'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks'

// ==========================================
// ANIMATION CLASSES (respecta prefers-reduced-motion)
// ==========================================

function getAnimationClasses(base: string, reducedMotion: boolean): string {
  if (reducedMotion) return ''
  return base
}

// ==========================================
// ICON COMPONENTS (SVG simples y animados)
// ==========================================

function InboxIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="inboxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="56" rx="20" ry="4" fill="#6366f1" opacity="0.2" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <rect x="8" y="20" width="48" height="32" rx="4" fill="url(#inboxGrad)" className={getAnimationClasses('animate-float-gentle', reducedMotion)} />
      <rect x="6" y="16" width="52" height="8" rx="3" fill="#a78bfa" opacity="0.6" />
      <rect x="20" y="28" width="24" height="16" rx="2" fill="white" opacity="0.15" />
      <path d="M20 30 L32 40 L44 30" stroke="white" strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="48" cy="14" r="2" fill="white" className={getAnimationClasses('animate-sparkle', reducedMotion)} />
      <circle cx="14" cy="12" r="1.5" fill="white" className={getAnimationClasses('animate-sparkle', reducedMotion)} style={{ animationDelay: '0.4s' }} />
    </svg>
  )
}

function SearchIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="16" fill="none" stroke="url(#searchGrad)" strokeWidth="4" className={getAnimationClasses('animate-pulse-glow', reducedMotion)} />
      <line x1="40" y1="40" x2="52" y2="52" stroke="url(#searchGrad)" strokeWidth="5" strokeLinecap="round" className={getAnimationClasses('animate-float-gentle', reducedMotion)} />
      <circle cx="26" cy="26" r="7" fill="none" stroke="white" strokeWidth="2" opacity="0.25" />
      <text x="12" y="18" fill="#a78bfa" fontSize="10" opacity="0.5" className={getAnimationClasses('animate-float', reducedMotion)}>?</text>
    </svg>
  )
}

function DataIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="18" rx="18" ry="6" fill="url(#dataGrad)" opacity="0.7" className={getAnimationClasses('animate-float-gentle', reducedMotion)} />
      <rect x="14" y="18" width="36" height="28" fill="url(#dataGrad)" opacity="0.5" />
      <ellipse cx="32" cy="46" rx="18" ry="6" fill="url(#dataGrad)" opacity="0.3" />
      <line x1="20" y1="26" x2="44" y2="26" stroke="white" strokeWidth="2" opacity="0.25" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <line x1="20" y1="33" x2="38" y2="33" stroke="white" strokeWidth="2" opacity="0.2" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.2s' }} />
      <circle cx="10" cy="24" r="2" fill="#a78bfa" className={getAnimationClasses('animate-float', reducedMotion)} />
      <circle cx="54" cy="32" r="1.5" fill="#8b5cf6" className={getAnimationClasses('animate-float', reducedMotion)} style={{ animationDelay: '0.3s' }} />
    </svg>
  )
}

function BellIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M32 8 C18 8 10 22 10 38 L10 48 Q10 54 16 54 L48 54 Q54 54 54 48 L54 38 C54 22 46 8 32 8 Z" fill="url(#bellGrad)" className={getAnimationClasses('animate-float-gentle', reducedMotion)} />
      <ellipse cx="32" cy="56" rx="8" ry="4" fill="#a78bfa" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <circle cx="48" cy="16" r="10" fill="#ef4444" className={getAnimationClasses('animate-pulse-glow', reducedMotion)} />
      <text x="48" y="20" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">0</text>
      <path d="M56 28 Q62 34 56 40" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.4" className={getAnimationClasses('animate-float', reducedMotion)} />
    </svg>
  )
}

function ChartIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <line x1="12" y1="52" x2="12" y2="12" stroke="#6366f1" strokeWidth="2" opacity="0.4" />
      <line x1="12" y1="52" x2="56" y2="52" stroke="#6366f1" strokeWidth="2" opacity="0.4" />
      <rect x="18" y="36" width="10" height="16" rx="2" fill="url(#chartGrad)" className={getAnimationClasses('animate-float-gentle', reducedMotion)} opacity="0.6" />
      <rect x="32" y="26" width="10" height="26" rx="2" fill="url(#chartGrad)" className={getAnimationClasses('animate-float-gentle', reducedMotion)} style={{ animationDelay: '0.15s' }} opacity="0.6" />
      <rect x="46" y="16" width="10" height="36" rx="2" fill="url(#chartGrad)" className={getAnimationClasses('animate-float-gentle', reducedMotion)} style={{ animationDelay: '0.3s' }} opacity="0.6" />
      <circle cx="23" cy="32" r="3" fill="#8b5cf6" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <circle cx="37" cy="22" r="3" fill="#a78bfa" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.2s' }} />
      <circle cx="51" cy="12" r="3" fill="#c4b5fd" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.4s' }} />
    </svg>
  )
}

function TaskIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="taskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="12" y="10" width="40" height="48" rx="4" fill="url(#taskGrad)" opacity="0.7" className={getAnimationClasses('animate-float-gentle', reducedMotion)} />
      <rect x="18" y="6" width="28" height="10" rx="3" fill="#a78bfa" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <rect x="18" y="24" width="8" height="8" rx="1" fill="white" opacity="0.25" />
      <line x1="30" y1="28" x2="46" y2="28" stroke="white" strokeWidth="2" opacity="0.25" className={getAnimationClasses('animate-pulse', reducedMotion)} />
      <rect x="18" y="36" width="8" height="8" rx="1" fill="white" opacity="0.2" />
      <line x1="30" y1="40" x2="42" y2="40" stroke="white" strokeWidth="2" opacity="0.2" className={getAnimationClasses('animate-pulse', reducedMotion)} style={{ animationDelay: '0.2s' }} />
      <circle cx="52" cy="18" r="8" fill="#22c55e" opacity="0.7" className={getAnimationClasses('animate-float', reducedMotion)} />
      <path d="M48 18 L51 21 L56 15" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  )
}

function CustomIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="w-24 h-24 mx-auto">
      <defs>
        <linearGradient id="customGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill="url(#customGrad)" opacity="0.15" />
      <circle cx="32" cy="32" r="16" fill="url(#customGrad)" opacity="0.3" />
      <circle cx="32" cy="32" r="8" fill="url(#customGrad)" opacity="0.5" />
      <circle cx="22" cy="22" r="2" fill="white" className={getAnimationClasses('animate-sparkle', reducedMotion)} />
      <circle cx="44" cy="26" r="1.5" fill="white" className={getAnimationClasses('animate-sparkle', reducedMotion)} style={{ animationDelay: '0.3s' }} />
      <circle cx="26" cy="44" r="1.5" fill="white" className={getAnimationClasses('animate-sparkle', reducedMotion)} style={{ animationDelay: '0.6s' }} />
    </svg>
  )
}

// ==========================================
// EMPTY STATE TYPES & COMPONENT
// ==========================================

export type EmptyStateType = 'inbox' | 'search' | 'data' | 'notifications' | 'chart' | 'tasks' | 'custom'

interface EmptyStateProps {
  type?: EmptyStateType
  title: string
  description?: string
  action?: ReactNode
  customIcon?: ReactNode
  className?: string
}

const icons: Record<Exclude<EmptyStateType, 'custom'>, (props: { reducedMotion: boolean }) => React.ReactElement> = {
  inbox: (p) => <InboxIcon {...p} />,
  search: (p) => <SearchIcon {...p} />,
  data: (p) => <DataIcon {...p} />,
  notifications: (p) => <BellIcon {...p} />,
  chart: (p) => <ChartIcon {...p} />,
  tasks: (p) => <TaskIcon {...p} />,
}

export function EmptyState({
  type = 'inbox',
  title,
  description,
  action,
  customIcon,
  className = ''
}: EmptyStateProps) {
  const reducedMotion = useReducedMotion()
  const IconComponent = type === 'custom' ? null : icons[type]

  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-purple/20 to-primary/20 rounded-full blur-2xl scale-80 opacity-50" />
        <div className="relative">
          {customIcon || (IconComponent && <IconComponent reducedMotion={reducedMotion} />)}
        </div>
        <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-accent-purple/50" />
        <div className="absolute -bottom-1 -left-3 w-1.5 h-1.5 rounded-full bg-primary/50" />
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold text-white mb-2 ${reducedMotion ? '' : 'animate-fade-in-up'}`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`text-white/50 max-w-sm mb-6 ${reducedMotion ? '' : 'animate-fade-in-up'}`} style={{ animationDelay: '0.1s' }}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className={reducedMotion ? '' : 'animate-fade-in-up'} style={{ animationDelay: '0.2s' }}>
          {action}
        </div>
      )}
    </div>
  )
}

// ==========================================
// SKELETON COMPONENTS
// ==========================================

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={style} />
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonProps & { lines?: number }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: i === lines - 1 ? '70%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton-card bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 ${className}`}>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }: SkeletonProps & { rows?: number; cols?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-4 pb-3 border-b border-white/[0.06]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonList({ items = 3, className = '' }: SkeletonProps & { items?: number }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
