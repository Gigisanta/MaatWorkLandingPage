'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export type QualityTier = 'high' | 'medium' | 'low';

export interface QualitySettings {
  tier: QualityTier;
  particleCount: number;
  starCount: number;
  pixelRatio: number;
  enablePostProcessing: boolean;
  enableKuwahara: boolean;
  bloomIntensity: number;
  bloomThreshold: number;
  nebulaLayers: number;
  fps: number;
}

interface UseAdaptiveQualityOptions {
  forceTier?: QualityTier;
}

const QUALITY_TIERS: Record<QualityTier, Omit<QualitySettings, 'fps'>> = {
  high: {
    tier: 'high',
    particleCount: 60000,
    starCount: 8000,
    pixelRatio: 2,
    enablePostProcessing: false,
    enableKuwahara: false,
    bloomIntensity: 0.4,
    bloomThreshold: 0.3,
    nebulaLayers: 2,
  },
  medium: {
    tier: 'medium',
    particleCount: 30000,
    starCount: 4000,
    pixelRatio: 1.5,
    enablePostProcessing: false,
    enableKuwahara: false,
    bloomIntensity: 0.3,
    bloomThreshold: 0.4,
    nebulaLayers: 1,
  },
  low: {
    tier: 'low',
    particleCount: 15000,
    starCount: 2000,
    pixelRatio: 1,
    enablePostProcessing: false,
    enableKuwahara: false,
    bloomIntensity: 0.2,
    bloomThreshold: 0.5,
    nebulaLayers: 1,
  },
};

function detectDeviceTier(): QualityTier {
  if (typeof window === 'undefined') return 'medium';

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');
  const isLowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
  const dpr = window.devicePixelRatio;

  if (isMobile || isLowPower) {
    return 'low';
  }

  if (dpr >= 2 && !isMobile) {
    return 'high';
  }

  return 'medium';
}

function getQualitySettings(tier: QualityTier, dpr: number): QualitySettings {
  const baseSettings = QUALITY_TIERS[tier];
  const safeDpr = Math.min(dpr, tier === 'high' ? 2 : tier === 'medium' ? 1.5 : 1);

  return {
    ...baseSettings,
    pixelRatio: safeDpr,
    fps: 60,
  };
}

export function useAdaptiveQuality(options: UseAdaptiveQualityOptions = {}): QualitySettings {
  const { forceTier } = options;
  const [fps, setFps] = useState(60);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const tier = useMemo(() => {
    if (forceTier) return forceTier;
    return detectDeviceTier();
  }, [forceTier]);

  const baseSettings = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    return getQualitySettings(tier, dpr);
  }, [tier]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastFrameTimeRef.current = performance.now();

    const measureFps = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (delta > 0 && delta < 100) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 30) {
          frameTimesRef.current.shift();
        }

        if (frameTimesRef.current.length >= 10) {
          const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
          setFps(Math.round(1000 / avgFrameTime));
        }
      }

      rafIdRef.current = requestAnimationFrame(measureFps);
    };

    rafIdRef.current = requestAnimationFrame(measureFps);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return {
    ...baseSettings,
    fps,
  };
}

export function useVisibilityState() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isVisible };
}

export function useFrameLimiter(targetFps: number = 30) {
  const lastUpdateRef = useRef<number>(0);
  const [canUpdate, setCanUpdate] = useState(true);

  const shouldUpdate = useCallback(() => {
    const now = performance.now();
    const minInterval = 1000 / targetFps;

    if (now - lastUpdateRef.current >= minInterval) {
      lastUpdateRef.current = now;
      return true;
    }
    return false;
  }, [targetFps]);

  return { shouldUpdate, canUpdate, setCanUpdate };
}
