'use client'

import { useRef, useEffect, useState, useMemo, useCallback, type CSSProperties } from 'react'
import { useParallax, useDividerVisibility, useReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

// Section definition for the progress indicator
interface SectionDefinition {
  id: string
  name: string
}

export type DividerVariant = 'wave' | 'curve' | 'slope' | 'dots' | 'particles' | 'gradient' | 'mountain' | 'tiered'
export type DividerPosition = 'top' | 'bottom' | 'both'

interface SectionDividerProps {
  variant?: DividerVariant
  position?: DividerPosition
  className?: string
  speed?: number
  particleCount?: number
  particleColor?: string
  gradientFrom?: string
  gradientTo?: string
}

// Seeded pseudo-random number generator for deterministic visuals
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// Elegant multi-layer SVG wave paths with gradient fills
const wavePaths = {
  smooth: {
    primary: 'M0,64 C320,100 480,28 720,64 C960,100 1120,28 1440,64 L1440,128 L0,128 Z',
    secondary: 'M0,80 C280,120 520,40 720,80 C920,120 1160,40 1440,80 L1440,128 L0,128 Z',
  },
  steep: {
    primary: 'M0,80 C240,20 480,120 720,60 C960,0 1200,100 1440,40 L1440,128 L0,128 Z',
    secondary: 'M0,60 C200,100 400,20 720,70 C1000,110 1200,30 1440,60 L1440,128 L0,128 Z',
  },
  gentle: {
    primary: 'M0,96 C360,64 720,128 1080,96 C1260,80 1380,88 1440,96 L1440,128 L0,128 Z',
    secondary: 'M0,80 C320,100 680,60 1080,80 C1300,92 1400,84 1440,80 L1440,128 L0,128 Z',
  },
  angular: {
    primary: 'M0,96 L360,48 L720,112 L1080,56 L1440,96 L1440,128 L0,128 Z',
    secondary: 'M0,112 L300,72 L660,96 L1020,64 L1440,112 L1440,128 L0,128 Z',
  },
}

// Mountain silhouette paths for editorial dividers
const mountainPaths = {
  back: 'M0,128 L0,60 L180,90 L360,40 L540,85 L720,35 L900,75 L1080,45 L1260,80 L1440,50 L1440,128 Z',
  middle: 'M0,128 L0,75 L200,95 L400,55 L600,90 L800,50 L1000,85 L1200,60 L1440,80 L1440,128 Z',
  front: 'M0,128 L0,90 L240,110 L480,70 L720,100 L960,65 L1200,95 L1440,75 L1440,128 Z',
}

// Tiered/stepped divider paths
const tieredPaths = {
  large: 'M0,128 L0,40 L320,40 L320,70 L640,70 L640,50 L960,50 L960,80 L1280,80 L1280,55 L1440,55 L1440,128 Z',
  medium: 'M0,128 L0,55 L360,55 L360,75 L720,75 L720,60 L1080,60 L1080,85 L1440,85 L1440,128 Z',
  small: 'M0,128 L0,70 L400,70 L400,82 L800,82 L800,72 L1200,72 L1200,90 L1440,90 L1440,128 Z',
}

function WaveDivider({
  position,
  variant = 'smooth',
  speed = 1,
  className
}: {
  position: 'top' | 'bottom'
  variant?: keyof typeof wavePaths
  speed?: number
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  const paths = wavePaths[variant]

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 overflow-hidden pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '128px' }}
    >
      {/* Vibrant glow layer with color gradient */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? 'linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
          filter: 'blur(24px)',
        }}
        aria-hidden="true"
      />
      {/* Iridescent shimmer line */}
      {!reducedMotion && isVisible && (
        <div
          className="absolute h-px left-0 right-0 animate-shimmer-sweep"
          style={{
            top: position === 'top' ? '32px' : 'unset',
            bottom: position === 'bottom' ? '32px' : 'unset',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-0 w-full h-full transition-transform duration-1000',
          isVisible ? 'translate-y-0 opacity-100' : position === 'top' ? '-translate-y-4 opacity-0' : 'translate-y-4 opacity-0'
        )}
        style={reducedMotion ? {} : {
          animation: position === 'top' ? `wave-float-${variant} ${10 / speed}s ease-in-out infinite` : undefined,
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Primary gradient fill */}
          <linearGradient id={`wave-primary-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#04040e" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </linearGradient>
          {/* Secondary gradient for depth layer */}
          <linearGradient id={`wave-secondary-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#04040e" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#04040e" stopOpacity="0.9" />
          </linearGradient>
          {/* Highlight gradient */}
          <linearGradient id={`wave-highlight-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" />
          </linearGradient>
        </defs>
        {/* Back layer with gradient */}
        <path
          d={paths.secondary}
          fill={`url(#wave-secondary-${position})`}
        />
        {/* Middle highlight layer */}
        <path
          d={paths.secondary}
          fill={`url(#wave-highlight-${position})`}
          opacity="0.5"
        />
        {/* Primary front layer */}
        <path
          d={paths.primary}
          fill={`url(#wave-primary-${position})`}
        />
      </svg>
      {/* Bottom flip for bottom position */}
      {position === 'bottom' && (
        <svg
          viewBox="0 0 1440 128"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={reducedMotion ? {} : {
            animation: `wave-float-${variant} ${10 / speed}s ease-in-out infinite`,
            animationDelay: '0.5s',
          }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`wave-primary-flip`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f0f1a" />
              <stop offset="100%" stopColor="#04040e" />
            </linearGradient>
          </defs>
          <path
            d={paths.primary}
            fill="url(#wave-primary-flip)"
            transform="rotate(180 720 64)"
          />
        </svg>
      )}
    </div>
  )
}

function CurveDivider({
  position,
  className
}: {
  position: 'top' | 'bottom'
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 overflow-hidden pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '100px' }}
    >
      {/* Vibrant gradient glow */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? 'linear-gradient(to bottom, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 100%)'
            : 'linear-gradient(to top, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 100%)',
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />
      {/* Shimmer line */}
      {!reducedMotion && isVisible && (
        <div
          className="absolute h-px animate-shimmer-sweep"
          style={{
            left: 0,
            right: 0,
            top: position === 'top' ? '48px' : 'unset',
            bottom: position === 'bottom' ? '48px' : 'unset',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(139, 92, 246, 0.5) 50%, rgba(255,255,255,0.5) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-0 w-full h-full transition-all duration-700',
          isVisible ? 'translate-y-0 opacity-100' : position === 'top' ? '-translate-y-3 opacity-0' : 'translate-y-3 opacity-0'
        )}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`curve-gradient-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#04040e" />
            <stop offset="60%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#04040e" />
          </linearGradient>
          <linearGradient id={`curve-shine-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="30%" stopColor="rgba(139, 92, 246, 0.15)" />
            <stop offset="70%" stopColor="rgba(99, 102, 241, 0.15)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>
        {/* Base curve with gradient */}
        <path
          d={position === 'top'
            ? 'M0,100 C360,0 720,100 1080,40 C1260,10 1380,25 1440,40 L1440,0 L0,0 Z'
            : 'M0,0 C360,100 720,0 1080,40 C1260,70 1380,55 1440,40 L1440,100 L0,100 Z'
          }
          fill={`url(#curve-gradient-${position})`}
        />
        {/* Shine overlay */}
        <path
          d={position === 'top'
            ? 'M0,100 C360,0 720,100 1080,40 C1260,10 1380,25 1440,40 L1440,0 L0,0 Z'
            : 'M0,0 C360,100 720,0 1080,40 C1260,70 1380,55 1440,40 L1440,100 L0,100 Z'
          }
          fill={`url(#curve-shine-${position})`}
        />
      </svg>
    </div>
  )
}

function SlopeDivider({
  position,
  className
}: {
  position: 'top' | 'bottom'
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 overflow-hidden pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '80px' }}
    >
      {/* Vibrant accent glow */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)'
            : 'linear-gradient(45deg, rgba(168, 85, 247, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)',
          filter: 'blur(16px)',
        }}
        aria-hidden="true"
      />
      {/* Shimmer accent */}
      {!reducedMotion && isVisible && (
        <div
          className="absolute h-0.5 animate-shimmer-sweep"
          style={{
            left: 0,
            right: 0,
            top: position === 'top' ? '38px' : 'unset',
            bottom: position === 'bottom' ? '38px' : 'unset',
            background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.6) 30%, rgba(99, 102, 241, 0.6) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-0 w-full h-full transition-all duration-700',
          isVisible ? 'translate-y-0 opacity-100' : position === 'top' ? '-translate-y-3 opacity-0' : 'translate-y-3 opacity-0'
        )}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`slope-gradient-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#04040e" />
            <stop offset="50%" stopColor="#080812" />
            <stop offset="100%" stopColor="#04040e" />
          </linearGradient>
          <linearGradient id={`slope-accent-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
            <stop offset="25%" stopColor="rgba(168, 85, 247, 0.2)" />
            <stop offset="75%" stopColor="rgba(99, 102, 241, 0.2)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>
        {/* Main slope polygon */}
        <polygon
          points={position === 'top'
            ? '0,80 480,0 960,80 1440,20 1440,80'
            : '0,0 480,80 960,0 1440,60 1440,0'
          }
          fill={`url(#slope-gradient-${position})`}
        />
        {/* Accent overlay */}
        <polygon
          points={position === 'top'
            ? '0,80 480,0 960,80 1440,20 1440,80'
            : '0,0 480,80 960,0 1440,60 1440,0'
          }
          fill={`url(#slope-accent-${position})`}
        />
      </svg>
    </div>
  )
}

interface DotItem {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  type: 'single' | 'ring'
}

function DotPattern({
  position,
  particleCount = 20,
  particleColor = 'rgba(139, 92, 246, 0.3)',
  className
}: {
  position: 'top' | 'bottom'
  particleCount?: number
  particleColor?: string
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  // Use seeded random for deterministic but varied visuals
  const dots = useMemo((): DotItem[] => {
    const random = seededRandom(position === 'top' ? 12345 : 67890)
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (i / particleCount) * 100,
      y: 35 + random() * 30,
      size: 2 + random() * 5,
      delay: random() * 3,
      duration: 3 + random() * 3,
      type: random() > 0.85 ? 'ring' : 'single',
    }))
  }, [particleCount, position])

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 overflow-hidden pointer-events-none flex',
        position === 'top' ? 'top-0 justify-center' : 'bottom-0 justify-center',
        className
      )}
      style={{ padding: '24px 0' }}
      aria-hidden="true"
    >
      {/* Layered glow background */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? `radial-gradient(ellipse 90% 120% at 50% 0%, ${particleColor} 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 30% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 70% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`
            : `radial-gradient(ellipse 90% 120% at 50% 100%, ${particleColor} 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 30% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 70% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
          filter: 'blur(8px)',
        }}
      />
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={cn(
            'absolute',
            !reducedMotion && isVisible && 'animate-fade-in-scale'
          )}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: reducedMotion ? 0.7 : (isVisible ? 1 : 0),
            transitionDelay: reducedMotion ? '0s' : `${dot.delay}s`,
            transitionDuration: '600ms',
            transitionProperty: 'opacity, transform',
            transform: reducedMotion || isVisible ? 'scale(1)' : 'scale(0)',
            animationDelay: reducedMotion ? '0s' : `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        >
          {dot.type === 'ring' ? (
            <div
              className="w-full h-full rounded-full border animate-pulse-glow"
              style={{
                borderColor: particleColor,
                borderWidth: '1px',
                backgroundColor: 'transparent',
                boxShadow: `0 0 ${dot.size * 2}px ${particleColor}, inset 0 0 ${dot.size}px ${particleColor}`,
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: particleColor,
                boxShadow: `0 0 ${dot.size * 2}px ${particleColor}, 0 0 ${dot.size * 4}px ${particleColor.replace('0.3', '0.15')}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface ParticleItem {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  delay: number
  duration: number
  opacity: number
  type: 'orb' | 'sparkle'
}

function ParticleField({
  position,
  particleCount = 30,
  particleColor = 'rgba(99, 102, 241, 0.4)',
  speed = 1,
  className
}: {
  position: 'top' | 'bottom'
  particleCount?: number
  particleColor?: string
  speed?: number
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  // Use seeded random for deterministic but varied visuals
  const particles = useMemo((): ParticleItem[] => {
    const random = seededRandom(position === 'top' ? 11111 : 22222)
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: random() * 100,
      y: random() * 100,
      size: 1 + random() * 4,
      speedX: (random() - 0.5) * 2,
      speedY: random() * 2 + 0.5,
      delay: random() * 4,
      duration: 10 + random() * 6,
      opacity: 0.4 + random() * 0.5,
      type: random() > 0.7 ? 'sparkle' : 'orb',
    }))
  }, [particleCount, position])

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute overflow-hidden pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '120px' }}
      aria-hidden="true"
    >
      {/* Layered ambient glow */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? `radial-gradient(ellipse 120% 200% at 50% 0%, ${particleColor} 0%, transparent 50%), radial-gradient(ellipse 80% 120% at 30% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(ellipse 80% 120% at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`
            : `radial-gradient(ellipse 120% 200% at 50% 100%, ${particleColor} 0%, transparent 50%), radial-gradient(ellipse 80% 120% at 30% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(ellipse 80% 120% at 70% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`,
          filter: 'blur(20px)',
        }}
      />
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute rounded-full',
            !reducedMotion && isVisible && 'animate-particle-drift'
          )}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particleColor,
            opacity: reducedMotion ? particle.opacity * 0.7 : (isVisible ? particle.opacity : 0),
            transitionDelay: reducedMotion ? '0s' : `${particle.delay}s`,
            transitionDuration: '800ms',
            transitionProperty: 'opacity',
            animationDelay: reducedMotion ? '0s' : `${particle.delay}s`,
            animationDuration: reducedMotion ? '0s' : `${particle.duration / speed}s`,
            boxShadow: particle.type === 'orb'
              ? `0 0 ${particle.size * 2}px ${particleColor}, 0 0 ${particle.size * 4}px ${particleColor}, 0 0 ${particle.size * 6}px ${particleColor.replace('0.4', '0.2')}`
              : `0 0 ${particle.size * 3}px ${particleColor}`,
          }}
        >
          {particle.type === 'sparkle' && !reducedMotion && isVisible && (
            <div
              className="absolute inset-0 animate-sparkle"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                borderRadius: '50%',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function GradientDivider({
  position,
  gradientFrom = 'rgba(99, 102, 241, 0.1)',
  gradientTo = 'transparent',
  className
}: {
  position: 'top' | 'bottom'
  gradientFrom?: string
  gradientTo?: string
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 pointer-events-none overflow-hidden',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '140px' }}
      aria-hidden="true"
    >
      {/* Layered gradient background */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-1000 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
            : `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
        }}
      />
      {/* Secondary color band for depth */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-1000 ease-out',
          isVisible ? 'opacity-60' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? 'linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 0%, transparent 60%)'
            : 'linear-gradient(to top, rgba(139, 92, 246, 0.05) 0%, transparent 60%)',
        }}
      />
      {/* Animated shimmer layers */}
      {!reducedMotion && isVisible && (
        <>
          <div
            className="absolute inset-0 animate-shimmer-sweep"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)',
              animationDuration: '3s',
            }}
          />
          <div
            className="absolute inset-0 animate-shimmer-sweep"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.1) 40%, rgba(99, 102, 241, 0.1) 60%, transparent 100%)',
              animationDuration: '4s',
              animationDelay: '1.5s',
            }}
          />
        </>
      )}
    </div>
  )
}

