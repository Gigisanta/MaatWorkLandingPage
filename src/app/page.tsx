'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AllInOne from '@/components/sections/AllInOne';
import ROIPricing from '@/components/sections/ROIPricing';
import ContactFAQ from '@/components/sections/ContactFAQ';
import Footer from '@/components/sections/Footer';
import FloatingWhatsApp from '@/components/sections/FloatingWhatsApp';

const GalaxyBackground3D = dynamic(() => import('@/components/three/GalaxyBackground3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-gradient-to-b from-violet-950 via-[#030014] to-[#030014]" />
});

export default function Home() {
  return (
    <>
      <GalaxyBackground3D />
      <div className="min-h-screen relative z-10">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <ROIPricing />
          <AllInOne />
          <ContactFAQ />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  );
}
