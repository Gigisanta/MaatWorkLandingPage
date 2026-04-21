import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { AnnouncementBanner } from '@/components/landing/announcement-banner'
import { ProblemSolutionSection } from '@/components/landing/problem-solution'
import { FeaturesGrid } from '@/components/landing/features-grid'
import { HowItWorks } from '@/components/landing/how-it-works'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { TrustBadges } from '@/components/landing/trust-badges'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { ContactForm } from '@/components/landing/contact-form'
import { Footer } from '@/components/landing/footer'
import { FloatingWhatsApp } from '@/components/landing/floating-whatsapp'

export default function Home() {
  return (
    <main>
      <Navbar />
      <AnnouncementBanner />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesGrid />
      <HowItWorks />
      <TestimonialsSection />
      <TrustBadges />
      <PricingSection />
      <FaqSection />

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 lg:px-12 bg-[#04040e]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-wider">Empezá hoy</span>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
              ¿Listo para que tu local funcione solo?
            </h2>
            <p className="text-white/60 mt-4 max-w-lg mx-auto">
              Contanos de qué tipo de local se trata y en qué procesos necesitás ayuda.
            </p>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