// Mountain silhouette divider - editorial style with layered peaks
function MountainDivider({
  position,
  className
}: {
  position: 'top' | 'bottom'
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 overflow-hidden pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '100px' }}
      aria-hidden="true"
    >
      {/* Atmospheric glow */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? 'linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%)',
          filter: 'blur(16px)',
        }}
      />
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-0 w-full h-full transition-all duration-700',
          isVisible ? 'translate-y-0 opacity-100' : position === 'top' ? '-translate-y-3 opacity-0' : 'translate-y-3 opacity-0'
        )}
        aria-hidden="true"
      >
        <defs>
          {/* Back mountain gradient - darkest */}
          <linearGradient id={`mountain-back-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#04040e" />
          </linearGradient>
          {/* Middle mountain gradient */}
          <linearGradient id={`mountain-middle-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080810" />
            <stop offset="100%" stopColor="#04040e" />
          </linearGradient>
          {/* Front mountain gradient - lightest */}
          <linearGradient id={`mountain-front-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f0f1a" />
            <stop offset="100%" stopColor="#080812" />
          </linearGradient>
          {/* Snow/highlight gradient */}
          <linearGradient id={`mountain-snow-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.12)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>
        {/* Back layer */}
        <path
          d={mountainPaths.back}
          fill={`url(#mountain-back-${position})`}
        />
        {/* Middle layer */}
        <path
          d={mountainPaths.middle}
          fill={`url(#mountain-middle-${position})`}
        />
        {/* Snow highlight on peaks */}
        <path
          d={mountainPaths.middle}
          fill={`url(#mountain-snow-${position})`}
          opacity="0.6"
        />
        {/* Front layer */}
        <path
          d={mountainPaths.front}
          fill={`url(#mountain-front-${position})`}
        />
      </svg>
      {/* Flip for bottom position */}
      {position === 'bottom' && (
        <svg
          viewBox="0 0 1440 128"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`mountain-front-flip`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#080812" />
              <stop offset="100%" stopColor="#0f0f1a" />
            </linearGradient>
          </defs>
          <path
            d={mountainPaths.front}
            fill="url(#mountain-front-flip)"
            transform="rotate(180 720 64)"
          />
        </svg>
      )}
    </div>
  )
}

