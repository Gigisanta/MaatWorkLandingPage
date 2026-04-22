'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { AnnouncementBanner } from '@/components/landing/announcement-banner';
import { Footer } from '@/components/landing/footer';
import { FloatingWhatsApp } from '@/components/landing/floating-whatsapp';
import { SectionReveal } from '@/components/ui/section-reveal';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { ScrollProgressIndicator, SectionDivider } from '@/components/landing/section-divider';
import { SocialProofToastContainer, useSocialProofToast } from '@/components/landing/social-proof-toast';
import { CursorTrail } from '@/components/ui/cursor-trail';

// Dynamic imports for below-fold sections (code splitting for better performance)
const ProblemSolutionSection = dynamic(
  () =>
    import('@/components/landing/problem-solution').then(
      (mod) => mod.ProblemSolutionSection,
    ),
  {
    loading: () => <SectionSkeleton variant="problem" />,
    ssr: true,
  },
);

const FeaturesGrid = dynamic(
  () =>
    import('@/components/landing/features-grid').then(
      (mod) => mod.FeaturesGrid,
    ),
  {
    loading: () => <SectionSkeleton variant="features" />,
    ssr: true,
  },
);

const DesignSystem = dynamic(
  () =>
    import('@/components/ui/design-system').then(
      (mod) => mod.DesignSystem,
    ),
  {
    loading: () => null,
    ssr: true,
  },
);

const HowItWorks = dynamic(
  () =>
    import('@/components/landing/how-it-works').then((mod) => mod.HowItWorks),
  {
    loading: () => <SectionSkeleton variant="howitworks" />,
    ssr: true,
  },
);

const TestimonialsSection = dynamic(
  () =>
    import('@/components/landing/testimonials-section').then(
      (mod) => mod.TestimonialsSection,
    ),
  {
    loading: () => <SectionSkeleton variant="testimonials" />,
    ssr: true,
  },
);

const TrustBadges = dynamic(
  () =>
    import('@/components/landing/trust-badges').then((mod) => mod.TrustBadges),
  {
    loading: () => <SectionSkeleton variant="trust" />,
    ssr: true,
  },
);

const PricingSection = dynamic(
  () =>
    import('@/components/landing/pricing-section').then(
      (mod) => mod.PricingSection,
    ),
  {
    loading: () => <SectionSkeleton variant="pricing" />,
    ssr: true,
  },
);

const FaqSection = dynamic(
  () =>
    import('@/components/landing/faq-section').then((mod) => mod.FaqSection),
  {
    loading: () => <SectionSkeleton variant="faq" />,
    ssr: true,
  },
);

const TransformationShowcase = dynamic(
  () =>
    import('@/components/landing/transformation-showcase').then(
      (mod) => mod.TransformationShowcase,
    ),
  {
    loading: () => <SectionSkeleton variant="features" />,
    ssr: true,
  },
);

const ContactForm = dynamic(
  () =>
    import('@/components/landing/contact-form').then((mod) => mod.ContactForm),
  {
    loading: () => <ContactFormSkeleton />,
    ssr: true,
  },
);

