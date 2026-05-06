'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(value);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString('es-AR')}</span>;
}

const PRICING_FEATURES = [
  'Gestión de Clientes completa',
  'Control de Cobros y Cuotas',
  'Agenda de Turnos Automáticos',
  'WhatsApp Automático',
  'Dashboard para el dueño',
  'Soporte por WhatsApp',
  'Capacitación inicial',
  'Tus datos 100% tuyos',
];

export default function ROIPricing() {
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [hourValue, setHourValue] = useState(2000);
  const [daysPerMonth, setDaysPerMonth] = useState(24);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [miniFormData, setMiniFormData] = useState({ nombre: '', whatsapp: '', email: '' });
  const [miniFormSubmitted, setMiniFormSubmitted] = useState(false);
  const [isSubmittingMini, setIsSubmittingMini] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const calculations = useMemo(() => {
    const monthlyHours = hoursPerDay * daysPerMonth;
    const monthlySavings = monthlyHours * hourValue;
    const yearlySavings = monthlySavings * 12;
    const roiPercentage = Math.round(((monthlySavings - 59) / 59) * 100);
    return { monthlyHours, monthlySavings, yearlySavings, roiPercentage };
  }, [hoursPerDay, hourValue, daysPerMonth]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(num);

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value));
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleMiniFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniFormData.nombre || !miniFormData.whatsapp) return;

    setIsSubmittingMini(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: miniFormData.nombre,
          whatsapp: miniFormData.whatsapp.replace(/\s/g, ''),
          email: miniFormData.email || undefined,
          industria: 'no_define',
          problema: `Calculó ahorro mensual de ${formatNumber(calculations.monthlySavings)} con el calculator`,
          procesos: [],
          source: 'roi_calculator',
        }),
      });

      const message = encodeURIComponent(
        `¡Hola! Usé la calculadora de MaatWork y calculé un ahorro de ${formatNumber(calculations.monthlySavings)}/mes.\n\nMi nombre: ${miniFormData.nombre}\nWhatsApp: ${miniFormData.whatsapp}`
      );
      window.open(`https://wa.me/542994569840?text=${message}`, '_blank');
      setMiniFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting mini form:', error);
    } finally {
      setIsSubmittingMini(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="roi-pricing"
      className="relative section-y bg-[#030014]/70"
    >
      <div className="container-custom px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="section-header">
            <h2>
              Calculá tu <span className="gradient-text">ahorro</span>
            </h2>
            <p>Ajustá los valores y ve cuánto recuperás</p>
          </div>

          {/* 60% Calculator - 40% Pricing */}
          <div className="grid md:grid-cols-10 gap-6 items-start">

            {/* Calculator - 60% */}
            <div className="md:col-span-6">
              <div className="card-base p-5">

                {/* Sliders stacked */}
                <div className="space-y-4 mb-4">

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 text-sm font-medium">Horas que perdés por día</label>
                      <span className="text-xl font-bold gradient-text">{hoursPerDay}h</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={hoursPerDay}
                      onChange={handleSliderChange(setHoursPerDay)}
                      className="w-full h-2 bg-violet-950/80 rounded-full appearance-none cursor-pointer accent-violet-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1h</span>
                      <span>12h</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 text-sm font-medium">Valor de tu hora</label>
                      <span className="text-xl font-bold gradient-text">{formatNumber(hourValue)}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={hourValue}
                      onChange={handleSliderChange(setHourValue)}
                      className="w-full h-2 bg-violet-950/80 rounded-full appearance-none cursor-pointer accent-violet-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>$500</span>
                      <span>$10.000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 text-sm font-medium">Días que trabajás por mes</label>
                      <span className="text-xl font-bold gradient-text">{daysPerMonth}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="30"
                      value={daysPerMonth}
                      onChange={handleSliderChange(setDaysPerMonth)}
                      className="w-full h-2 bg-violet-950/80 rounded-full appearance-none cursor-pointer accent-violet-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>20</span>
                      <span>30</span>
                    </div>
                  </div>

                </div>

                {/* Result */}
                <div className="section-card p-4 mb-4">
                  <p className="text-slate-400 text-xs text-center mb-2 uppercase tracking-wider">Ahorro mensual</p>
                  <p className="text-4xl md:text-5xl font-bold text-center gradient-text mb-3">
                    {isVisible ? <AnimatedNumber value={calculations.monthlySavings} duration={800} /> : '$0'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-violet-950/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">{isVisible ? <AnimatedNumber value={calculations.monthlyHours} duration={600} /> : '0'}h</p>
                      <p className="text-xs text-slate-400">hrs/mes</p>
                    </div>
                    <div className="bg-violet-950/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">{isVisible ? <AnimatedNumber value={Math.round(calculations.monthlyHours / 8)} duration={600} /> : '0'}d</p>
                      <p className="text-xs text-slate-400">días/mes</p>
                    </div>
                    <div className="bg-violet-950/40 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">{isVisible ? <AnimatedNumber value={calculations.yearlySavings} duration={1000} /> : '$0'}</p>
                      <p className="text-xs text-slate-400">por año</p>
                    </div>
                  </div>
                </div>

                {/* ROI Badge */}
                <div className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-green-900/30 via-green-800/20 to-green-900/30 border border-green-700/30 rounded-xl">
                  <span className="text-green-400 font-bold text-3xl">
                    {isVisible ? <AnimatedNumber value={calculations.roiPercentage} duration={600} /> : '0'}%
                  </span>
                  <span className="text-green-300/80 text-sm">ROI en el primer mes</span>
                </div>

                {/* Mini Lead Form - appears after interaction */}
                {hasInteracted && !miniFormSubmitted && (
                  <div className="mt-4 p-4 bg-violet-950/40 border border-violet-700/30 rounded-xl">
                    <p className="text-white text-sm font-medium mb-3 text-center">
                      Guardá tu cálculo y te contactamos con un plan personalizado
                    </p>
                    <form onSubmit={handleMiniFormSubmit} className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre"
                        value={miniFormData.nombre}
                        onChange={(e) => setMiniFormData({ ...miniFormData, nombre: e.target.value })}
                        className="input-base text-sm"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="WhatsApp"
                        value={miniFormData.whatsapp}
                        onChange={(e) => setMiniFormData({ ...miniFormData, whatsapp: e.target.value })}
                        className="input-base text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email (opcional)"
                        value={miniFormData.email}
                        onChange={(e) => setMiniFormData({ ...miniFormData, email: e.target.value })}
                        className="input-base text-sm"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingMini}
                        className="btn-green w-full py-2 text-sm disabled:opacity-50"
                      >
                        {isSubmittingMini ? 'Guardando...' : 'Guardar y continuar'}
                      </button>
                    </form>
                  </div>
                )}

                {miniFormSubmitted && (
                  <div className="mt-4 p-4 bg-green-900/30 border border-green-700/30 rounded-xl text-center">
                    <p className="text-green-400 font-medium">¡Guardado! Te redirigimos a WhatsApp...</p>
                  </div>
                )}

              </div>
            </div>

            {/* Pricing Card - 40% */}
            <div className="md:col-span-4">
              <div className="card-base p-5">
                {/* Urgency Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-900/40 border border-orange-700/40 rounded-full text-xs text-orange-300">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Spots limitados este mes
                  </span>
                </div>

                <div className="text-center mb-5">
                  <h3 className="text-xl font-bold text-white mb-1">Simple y transparente</h3>
                  <p className="text-slate-400 text-sm">Un solo plan con todo incluido</p>
                </div>

                <div className="text-center mb-5">
                  <p className="text-base font-medium text-slate-300">Precio base desde</p>
                  <p className="text-4xl font-bold gradient-text">$100</p>
                  <p className="text-slate-400 text-sm">USD/mes</p>
                </div>

                <ul className="space-y-3 mb-5">
                  {PRICING_FEATURES.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/542994569840?text=Hola!%20Quiero%20empezar%20con%20MaatWork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green w-full text-center py-3 block text-base font-semibold rounded-xl"
                >
                  Comenzar ahora
                </a>

                <p className="text-xs text-slate-500 text-center mt-3">
                  Sin tarjeta • Configuración en 24hs
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}