'use client';

import { useReducedMotion } from '@/hooks';

/**
 * Design System Showcase
 *
 * Comprehensive visual documentation of MaatWork's design tokens.
 * Includes colors, gradients, typography scales, and spacing system.
 *
 * CSS Custom Properties (defined in globals.css):
 *
 * // Brand Colors - Light Theme
 * --color-crema: #F7F3EE          (Background primary)
 * --color-crema-dark: #EDE8E1     (Background secondary)
 * --color-crema-200: #E5DFD7      (Background tertiary)
 * --color-bosque: #2D5A3D         (Primary brand green)
 * --color-bosque-dark: #1E3D29   (Primary dark)
 * --color-bosque-light: #4A7A5A  (Primary light)
 * --color-terracota: #D4714E     (Accent orange)
 * --color-terracota-dark: #B85A3A (Accent dark)
 * --color-contrast: #6B2D3A       (High contrast accent)
 *
 * // Dark Theme
 * --color-bg-base: #04040e        (Background base)
 * --color-primary: #6366f1        (Primary indigo)
 * --color-primary-dark: #4f46e5   (Primary dark)
 * --color-accent-purple: #8b5cf6  (Accent purple)
 * --color-accent-green: #22c55e  (Accent green)
 * --color-bg-surface: rgba(255,255,255,0.025)  (Surface)
 * --color-bg-elevated: rgba(255,255,255,0.05)  (Elevated)
 * --color-border-subtle: rgba(255,255,255,0.07)
 * --color-border-mid: rgba(255,255,255,0.12)
 *
 * // Animation Tokens
 * --duration-fast: 150ms
 * --duration-normal: 300ms
 * --duration-slow: 500ms
 * --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
 */

// ======================
// Token Definitions
// ======================

interface ColorToken {
  name: string;
  hex: string;
  variable: string;
}

interface GradientToken {
  name: string;
  gradient: string;
}

interface TypographyToken {
  name: string;
  size: string;
  variable: string;
  sample: string;
}

interface SpacingToken {
  name: string;
  value: string;
}

const darkThemeTokens: ColorToken[] = [
  { name: 'Bg Base', hex: '#04040e', variable: '--color-bg-base' },
  { name: 'Primary', hex: '#6366f1', variable: '--color-primary' },
  { name: 'Primary Dark', hex: '#4f46e5', variable: '--color-primary-dark' },
  { name: 'Accent Purple', hex: '#8b5cf6', variable: '--color-accent-purple' },
  { name: 'Accent Green', hex: '#22c55e', variable: '--color-accent-green' },
  { name: 'Surface', hex: 'rgba(255,255,255,0.025)', variable: '--color-bg-surface' },
  { name: 'Elevated', hex: 'rgba(255,255,255,0.05)', variable: '--color-bg-elevated' },
  { name: 'Border Subtle', hex: 'rgba(255,255,255,0.07)', variable: '--color-border-subtle' },
  { name: 'Border Mid', hex: 'rgba(255,255,255,0.12)', variable: '--color-border-mid' },
];

const lightThemeTokens: ColorToken[] = [
  { name: 'Crema', hex: '#F7F3EE', variable: '--color-crema' },
  { name: 'Crema Dark', hex: '#EDE8E1', variable: '--color-crema-dark' },
  { name: 'Crema 200', hex: '#E5DFD7', variable: '--color-crema-200' },
  { name: 'Bosque', hex: '#2D5A3D', variable: '--color-bosque' },
  { name: 'Bosque Dark', hex: '#1E3D29', variable: '--color-bosque-dark' },
  { name: 'Bosque Light', hex: '#4A7A5A', variable: '--color-bosque-light' },
  { name: 'Terracota', hex: '#D4714E', variable: '--color-terracota' },
  { name: 'Terracota Dark', hex: '#B85A3A', variable: '--color-terracota-dark' },
  { name: 'Contrast', hex: '#6B2D3A', variable: '--color-contrast' },
];

const brandGradients: GradientToken[] = [
  { name: 'Primary', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)' },
  { name: 'Mesh', gradient: 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.12) 0px, transparent 50%)' },
  { name: 'Warm', gradient: 'linear-gradient(135deg, #D4714E 0%, #B85A3A 100%)' },
  { name: 'Forest', gradient: 'linear-gradient(135deg, #2D5A3D 0%, #4A7A5A 50%, #1E3D29 100%)' },
];

const typographyTokens: TypographyToken[] = [
  { name: 'Display XL', size: 'clamp(3rem, 1rem + 7vw, 8rem)', variable: '--text-hero', sample: 'Hero' },
  { name: 'Display LG', size: 'clamp(2rem, 0.5rem + 5vw, 4rem)', variable: '--text-display', sample: 'Display' },
  { name: 'Heading', size: 'clamp(1.5rem, 0.25rem + 3vw, 2.25rem)', variable: '--text-heading', sample: 'Heading' },
  { name: 'Base', size: 'clamp(1rem, 0.92rem + 0.4vw, 1.125rem)', variable: '--text-base', sample: 'Base text for body content' },
  { name: 'Small', size: '0.875rem', variable: '--text-sm', sample: 'Small supporting text' },
  { name: 'Caption', size: '0.75rem', variable: '--text-xs', sample: 'Caption and labels' },
];

