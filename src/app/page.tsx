'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { AnnouncementBanner } from '@/components/landing/announcement-banner';
import { Footer } from '@/components/landing/footer';
import { FloatingWhatsApp } from '@/components/landing/floating-whatsapp';
import { SectionReveal } from '@/components/ui/section-reveal';
import { ScrollProgressIndicator, SectionDivider } from '@/components/landing/section-divider';
import { SocialProofToastContainer, useSocialProofToast } from '@/components/landing/social-proof-toast';
import { CursorTrail } from '@/components/ui/cursor-trail';
import { SectionSkeleton, ContactFormSkeleton, PageSkeleton } from '@/components/ui/skeleton-loaders';

// Dynamic imports for below-fold sections (code splitting for better performance)
const AmbientParticles = dynamic(
  () => import('@/components/ui/ambient-particles').then((mod) => mod.AmbientParticles),
  { ssr: false }
);

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

const ROICalculator = dynamic(
  () =>
    import('@/components/landing/roi-calculator').then(
      (mod) => mod.ROICalculator,
    ),
  {
    loading: () => <SectionSkeleton variant="features" />,
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

const TOAST_NAMES = ['Maria', 'Carlos', 'Ana', 'Diego', 'Sofia', 'Pablo'] as const;
const TOAST_LOCATIONS = ['Santiago, Chile', 'Madrid, Espana', 'Lima, Peru', 'Bogota, Colombia', 'Montevideo, Uruguay'] as const;
const TOAST_ACTIONS = ['se unio al programa', 'comenzo su prueba gratis', 'contrato el plan Pro', 'solicito una demo'] as const;

function getRandomToastData() {
  const name = TOAST_NAMES[Math.floor(Math.random() * TOAST_NAMES.length)];
  const location = TOAST_LOCATIONS[Math.floor(Math.random() * TOAST_LOCATIONS.length)];
  const action = TOAST_ACTIONS[Math.floor(Math.random() * TOAST_ACTIONS.length)];
  return { userName: name, userLocation: location, action, avatarFallback: name[0] };
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(!prefersReducedMotion);
  const [contentVisible, setContentVisible] = useState(prefersReducedMotion);
  const { toasts, addToast, removeToast, isMounted } = useSocialProofToast();

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

    const intervalTimer = setInterval(() => {
      addToast(getRandomToastData());
    }, 12000);

    return () => {
      clearTimeout(demoTimer);
      clearInterval(intervalTimer);
    };
  }, [contentVisible, addToast]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const minDisplayTimer = setTimeout(() => {
      setIsLoading(false);
      requestAnimationFrame(() => {
        setContentVisible(true);
      });
    }, 800);

    return () => clearTimeout(minDisplayTimer);
  }, [prefersReducedMotion]);

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

      {/* ROI Calculator */}
      <SectionReveal delay={100}>
        <ROICalculator />
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
