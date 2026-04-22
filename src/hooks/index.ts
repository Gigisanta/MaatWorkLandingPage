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
  useReducedMotion,
  springInterpolate,
  lerp,
} from './use-scroll-reveal'

// 3D tilt effects
export { useTilt3D } from './use-tilt'

// Magnetic button interaction
export { useMagneticButton } from './use-magnetic-button'

/* ======================
   OBSERVERS
   ====================== */

/**
 * Visibility hook for dividers with reduced motion support.
 */
export { useDividerVisibility } from './use-divider-visibility'
