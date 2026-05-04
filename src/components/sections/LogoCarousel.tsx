'use client';

const LOGOS = [
  { name: 'Next.js', icon: 'N' },
  { name: 'React', icon: 'R' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind', icon: 'TW' },
  { name: 'Vercel', icon: 'V' },
  { name: 'Node.js', icon: 'N' },
  { name: 'PostgreSQL', icon: 'PG' },
  { name: 'AWS', icon: 'AWS' },
];

export default function LogoCarousel() {
  return (
    <section className="py-10 bg-[#030014] border-y border-violet-900/20 overflow-hidden">
      <div className="container-custom px-4 mb-8">
        <p className="text-center text-base text-slate-400 uppercase tracking-wider">
          Tecnologías que utilizamos
        </p>
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030014] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030014] to-transparent z-10" />

        {/* Infinite scroll */}
        <div className="flex animate-scroll">
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-xl bg-violet-950/50 border border-violet-800/30 flex items-center justify-center mb-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <span className="text-lg font-bold text-violet-400">{logo.icon}</span>
              </div>
              <span className="text-xs text-slate-500">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