const spacingTokens: SpacingToken[] = [
  { name: 'Section', value: 'clamp(4rem, 3rem + 5vw, 10rem)' },
  { name: 'Container', value: 'max-width 1280px' },
  { name: 'Gap MD', value: '1.5rem / 24px' },
  { name: 'Gap SM', value: '0.75rem / 12px' },
  { name: 'Radius LG', value: '1rem / 16px' },
  { name: 'Radius MD', value: '0.5rem / 8px' },
];

// ======================
// Animation Config
// ======================

const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// ======================
// Swatch Components
// ======================

function ColorSwatch({ token, index, isDark }: { token: ColorToken; index: number; isDark: boolean }) {
  const reducedMotion = useReducedMotion();
  const isTransparent = token.hex.includes('rgba');
  const isVeryLight = !isTransparent && ['#F7F3EE', '#EDE8E1', '#E5DFD7'].includes(token.hex);

  return (
    <div
      className="group relative"
      style={{
        opacity: reducedMotion ? 1 : 0,
        transform: reducedMotion ? 'none' : 'translateY(12px)',
        transition: `opacity ${ANIMATION.normal} ease ${index * 60}ms, transform ${ANIMATION.normal} ease ${index * 60}ms`,
      }}
    >
      <div
        className="relative h-16 rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
        style={{
          backgroundColor: token.hex,
          boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {/* Hover info overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${
            isVeryLight ? 'bg-[#1A1A1A]/85' : 'bg-[#04040e]/85'
          } opacity-0 group-hover:opacity-100`}
        >
          <span className="font-mono text-[10px] text-white/90">{token.hex}</span>
          <span className="text-[9px] mt-0.5 uppercase tracking-wider text-white/50">{token.variable}</span>
        </div>
      </div>
      <p className={`mt-2 text-[10px] text-center font-medium ${isDark ? 'text-white/50' : 'text-[#1A1A1A]/60'}`}>
        {token.name}
      </p>
    </div>
  );
}

function GradientSwatch({ token, index }: { token: GradientToken; index: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="group relative"
      style={{
        opacity: reducedMotion ? 1 : 0,
        transform: reducedMotion ? 'none' : 'translateY(16px)',
        transition: `opacity ${ANIMATION.slow} ease ${index * 80}ms, transform ${ANIMATION.slow} ease ${index * 80}ms`,
      }}
    >
      <div
        className="relative h-20 rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
        style={{
          background: token.gradient,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Shimmer effect */}
        {!reducedMotion && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
              animation: 'shimmer 1.5s ease-out forwards',
            }}
          />
        )}
      </div>
      <p className="mt-2 text-[10px] text-center font-medium text-white/50">{token.name}</p>
    </div>
  );
}

// ======================
// Hero Animated Gradient
// ======================

function AnimatedBrandGradient() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative h-28 rounded-2xl overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #a78bfa 50%, #8b5cf6 65%, #6366f1 100%)',
          backgroundSize: reducedMotion ? '100% 100%' : '200% 200%',
          animation: reducedMotion ? 'none' : 'gradient-drift 8s ease-in-out infinite',
        }}
      />

      {/* Glow overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(139, 92, 246, 0.5) 0%, transparent 60%)',
        }}
      />

      {/* Animated light sweep */}
      {!reducedMotion && (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              animation: 'light-sweep 3s ease-in-out infinite',
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(270deg, transparent 0%, rgba(139, 92, 246, 0.3) 50%, transparent 100%)',
              animation: 'light-sweep-reverse 4s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/80 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm bg-[#04040e]/40 px-4 py-1.5 rounded-full">
          Primary Brand Gradient
        </span>
      </div>
    </div>
  );
}

// ======================
// Section Components
// ======================

