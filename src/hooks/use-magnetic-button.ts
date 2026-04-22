'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { springInterpolate } from './use-scroll-reveal';

interface MagneticButtonOptions {
  strength?: number;
  maxDistance?: number;
  scaleOnHover?: number;
  glowIntensity?: number;
  disabled?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function useMagneticButton<T extends HTMLElement = HTMLButtonElement>(
  options: MagneticButtonOptions = {},
) {
  const {
    strength = 0.25,
    maxDistance = 20,
    scaleOnHover = 1.04,
    glowIntensity = 0.5,
    disabled = false,
  } = options;

  const ref = useRef<T>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia('(pointer: coarse)').matches,
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Skip on touch devices or when disabled
  const shouldAnimate = !disabled && !isTouchDevice;

  useEffect(() => {
    if (!shouldAnimate) return;

    const element = ref.current;
    if (!element) return;

    let animationFrame: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let isInViewport = false;

    // Smoother spring settings
    const stiffness = 80;
    const damping = 12;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isInViewport) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const maxDist = Math.max(rect.width, rect.height) * 0.8;
      if (distance < maxDist) {
        const factor = Math.pow(1 - distance / maxDist, 2);
        targetX = Math.max(
          -maxDistance,
          Math.min(maxDistance, deltaX * strength * factor),
        );
        targetY = Math.max(
          -maxDistance,
          Math.min(maxDistance, deltaY * strength * factor),
        );
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const animate = () => {
      const { value: newX, velocity: newVelX } = springInterpolate(
        currentX,
        targetX,
        velocityX,
        stiffness,
        damping,
      );
      const { value: newY, velocity: newVelY } = springInterpolate(
        currentY,
        targetY,
        velocityY,
        stiffness,
        damping,
      );

      currentX = newX;
      currentY = newY;
      velocityX = newVelX;
      velocityY = newVelY;

      const scale = isHovering ? scaleOnHover : 1;
      element.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;

      const shouldContinue =
        Math.abs(targetX - currentX) > 0.005 ||
        Math.abs(targetY - currentY) > 0.005 ||
        isHovering;

      if (shouldContinue) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const handleMouseEnter = () => {
      isInViewport = true;
      setIsHovering(true);
      element.style.willChange = 'transform';
    };

    const handleMouseLeave = () => {
      isInViewport = false;
      setIsHovering(false);
      targetX = 0;
      targetY = 0;

      animationFrame = requestAnimationFrame(animate);
    };

    // Glow animation
    const updateGlow = () => {
      const glowElement = element.querySelector(
        '.magnetic-glow',
      ) as HTMLElement;
      if (glowElement) {
        glowElement.style.opacity = isHovering ? String(glowIntensity) : '0';
        glowElement.style.transform = 'scale(1.15)';
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    if (isHovering) {
      updateGlow();
    }

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    shouldAnimate,
    strength,
    maxDistance,
    scaleOnHover,
    isHovering,
    glowIntensity,
  ]);

  // Ripple effect handler
  const createRipple = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!shouldAnimate) return;

      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = 'clientX' in e ? e.clientX - rect.left : rect.width / 2;
      const y = 'clientY' in e ? e.clientY - rect.top : rect.height / 2;

      const ripple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
        size: Math.max(rect.width, rect.height) * 2.5,
      };

      setRipples((prev) => [...prev, ripple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 700);
    },
    [shouldAnimate],
  );

  return {
    ref,
    isHovering,
    ripples,
    createRipple,
    isTouchDevice: isTouchDevice || disabled,
  };
}
