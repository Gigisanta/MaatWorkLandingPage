import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { PremiumCursor } from '@/components/ui/premium-cursor'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
})

const BASE_URL = 'https://maatwork.com'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MaatWork',
  description:
    'Desarrollo de aplicaciones a medida para negocios en Argentina. Automatización de natatorios, peluquerías, gimnasios y centros de membresías.',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  sameAs: [
    'https://twitter.com/maatwork',
    'https://www.instagram.com/maatwork',
    'https://www.linkedin.com/company/maatwork',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'es',
    areaServed: 'AR',
  },
}

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MaatWork',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Plataforma de gestión empresarial para automatizar cobros, turnos y comunicaciones WhatsApp en locales comerciales.',
  offers: {
    '@type': 'Offer',
    category: 'Subscription',
  },
  provider: {
    '@type': 'Organization',
    name: 'MaatWork',
    url: BASE_URL,
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MaatWork — Apps a Medida para tu Negocio',
    template: '%s | MaatWork',
  },
  description:
    'Desarrollamos aplicaciones personalizadas para natatorios, peluquerías, gimnasios y centros de membresías en Argentina. Automatizá cobros, turnos y WhatsApp en días.',
  keywords: [
    'aplicaciones a medida',
    'automatización de negocios',
    'software para natatorios',
    'sistema para peluquerías',
    'gestión de gimnasios',
    'membresías',
    'cobros automatizados',
    'turnos online',
    'WhatsApp business',
    'desarrollo de apps Argentina',
    'software para locales',
    'automatización comercial',
  ],
  authors: [{ name: 'MaatWork', url: BASE_URL }],
  creator: 'MaatWork',
  publisher: 'MaatWork',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'es-AR': BASE_URL,
      es: BASE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: BASE_URL,
    siteName: 'MaatWork',
    title: 'MaatWork — Apps a Medida para tu Negocio',
    description:
      'Desarrollamos aplicaciones personalizadas para que tu local corra solo. Automatizá cobros, turnos y WhatsApp en días.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'MaatWork — Apps a Medida para tu Negocio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MaatWork — Apps a Medida para tu Negocio',
    description:
      'Desarrollamos aplicaciones personalizadas para que tu local corra solo. Automatizá cobros, turnos y WhatsApp.',
    site: '@maatwork',
    creator: '@maatwork',
    images: [`${BASE_URL}/og-image.png`],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'Business',
  classification: 'Software Development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#04040e" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
        />
      </head>
      <body className="font-body bg-[#04040e] text-white antialiased">
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Saltar al contenido principal
        </a>

        <div aria-hidden="true">
          <div className="glow-blob glow-blob-primary fixed -top-40 -left-40 w-[700px] h-[700px] opacity-50 animate-drift" />
          <div
            className="glow-blob glow-blob-purple fixed top-1/3 -right-40 w-[600px] h-[600px] opacity-40 animate-pulse-glow"
            style={{ animationDelay: '-5s' }}
          />
          <div
            className="glow-blob glow-blob-primary fixed bottom-0 left-1/3 w-[900px] h-[900px] opacity-20 animate-float"
            style={{ animationDelay: '-8s' }}
          />
          <div
            className="fixed top-1/4 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow"
            style={{ animationDelay: '-2s' }}
          />
          <div
            className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse-glow"
            style={{ animationDelay: '-7s' }}
          />
          <div
            className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none z-[9997] opacity-[0.02]"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
        </div>

        <ScrollProgress />
        <PremiumCursor />
        <main id="main-content" className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
