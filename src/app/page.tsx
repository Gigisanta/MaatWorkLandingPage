'use client';

import dynamic from 'next/dynamic';
import AnnouncementBanner from '@/components/sections/AnnouncementBanner';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import LogoCarousel from '@/components/sections/LogoCarousel';
import ProblemSolution from '@/components/sections/ProblemSolution';
import FeaturesGrid from '@/components/sections/FeaturesGrid';
import HowItWorks from '@/components/sections/HowItWorks';
import TransformationShowcase from '@/components/sections/TransformationShowcase';
import Testimonials from '@/components/sections/Testimonials';
import PricingSection from '@/components/sections/PricingSection';
import ROICalculator from '@/components/sections/ROICalculator';
import TrustBadges from '@/components/sections/TrustBadges';
import FAQSection from '@/components/sections/FAQSection';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import FloatingWhatsApp from '@/components/sections/FloatingWhatsApp';

const GalaxyBackground3D = dynamic(() => import('@/components/three/GalaxyBackground3D'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <AnnouncementBanner />
      <Navbar />
      <main>
        <HeroSection />
        <LogoCarousel />
        <ProblemSolution />
        <FeaturesGrid />
        <HowItWorks />
        <TransformationShowcase />
        <Testimonials />
        <TrustBadges />
        <PricingSection />
        <ROICalculator />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <GalaxyBackground3D />
    </div>
  );
}
