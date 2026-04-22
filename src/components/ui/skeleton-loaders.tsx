'use client';

type SectionVariant = 'problem' | 'features' | 'howitworks' | 'testimonials' | 'trust' | 'pricing' | 'faq';

const sectionHeights: Record<SectionVariant, string> = {
  problem: 'h-[800px]',
  features: 'h-[600px]',
  howitworks: 'h-[500px]',
  testimonials: 'h-[400px]',
  trust: 'h-[200px]',
  pricing: 'h-[700px]',
  faq: 'h-[600px]',
};

// Premium Skeleton for below-fold sections with shimmer sweep animation
export function SectionSkeleton({ variant }: { variant: SectionVariant }) {
  return (
    <div
      className={`${sectionHeights[variant] || 'h-[400px]'} bg-[#04040e] flex items-center justify-center relative overflow-hidden`}
    >
      {/* Premium skeleton container with breathing animation */}
      <div className="skeleton-premium-group flex flex-col items-center gap-5">
        {/* Main title skeleton */}
        <div className="skeleton-shimmer-line w-40 h-9 rounded-xl" />
        {/* Subtitle lines with staggered delays */}
        <div className="skeleton-shimmer-line w-56 h-4 rounded-lg delay-100" />
        <div className="skeleton-shimmer-line w-72 h-4 rounded-lg delay-200" />
        {/* Decorative elements */}
        <div className="skeleton-shimmer-line w-24 h-3 rounded-full delay-300 mt-2 opacity-60" />
      </div>

      {/* Ambient glow effect */}
      <div className="skeleton-ambient-glow" />
    </div>
  );
}

// Premium Contact Form Skeleton with card-like structure
export function ContactFormSkeleton() {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden">
      {/* Card glow effect */}
      <div className="skeleton-card-glow" />

      <div className="space-y-5 relative z-10">
        {/* Label skeleton */}
        <div className="skeleton-shimmer-line w-20 h-3 rounded-full" />
        {/* Title skeleton */}
        <div className="skeleton-shimmer-line w-44 h-8 rounded-xl" />
        {/* Input skeletons with staggered delays */}
        <div className="skeleton-shimmer-line w-full h-12 rounded-xl delay-100" />
        <div className="skeleton-shimmer-line w-full h-12 rounded-xl delay-200" />
        <div className="skeleton-shimmer-line w-full h-24 rounded-xl delay-300" />
        {/* Button skeleton */}
        <div className="skeleton-shimmer-line w-full h-12 rounded-xl delay-400 mt-2" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton">
      {/* Premium branded skeleton loader */}
      <div className="skeleton-loader-container">
        {/* Logo placeholder with shimmer */}
        <div className="skeleton-logo-premium">
          <div className="skeleton-logo-inner" />
        </div>

        {/* Animated spinner with gradient */}
        <div className="skeleton-spinner-premium">
          <div className="skeleton-spinner-inner" />
        </div>

        {/* Loading text */}
        <div className="skeleton-loading-text">
          <span className="skeleton-dot delay-0" />
          <span className="skeleton-dot delay-150" />
          <span className="skeleton-dot delay-300" />
        </div>
      </div>

      {/* Full page skeleton preview */}
      <div className="skeleton-page-preview">
        {/* Nav skeleton */}
        <div className="skeleton-nav">
          <div className="skeleton-nav-logo" />
          <div className="skeleton-nav-links">
            <div className="skeleton-shimmer-line w-16 h-4 rounded" />
            <div className="skeleton-shimmer-line w-16 h-4 rounded" />
            <div className="skeleton-shimmer-line w-16 h-4 rounded" />
          </div>
        </div>

        {/* Hero section skeleton */}
        <div className="skeleton-hero-premium">
          <div className="skeleton-hero-content">
            <div className="skeleton-shimmer-line w-3/4 h-12 rounded-2xl delay-100" />
            <div className="skeleton-shimmer-line w-full h-6 rounded-xl delay-200 mt-4" />
            <div className="skeleton-shimmer-line w-2/3 h-6 rounded-xl delay-300 mt-2" />
            <div className="skeleton-hero-cta delay-400">
              <div className="skeleton-shimmer-line w-32 h-12 rounded-xl" />
              <div className="skeleton-shimmer-line w-28 h-12 rounded-xl delay-100" />
            </div>
          </div>
          {/* Hero decorative elements */}
          <div className="skeleton-hero-decoration">
            <div className="skeleton-hero-orb skeleton-orb-1" />
            <div className="skeleton-hero-orb skeleton-orb-2" />
          </div>
        </div>

        {/* Card skeletons preview */}
        <div className="skeleton-cards-premium">
          <div className="skeleton-card-premium delay-100">
            <div className="skeleton-card-icon" />
            <div className="skeleton-shimmer-line w-3/4 h-5 rounded-lg" />
            <div className="skeleton-shimmer-line w-full h-4 rounded mt-3" />
            <div className="skeleton-shimmer-line w-2/3 h-4 rounded mt-2" />
          </div>
          <div className="skeleton-card-premium delay-200">
            <div className="skeleton-card-icon" />
            <div className="skeleton-shimmer-line w-3/4 h-5 rounded-lg" />
            <div className="skeleton-shimmer-line w-full h-4 rounded mt-3" />
            <div className="skeleton-shimmer-line w-2/3 h-4 rounded mt-2" />
          </div>
          <div className="skeleton-card-premium delay-300">
            <div className="skeleton-card-icon" />
            <div className="skeleton-shimmer-line w-3/4 h-5 rounded-lg" />
            <div className="skeleton-shimmer-line w-full h-4 rounded mt-3" />
            <div className="skeleton-shimmer-line w-2/3 h-4 rounded mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
