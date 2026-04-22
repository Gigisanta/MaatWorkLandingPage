'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks'

interface LogoItem {
  name: string
  /** SVG string for the logo */
  svg?: string
  /** Image URL fallback */
  imageUrl?: string
  /** Alt text for accessibility */
  alt: string
}

interface LogoCarouselProps {
  /** Array of logo items to display */
  logos: LogoItem[]
  /** Label text above the carousel */
  label?: string
  /** Animation speed - lower = faster (default: 40) */
  duration?: number
  /** Gap between logos in pixels (default: 48) */
  gap?: number
  /** Direction of scroll: 'left' or 'right' (default: 'left') */
  direction?: 'left' | 'right'
  /** Additional CSS classes */
  className?: string
  /** @deprecated - Use duration instead */
  speed?: number
  /** @deprecated - No longer used */
  visibleCount?: number
}

/**
 * Premium LogoCarousel with smooth infinite marquee animation,
 * glow hover effects, and prefers-reduced-motion support.
 */
export function LogoCarousel({
  logos,
  label = 'Trusted by',
  duration = 40,
  gap = 48,
  direction = 'left',
  className,
}: LogoCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Duplicate logos for seamless infinite scroll
  const trackContent = [...logos, ...logos]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden py-12 select-none',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Edge fade gradients */}
      <div
        className="absolute left-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #04040e 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #04040e 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Label */}
      <div className="text-center mb-10 relative z-10">
        <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-white/30">
          {label}
        </span>
      </div>

      {/* Carousel viewport */}
      <div className="relative flex items-center" style={{ gap: `${gap}px` }}>
        <div
          className={cn(
            'flex items-center will-change-transform',
            !prefersReducedMotion && !isPaused && 'animate-marquee'
          )}
          style={{
            '--marquee-duration': `${duration}s`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal',
            animationPlayState: isPaused ? 'paused' : 'running',
          } as React.CSSProperties}
        >
          {trackContent.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              {/* Logo container with premium hover effects */}
              <div
                className="flex items-center justify-center h-14 px-6 mx-2
                           rounded-2xl transition-all duration-500 ease-out
                           bg-white/[0.02] border border-white/[0.05]
                           hover:bg-white/[0.06] hover:border-white/[0.12]
                           hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]
                           hover:scale-105"
              >
                {logo.svg ? (
                  <div
                    className="w-full h-full flex items-center justify-center text-white/40
                               transition-colors duration-500 group-hover:text-white/90"
                    dangerouslySetInnerHTML={{ __html: logo.svg }}
                    aria-label={logo.alt}
                  />
                ) : logo.imageUrl ? (
                  <Image
                    src={logo.imageUrl}
                    alt={logo.alt}
                    width={64}
                    height={56}
                    className="max-h-full max-w-full object-contain
                               brightness-0 invert opacity-40
                               group-hover:brightness-100 group-hover:opacity-100
                               transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white/40 font-semibold text-sm tracking-wide
                                   group-hover:text-white/80 transition-colors duration-500">
                    {logo.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute bottom-2 right-4 z-20">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
        </div>
      )}
    </div>
  )
}

// Placeholder logos for demonstration
// In production, replace with actual client logos
export const placeholderLogos: LogoItem[] = [
  {
    name: 'TechCorp',
    alt: 'TechCorp logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="24" height="24" rx="4" fill="currentColor"/>
      <text x="36" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">TechCorp</text>
    </svg>`,
  },
  {
    name: 'Innovate Labs',
    alt: 'Innovate Labs logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="20" r="12" stroke="currentColor" stroke-width="2"/>
      <text x="36" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">Innovate</text>
    </svg>`,
  },
  {
    name: 'Digital Flow',
    alt: 'Digital Flow logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 L16 8 L28 20 L16 32 Z" fill="currentColor"/>
      <text x="36" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">Digital</text>
    </svg>`,
  },
  {
    name: 'CloudBase',
    alt: 'CloudBase logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 28 C10 28 4 22 4 16 C4 10 10 6 18 8 C20 4 26 4 28 8 C36 6 40 12 36 18 C38 22 34 28 26 28 Z" fill="currentColor"/>
      <text x="46" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">CloudBase</text>
    </svg>`,
  },
  {
    name: 'DataPro',
    alt: 'DataPro logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="28" height="4" rx="2" fill="currentColor"/>
      <rect x="4" y="20" width="20" height="4" rx="2" fill="currentColor"/>
      <rect x="4" y="28" width="24" height="4" rx="2" fill="currentColor"/>
      <text x="36" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">DataPro</text>
    </svg>`,
  },
  {
    name: 'NextGen',
    alt: 'NextGen logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,4 28,28 4,28" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="36" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">NextGen</text>
    </svg>`,
  },
  {
    name: 'SmartStack',
    alt: 'SmartStack logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="20" height="8" rx="2" fill="currentColor"/>
      <rect x="8" y="16" width="20" height="8" rx="2" fill="currentColor"/>
      <rect x="12" y="28" width="20" height="8" rx="2" fill="currentColor"/>
      <text x="40" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">SmartStack</text>
    </svg>`,
  },
  {
    name: 'AIVenture',
    alt: 'AIVenture logo',
    svg: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="16" cy="20" r="6" fill="currentColor"/>
      <text x="36" y="26" font-family="system-ui" font-size="14" font-weight="600" fill="currentColor">AIVenture</text>
    </svg>`,
  },
]
