'use client'

// Hooks Index — only exports actually used hooks

// Scroll animation utilities (used by use-magnetic-button, use-tilt)
export {
  useReducedMotion,
  springInterpolate,
  lerp,
} from './use-scroll-reveal'

// 3D tilt effects (not currently used by components but kept for future use)
export { useTilt3D } from './use-tilt'

// Magnetic button interaction (not currently used by components but kept for future use)
export { useMagneticButton } from './use-magnetic-button'

// Lead capture
export { useExitIntent } from './use-exit-intent'
export { useUtm } from './use-utm'
