/**

# Hooks Index

Central export point for all custom hooks.

## Categories

- **Motion & Animation**: Scroll reveals, parallax, tilt, magnetic effects
- **Observers**: Scroll, intersection, mouse position tracking
- **Utilities**: Interval, reduced motion detection

## Usage with Reduced Motion

All animation hooks automatically check `useReducedMotion()` internally.
For manual control, import and use `useReducedMotion` directly:

```tsx
import { useReducedMotion, useScrollReveal } from '@/hooks'

function MyComponent() {
  const shouldReduceMotion = useReducedMotion()

  // Apply reduced motion logic manually if needed
  const animationDuration = shouldReduceMotion ? 0 : 600
}
```

*/

/* ======================
   MOTION & ANIMATION
   ====================== */

// Scroll-based animations
export {
  useScrollReveal,
  useStaggerReveal,
  useParallax,
  useCounter,
  useScrollProgress,
  useMagnetic,
  lerp,
  springInterpolate,
  useReducedMotion,
} from './use-scroll-reveal'

// 3D tilt effects
export { useTilt3D } from './use-tilt'

// Magnetic button interaction
export { useMagneticButton } from './use-magnetic-button'

/* ======================
   OBSERVERS
   ====================== */

/**
 * Tracks vertical scroll position.
 * @returns [scrollY] - Current scroll offset in pixels
 */
export { useScrollY } from './useScrollY'

/**
 * Tracks mouse position relative to viewport.
 * @returns [x, y] - Mouse coordinates
 */
export { useMousePosition } from './useMousePosition'

/**
 * Detects when element enters/exits viewport.
 * @returns [ref, isIntersecting] - Ref to attach and intersection state
 */
export { useIntersectionObserver } from './useIntersectionObserver'

/* ======================
   UTILITIES
   ====================== */

/**
 * Interval timer with pause/resume support.
 */
export { useInterval } from './useInterval'
