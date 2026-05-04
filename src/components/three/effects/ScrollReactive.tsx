'use client';

import { createContext, useContext, useEffect, useState, useRef, useMemo, ReactNode } from 'react';

interface ScrollState {
  scrollProgress: number;
  scrollVelocity: number;
  scrollY: number;
}

interface ScrollContextValue extends ScrollState {
  lenisRef: React.MutableRefObject<unknown | null>;
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollY: 0,
  lenisRef: { current: null },
});

export const useScrollContext = () => useContext(ScrollContext);

interface ScrollReactiveProviderProps {
  children: ReactNode;
}

export function ScrollReactiveProvider({ children }: ScrollReactiveProviderProps) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollProgress: 0,
    scrollVelocity: 0,
    scrollY: 0,
  });

  const rafIdRef = useRef<number | null>(null);
  const lenisRef = useRef<unknown | null>(null);

  useEffect(() => {
    let mounted = true;

    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        const lenis = new Lenis({
          lerp: 0.08,
          duration: 1.2,
          smoothWheel: true,
        });

        if (!mounted) {
          lenis.destroy();
          return;
        }

        lenisRef.current = lenis;

        const handleScroll = ({ scroll, limit, velocity }: { scroll: number; limit: number; velocity: number }) => {
          if (!mounted) return;
          const maxScroll = limit > 0 ? limit : document.body.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(Math.max(scroll / maxScroll, 0), 1) : 0;

          setScrollState({
            scrollProgress: progress,
            scrollVelocity: velocity,
            scrollY: scroll,
          });
        };

        lenis.on('scroll', handleScroll);

        function raf(time: number) {
          if (!mounted) return;
          lenis.raf(time);
          rafIdRef.current = requestAnimationFrame(raf);
        }
        rafIdRef.current = requestAnimationFrame(raf);

      } catch {
        console.warn('Lenis failed to load, using native scroll');

        const handleScroll = () => {
          if (!mounted) return;
          const scrollY = window.scrollY;
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

          setScrollState(prev => ({
            ...prev,
            scrollProgress: progress,
            scrollVelocity: prev.scrollVelocity * 0.5,
            scrollY,
          }));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
      }
    };

    initLenis();

    return () => {
      mounted = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (lenisRef.current && typeof (lenisRef.current as { destroy?: () => void }).destroy === 'function') {
        (lenisRef.current as { destroy: () => void }).destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  const value = useMemo<ScrollContextValue>(() => ({
    ...scrollState,
    lenisRef,
  }), [scrollState]);

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollReactive() {
  return useScrollContext();
}
