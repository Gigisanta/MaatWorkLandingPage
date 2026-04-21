'use client'

import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const ParticlesCanvas = dynamic(
  () => import('@/components/three/particles-canvas').then((mod) => mod.ParticlesCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-transparent" /> }
)

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#04040e' }}
    >
      {/* 3D Particles Background */}
      <ParticlesCanvas />

      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      {/* Glowing blobs */}
      <div className="glow-blob glow-blob-primary" aria-hidden="true" />
      <div className="glow-blob glow-blob-purple" aria-hidden="true" />

      {/* Hero gradient background */}
      <div className="hero-gradient-bg absolute inset-0" aria-hidden="true" />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #04040e 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="animate-fade-in-scale">
            {/* Badge */}
            <div className="mb-8">
              <span className="badge badge-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                Apps para negocios argentinos
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] mb-6 tracking-tight">
              <span className="text-white">Deja de perder tiempo</span>
              <br />
              <span className="gradient-brand-text">automatizando tu local.</span>
              <br />
              <span className="text-white">Hoy.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-dim max-w-lg mb-10 leading-relaxed">
              La única plataforma que desarrolla tu app personalizada en 7-14 días.
              Clientes, cobros, turnos y WhatsApp automático — sin que vos hagas nada.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-14">
              <Button variant="primary-dark" size="lg">
                Proba gratis 7 dias
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button variant="secondary-dark" size="lg">
                Sin tarjeta · Sin compromiso
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 lg:gap-14">
              <div>
                <div className="font-display text-4xl lg:text-5xl font-extrabold gradient-brand-text mb-1">7-14</div>
                <div className="text-sm text-white/60">Dias para tu app</div>
              </div>
              <div>
                <div className="font-display text-4xl lg:text-5xl font-extrabold gradient-brand-text mb-1">3+</div>
                <div className="text-sm text-white/60">Rubros activos</div>
              </div>
              <div>
                <div className="font-display text-4xl lg:text-5xl font-extrabold gradient-brand-text mb-1">24/7</div>
                <div className="text-sm text-white/60">Automatizacion</div>
              </div>
            </div>
          </div>

          {/* Right: Mockup cards - elegant stepped arrangement */}
          <div className="relative h-[420px] lg:h-[540px] hidden lg:block">
            {/* Peluqueria - back left, smaller */}
            <div className="mockup-card mockup-float-2 absolute w-56 top-4 left-0 animate-fade-in-scale delay-200">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-dim">Peluqueria</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-xs">15:30</span>
                    <span className="text-white/80">Corte & Barba</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-xs">16:15</span>
                    <span className="text-white/80">Color</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Natatorio - center, prominent */}
            <div className="mockup-card mockup-float-1 absolute w-72 top-24 left-12 right-0 mx-auto animate-fade-in-scale delay-100">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-dim">Natatorio</span>
                </div>
                <div className="space-y-2">
                  <div className="inline-block bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md font-medium">
                    Grupos de Natacion
                  </div>
                  <div className="text-sm text-white/80">Adultos Inicial (19:00)</div>
                  <div className="text-sm text-white/80">Ninos Nivel 1 (17:30)</div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.07]">
                  <div className="text-xs text-dim mb-1.5">Asistencias Hoy</div>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold text-white">42</div>
                    <div className="text-sm text-dim">/ 50</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academia - front right, with chart */}
            <div className="mockup-card mockup-float-3 absolute w-64 bottom-4 right-4 animate-fade-in-scale delay-300">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-dim">Academia</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-dim">Alumnos Activos</span>
                  <span className="text-2xl font-extrabold text-white">128</span>
                </div>
                <div className="flex items-end gap-1.5 h-14">
                  <div className="flex-1 bg-primary/20 rounded-t" style={{ height: '45%' }} />
                  <div className="flex-1 bg-primary/30 rounded-t" style={{ height: '65%' }} />
                  <div className="flex-1 bg-primary/40 rounded-t" style={{ height: '55%' }} />
                  <div className="flex-1 bg-primary/50 rounded-t" style={{ height: '80%' }} />
                  <div className="flex-1 bg-primary/60 rounded-t" style={{ height: '70%' }} />
                  <div className="flex-1 bg-primary rounded-t" style={{ height: '90%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile cards - stacked simplified version */}
          <div className="lg:hidden grid gap-4 mt-8">
            <div className="mockup-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-dim">Natatorio</span>
              </div>
              <div className="text-sm text-white/80">Grupos de Natacion · 42/50 asistentes</div>
            </div>
            <div className="mockup-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-dim">Peluqueria</span>
              </div>
              <div className="text-sm text-white/80">15:30 Corte & Barba · 16:15 Color</div>
            </div>
            <div className="mockup-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-dim">Academia</span>
              </div>
              <div className="text-sm text-white/80">128 Alumnos Activos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