// Tiered/stepped divider - modern geometric style
function TieredDivider({
  position,
  className
}: {
  position: 'top' | 'bottom'
  className?: string
}) {
  const { containerRef, isVisible, reducedMotion } = useDividerVisibility()

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute left-0 right-0 overflow-hidden pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: '90px' }}
      aria-hidden="true"
    >
      {/* Soft ambient glow */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: position === 'top'
            ? 'linear-gradient(to bottom, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.06) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.06) 50%, transparent 100%)',
          filter: 'blur(12px)',
        }}
      />
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-0 w-full h-full transition-all duration-700',
          isVisible ? 'translate-y-0 opacity-100' : position === 'top' ? '-translate-y-3 opacity-0' : 'translate-y-3 opacity-0'
        )}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`tiered-large-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0c0c18" />
            <stop offset="100%" stopColor="#04040e" />
          </linearGradient>
          <linearGradient id={`tiered-medium-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#090912" />
            <stop offset="100%" stopColor="#04040e" />
          </linearGradient>
          <linearGradient id={`tiered-small-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a16" />
            <stop offset="100%" stopColor="#060610" />
          </linearGradient>
          {/* Edge highlight */}
          <linearGradient id={`tiered-edge-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="20%" stopColor="rgba(139, 92, 246, 0.15)" />
            <stop offset="80%" stopColor="rgba(99, 102, 241, 0.15)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>
        {/* Large tier */}
        <path
          d={tieredPaths.large}
          fill={`url(#tiered-large-${position})`}
        />
        {/* Medium tier */}
        <path
          d={tieredPaths.medium}
          fill={`url(#tiered-medium-${position})`}
        />
        {/* Small tier */}
        <path
          d={tieredPaths.small}
          fill={`url(#tiered-small-${position})`}
        />
        {/* Edge highlight line */}
        <path
          d={tieredPaths.small}
          fill="none"
          stroke={`url(#tiered-edge-${position})`}
          strokeWidth="1"
        />
      </svg>
      {/* Flip for bottom position */}
      {position === 'bottom' && (
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`tiered-small-flip`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#060610" />
              <stop offset="100%" stopColor="#0a0a16" />
            </linearGradient>
          </defs>
          <path
            d={tieredPaths.small}
            fill="url(#tiered-small-flip)"
            transform="rotate(180 720 45)"
          />
        </svg>
      )}
    </div>
  )
}

