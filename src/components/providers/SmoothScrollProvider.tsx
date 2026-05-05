'use client';

// Lenis removed - using native CSS smooth-scroll instead to avoid conflicts with Three.js
// Add scroll-behavior: smooth to html in globals.css

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
