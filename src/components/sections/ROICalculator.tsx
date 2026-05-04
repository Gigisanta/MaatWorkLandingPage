'use client';

import { useState, useMemo } from 'react';

export default function ROICalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [hourValue, setHourValue] = useState(2000);
  const [daysPerMonth, setDaysPerMonth] = useState(24);

  const calculations = useMemo(() => {
    const monthlyHours = hoursPerDay * daysPerMonth;
    const monthlySavings = monthlyHours * hourValue;
    const yearlySavings = monthlySavings * 12;
    const maatworkCost = 59;
    const roiPercentage = Math.round(((monthlySavings - maatworkCost) / maatworkCost) * 100);

    return {
      monthlyHours,
      monthlySavings,
      yearlySavings,
      roiPercentage,
    };
  }, [hoursPerDay, hourValue, daysPerMonth]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="roi-calculator" className="py-12 md:py-16 bg-gradient-to-b from-[#0a0a1a] to-[#030014]">
      <div className="container-custom px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-600 mb-6">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Calculá tu <span className="gradient-text">ahorro</span>
            </h2>
            <p className="text-slate-400">
              Descubrí cuánto tiempo y dinero podés recuperar con MaatWork
            </p>
          </div>

          <div className="bg-[#0a0a1a] border border-violet-800 rounded-3xl p-8">
            {/* Sliders */}
            <div className="space-y-6 mb-6">
              {/* Hours per day */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-slate-300 font-medium">Horas diarias en tareas manuales</label>
                  <span className="text-2xl font-bold gradient-text">{hoursPerDay}h</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-violet-950 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Hour value */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-slate-300 font-medium">Valor de tu hora de trabajo</label>
                  <span className="text-2xl font-bold gradient-text">{formatNumber(hourValue)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={hourValue}
                  onChange={(e) => setHourValue(Number(e.target.value))}
                  className="w-full h-2 bg-violet-950 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Days per month */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-slate-300 font-medium">Días laborables por mes</label>
                  <span className="text-2xl font-bold gradient-text">{daysPerMonth}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="30"
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-violet-950 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>20</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#030014] rounded-2xl p-4 mb-4">
              <div className="text-center mb-6">
                <p className="text-slate-400 mb-2">Ahorro mensual</p>
                <p className="text-5xl md:text-6xl font-bold gradient-text">
                  {formatNumber(calculations.monthlySavings)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{calculations.monthlyHours}h</p>
                  <p className="text-xs text-slate-500">horas/mes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{Math.round(calculations.monthlyHours / 8)}d</p>
                  <p className="text-xs text-slate-500">días/mes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatNumber(calculations.yearlySavings)}</p>
                  <p className="text-xs text-slate-500">año</p>
                </div>
              </div>
            </div>

            {/* ROI highlight */}
            <div className="text-center mb-8 p-4 bg-green-950 border border-green-800 rounded-xl">
              <p className="text-green-300 text-sm">
                <span className="font-bold text-lg">{calculations.roiPercentage}%</span> ROI mensual
              </p>
              <p className="text-green-400/70 text-xs mt-1">
                MaatWork se paga solo en segundos de ahorro
              </p>
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/5491130916574?text=Hola!%20Quiero%20empezar%20con%20MaatWork%20-%20Ya%20calculé%20mi%20ahorro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-green w-full text-center py-4 block"
            >
              Comenzar ahora y recuperar mi tiempo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
