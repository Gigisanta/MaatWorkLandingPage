'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          className="fixed inset-0 z-[-1]"
          style={{
            background: 'linear-gradient(135deg, #0a0a1f 0%, #1a0a2e 50%, #0d0d1a 100%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2 text-red-300 text-sm font-mono max-w-md">
              <p className="font-bold mb-1">3D Error:</p>
              <p className="text-xs break-all">{this.state.error?.message}</p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}