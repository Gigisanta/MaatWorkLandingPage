'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react';

import { useReducedMotion } from '@/hooks';

// ======================
// Types
// ======================

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'none';

interface PageTransitionOptions {
  children: ReactNode;
  className?: string;
  staggerChildren?: boolean;
  staggerDelay?: number;
  animationType?: AnimationType;
  enableCurtain?: boolean;
  curtainColor?: string;
}

// ======================
// Animation config - Premium easing
// ======================

const ANIMATION_CONFIG = {
  duration: 600,
  staggerDuration: 500,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  staggerEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  curtainEasing: 'cubic-bezier(0.76, 0, 0.24, 1)',
} as const;

// ======================
// Hook: Intersection Observer for reveal
// ======================

function useInView(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsInView(true);
      return () => {};
    }

    const element = ref.current;
    if (!element) return () => {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? '0px',
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, options?.threshold, options?.rootMargin]);

  return { ref, isInView };
}

// ======================
// Animation state maps
// ======================

const FROM_STATES: Record<AnimationType, CSSProperties> = {
  'fade-up': { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
  'fade-down': { opacity: 0, transform: 'translate3d(0, -24px, 0)' },
  'slide-left': { opacity: 0, transform: 'translate3d(32px, 0, 0)' },
  'slide-right': { opacity: 0, transform: 'translate3d(-32px, 0, 0)' },
  scale: { opacity: 0, transform: 'translate3d(0, 0, 0) scale(0.94)' },
  none: { opacity: 1, transform: 'none' },
};

const TO_STATES: Record<AnimationType, CSSProperties> = {
  'fade-up': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  'fade-down': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  'slide-left': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  'slide-right': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  scale: { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
  none: { opacity: 1, transform: 'none' },
};

const STAGGER_FROM_STATES: Record<AnimationType, CSSProperties> = {
  'fade-up': { opacity: 0, transform: 'translate3d(0, 14px, 0)' },
  'fade-down': { opacity: 0, transform: 'translate3d(0, -14px, 0)' },
  'slide-left': { opacity: 0, transform: 'translate3d(-14px, 0, 0)' },
  'slide-right': { opacity: 0, transform: 'translate3d(14px, 0, 0)' },
  scale: { opacity: 0, transform: 'translate3d(0, 0, 0) scale(0.97)' },
  none: { opacity: 0, transform: 'none' },
};

// ======================
// Section Reveal
// ======================

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
}

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up',
}: SectionRevealProps) {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });
  const prefersReducedMotion = useReducedMotion();

  const getStyle = useCallback((): CSSProperties => {
    if (animation === 'none') {
      return { opacity: 1, transform: 'none' };
    }

    const target = isInView ? TO_STATES[animation] : FROM_STATES[animation];
    const duration = prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration;
    const easedDelay = prefersReducedMotion ? 0 : delay;

    return {
      ...target,
      transition: `opacity ${duration}ms ${ANIMATION_CONFIG.easing} ${easedDelay}ms, transform ${duration}ms ${ANIMATION_CONFIG.easing} ${easedDelay}ms`,
      willChange: 'opacity, transform',
    };
  }, [animation, delay, isInView, prefersReducedMotion]);

  return (
    <div ref={ref} className={className} style={getStyle()}>
      {children}
    </div>
  );
}

// ======================
// Stagger Item
// ======================

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
}

export function StaggerItem({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up',
}: StaggerItemProps) {
  const { ref, isInView } = useInView({
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px',
  });
  const prefersReducedMotion = useReducedMotion();

  const getStyle = useCallback((): CSSProperties => {
    const effectiveDelay = prefersReducedMotion ? 0 : delay;
    const duration = prefersReducedMotion ? 0 : ANIMATION_CONFIG.staggerDuration;

    if (animation === 'none' || isInView) {
      return {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
        transition: `opacity ${duration}ms ${ANIMATION_CONFIG.staggerEasing} ${effectiveDelay}ms, transform ${duration}ms ${ANIMATION_CONFIG.staggerEasing} ${effectiveDelay}ms`,
        willChange: 'opacity, transform',
      };
    }

    return {
      ...STAGGER_FROM_STATES[animation],
      transition: `opacity ${duration}ms ${ANIMATION_CONFIG.staggerEasing} ${effectiveDelay}ms, transform ${duration}ms ${ANIMATION_CONFIG.staggerEasing} ${effectiveDelay}ms`,
      willChange: 'opacity, transform',
    };
  }, [animation, delay, isInView, prefersReducedMotion]);

  return (
    <div ref={ref} className={className} style={getStyle()}>
      {children}
    </div>
  );
}

