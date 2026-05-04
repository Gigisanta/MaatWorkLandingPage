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
  openGraph: {
    title: "MaatWork | Automatiza tu local, hoy",
    description: "SaaS de automatización comercial para pequenos negocios en Argentina.",
    type: "website",
  },
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
