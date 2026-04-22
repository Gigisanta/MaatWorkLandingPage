'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks'

// ==========================================
// PREMIUM SCROLL PROGRESS BAR
// ==========================================

interface ScrollProgressProps {
  className?: string
  height?: 'sm' | 'md' | 'lg'
  showGlow?: boolean
  gradient?: 'primary' | 'purple' | 'mixed' | 'white'
  position?: 'top' | 'bottom'
}

export function ScrollProgress({
  className = '',
  height = 'md',
  showGlow = true,
  gradient = 'mixed',
  position = 'top'
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isShimmering, setIsShimmering] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let rafId: number
    let lastScrollY = 0

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

      // Trigger shimmer on scroll movement
      if (Math.abs(scrollTop - lastScrollY) > 2) {
        setIsShimmering(true)
        lastScrollY = scrollTop
      } else {
        setIsShimmering(false)
      }

      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [reducedMotion])

  const heights = { sm: 'h-[2px]', md: 'h-[3px]', lg: 'h-[4px]' }
  const trackHeights = { sm: 'h-[2px]', md: 'h-[3px]', lg: 'h-[4px]' }

  const gradients = {
    primary: 'from-[#6366f1] via-[#818cf8] to-[#6366f1]',
    purple: 'from-[#8b5cf6] via-[#a78bfa] to-[#8b5cf6]',
    mixed: 'from-[#6366f1] via-[#8b5cf6] via-50% to-[#6366f1]',
    white: 'from-white/80 via-white/60 to-white/80'
  }

  const glows = {
    primary: '[box-shadow:0_0_12px_rgba(99,102,241,0.5),0_0_24px_rgba(99,102,241,0.25)]',
    purple: '[box-shadow:0_0_12px_rgba(139,92,246,0.5),0_0_24px_rgba(139,92,246,0.25)]',
    mixed: '[box-shadow:0_0_16px_rgba(99,102,241,0.4),0_0_32px_rgba(139,92,246,0.2)]',
    white: '[box-shadow:0_0_8px_rgba(255,255,255,0.3)]'
  }

  if (reducedMotion) {
    return null
  }

  return (
    <div
      className={`fixed ${position}-0 left-0 right-0 z-[100] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      {/* Track background */}
      <div className={`w-full bg-black/20 backdrop-blur-sm ${trackHeights[height]}`}>
        {/* Progress bar with glow */}
        <div
          className={`
            relative ${heights[height]} rounded-full
            bg-gradient-to-r ${gradients[gradient]}
            ${showGlow ? glows[gradient] : ''}
            transition-[width] duration-100 ease-out
            ${isShimmering ? 'after:absolute after:top-0 after:right-0 after:w-[60px] after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:animate-[shimmer_0.6s_ease-out]' : ''}
          `}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ==========================================
// CIRCULAR PROGRESS INDICATOR
// ==========================================

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  className?: string
  gradient?: 'primary' | 'purple' | 'mixed'
}

export function CircularProgress({
  progress,
  size = 64,
  strokeWidth = 3,
  showValue = true,
  className = '',
  gradient = 'mixed'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const gradientIds = {
    primary: 'circularGradPrimary',
    purple: 'circularGradPurple',
    mixed: 'circularGradMixed'
  }

  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id={gradientIds[gradient]} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientIds[gradient]})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: reducedMotion ? 'none' : 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))'
          }}
        />
      </svg>

      {showValue && (
        <span className="absolute text-xs font-medium text-white/70">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}

// ==========================================
// READING TIME PROGRESS
// ==========================================

interface ReadingProgressProps {
  className?: string
  contentRef?: React.RefObject<HTMLElement | null>
}

export function ReadingProgress({
  className = '',
  contentRef
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const updateProgress = () => {
      if (contentRef?.current) {
        const element = contentRef.current
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = element.offsetHeight
        const viewportHeight = window.innerHeight
        const scrollTop = window.scrollY

        const start = elementTop - viewportHeight
        const end = elementTop + elementHeight
        const current = scrollTop

        const readProgress = ((current - start) / (end - start)) * 100
        setProgress(Math.min(100, Math.max(0, readProgress)))
      } else {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollTop = window.scrollY
        const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
        setProgress(Math.min(100, Math.max(0, scrollProgress)))
      }
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [reducedMotion, contentRef])

  if (reducedMotion) {
    return null
  }

  return (
    <div
      className={`fixed left-0 top-1/2 -translate-y-1/2 w-1 h-32 z-50 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div className="w-full h-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="w-full bg-gradient-to-b from-primary to-accent-purple rounded-full transition-all duration-150 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ==========================================
// CHAPTER PROGRESS INDICATOR
// ==========================================

interface Chapter {
  id: string
  title: string
  element: HTMLElement
}

interface ChapterProgressProps {
  chapters: Chapter[]
  className?: string
}

export function ChapterProgress({
  chapters,
  className = ''
}: ChapterProgressProps) {
  const [activeChapter, setActiveChapter] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || chapters.length === 0) return

    const observers: IntersectionObserver[] = []

    chapters.forEach((chapter, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveChapter(index)
          }
        },
        { threshold: 0.5, rootMargin: '-20% 0px -30% 0px' }
      )

      observer.observe(chapter.element)
      observers.push(observer)
    })

    return () => observers.forEach(obs => obs.disconnect())
  }, [reducedMotion, chapters])

  if (reducedMotion || chapters.length === 0) {
    return null
  }

  return (
    <nav
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 ${className}`}
      aria-label="Chapter navigation"
    >
      <div className="flex flex-col gap-3">
        {chapters.map((chapter, index) => {
          const isActive = index === activeChapter
          const isPast = index < activeChapter

          return (
            <div key={chapter.id} className="relative group">
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-xs text-white/70 whitespace-nowrap bg-black/60 px-2 py-1 rounded">
                  {chapter.title}
                </span>
              </div>

              {/* Dot */}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary scale-125 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                    : isPast
                    ? 'bg-accent-purple/60'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            </div>
          )
        })}
      </div>

      {/* Connecting line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/5">
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-accent-purple transition-all duration-300"
          style={{
            height: `${((activeChapter + 1) / chapters.length) * 100}%`
          }}
        />
      </div>
    </nav>
  )
}

// ==========================================
// COMPACT PROGRESS BAR (for headers)
// ==========================================

interface CompactProgressProps {
  progress: number
  className?: string
}

export function CompactProgress({
  progress,
  className = ''
}: CompactProgressProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return null
  }

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 to-accent-purple/40 ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-accent-purple transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