// Parallax wrapper for dividers
function ParallaxDivider({
  children,
  speed = 0.5,
  className
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const { ref, offset } = useParallax<HTMLDivElement>({ speed, direction: 'up' })

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{ transform: `translateY(${offset * 0.25}px)` }}
    >
      {children}
    </div>
  )
}

export function SectionDivider({
  variant = 'wave',
  position = 'bottom',
  className,
  speed = 1,
  particleCount = 20,
  particleColor = 'rgba(139, 92, 246, 0.3)',
  gradientFrom = 'rgba(99, 102, 241, 0.1)',
  gradientTo = 'transparent',
}: SectionDividerProps) {
  // Render top divider
  const renderTopDivider = () => {
    switch (variant) {
      case 'wave':
        return (
          <WaveDivider
            position="top"
            variant="smooth"
            speed={speed}
            className={className}
          />
        )
      case 'curve':
        return <CurveDivider position="top" className={className} />
      case 'slope':
        return <SlopeDivider position="top" className={className} />
      case 'dots':
        return (
          <DotPattern
            position="top"
            particleCount={particleCount}
            particleColor={particleColor}
            className={className}
          />
        )
      case 'particles':
        return (
          <ParticleField
            position="top"
            particleCount={particleCount}
            particleColor={particleColor}
            speed={speed}
            className={className}
          />
        )
      case 'gradient':
        return (
          <GradientDivider
            position="top"
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
            className={className}
          />
        )
      case 'mountain':
        return <MountainDivider position="top" className={className} />
      case 'tiered':
        return <TieredDivider position="top" className={className} />
      default:
        return null
    }
  }

  // Render bottom divider
  const renderBottomDivider = () => {
    switch (variant) {
      case 'wave':
        return (
          <WaveDivider
            position="bottom"
            variant="smooth"
            speed={speed}
            className={className}
          />
        )
      case 'curve':
        return <CurveDivider position="bottom" className={className} />
      case 'slope':
        return <SlopeDivider position="bottom" className={className} />
      case 'dots':
        return (
          <DotPattern
            position="bottom"
            particleCount={particleCount}
            particleColor={particleColor}
            className={className}
          />
        )
      case 'particles':
        return (
          <ParticleField
            position="bottom"
            particleCount={particleCount}
            particleColor={particleColor}
            speed={speed}
            className={className}
          />
        )
      case 'gradient':
        return (
          <GradientDivider
            position="bottom"
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
            className={className}
          />
        )
      case 'mountain':
        return <MountainDivider position="bottom" className={className} />
      case 'tiered':
        return <TieredDivider position="bottom" className={className} />
      default:
        return null
    }
  }

  return (
    <>
      {(position === 'top' || position === 'both') && renderTopDivider()}
      {(position === 'bottom' || position === 'both') && renderBottomDivider()}
    </>
  )
}

