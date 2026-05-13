import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maatwork.com"),
  title: "MaatWork | Automatiza tu local, hoy",
  description: "SaaS de automatización comercial para gyms, salones de belleza, academias y más en Argentina. Agenda automática, control de cobros y WhatsApp integrado. $59 USD/mes.",
  keywords: ["automatización comercial", "saas gyms", "saas belleza", "academias argentina", "gestion de turnos", "software gyms", "software salones", "automatizacion whatsapp", "maatwork"],
  authors: [{ name: "MaatWork" }],
  creator: "MaatWork",
  publisher: "MaatWork",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MaatWork | Automatiza tu local, hoy",
    description: "SaaS de automatización comercial para gyms, salones de belleza, academias y más en Argentina.",
    url: "https://maatwork.com",
    siteName: "MaatWork",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MaatWork - Automatización comercial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MaatWork | Automatiza tu local, hoy",
    description: "SaaS de automatización comercial para pequeños negocios en Argentina.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030014",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#030014" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MaatWork",
              "description": "SaaS de automatización comercial para gyms, salones de belleza, academias y centros en Argentina.",
              "url": "https://maatwork.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "59",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "500",
              },
              "provider": {
                "@type": "Organization",
                "name": "MaatWork",
                "location": "Argentina",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "¿Cuánto cuesta MaatWork?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "MaatWork tiene un precio único de $59 USD/mes con todas las funcionalidades incluidas.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "¿Qué incluye MaatWork?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gestión de clientes, control de cobros y cuotas, agenda de turnos, WhatsApp automático, panel de dashboard y soporte incluido.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "¿Cuánto tiempo toma implementar MaatWork?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "De cero a producción en 5-10 días: 1-2 días de diagnóstico, 3-7 días de prototipo, 1-2 días de lanzamiento.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${manrope.variable} min-h-full flex flex-col antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          Saltar al contenido principal
        </a>
        <SmoothScrollProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