// Premium Skeleton for below-fold sections with shimmer sweep animation
function SectionSkeleton({ variant }: { variant: string }) {
  const heights: Record<string, string> = {
    problem: 'h-[800px]',
    features: 'h-[600px]',
    howitworks: 'h-[500px]',
    testimonials: 'h-[400px]',
    trust: 'h-[200px]',
    pricing: 'h-[700px]',
    faq: 'h-[600px]',
  };

  return (
    <div
      className={`${heights[variant] || 'h-[400px]'} bg-[#04040e] flex items-center justify-center relative overflow-hidden`}
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
function ContactFormSkeleton() {
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

function PageSkeleton() {
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });
  const [contentVisible, setContentVisible] = useState(false);
  const { toasts, addToast, removeToast, isMounted } = useSocialProofToast();

  // Demo: Show a social proof toast after 5 seconds
  useEffect(() => {
    if (!contentVisible) return;

    const demoTimer = setTimeout(() => {
      addToast({
        userName: 'Juan',
        userLocation: 'Buenos Aires, Argentina',
        action: 'se unio al programa',
        avatarFallback: 'J',
      });
    }, 5000);

    // Show more toasts periodically for demo
    const intervalTimer = setInterval(() => {
      const names = ['Maria', 'Carlos', 'Ana', 'Diego', 'Sofia', 'Pablo'];
      const locations = ['Santiago, Chile', 'Madrid, Espana', 'Lima, Peru', 'Bogota, Colombia', 'Montevideo, Uruguay'];
      const actions = ['se unio al programa', 'comenzo su prueba gratis', 'contrato el plan Pro', 'solicito una demo'];

      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      addToast({
        userName: randomName,
        userLocation: randomLocation,
        action: randomAction,
        avatarFallback: randomName[0],
      });
    }, 12000);

    return () => {
      clearTimeout(demoTimer);
      clearInterval(intervalTimer);
    };
  }, [contentVisible, addToast]);

  useEffect(() => {
    // Minimum skeleton display time for visual feedback
    const minDisplayTimer = setTimeout(() => {
      setIsLoading(false);
      // Small delay before triggering entrance animations
      requestAnimationFrame(() => {
        setContentVisible(true);
      });
    }, 800);

    return () => clearTimeout(minDisplayTimer);
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <main className={contentVisible ? 'page-loaded' : ''}>
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />

      {/* Ambient particle background - atmospheric depth layer */}
      <AmbientParticles
        count={35}
        sizeRange={[1, 3]}
        opacityRange={[0.08, 0.35]}
        speedMultiplier={0.2}
        parallaxIntensity={0.015}
        zIndex={-1}
      />

      {/* Cursor trail effect */}
      <CursorTrail />

      <div className="entrance-nav">
        <Navbar />
      </div>
      <div className="entrance-banner">
        <AnnouncementBanner />
      </div>
      <div className="entrance-hero">
        <HeroSection />
      </div>

      {/* Section divider: animated wave after hero */}
      <SectionDivider variant="wave" position="bottom" speed={0.8} />

      <SectionReveal>
        <ProblemSolutionSection />
      </SectionReveal>

      {/* Section divider: dot pattern */}
      <SectionDivider variant="dots" position="both" particleCount={15} particleColor="rgba(99, 102, 241, 0.25)" />

      <SectionReveal delay={100}>
        <FeaturesGrid />
      </SectionReveal>

      {/* Section divider: animated particles */}
      <SectionDivider variant="particles" position="both" particleCount={20} particleColor="rgba(168, 85, 247, 0.2)" speed={0.5} />

      <SectionReveal delay={150}>
        <TransformationShowcase />
      </SectionReveal>

      {/* Design System showcase - subtle premium polish */}
      <DesignSystem />

      {/* Section divider: gradient fade */}
      <SectionDivider variant="gradient" position="both" gradientFrom="rgba(139, 92, 246, 0.08)" gradientTo="transparent" />

      <SectionReveal delay={150}>
        <HowItWorks />
      </SectionReveal>

      {/* Section divider: animated particles */}
      <SectionDivider variant="particles" position="both" particleCount={25} particleColor="rgba(168, 85, 247, 0.3)" speed={0.6} />

      <SectionReveal delay={100}>
        <TestimonialsSection />
      </SectionReveal>

      {/* Section divider: subtle gradient */}
      <SectionDivider variant="gradient" position="both" gradientFrom="rgba(99, 102, 241, 0.05)" gradientTo="transparent" />

      <SectionReveal delay={100}>
        <TrustBadges />
      </SectionReveal>

      {/* Section divider: wave */}
      <SectionDivider variant="wave" position="both" speed={1.2} />

      <SectionReveal delay={150}>
        <PricingSection />
      </SectionReveal>

      {/* Section divider: curve */}
      <SectionDivider variant="curve" position="both" />

      <SectionReveal delay={100}>
        <FaqSection />
      </SectionReveal>

      {/* Section divider: slope */}
      <SectionDivider variant="slope" position="both" />

      {/* Contact Section */}
      <SectionReveal delay={50}>
        <section
          id="contact"
          className="section-spacing px-6 lg:px-12 bg-[#04040e]"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-bold uppercase tracking-wider">
                Empezá hoy
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
                ¿Listo para que tu local funcione solo?
              </h2>
              <p className="text-white/60 mt-4 max-w-lg mx-auto">
                Contanos de qué tipo de local se trata y en qué procesos
                necesitás ayuda.
              </p>
            </div>
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <ContactForm />
            </div>
          </div>
        </section>
      </SectionReveal>

      <Footer />
      <FloatingWhatsApp />
      <SocialProofToastContainer
        toasts={toasts}
        onDismiss={removeToast}
        isMounted={isMounted}
      />
    </main>
  );
}
