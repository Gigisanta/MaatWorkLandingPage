'use client'

import { useState, useEffect, useRef } from 'react'

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return position
}
