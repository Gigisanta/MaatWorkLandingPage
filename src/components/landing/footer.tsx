export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="bg-bg-base">
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

              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Producto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
                Producto
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    Precios
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    Cómo funciona
                  </a>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">
                Empresa
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#testimonials"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    Testimonios
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    Contacto
                  </a>
                </li>
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
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    +54 299 456-9840
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:clientes@maat.work"
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    clientes@maat.work
                  </a>
                </li>
              </ul>

              {/* Location badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-xs text-white/40">Argentina, LATAM</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] pt-8">
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
        </div>

        {/* Subtle glow at bottom */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </footer>
  )
}
