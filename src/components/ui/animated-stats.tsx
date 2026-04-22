'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useReducedMotion, springInterpolate } from '@/hooks';

// Premium easing matching the landing page aesthetic
const PREMIUM_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ======================
// Spring-based Animated Counter Hook
// ======================

interface UseAnimatedCounterOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

interface UseAnimatedCounterReturn {
  ref: React.RefObject<HTMLSpanElement | null>;
  count: number;
  formatted: string;
  isVisible: boolean;
  progress: number;
}

export function useAnimatedCounter({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
}: UseAnimatedCounterOptions): UseAnimatedCounterReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  // Compute final values based on reducedMotion
  const progress = reducedMotion ? 1 : animatedProgress;
  const count = reducedMotion ? end : start + (end - start) * animatedProgress;

  // Intersection observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsVisible(true);
          hasAnimatedRef.current = true;
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Spring physics animation
  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) return; // Skip animation entirely

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      let velocity = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Spring-based easing for premium feel
        const { value: easedProgress, velocity: newVel } = springInterpolate(
          0,
          1,
          velocity,
          80,   // stiffness
          12,   // damping
          1     // mass
        );
        velocity = newVel;

        setAnimatedProgress(easedProgress);

        if (rawProgress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setAnimatedProgress(1);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isVisible, start, end, duration, delay, reducedMotion]);

  const formatted = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { ref, count, formatted, isVisible, progress };
}

// ======================
// Glow Effects
// ======================

interface IconGlowProps {
  children: ReactNode;
  color?: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function IconGlow({
  children,
  color = 'rgba(99, 102, 241, 0.6)',
  isActive = true,
  size = 'md',
}: IconGlowProps) {
  const sizeClasses = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' };
  const blurSizes = { sm: 'blur(10px)', md: 'blur(14px)', lg: 'blur(20px)' };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl animate-pulse-subtle"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: blurSizes[size],
            animationDuration: '3s',
          }}
          aria-hidden="true"
        />
      )}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center rounded-xl
                    bg-white/5 border border-white/10 backdrop-blur-sm
                    transition-all duration-300 hover:bg-white/10 hover:border-white/20"
      >
        {children}
      </div>
    </div>
  );
}

// Number display with layered glow
interface NumberGlowProps {
  children: ReactNode;
  color: string;
  isActive: boolean;
  progress: number;
}

