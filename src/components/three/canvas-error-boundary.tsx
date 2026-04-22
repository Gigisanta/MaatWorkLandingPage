'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary for WebGL/Three.js Canvas components.
 * Catches render errors and displays a fallback UI.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback - subtle dark gradient with error indication
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          role="alert"
          aria-live="polite"
        >
          <div className="text-center">
            {/* Subtle error indicator */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1a1a2e]/40 to-[#0f0a1e]/40 border border-white/5 backdrop-blur-sm flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-xs text-white/20">Contenido 3D no disponible</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