// Default sections for the landing page - only includes IDs that actually exist in the page
const DEFAULT_SECTIONS: SectionDefinition[] = [
  { id: 'testimonials', name: 'Testimonios' },
  { id: 'faq', name: 'Preguntas' },
  { id: 'contact', name: 'Contacto' },
]

// Scroll Progress Indicator Component with Section Detection
export function ScrollProgressIndicator({
  className,
  showBackground = false,
  height = 3,
  gradientFrom = 'var(--color-primary)',
  gradientTo = 'var(--color-accent-purple)',
  showReadingTime = true,
  estimatedWordsPerMinute = 200,
  showSectionName = true,
  showSectionMarkers = true,
  sections = DEFAULT_SECTIONS,
}: {
  className?: string
  showBackground?: boolean
  height?: number
  gradientFrom?: string
  gradientTo?: string
  showReadingTime?: boolean
  estimatedWordsPerMinute?: number
  showSectionName?: boolean
  showSectionMarkers?: boolean
  sections?: SectionDefinition[]
}) {
  const [progress, setProgress] = useState(0)
  const [readingTime, setReadingTime] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState<SectionDefinition | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [isHoveringMarker, setIsHoveringMarker] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Calculate section positions for markers
  const sectionPositions = useMemo(() => {
    if (typeof window === 'undefined') return []

    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return sections.map(section => {
      const element = document.getElementById(section.id)
      if (!element) return { ...section, position: 0, element: null as HTMLElement | null }

      const rect = element.getBoundingClientRect()
      const scrollTop = window.scrollY
      const elementTop = rect.top + scrollTop
      const position = docHeight > 0 ? elementTop / docHeight : 0

      return {
        ...section,
        position: Math.min(Math.max(position, 0), 1),
        element,
      }
    }).filter(s => s.element !== null)
  }, [sections])

  // Scroll to section handler
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    }
  }, [reducedMotion])

  // Setup intersection observer for section detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(Math.max(scrollProgress, 0), 1))

      // Show indicator after scrolling past hero
      setIsVisible(scrollTop > 100)

      // Determine current section based on scroll position
      const viewportMiddle = scrollTop + window.innerHeight * 0.4

      let activeSection: SectionDefinition | null = null
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollTop
          const elementBottom = elementTop + rect.height

          if (viewportMiddle >= elementTop && viewportMiddle < elementBottom) {
            activeSection = section
            break
          }
        }
      }

      // Fallback: use progress if no section matched
      if (!activeSection && sections.length > 0) {
        const progressIndex = Math.min(
          Math.floor(progress * sections.length),
          sections.length - 1
        )
        activeSection = sections[progressIndex]
      }

      setCurrentSection(activeSection)
      setActiveSectionId(activeSection?.id || null)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [progress, sections])

  // Calculate reading time on mount
  useEffect(() => {
    if (!showReadingTime) return

    const calculateReadingTime = () => {
      // Get all text content from main sections
      const mainContent = document.querySelector('main')
      if (!mainContent) return

      const text = mainContent.textContent || ''
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length
      const minutes = Math.ceil(wordCount / estimatedWordsPerMinute)

      setReadingTime(minutes < 1 ? '< 1 min' : `${minutes} min`)
    }

    // Delay calculation to ensure content is loaded
    const timer = setTimeout(calculateReadingTime, 100)
    return () => clearTimeout(timer)
  }, [showReadingTime, estimatedWordsPerMinute])

  return (
    <>
      {/* Progress Bar */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-opacity duration-500',
          isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          showBackground && 'bg-black/20',
          className
        )}
        style={{ height: `${height + (showSectionName ? 32 : 0)}px` }}
        role="progressbar"
        aria-label="Scroll progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Glow layer behind bar */}
        <div
          className="absolute"
          style={{
            top: showSectionName ? '32px' : '0',
            left: 0,
            right: 0,
            height: `${height}px`,
            background: `linear-gradient(90deg, ${gradientFrom}40 0%, ${gradientTo}40 100%)`,
            filter: 'blur(4px)',
            opacity: reducedMotion ? 0.5 : 0.8,
          }}
          aria-hidden="true"
        />

        {/* Main progress bar with GPU-accelerated transform */}
        <div
          className={cn(
            'absolute will-change-transform',
            !reducedMotion && 'transition-[width] duration-150 ease-out'
          )}
          style={{
            top: showSectionName ? '32px' : '0',
            left: 0,
            width: `${progress * 100}%`,
            height: `${height}px`,
          }}
        >
          <div
            className="h-full"
            style={{
              background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 50%, #a78bfa 100%)`,
            }}
          />
          {/* Subtle shimmer overlay */}
          {!reducedMotion && progress > 0 && progress < 1 && (
            <div
              className="absolute inset-0 animate-shimmer-sweep"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Section Name Label */}
        {showSectionName && currentSection && (
          <div
            className={cn(
              'absolute left-0 right-0 h-8 flex items-center px-4',
              'transition-all duration-300 ease-out',
              reducedMotion ? '' : 'transition-[opacity,transform] duration-300'
            )}
            style={{ top: 0 }}
          >
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full',
                'bg-zinc-950/90 backdrop-blur-md border border-white/[0.08]',
                'text-xs font-medium text-white/80',
                'transition-all duration-300 ease-out',
                !reducedMotion && 'animate-fade-in'
              )}
            >
              {/* Section indicator dot */}
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                }}
              />
              <span className="capitalize">{currentSection.name}</span>
            </div>
          </div>
        )}

        {/* Clickable Section Markers */}
        {showSectionMarkers && isVisible && sectionPositions.length > 0 && (
          <div
            className="absolute pointer-events-auto"
            style={{
              top: showSectionName ? '32px' : '0',
              left: 0,
              right: 0,
              height: `${height}px`,
            }}
            role="navigation"
            aria-label="Section navigation"
          >
            {sectionPositions.map((section) => {
              const isActive = section.id === activeSectionId
              const isHovered = section.id === isHoveringMarker

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => setIsHoveringMarker(section.id)}
                  onMouseLeave={() => setIsHoveringMarker(null)}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
                    'w-3 h-3 rounded-full border-2',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950',
                    isActive
                      ? 'border-violet-400 bg-violet-400 scale-125'
                      : 'border-white/40 bg-zinc-900 hover:border-white/70 hover:bg-white/20',
                    isHovered && !isActive && 'scale-110 border-white/60'
                  )}
                  style={{
                    left: `${section.position * 100}%`,
                    opacity: progress >= section.position || isActive ? 1 : 0.3,
                  }}
                  aria-label={`Ir a ${section.name}`}
                  aria-current={isActive ? 'true' : undefined}
                  title={section.name}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Reading Time Indicator */}
      {showReadingTime && readingTime && (
        <div
          className={cn(
            'fixed top-3 right-4 lg:top-4 lg:right-8 z-[9999] pointer-events-none',
            'opacity-0 translate-y-[-8px]',
            isVisible && 'opacity-100 translate-y-0'
          )}
          style={{ transition: 'all 500ms ease-out 100ms' }}
          aria-live="polite"
        >
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full',
              'bg-zinc-950/80 backdrop-blur-md border border-white/[0.08]',
              'text-xs font-medium text-white/60'
            )}
          >
            {/* Clock icon */}
            <svg
              className="w-3.5 h-3.5 text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{readingTime} de lectura</span>
          </div>
        </div>
      )}
    </>
  )
}

