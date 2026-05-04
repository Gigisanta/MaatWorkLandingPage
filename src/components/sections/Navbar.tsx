'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Características' },
  { href: '#pricing', label: 'Precios' },
  { href: '#how-it-works', label: 'Cómo funciona' },
  { href: '#testimonials', label: 'Testimonios' },
  { href: '#contact', label: 'Contacto' },
];

const WHATSAPP_LINK = 'https://wa.me/5491130916574?text=Hola!%20Quiero%20probar%20MaatWork%20gratis';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-[#030014]/95 py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-60 group-hover:blur-md transition-all duration-300" />
          </div>
          <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">MaatWork</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-all duration-300 relative group py-1"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
              className="hidden md:flex btn-green text-sm hover:scale-105 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 active:scale-95"
        >
          Prueba gratis
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-violet-900/30 rounded-lg transition-all duration-300"
          aria-label="Abrir menú"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass border-t border-violet-900/50 transition-all duration-300 origin-top ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 scale-y-100' : 'opacity-0 -translate-y-4 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-4 gap-2">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white hover:bg-violet-800/40 transition-all duration-300 py-3 px-4 rounded-lg border border-transparent hover:border-violet-700/30 active:scale-95"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green text-center mt-2 hover:scale-[1.02] transition-transform duration-300 active:scale-95"
          >
            Prueba gratis
          </a>
        </div>
      </div>
    </nav>
  );
}
