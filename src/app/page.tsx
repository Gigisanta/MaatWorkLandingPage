import GalaxyWrapper from '@/components/GalaxyWrapper';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AllInOne from '@/components/sections/AllInOne';
import ROIPricing from '@/components/sections/ROIPricing';
import ContactFAQ from '@/components/sections/ContactFAQ';
import Footer from '@/components/sections/Footer';
import FloatingWhatsApp from '@/components/sections/FloatingWhatsApp';
import ExitIntentPopup from '@/components/sections/ExitIntentPopup';

export default function Home() {
  return (
    <>
      <GalaxyWrapper />
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
      <ExitIntentPopup />
    </>
  );
}
