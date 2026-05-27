'use client';

import { useEffect, useState } from 'react';

// Viewport hook for responsive effects
export function useViewport() {
  const [viewport, setViewport] = useState({ width: 1920, height: 1080, isMobile: false, isTablet: false });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      setViewport({ width, height, isMobile, isTablet });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return viewport;
}
