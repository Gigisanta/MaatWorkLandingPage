'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#features', label: 'Características' },
  { href: '#pricing', label: 'Precios' },
  { href: '#how-it-works', label: 'Cómo funciona' },
  { href: '#contact', label: 'Contacto' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
        scrolled
          ? 'py-3'
          : 'py-5'
      }`}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-[#04040e]/80 backdrop-blur-xl border-b border-white/[0.06] opacity-0 transition-opacity duration-300 ${
        scrolled ? 'opacity-100' : ''
      }" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-display text-xl font-black text-white tracking-tight">
            MaatWork
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button variant="primary-dark" size="sm" className="hidden sm:inline-flex">
              Probar gratis
            </Button>
            <Button variant="secondary-dark" size="sm">
              Reservar lugar
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
