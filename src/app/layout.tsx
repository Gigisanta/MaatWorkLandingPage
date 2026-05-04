import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MaatWork | Automatiza tu local, hoy",
  description: "SaaS de automatización comercial para gyms, salones de belleza, academias y más. +500 usuarios esperando. $59 USD/mes.",
  keywords: ["automatización", "saas", "gimnasios", "belleza", "academias", "argentina", "gestión", "turnos", "clientes"],
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
    description: "SaaS de automatización comercial para gyms, salones de belleza, academias y más.",
    url: "https://maatwork.com",
    siteName: "MaatWork",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaatWork | Automatiza tu local, hoy",
    description: "SaaS de automatización comercial para pequeños negocios en Argentina.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#030014" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          Saltar al contenido principal
        </a>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
