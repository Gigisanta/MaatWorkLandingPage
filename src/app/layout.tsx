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
        {/* Background glow blobs */}
        <div className="glow-blob glow-blob-primary fixed -top-40 -left-40 w-[600px] h-[600px] opacity-40" />
        <div className="glow-blob glow-blob-purple fixed top-1/3 -right-40 w-[500px] h-[500px] opacity-30 animate-pulse-glow" style={{ animationDelay: '-3s' }} />
        <div className="glow-blob glow-blob-primary fixed bottom-0 left-1/3 w-[800px] h-[800px] opacity-20" />

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
