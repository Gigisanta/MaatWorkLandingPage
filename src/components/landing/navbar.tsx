'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { useReducedMotion } from '@/hooks'

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#pricing', label: 'Precios' },
  { href: '#how-it-works', label: 'Cómo funciona' },
  { href: '#testimonials', label: 'Testimonios' },
  { href: '#contact', label: 'Contacto' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible] = useState(true)

  // Scroll lock when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])
  const prefersReducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const headerOffset = 100
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
    closeMobileMenu()
  }, [closeMobileMenu, prefersReducedMotion])

  const transitionDuration = prefersReducedMotion ? 0 : 500

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${prefersReducedMotion ? '' : 'duration-500'} ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: `opacity 0.6s ease-out, transform 0.6s ease-out, padding ${transitionDuration}ms ease`
      }}
    >
      {/* Premium glassmorphism background */}
      <div
        className={`absolute inset-0 transition-all ${prefersReducedMotion ? '' : 'duration-500'} ${
          scrolled
            ? 'bg-[var(--color-bg-base)]/90 backdrop-blur-2xl border-b border-white/[0.14] shadow-2xl shadow-indigo-950/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Layered ambient glow */}
        {scrolled && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-violet-500/5" />
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          </>
        )}
      </div>

      {/* Animated scroll progress */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.02]">
        <div
          className={`h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 ${prefersReducedMotion ? '' : 'transition-all duration-150 ease-out'}`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between">
          {/* Logo with premium hover effect */}
          <a
            href="#"
            className="font-display text-xl font-black text-white tracking-tight group relative rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer min-h-11 flex items-center"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }) }}
            aria-label="MaatWork - Volver al inicio"
          >
            <span className="relative z-10">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">Maat</span>
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Work</span>
            </span>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-lg blur-xl" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-indigo-400/50 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
          </a>

          {/* Desktop nav links with refined hover states */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-4 py-2 text-sm text-white/50 hover:text-white group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 cursor-pointer"
              >
                <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-300" />
                <span className="relative block">{link.label}</span>
                <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <MagneticButton
              variant="primary-dark"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Probar gratis
            </MagneticButton>
            <MagneticButton
              variant="secondary-dark"
              size="sm"
              onClick={(e) => handleNavClick(e, '#pricing')}
            >
              Reservar lugar
            </MagneticButton>

            {/* Mobile menu button with refined states */}
            <button
              className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 focus-ring cursor-pointer ${
                prefersReducedMotion ? '' : 'duration-300'
              } ${
                mobileMenuOpen
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-5 h-5">
                <span className={`absolute left-0 w-full h-0.5 bg-current transition-all ${prefersReducedMotion ? '' : 'duration-300'} ${mobileMenuOpen ? 'top-2 rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 top-2 w-full h-0.5 bg-current transition-all ${prefersReducedMotion ? '' : 'duration-300'} ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`absolute left-0 w-full h-0.5 bg-current transition-all ${prefersReducedMotion ? '' : 'duration-300'} ${mobileMenuOpen ? 'top-2 -rotate-45' : 'top-3'}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu with smooth animation */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[54] lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
        <div
          className={`lg:hidden overflow-hidden transition-all ${prefersReducedMotion ? '' : 'duration-300'} ${
            mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}
          style={{ zIndex: 55 }}
        >
          <div className="pb-4 space-y-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3.5 min-h-11 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg focus-ring-subtle cursor-pointer"
                style={{ transition: `all 200ms ease ${i * 50}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-indigo-500/50" />
                  {link.label}
                </span>
              </a>
            ))}
            <div className="pt-4 px-4 space-y-2">
              <MagneticButton
                variant="primary-dark"
                size="sm"
                className="w-full"
                onClick={(e) => handleNavClick(e, '#contact')}
              >
                Probar gratis
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
