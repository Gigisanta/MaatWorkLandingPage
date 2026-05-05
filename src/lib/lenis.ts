import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function getLenis() {
  if (typeof window === 'undefined') return null;

  if (!lenis) {
    lenis = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
  }
  return lenis;
}

export function initLenis(): Lenis | null {
  const instance = getLenis();
  if (!instance) return null;

  const raf = (time: number) => {
    instance.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
  return instance;
}

export function destroyLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function scrollToTarget(target: string | HTMLElement, offset: number = 0) {
  if (lenis) {
    lenis.scrollTo(target as string, { offset, duration: 1.2 });
  }
}

export { Lenis };
