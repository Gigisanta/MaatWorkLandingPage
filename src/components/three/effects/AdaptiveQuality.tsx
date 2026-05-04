'use client';

import { useState, useEffect } from 'react';

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
}

interface UseAdaptiveQualityOptions {
  forceTier?: QualityTier;
}

function getQualitySettings(tier: QualityTier, dpr: number): QualitySettings {
  const safeDpr = typeof window !== 'undefined' ? Math.min(dpr, tier === 'high' ? 2 : tier === 'medium' ? 1.5 : 1) : 1;

  switch (tier) {
    case 'high':
      return {
        tier: 'high',
        particleCount: 30000,
        starCount: 6000,
        pixelRatio: safeDpr,
        enablePostProcessing: true,
        enableKuwahara: false,
        bloomIntensity: 1.2,
        bloomThreshold: 0.75,
        nebulaLayers: 2,
      };

    case 'medium':
      return {
        tier: 'medium',
        particleCount: 20000,
        starCount: 4000,
        pixelRatio: safeDpr,
        enablePostProcessing: true,
        enableKuwahara: false,
        bloomIntensity: 1.0,
        bloomThreshold: 0.8,
        nebulaLayers: 1,
      };

    case 'low':
      return {
        tier: 'low',
        particleCount: 20000,
        starCount: 4000,
        pixelRatio: 1,
        enablePostProcessing: false,
        enableKuwahara: false,
        bloomIntensity: 0.8,
        bloomThreshold: 0.85,
        nebulaLayers: 1,
      };
  }
}

export function useAdaptiveQuality(options: UseAdaptiveQualityOptions = {}): QualitySettings {
  const { forceTier } = options;

  // Compute quality based on forceTier or detect device capabilities
  // This runs on every render when forceTier changes, avoiding setState in effect
  const quality = (() => {
    if (forceTier) {
      return getQualitySettings(forceTier, 1);
    }

    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '');
    const isLowPower = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) <= 4;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    let tier: QualityTier;

    if (isMobile || isLowPower) {
      tier = 'low';
    } else if (dpr >= 2 && !isMobile) {
      tier = 'high';
    } else {
      tier = 'medium';
    }

    return getQualitySettings(tier, dpr);
  })();

  return quality;
}

// Visibility hook for pausing when not visible
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
