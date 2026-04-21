'use client'

import {
  Users,
  CreditCard,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: 'Gestión de Clientes',
    desc: 'Cada cliente tiene su ficha digital: datos de contacto, membresía, asistencia e historial.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: CreditCard,
    title: 'Cobros y Cuotas',
    desc: 'Registrá cobros y dejá que la app maneje los recordatorios.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Calendar,
    title: 'Turnos y Clases',
    desc: 'Organizá grupos o turnos con horarios y capacidades.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Automático',
    desc: 'Mensajes automáticos sin que hagas nada. Confirmar turnos, avisar cuotas.',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: BarChart3,
    title: 'Panel para el Dueño',
    desc: 'Entrás al panel y en 10 segundos sabés cómo viene el mes.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Settings,
    title: 'Hecha a Medida',
    desc: 'No es genérica. Diseñamos la app para tus procesos específicos.',
    gradient: 'from-rose-500 to-pink-600',
  },
];

export function FeaturesGrid() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#04040e]">
      <div className="max-w-6xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-sm font-bold uppercase tracking-wider text-white/40">
            Funcionalidades
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Una app que trabaja por vos, 24/7
          </h2>
        </div>

        <div
          ref={gridRef}
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 cursor-pointer"
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.gradient.includes('violet') ? 'rgba(139, 92, 246, 0.15)' : feature.gradient.includes('emerald') ? 'rgba(16, 185, 129, 0.15)' : feature.gradient.includes('amber') ? 'rgba(245, 158, 11, 0.15)' : feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0.15)' : feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(244, 63, 94, 0.15)'} 0%, transparent 70%)`,
                  }}
                />

                {/* Icon container with gradient */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{feature.desc}</p>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
