'use client'

import { useReducedMotion } from '@/hooks'

export function Footer() {
  const reduceMotion = useReducedMotion()

  return (
    <footer className="relative overflow-hidden">
      {/* Glassmorphism base layer */}
      <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-xl" />

      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent animate-gradient-shift-reverse opacity-60" />
        {!reduceMotion && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse-glow" />}
      </div>

      {/* Ambient floating orbs - subtle depth effect */}
      {!reduceMotion && (
        <>
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-[80px] animate-float pointer-events-none" />
          <div className="absolute bottom-20 right-[5%] w-96 h-96 rounded-full bg-accent-purple/5 blur-[100px] animate-float-a pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px] animate-drift pointer-events-none" />
        </>
      )}

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #6366f1 1px, transparent 1px), radial-gradient(circle at 80% 50%, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Map/location visual element - bottom right */}
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none opacity-[0.03]">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="200" cy="200" r="150" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="100" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="50" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="5" fill="#6366f1" />
          <path d="M200 50 L200 100 M200 300 L200 350 M50 200 L100 200 M300 200 L350 200" stroke="#6366f1" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <div className="font-display text-2xl font-black text-white mb-4 tracking-tight">
                MaatWork
              </div>
              <p className="text-sm leading-relaxed text-white/70 max-w-[240px]">
                Tu local, automatizado.<br />
                Tu app, lista para usar.
              </p>

              {/* Social links - premium effects */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { label: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                ].map(({ label, path }) => (
                  <a
                    key={label}
                    href="#"
                    className="group/social relative w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white hover:bg-primary/20 hover:border-primary/40 hover:scale-110 transition-all duration-300 ease-out overflow-hidden"
                    aria-label={label}
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-primary/20 to-violet-500/20 opacity-0 group-hover/social:opacity-100 transition-opacity duration-500" />
                    <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/social:scale-125" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                    {!reduceMotion && (
                      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/social:translate-x-[200%] transition-transform duration-700" />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Producto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
                Producto
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '#features', label: 'Características' },
                  { href: '#pricing', label: 'Precios' },
                  { href: '#how-it-works', label: 'Cómo funciona' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group/link text-sm text-white/60 hover:text-white inline-flex items-center gap-2.5 transition-all duration-300 relative"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/link:bg-primary group-hover/link:scale-150 group-hover/link:shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300" />
                      <span className="relative">
                        {label}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-primary to-violet-500 group-hover/link:w-full transition-all duration-300" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
                Empresa
              </h4>
              <ul className="space-y-3">
                {[
                  { href: '#testimonials', label: 'Testimonios' },
                  { href: '#faq', label: 'Preguntas Frecuentes' },
                  { href: '#contact', label: 'Contacto' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group/link text-sm text-white/60 hover:text-white inline-flex items-center gap-2.5 transition-all duration-300 relative"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/link:bg-primary group-hover/link:scale-150 group-hover/link:shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300" />
                      <span className="relative">
                        {label}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-primary to-violet-500 group-hover/link:w-full transition-all duration-300" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
                Contacto
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+542994569840"
                    className="group/contact text-sm text-white/60 hover:text-white inline-flex items-center gap-2.5 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 text-primary/60 group-hover/contact:text-primary group-hover/contact:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    +54 299 456-9840
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:clientes@maat.work"
                    className="group/contact text-sm text-white/60 hover:text-white inline-flex items-center gap-2.5 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 text-primary/60 group-hover/contact:text-primary group-hover/contact:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    clientes@maat.work
                  </a>
                </li>
              </ul>

              {/* Location badge */}
              <div className="group/location mt-6 relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-primary/30 hover:bg-primary/10 transition-all duration-500">
                <span className="relative flex h-2.5 w-2.5">
                  {!reduceMotion && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />}
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green shadow-[0_0_10px_rgba(34,197,94,0.6)] group-hover/location:shadow-[0_0_15px_rgba(34,197,94,0.8)] transition-shadow duration-500" />
                </span>
                <span className="text-xs text-white/60 group-hover/location:text-white/90 transition-colors duration-300">Argentina, LATAM</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/location:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          {/* Elegant separator with gradient */}
          <div className="relative py-8">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <div className="relative flex justify-center">
              <span className="px-4 bg-bg-base">
                <svg className="w-5 h-5 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/30">
              © 2026 MaatWork. Construido con determinación en Argentina para LATAM.
            </p>
            <div className="flex items-center gap-1 text-sm text-white/30">
              <span>Powered by</span>
              <span className="text-white/50">Neon</span>
              <span className="mx-1">·</span>
              <span className="text-white/50">Vercel</span>
            </div>
          </div>
        </div>

        {/* Dynamic gradient at bottom */}
        <div className="h-px relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-gradient-shift" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent animate-gradient-shift-reverse" />
          {!reduceMotion && <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-primary/40 to-violet-600/0 animate-pulse-glow" />}
        </div>
      </div>
    </footer>
  )
}