// ======================
// Page Transitions
// ======================

export function PageTransitions({
  children,
  className = '',
  staggerChildren = true,
  staggerDelay = 80,
  animationType = 'fade-up',
  enableCurtain = false,
  curtainColor = '#6366f1',
}: PageTransitionOptions) {
  const [isCurtainActive, setIsCurtainActive] = useState(false);
  const [curtainDirection, setCurtainDirection] = useState<'up' | 'down'>('down');
  const [curtainVisible, setCurtainVisible] = useState(false);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);
  const curtainTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const clearCurtainTimeout = useCallback(() => {
    if (curtainTimeoutRef.current) {
      clearTimeout(curtainTimeoutRef.current);
      curtainTimeoutRef.current = null;
    }
  }, []);

  const hideCurtain = useCallback(() => {
    setIsCurtainActive(false);
    clearCurtainTimeout();
    curtainTimeoutRef.current = setTimeout(() => setCurtainVisible(false), 700);
  }, [clearCurtainTimeout]);

  useEffect(() => {
    if (prefersReducedMotion || !enableCurtain) return;

    const handleScroll = () => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        const delta = window.scrollY - lastScrollY.current;

        if (Math.abs(delta) > 80) {
          const newDirection = delta > 0 ? 'down' : 'up';

          if (newDirection !== curtainDirection || !isCurtainActive) {
            setCurtainDirection(newDirection);
            setCurtainVisible(true);
            setIsCurtainActive(true);
            clearCurtainTimeout();
            curtainTimeoutRef.current = setTimeout(hideCurtain, 400);
          }
        }

        lastScrollY.current = window.scrollY;
        rafId.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      clearCurtainTimeout();
    };
  }, [prefersReducedMotion, enableCurtain, curtainDirection, isCurtainActive, hideCurtain, clearCurtainTimeout]);

  const childrenArray = Array.isArray(children) ? children : [children];

  const getItemStyle = useCallback(
    (index: number): CSSProperties => {
      const effectiveDelay = prefersReducedMotion ? 0 : index * staggerDelay;
      const duration = prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration;

      if (animationType === 'none') {
        return { opacity: 1, transform: 'none', transition: 'none' };
      }

      return {
        ...FROM_STATES[animationType],
        transition: `opacity ${duration}ms ${ANIMATION_CONFIG.easing} ${effectiveDelay}ms, transform ${duration}ms ${ANIMATION_CONFIG.easing} ${effectiveDelay}ms`,
        willChange: 'opacity, transform',
      };
    },
    [animationType, staggerDelay, prefersReducedMotion],
  );

  const content = staggerChildren ? (
    <div style={{ display: 'contents' }}>
      {childrenArray.map((child, index) => (
        <div key={index} style={getItemStyle(index)}>
          {child}
        </div>
      ))}
    </div>
  ) : (
    children
  );

  const curtainTransform = curtainDirection === 'down'
    ? 'translate3d(0, 0%, 0)'
    : 'translate3d(0, 0%, 0)';

  const curtainFromTransform = curtainDirection === 'down'
    ? 'translate3d(0, -100%, 0)'
    : 'translate3d(0, 100%, 0)';

  return (
    <>
      {enableCurtain && curtainVisible && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            background: `linear-gradient(135deg, ${curtainColor} 0%, #8b5cf6 50%, ${curtainColor} 100%)`,
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite',
            transform: isCurtainActive ? curtainTransform : curtainFromTransform,
            transition: `transform 0.65s ${ANIMATION_CONFIG.curtainEasing}`,
            zIndex: 9990,
            pointerEvents: 'none',
            willChange: 'transform',
            contain: 'strict',
          }}
        />
      )}
      <div className={className}>{content}</div>
    </>
  );
}
