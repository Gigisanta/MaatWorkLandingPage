'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#roi-pricing', label: 'Calculadora' },
  { href: '#all-in-one', label: 'Características' },
  { href: '#contact', label: 'Contacto' },
];

import { WHATSAPP_LINKS } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030014]/95 backdrop-blur-md border-b border-violet-900/30 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2" aria-label="MaatWork">
          <img
            src="/logo.svg"
            alt="MaatWork Logo"
            className="w-8 h-8"
            width={32}
            height={32}
          />
          <span className="text-lg font-semibold gradient-text">MaatWork</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={WHATSAPP_LINKS.nav}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Prueba gratis
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
          aria-label="Menú"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#030014]/98 backdrop-blur-md border-b border-violet-900/30">
          <div className="container-custom px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white py-3 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_LINKS.nav}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-3 rounded-lg mt-2"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Prueba gratis
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}