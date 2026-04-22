/**
 * UI Component Library
 * Organized exports with motion-safe components
 */

// ==========================================
// FORM CONTROLS
// ==========================================

export { Input, type InputProps } from './input'
export { Textarea, type TextareaProps } from './textarea'
export { Select, type SelectProps } from './select'
export { Checkbox, type CheckboxProps } from './checkbox'

// ==========================================
// BUTTONS & ACTIONS
// ==========================================

export { Button, type ButtonProps } from './button'
export { MagneticButton, MagneticLink } from './magnetic-button'

// ==========================================
// LAYOUT & STRUCTURE
// ==========================================

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, type CardProps } from './card'
export { Badge, type BadgeProps } from './badge'

// ==========================================
// LOADERS & PROGRESS
// ==========================================

export {
  GradientSpinner,
  OrbitSpinner,
  PulseDots,
  WaveBars,
  DualRing,
  LiquidSpinner,
  GearSpinner,
  BounceDots,
  SyncDots,
  MeshSpinner,
  BrandSpinner,
  LoadingSpinner,
  LoadingOverlay,
  InlineLoading,
  ProgressBar,
  SpinnerKeyframes
} from './loading-spinners'

export {
  ScrollProgress,
  CircularProgress,
  ReadingProgress,
  ChapterProgress,
  CompactProgress
} from './scroll-progress'

// ==========================================
// EMPTY STATES & ERROR HANDLING
// ==========================================

export {
  EmptyState,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  type EmptyStateType
} from './empty-state'

export {
  ErrorState,
  RetryButton,
  ErrorBoundaryFallback,
  type ErrorType
} from './error-state'

// ==========================================
// NETWORK & STATE
// ==========================================

export {
  NetworkProvider,
  useNetworkStatus,
  ConnectionIndicator,
  RealtimeStatusBanner
} from './state-notifications'

// ==========================================
// SCROLL & ANIMATION
// ==========================================

export {
  ScrollAnimate,
  SectionTransition,
  ScrollStagger,
  useEntranceAnimation
} from './scroll-animate'

// ==========================================
// PAGE TRANSITIONS & REVEAL
// ==========================================

export {
  SectionReveal,
  StaggerContainer,
  usePageEnterTransition,
  PageTransitions,
  TextReveal
} from './section-reveal'

// ==========================================
// CURSORS & PARTICLES
// ==========================================

export { CursorTrail } from './cursor-trail'
export { PremiumCursor } from './premium-cursor'
export { AmbientParticles } from './ambient-particles'

// ==========================================
// DATA VISUALIZATION
// ==========================================

export {
  useAnimatedCounter,
  AnimatedStat,
  AnimatedStats,
  AnimatedStatRing
} from './animated-stats'

// ==========================================
// FAQ
// ==========================================

export { FAQAccordion, type FAQItem } from './faq-accordion'

// ==========================================
// DESIGN SYSTEM
// ==========================================

export { DesignSystem } from './design-system'

// ==========================================
// MOTION UTILITIES
// ==========================================

export { useReducedMotion } from '@/hooks'
