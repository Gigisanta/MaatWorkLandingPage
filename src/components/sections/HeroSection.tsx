'use client';

import { useEffect, useRef } from 'react';

const WHATSAPP_LINK = 'https://wa.me/5491130916574?text=Hola!%20Quiero%20probar%20MaatWork%20gratis';

const TRUST_BADGES = [
  { value: '+1 año', label: 'desarrollo' },
  { value: '+500', label: 'usuarios en espera' },
  { value: '100%', label: 'escala desde día uno' },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/60 to-[#030014] z-[1]" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="reveal opacity-0 mb-4" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-900/90 border border-violet-700/50 text-sm text-violet-300">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Ahora en Beta — Precio especial de lanzamiento
            </span>
          </div>

          {/* Headline */}
          <h1 className="reveal opacity-0 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ animationDelay: '0.2s' }}>
            Deja de perder tiempo.{' '}
            <span className="gradient-text">automatizando tu local.</span>
            <br />
            <span className="text-white">Hoy.</span>
          </h1>

          {/* Subtext */}
          <p className="reveal opacity-0 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10" style={{ animationDelay: '0.3s' }}>
            MaatWork es el SaaS de automatización comercial diseñado para gimnasios, salones de belleza,
            academias y centros de pilates en Argentina. sin complicaciones, sin licencias caras.
          </p>

          {/* Trust Badges */}
          <div className="reveal opacity-0 flex flex-wrap justify-center gap-4 md:gap-8 mb-8" style={{ animationDelay: '0.4s' }}>
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="group flex flex-col items-center hover:scale-105 transition-transform duration-300">
                <span className="text-2xl md:text-3xl font-bold gradient-text">{badge.value}</span>
                <span className="text-xs text-slate-300 uppercase tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="reveal opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.5s' }}>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-green text-lg px-8 py-4 flex items-center gap-2 active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Comenzar ahora
            </a>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2 active:scale-95 transition-transform">
              Ver cómo funciona
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-violet-500/80 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-violet-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