function SectionHeader({ label, title, description }: { label: string; title: string; description: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="text-center mb-12">
      <span
        className="inline-block text-[9px] font-bold uppercase tracking-[0.25em] text-primary mb-4"
        style={{
          opacity: reducedMotion ? 1 : 0,
          transform: reducedMotion ? 'none' : 'translateY(8px)',
          transition: `opacity ${ANIMATION.normal} ease, transform ${ANIMATION.normal} ease`,
        }}
      >
        {label}
      </span>
      <h3
        className="font-display text-2xl lg:text-3xl font-black text-white/90"
        style={{
          opacity: reducedMotion ? 1 : 0,
          transform: reducedMotion ? 'none' : 'translateY(12px)',
          transition: `opacity ${ANIMATION.normal} ease 100ms, transform ${ANIMATION.normal} ease 100ms`,
        }}
      >
        {title}
      </h3>
      <p
        className="mt-3 text-sm text-white/40 max-w-lg mx-auto"
        style={{
          opacity: reducedMotion ? 1 : 0,
          transform: reducedMotion ? 'none' : 'translateY(8px)',
          transition: `opacity ${ANIMATION.normal} ease 200ms, transform ${ANIMATION.normal} ease 200ms`,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function TokenGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">{children}</div>;
}

// ======================
// Main Component
// ======================

export function DesignSystem() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #04040e 0%, rgba(99, 102, 241, 0.03) 50%, #04040e 100%)' }}
    >
      {/* Background glow effects */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-[9px] font-bold uppercase tracking-[0.3em] text-primary/80 mb-6"
            style={{
              opacity: reducedMotion ? 1 : 0,
              transform: reducedMotion ? 'none' : 'translateY(8px)',
              transition: `opacity ${ANIMATION.normal} ease, transform ${ANIMATION.normal} ease`,
            }}
          >
            Design System
          </span>
          <h2
            className="font-display text-4xl lg:text-5xl font-black text-white/95 mb-4"
            style={{
              opacity: reducedMotion ? 1 : 0,
              transform: reducedMotion ? 'none' : 'translateY(12px)',
              transition: `opacity ${ANIMATION.normal} ease 100ms, transform ${ANIMATION.normal} ease 100ms`,
            }}
          >
            Brand Foundations
          </h2>
          <p
            className="text-white/40 max-w-xl mx-auto"
            style={{
              opacity: reducedMotion ? 1 : 0,
              transform: reducedMotion ? 'none' : 'translateY(8px)',
              transition: `opacity ${ANIMATION.normal} ease 200ms, transform ${ANIMATION.normal} ease 200ms`,
            }}
          >
            The visual language that brings MaatWork to life
          </p>
        </div>

        {/* Brand Gradient Showcase */}
        <div className="mb-20">
          <AnimatedBrandGradient />
        </div>

        {/* Colors Grid */}
        <div className="mb-20">
          <SectionHeader
            label="Colors"
            title="Dark Theme Palette"
            description="Indigo and purple tones for dark interfaces"
          />
          <TokenGrid>
            {darkThemeTokens.map((token, i) => (
              <ColorSwatch key={token.variable} token={token} index={i} isDark />
            ))}
          </TokenGrid>
        </div>

        <div className="mb-20">
          <SectionHeader
            label="Colors"
            title="Light Theme Palette"
            description="Warm cream and forest tones for light interfaces"
          />
          <TokenGrid>
            {lightThemeTokens.map((token, i) => (
              <ColorSwatch key={token.variable} token={token} index={i} isDark={false} />
            ))}
          </TokenGrid>
        </div>

        {/* Gradients */}
        <div className="mb-20">
          <SectionHeader
            label="Gradients"
            title="Brand Gradients"
            description="Signature gradient combinations"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {brandGradients.map((token, i) => (
              <GradientSwatch key={token.name} token={token} index={i} />
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-20">
          <SectionHeader
            label="Typography"
            title="Type Scale"
            description="Fluid typography using clamp()"
          />
          <div className="space-y-6 bg-white/[0.02] rounded-2xl p-8 border border-white/5">
            {typographyTokens.map((token, i) => (
              <div
                key={token.variable}
                className="flex items-baseline justify-between gap-4 pb-4 border-b border-white/5 last:border-0"
                style={{
                  opacity: reducedMotion ? 1 : 0,
                  transform: reducedMotion ? 'none' : 'translateX(-8px)',
                  transition: `opacity ${ANIMATION.normal} ease ${i * 80}ms, transform ${ANIMATION.normal} ease ${i * 80}ms`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <span
                    className="text-white/90 truncate block"
                    style={{ fontSize: token.size }}
                  >
                    {token.sample}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-primary/80">{token.variable}</span>
                  <span className="text-[9px] text-white/30 block mt-0.5">{token.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="mb-16">
          <SectionHeader
            label="Spacing"
            title="Layout Rhythm"
            description="Consistent spacing creates visual harmony"
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {spacingTokens.map((token, i) => (
              <div
                key={token.name}
                className="bg-white/[0.02] rounded-xl p-4 border border-white/5"
                style={{
                  opacity: reducedMotion ? 1 : 0,
                  transform: reducedMotion ? 'none' : 'translateY(8px)',
                  transition: `opacity ${ANIMATION.normal} ease ${i * 60}ms, transform ${ANIMATION.normal} ease ${i * 60}ms`,
                }}
              >
                <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-2">{token.name}</span>
                <span className="text-xs font-mono text-primary/80">{token.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animation Tokens */}
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-[10px] text-white/25 uppercase tracking-wider">
            All tokens use CSS custom properties for easy theming and dark/light mode support
          </p>
        </div>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes gradient-drift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes light-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes light-sweep-reverse {
          0% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