// Section Wrapper with IntersectionObserver Reveal
interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  revealOnScroll?: boolean
  parallaxSpeed?: number
  style?: CSSProperties
}

export function SectionWrapper({
  children,
  className,
  id,
  revealOnScroll = true,
  parallaxSpeed,
  style,
}: SectionWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // Initialize isVisible based on reduced motion preference
  const [isVisible, setIsVisible] = useState(() => reducedMotion)

  useEffect(() => {
    if (!revealOnScroll || reducedMotion) {
      // Skip animation if user prefers reduced motion
      return
    }

    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [revealOnScroll, reducedMotion])

  const content = (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        'relative transition-all duration-700',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )

  if (parallaxSpeed && !reducedMotion) {
    return (
      <ParallaxDivider speed={parallaxSpeed}>
        {content}
      </ParallaxDivider>
    )
  }

  return content
}

// Animated Dot Grid Background
interface DotGridProps {
  className?: string
  dotColor?: string
  spacing?: number
  animate?: boolean
  scrollSpeed?: number
}

export function AnimatedDotGrid({
  className,
  dotColor = 'rgba(99, 102, 241, 0.15)',
  spacing = 32,
  animate = true,
  scrollSpeed = 1,
}: DotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // Calculate offset based on scroll
  const offset = useMemo(() => {
    // Always return an object for consistent access
    if (!animate || reducedMotion) return { current: 0 }
    // We'll use a ref to track scroll position without causing re-renders
    return { current: 0 }
  }, [animate, reducedMotion])

  useEffect(() => {
    if (!animate || reducedMotion) return

    const handleScroll = () => {
      if (offset.current !== undefined) {
        offset.current = window.scrollY * scrollSpeed * 0.1
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [animate, reducedMotion, offset, scrollSpeed])

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />
    </div>
  )
}
