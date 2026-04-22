'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks'

interface UseDividerVisibilityResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  isVisible: boolean
  reducedMotion: boolean
}

export function useDividerVisibility(
  threshold: number = 0.1
): UseDividerVisibilityResult {
  const reducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(reducedMotion)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (reducedMotion) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [reducedMotion, threshold])

  return { containerRef, isVisible, reducedMotion }
}