function NumberGlow({ children, color, isActive, progress }: NumberGlowProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Core number */}
      <span
        className="relative z-10 font-display font-extrabold text-white"
        style={{
          textShadow: isActive
            ? `0 0 30px ${color}, 0 0 60px ${color}, 0 0 90px ${color}`
            : 'none',
          transition: `text-shadow 0.6s ${PREMIUM_EASE}`,
        }}
      >
        {children}
      </span>

      {/* Ambient glow ring during animation */}
      {!reducedMotion && isActive && progress < 1 && (
        <span
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            filter: 'blur(24px)',
            background: `radial-gradient(circle, ${color}40 0%, transparent 60%)`,
            transform: `scale(${1.2 + (1 - progress) * 0.4})`,
            opacity: (1 - progress) * 0.6,
            transition: `transform 0.1s linear, opacity 0.1s linear`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Completion pulse */}
      {!reducedMotion && isActive && progress === 1 && (
        <span
          className="absolute inset-0 -z-10 pointer-events-none animate-ring-pulse"
          style={{
            filter: 'blur(16px)',
            background: `radial-gradient(circle, ${color}30 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ======================
// AnimatedStat Component
// ======================

interface AnimatedStatProps {
  value: number;
  label: string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  glowColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AnimatedStat({
  value,
  label,
  icon,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2000,
  delay = 0,
  glowColor = 'rgba(99, 102, 241, 0.6)',
  size = 'lg',
  className = '',
}: AnimatedStatProps) {
  const { ref, formatted, progress, isVisible } = useAnimatedCounter({
    end: value,
    duration,
    delay,
    decimals,
    prefix,
    suffix,
  });

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl lg:text-5xl',
    xl: 'text-5xl lg:text-6xl',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {icon && (
        <IconGlow color={glowColor} isActive={isVisible} size="md">
          {icon}
        </IconGlow>
      )}
      <div className="relative mt-3">
        <span ref={ref} className={sizeClasses[size]}>
          <NumberGlow color={glowColor} isActive={isVisible} progress={progress}>
            {formatted}
          </NumberGlow>
        </span>
      </div>
      <span className="text-sm text-white/60 mt-1 text-center">{label}</span>
    </div>
  );
}

// ======================
// AnimatedStats Container
// ======================

interface StatItem {
  value: number;
  label: string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface AnimatedStatsProps {
  stats: StatItem[];
  className?: string;
  staggerDelay?: number;
  duration?: number;
  startDelay?: number;
  glowColor?: string;
  horizontal?: boolean;
  gap?: string;
}

export function AnimatedStats({
  stats,
  className = '',
  staggerDelay = 150,
  duration = 1800,
  startDelay = 0,
  glowColor = 'rgba(99, 102, 241, 0.6)',
  horizontal = true,
  gap = 'gap-10 lg:gap-14',
}: AnimatedStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const reducedMotion = useReducedMotion();

  // Container intersection
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(stats.length);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stats.length]);

  // Stagger reveal with premium easing
  useEffect(() => {
    if (reducedMotion) return; // Skip stagger animation entirely

    const timeouts: NodeJS.Timeout[] = [];
    const count = stats.length;

    for (let i = 0; i < count; i++) {
      const delay = startDelay + i * staggerDelay;
      const timeout = setTimeout(() => {
        setVisibleCount(i + 1);
      }, delay);
      timeouts.push(timeout);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [stats.length, staggerDelay, startDelay, reducedMotion]);

  // Compute effective visible count
  const effectiveVisibleCount = reducedMotion ? stats.length : visibleCount;

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap ${horizontal ? 'flex-row' : 'flex-col'} ${gap} ${className}`}
    >
      {stats.map((stat, index) => {
        const isRevealed = index < effectiveVisibleCount;

        return (
          <div
            key={index}
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
              transition: `opacity 600ms ${PREMIUM_EASE}, transform 600ms ${PREMIUM_EASE}`,
              transitionDelay: reducedMotion ? '0ms' : `${index * staggerDelay}ms`,
            }}
          >
            <AnimatedStat
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals}
              duration={duration}
              delay={reducedMotion ? 0 : 200}
              glowColor={glowColor}
            />
          </div>
        );
      })}
    </div>
  );
}

// ======================
// AnimatedStatRing Component
// ======================

interface AnimatedStatRingProps {
  value: number;
  maxValue: number;
  label: string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  size?: number;
  strokeWidth?: number;
  ringColor?: string;
  className?: string;
}

export function AnimatedStatRing({
  value,
  maxValue,
  label,
  icon,
  prefix = '',
  suffix = '',
  duration = 2000,
  delay = 0,
  size = 120,
  strokeWidth = 8,
  ringColor = '#6366f1',
  className = '',
}: AnimatedStatRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Animate from 0 to maxValue to show progress
  const { ref, count: animatedCount, progress, isVisible } = useAnimatedCounter({
    end: maxValue,
    duration,
    delay,
  });

  // Calculate display values
  const displayValue = Math.round((value / maxValue) * animatedCount);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div ref={containerRef} className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              filter: `drop-shadow(0 0 8px ${ringColor})`,
              transition: reducedMotion ? 'none' : 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {icon && (
            <div className="absolute -top-8">
              <IconGlow color={ringColor} isActive={isVisible} size="sm">
                {icon}
              </IconGlow>
            </div>
          )}
          <span
            ref={ref}
            className="text-2xl font-bold text-white"
            style={{
              textShadow: isVisible ? `0 0 20px ${ringColor}` : 'none',
              transition: `text-shadow 0.6s ${PREMIUM_EASE}`,
            }}
          >
            {prefix}
            {displayValue}
            {suffix}
          </span>
        </div>

        {/* Completion glow */}
        {isVisible && progress === 1 && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none animate-pulse-subtle"
            style={{
              background: `radial-gradient(circle, ${ringColor}25 0%, transparent 60%)`,
              filter: 'blur(12px)',
              animationDuration: '2s',
            }}
            aria-hidden="true"
          />
        )}
      </div>
      <span className="text-sm text-white/60 mt-3 text-center">{label}</span>
    </div>
  );
}
