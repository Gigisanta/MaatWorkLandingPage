'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useReducedMotion, springInterpolate } from '@/hooks';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary-dark'
    | 'secondary-dark'
    | 'primary'
    | 'secondary'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: string;
  rippleColor?: string;
  children: React.ReactNode;
}

// Spring physics constants for premium feel
const SPRING = { stiffness: 120, damping: 14 };

function usePremiumMagnetic<T extends HTMLElement>(options: {
  strength?: number;
  tiltStrength?: number;
  disabled?: boolean;
}) {
  const { strength = 0.3, tiltStrength = 0.15, disabled = false } = options;
  const ref = useRef<T>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Animation state
  const state = useRef({
    targetX: 0, targetY: 0,
    targetTiltX: 0, targetTiltY: 0,
    currentX: 0, currentY: 0,
    currentTiltX: 0, currentTiltY: 0,
    velocityX: 0, velocityY: 0,
    velocityTiltX: 0, velocityTiltY: 0,
    raf: null as number | null,
  });

  // Detect touch device
  useEffect(() => {
    const check = () => setIsTouchDevice(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const shouldAnimate = !disabled && !isTouchDevice;

  useEffect(() => {
    if (!shouldAnimate) return;
    const el = ref.current;
    if (!el) return;

    const s = state.current;

    const animate = () => {
      // Spring interpolation for position
      const posX = springInterpolate(s.currentX, s.targetX, s.velocityX, SPRING.stiffness, SPRING.damping);
      const posY = springInterpolate(s.currentY, s.targetY, s.velocityY, SPRING.stiffness, SPRING.damping);
      // Tilt interpolation (more damped)
      const tiltX = springInterpolate(s.currentTiltX, s.targetTiltX, s.velocityTiltX, 80, 18);
      const tiltY = springInterpolate(s.currentTiltY, s.targetTiltY, s.velocityTiltY, 80, 18);

      s.currentX = posX.value; s.velocityX = posX.velocity;
      s.currentY = posY.value; s.velocityY = posY.velocity;
      s.currentTiltX = tiltX.value; s.velocityTiltX = tiltX.velocity;
      s.currentTiltY = tiltY.value; s.velocityTiltY = tiltY.velocity;

      el.style.transform = `translate3d(${s.currentX}px, ${s.currentY}px, 0) perspective(600px) rotateX(${s.currentTiltX}deg) rotateY(${s.currentTiltY}deg) scale(${isHovering ? 1.05 : 1})`;

      // Update glow position
      const glow = el.querySelector('.magnetic-glow') as HTMLElement;
      if (glow) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Glow offset follows magnetic pull with offset
        const glowX = centerX + s.targetX * 0.8;
        const glowY = centerY + s.targetY * 0.8;
        glow.style.background = `radial-gradient(circle at ${glowX}px ${glowY}px, var(--glow-color, rgba(139, 92, 246, 0.6)) 0%, transparent 70%)`;
      }

      const shouldContinue = Math.abs(s.targetX - s.currentX) > 0.01 ||
        Math.abs(s.targetY - s.currentY) > 0.01 ||
        Math.abs(s.targetTiltX - s.currentTiltX) > 0.01 ||
        Math.abs(s.targetTiltY - s.currentTiltY) > 0.01 ||
        isHovering;

      if (shouldContinue) {
        s.raf = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxDist = Math.max(rect.width, rect.height) * 0.7;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < maxDist) {
        const factor = Math.pow(1 - dist / maxDist, 2);
        s.targetX = deltaX * strength * factor;
        s.targetY = deltaY * strength * factor;
        s.targetTiltX = -deltaY * tiltStrength * factor;
        s.targetTiltY = deltaX * tiltStrength * factor;
      } else {
        s.targetX = 0; s.targetY = 0;
        s.targetTiltX = 0; s.targetTiltY = 0;
      }

      if (!s.raf) s.raf = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      el.style.willChange = 'transform';
      el.style.transition = 'none';
      if (!s.raf) s.raf = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      s.targetX = 0; s.targetY = 0;
      s.targetTiltX = 0; s.targetTiltY = 0;
      el.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
      if (!s.raf) s.raf = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [shouldAnimate, strength, tiltStrength, isHovering]);

  return { ref, isHovering, isTouchDevice };
}

export function MagneticButton({
  variant = 'primary-dark',
  size = 'md',
  glowColor = 'rgba(139, 92, 246, 0.6)',
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  className = '',
  disabled,
  onClick,
  children,
  ...props
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  const { ref, isHovering, isTouchDevice } = usePremiumMagnetic<HTMLButtonElement>({
    strength: 0.35,
    tiltStrength: 0.12,
    disabled: disabled || reducedMotion,
  });

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.max(rect.width, rect.height) * 2.5,
    };
    setRipples(prev => [...prev, ripple]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 700);
    onClick?.(e);
  }, [disabled, onClick]);

  const isDisabled = disabled || reducedMotion || isTouchDevice;

  const sizeClasses = {
    sm: 'h-10 px-5 text-sm gap-1.5',
    md: 'h-12 px-6 text-base gap-2',
    lg: 'h-14 px-8 text-lg gap-2.5',
  };

  const variantClasses = {
    'primary-dark': 'bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110',
    'secondary-dark': 'bg-white/5 border border-white/15 text-white hover:bg-white/12 hover:border-white/25 backdrop-blur-sm',
    primary: 'bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:brightness-110',
    secondary: 'bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/15',
    ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/8',
  };

  return (
    <button
      ref={ref}
      className={`relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 ease-out focus-ring disabled:pointer-events-none disabled:opacity-50 ${isPressed && !isDisabled ? 'scale-[0.97]' : ''} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{
        '--glow-color': glowColor,
        willChange: 'transform',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      } as React.CSSProperties}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {/* Dynamic glow layer */}
      <div
        className="magnetic-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: isHovering ? 0.7 : 0,
        }}
      />

      {/* Inner glow border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          opacity: isHovering ? 0.5 : 0,
        }}
      />

      {/* Sparkle particles on hover */}
      {isHovering && !isDisabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + (i % 3) * 30}%`,
                animation: `sparkle 1.5s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2,
            background: `radial-gradient(circle, ${rippleColor} 0%, transparent 70%)`,
            animation: 'ripple-expand 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* Premium shine sweep */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
        <span
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 70%)',
            transform: isHovering ? 'translateX(150%)' : 'translateX(-150%)',
            transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </span>

      <style>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        @keyframes ripple-expand {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </button>
  );
}

// Link variant of magnetic button
interface MagneticLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?:
    | 'primary-dark'
    | 'secondary-dark'
    | 'primary'
    | 'secondary'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: string;
  rippleColor?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function MagneticLink({
  variant = 'primary-dark',
  size = 'md',
  glowColor = 'rgba(139, 92, 246, 0.6)',
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  className = '',
  disabled,
  onClick,
  children,
  ...props
}: MagneticLinkProps) {
  const reducedMotion = useReducedMotion();
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  const { ref, isHovering, isTouchDevice } = usePremiumMagnetic<HTMLAnchorElement>({
    strength: 0.35,
    tiltStrength: 0.12,
    disabled: disabled || reducedMotion,
  });

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: Math.max(rect.width, rect.height) * 2.5,
    };
    setRipples(prev => [...prev, ripple]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 700);
    onClick?.(e);
  }, [disabled, onClick]);

  const isDisabled = disabled || reducedMotion || isTouchDevice;

  const sizeClasses = {
    sm: 'h-10 px-5 text-sm gap-1.5',
    md: 'h-12 px-6 text-base gap-2',
    lg: 'h-14 px-8 text-lg gap-2.5',
  };

  const variantClasses = {
    'primary-dark': 'bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110',
    'secondary-dark': 'bg-white/5 border border-white/15 text-white hover:bg-white/12 hover:border-white/25 backdrop-blur-sm',
    primary: 'bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:brightness-110',
    secondary: 'bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/15',
    ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/8',
  };

  return (
    <a
      ref={ref}
      className={`relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 ease-out focus-ring disabled:pointer-events-none disabled:opacity-50 ${isPressed && !isDisabled ? 'scale-[0.97]' : ''} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{
        '--glow-color': glowColor,
        willChange: 'transform',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      } as React.CSSProperties}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {/* Dynamic glow layer */}
      <div
        className="magnetic-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: isHovering ? 0.7 : 0,
        }}
      />

      {/* Inner glow border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          opacity: isHovering ? 0.5 : 0,
        }}
      />

      {/* Sparkle particles on hover */}
      {isHovering && !isDisabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + (i % 3) * 30}%`,
                animation: `sparkle 1.5s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Link content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2,
            background: `radial-gradient(circle, ${rippleColor} 0%, transparent 70%)`,
            animation: 'ripple-expand 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* Premium shine sweep */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
        <span
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 70%)',
            transform: isHovering ? 'translateX(150%)' : 'translateX(-150%)',
            transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </span>

      <style>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        @keyframes ripple-expand {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
