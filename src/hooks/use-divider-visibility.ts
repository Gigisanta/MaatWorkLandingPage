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
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true)
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
