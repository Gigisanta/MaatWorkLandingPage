'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#pricing', label: 'Precios' },
  { href: '#how-it-works', label: 'Cómo funciona' },
  { href: '#testimonials', label: 'Testimonios' },
  { href: '#contact', label: 'Contacto' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      {/* Backdrop blur */}
      <div
        className={`absolute inset-0 bg-[#04040e]/80 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Gradient line at bottom when scrolled */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-display text-xl font-black text-white tracking-tight group relative"
          >
            <span className="relative z-10">MaatWork</span>
            {/* Logo glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                {/* Underline effect */}
                <span className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary-dark"
              size="sm"
              className="hidden sm:inline-flex relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Probar gratis</span>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Button>
            <Button variant="secondary-dark" size="sm">
              Reservar lugar
            </Button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 px-4">
              <Button variant="primary-dark" size="sm" className="w-full">
                Probar gratis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
