import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MaatWork — Tu local, automatizado',
  description: 'Apps a medida para natatorios, peluquerías, gimnasios y centros de membresías. Automatizá cobros, turnos y WhatsApp en días.',
  openGraph: {
    title: 'MaatWork — Tu negocio, bajo control',
    description: 'Apps a medida para que tu local corra solo.',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-body bg-[#04040e] text-white antialiased">
        {/* Background glow blobs with enhanced animations */}
        <div className="glow-blob glow-blob-primary fixed -top-40 -left-40 w-[700px] h-[700px] opacity-50 animate-drift" />
        <div className="glow-blob glow-blob-purple fixed top-1/3 -right-40 w-[600px] h-[600px] opacity-40 animate-pulse-glow" style={{ animationDelay: '-5s' }} />
        <div className="glow-blob glow-blob-primary fixed bottom-0 left-1/3 w-[900px] h-[900px] opacity-20 animate-float" style={{ animationDelay: '-8s' }} />

        {/* Secondary accent glows */}
        <div className="fixed top-1/4 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-2s' }} />
        <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-7s' }} />

        {/* Noise texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanline effect (subtle) */}
        <div className="fixed inset-0 pointer-events-none z-[9997] opacity-[0.02]" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }} />

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
