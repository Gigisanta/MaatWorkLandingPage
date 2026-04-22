'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useReducedMotion } from '@/hooks';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  parallaxFactor: number;
  hue: number;
  saturation: number;
  lightness: number;
  pulsePhase: number;
  pulseSpeed: number;
  depth: number; // 0 = far, 1 = near
}

interface AmbientParticlesProps {
  /** Maximum number of particles */
  count?: number;
  /** Base particle size range (min, max) in pixels */
  sizeRange?: [number, number];
  /** Base opacity range (min, max) */
  opacityRange?: [number, number];
  /** Particle movement speed multiplier */
  speedMultiplier?: number;
  /** Mouse parallax intensity (0-1) */
  parallaxIntensity?: number;
  /** Disable on mobile screens */
  disableOnMobile?: boolean;
  /** CSS class for container */
  className?: string;
  /** Z-index layer position */
  zIndex?: number;
}

/**
 * Premium ambient particle background with mouse parallax effect.
 * Features constellation lines, depth blur, and additive glow blending.
 * Respects prefers-reduced-motion and disables on mobile by default.
 */
export function AmbientParticles({
  count = 40,
  sizeRange = [1, 3],
  opacityRange = [0.06, 0.22],
  speedMultiplier = 0.12,
  parallaxIntensity = 0.02,
  disableOnMobile = true,
  className = '',
  zIndex = -1,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const lastTimeRef = useRef<number>(0);

  const [isEnabled, setIsEnabled] = useState(true);
  const reducedMotion = useReducedMotion();

  // Premium theme colors as HSL values
  const THEME_HUES = {
    primary: 239,    // #6366f1 - Indigo
    purple: 262,     // #8b5cf6 - Violet
    cyan: 190,       // #06b6d4 - Cyan accent
    emerald: 160,    // #14b8a6 - Teal
  };

  // Check if mobile
  useEffect(() => {
    if (!disableOnMobile) {
      setIsEnabled(true);
      return;
    }

    const checkMobile = () => {
      setIsEnabled(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [disableOnMobile]);

  // Initialize particles with depth layering
  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      const hues = [THEME_HUES.primary, THEME_HUES.purple, THEME_HUES.cyan, THEME_HUES.emerald];

      for (let i = 0; i < count; i++) {
        // Create depth layers: 60% far, 30% mid, 10% near
        const depthRoll = Math.random();
        const depth = depthRoll < 0.6 ? depthRoll / 0.6 * 0.5 :
                      depthRoll < 0.9 ? 0.5 + (depthRoll - 0.6) / 0.3 * 0.3 :
                      0.8 + (depthRoll - 0.9) / 0.1 * 0.2;

        const sizeMultiplier = 0.4 + depth * 0.8; // Far particles smaller
        const size = (sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])) * sizeMultiplier;
        const opacity = (opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0])) * (0.5 + depth * 0.5);

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          opacity,
          speedX: (Math.random() - 0.5) * speedMultiplier * (0.5 + depth * 0.5),
          speedY: (Math.random() - 0.5) * speedMultiplier * 0.4 * (0.5 + depth * 0.5),
          parallaxFactor: 0.2 + depth * 0.8,
          hue: hues[Math.floor(Math.random() * hues.length)],
          saturation: 50 + Math.random() * 40,
          lightness: 55 + Math.random() * 25,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.001 + Math.random() * 0.002,
          depth,
        });
      }

      particlesRef.current = particles;
    },
    [count, sizeRange, opacityRange, speedMultiplier],
  );

  // Handle mouse movement
  useEffect(() => {
    if (!isEnabled || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isEnabled, reducedMotion]);

  // Animation setup
  useEffect(() => {
    if (!isEnabled || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles(width, height);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isEnabled, reducedMotion, initParticles]);

  // Main animation frame with delta-time
  useEffect(() => {
    if (!isEnabled || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const animate = (currentTime: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 16.67 : 1;
      lastTimeRef.current = currentTime;

      // Clamp delta to prevent jumps on tab switch
      const dt = Math.min(deltaTime, 3);

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation with easing
      const easing = 1 - Math.pow(0.92, dt);
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * easing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * easing;

      // Calculate mouse offset for parallax
      const mouseOffsetX = (mouseRef.current.x - 0.5) * parallaxIntensity * width * 2;
      const mouseOffsetY = (mouseRef.current.y - 0.5) * parallaxIntensity * height * 2;

      const particles = particlesRef.current;

      // Sort by depth for proper layering (far first)
      particles.sort((a, b) => a.depth - b.depth);

      // Draw constellation lines (subtle connections between nearby particles)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const px1 = p1.x + mouseOffsetX * p1.parallaxFactor;
        const py1 = p1.y + mouseOffsetY * p1.parallaxFactor;

        // Only connect far and mid depth particles
        if (p1.depth > 0.7) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.depth > 0.7) continue;

          const px2 = p2.x + mouseOffsetX * p2.parallaxFactor;
          const py2 = p2.y + mouseOffsetY * p2.parallaxFactor;

          const dx = px2 - px1;
          const dy = py2 - py1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150 + (1 - p1.depth) * 100;

          if (dist < maxDist) {
            const lineOpacity = (1 - dist / maxDist) * 0.08 * ((p1.depth + p2.depth) / 2);
            const midHue = (p1.hue + p2.hue) / 2;

            ctx.beginPath();
            ctx.strokeStyle = `hsla(${midHue}, 60%, 65%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py2);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position with delta-time
        particle.x += particle.speedX * dt;
        particle.y += particle.speedY * dt;

        // Wrap around edges with margin
        const margin = 30;
        if (particle.x < -margin) particle.x = width + margin;
        else if (particle.x > width + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = height + margin;
        else if (particle.y > height + margin) particle.y = -margin;

        // Update pulse with delta-time
        particle.pulsePhase += particle.pulseSpeed * dt;
        const pulseFactor = 0.65 + 0.35 * Math.sin(particle.pulsePhase);

        // Calculate parallax position
        const parallaxX = particle.x + mouseOffsetX * particle.parallaxFactor;
        const parallaxY = particle.y + mouseOffsetY * particle.parallaxFactor;

        // Mouse hover interaction
        const dx = parallaxX - targetMouseRef.current.x * width;
        const dy = parallaxY - targetMouseRef.current.y * height;
        const distFromCursor = Math.sqrt(dx * dx + dy * dy);
        const hoverRadius = 100 + particle.depth * 80;
        const hoverBoost = distFromCursor < hoverRadius
          ? (1 - distFromCursor / hoverRadius) * 0.4 * (0.3 + particle.depth * 0.7)
          : 0;

        // Final opacity
        const finalOpacity = Math.min(particle.opacity * pulseFactor + hoverBoost, 0.7);

        // Draw glow with additive blending
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const glowSize = particle.size * (3 + hoverBoost * 3) * (1 + particle.depth * 0.5);
        const gradient = ctx.createRadialGradient(
          parallaxX, parallaxY, 0,
          parallaxX, parallaxY, glowSize,
        );
        const alpha = finalOpacity * 0.4;
        gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 10}%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(parallaxX, parallaxY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw core particle
        ctx.beginPath();
        ctx.fillStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 15}%, ${finalOpacity})`;
        ctx.arc(parallaxX, parallaxY, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright center for larger, nearer particles
        if (particle.size > 1.8 && particle.depth > 0.4) {
          ctx.beginPath();
          ctx.fillStyle = `hsla(${particle.hue}, 30%, 90%, ${finalOpacity * 0.8})`;
          ctx.arc(parallaxX, parallaxY, particle.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled, reducedMotion, parallaxIntensity]);

  // Early return when disabled
  if (!isEnabled) {
    return null;
  }

  // Simplified static rendering for reduced motion
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`ambient-particles-container ${className}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`ambient-particles-container ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

export default AmbientParticles;
