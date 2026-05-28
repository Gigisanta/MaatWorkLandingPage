'use client';

import { useRef, useCallback } from 'react';

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
    particleCount: 40000,
    starCount: 5700,
    pixelRatio: 2,
    enablePostProcessing: false,
    enableKuwahara: false,
    bloomIntensity: 0.4,
    bloomThreshold: 0.3,
    nebulaLayers: 2,
  },
  medium: {
    tier: 'medium',
    particleCount: 20000,
    starCount: 3500,
    pixelRatio: 1.5,
    enablePostProcessing: false,
    enableKuwahara: false,
    bloomIntensity: 0.3,
    bloomThreshold: 0.4,
    nebulaLayers: 1,
  },
  low: {
    tier: 'low',
    particleCount: 10000,
    starCount: 1800,
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

  if (isMobile || isLowPower) return 'low';
  if (dpr >= 2 && !isMobile) return 'high';
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
  const settingsRef = useRef<QualitySettings | null>(null);

  if (settingsRef.current === null) {
    const tier = forceTier ?? detectDeviceTier();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    settingsRef.current = getQualitySettings(tier, dpr);
  }

  return settingsRef.current;
}

export function useVisibilityState() {
  const isVisibleRef = useRef(true);
  const callbackRef = useRef<(() => void) | null>(null);

  if (typeof document !== 'undefined' && callbackRef.current === null) {
    callbackRef.current = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', callbackRef.current);
  }

  return { isVisible: isVisibleRef.current };
}

/**
 * Optimized frame limiter — no useState, no re-renders.
 * Uses ref-only approach for zero React overhead.
 */
export function useFrameLimiter(targetFps: number = 30) {
  const lastUpdateRef = useRef<number>(0);

  const shouldUpdate = useCallback(() => {
    const now = performance.now();
    const minInterval = 1000 / targetFps;

    if (now - lastUpdateRef.current >= minInterval) {
      lastUpdateRef.current = now;
      return true;
    }
    return false;
  }, [targetFps]);

  return { shouldUpdate };
}

/**
 * Smoothed delta time provider — eliminates frame time jitter.
 * Uses exponential moving average for buttery smooth animation.
 */
export function useSmoothDelta() {
  const smoothedRef = useRef(1 / 60);
  const rawRef = useRef(1 / 60);

  const getSmoothDelta = useCallback((rawDelta: number) => {
    // Clamp raw delta to avoid spikes (tab switch, GC pause)
    const clamped = Math.min(rawDelta, 0.1); // max 100ms
    rawRef.current = clamped;
    
    // EMA smoothing — factor 0.15 gives ~4 frame response time
    smoothedRef.current += (clamped - smoothedRef.current) * 0.15;
    return smoothedRef.current;
  }, []);

  return { getSmoothDelta };
}
