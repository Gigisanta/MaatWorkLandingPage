'use client';

const TESTIMONIALS = [
  {
    quote: "Antes Perdía 3 horas diarias manejando la agenda en papel. Ahora todo está automatizado y mis clientes reciben recordatorios automáticos.",
    name: 'María González',
    role: 'Dueña',
    business: 'Gimnasio FitLife',
    type: 'Gimnasio',
  },
  {
    quote: "El control de cobros cambió mi vida. Antes tenía $40,000 en deudas de clientes que no pagaban. Ahora tengo todo registrado y los cobros son puntuales.",
    name: 'Carlos Rodríguez',
    role: 'Propietario',
    business: 'Salón Belleza Express',
    type: 'Salón de belleza',
  },
  {
    quote: "La integración con WhatsApp es increíble. Mis alumnos confirman sus clases con un mensaje y todo se actualiza solo.",
    name: 'Laura Martínez',
    role: 'Directora',
    business: 'Academia de Inglés Pro',
    type: 'Academia',
  },
  {
    quote: "Tengo 120 alumnos en 8 horarios diferentes. Antes era un caos. Ahora la agenda se maneja sola y nunca más mezclé un turno.",
    name: 'Roberto Sánchez',
    role: 'Instructor',
    business: 'Estudio de Danza Riverside',
    type: 'Estudio de danza',
  },
  {
    quote: "Los paquetes de clases ya no se vencen sin que el cliente lo sepa. Mi beneficio aumentó 30% el primer mes.",
    name: 'Ana Pérez',
    role: 'Profesora',
    business: 'Centro de Pilates Equilibrium',
    type: 'Centro de pilates',
  },
  {
    quote: "La personalización por industria fue clave. No me vendieron un software genérico, me crearon una app para academias de karate.",
    name: 'Martín López',
    role: 'Sensei',
    business: 'Escuela de Karate Shin',
    type: 'Escuela de karate',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-12 md:py-16 bg-gradient-to-b from-[#0a0a1a] to-[#030014]">
      <div className="container-custom px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Lo que dicen nuestros <span className="gradient-text">clientes</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Negocios como el tuyo ya automatizaron su día a día con MaatWork
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-violet-950 to-purple-950 border border-violet-800/80 rounded-2xl hover:border-violet-500 transition-all duration-300"
            >
              {/* Quote */}
              <div className="mb-6">
                <svg className="w-8 h-8 text-violet-500/50 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-200 leading-relaxed">{testimonial.quote}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-300">
                    {testimonial.role} • {testimonial.business}
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-violet-900 border border-violet-700 rounded-full text-xs text-violet-200">
                  {testimonial.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Placeholder */}
        <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="relative aspect-video bg-gradient-to-br from-violet-950 to-purple-950 rounded-2xl border border-violet-800/60 overflow-hidden flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-violet-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <p className="text-white font-medium">Testimonio en video</p>
              <p className="text-sm text-slate-200">Propietario de gimnasio</p>
            </div>
          </div>
          <div className="relative aspect-video bg-gradient-to-br from-violet-950 to-purple-950 rounded-2xl border border-violet-800/60 overflow-hidden flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-violet-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <p className="text-white font-medium">Testimonio en video</p>
              <p className="text-sm text-slate-200">Dueña de salón de belleza</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
