'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks'

export interface FAQItem {
  q: string
  a: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  allowMultiple?: boolean
  defaultOpen?: number | null
  className?: string
}

interface FAQAccordionItemProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  onFocus: () => void
  isFirst: boolean
  isLast: boolean
  index: number
}

// Premium easing curves from design tokens
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  onFocus,
  isFirst,
  isLast,
  index,
}: FAQAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const prefersReducedMotion = useReducedMotion()

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [item.a])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp' && !isFirst) {
        e.preventDefault()
        onFocus()
      } else if (e.key === 'ArrowDown' && !isLast) {
        e.preventDefault()
        onFocus()
      }
    },
    [isFirst, isLast, onFocus]
  )

  const transition = prefersReducedMotion ? 'ease-out' : EASE_OUT_EXPO

  return (
    <div className="group relative accordion-item">
      {/* Ambient glow backdrop - animates on open */}
      <div
        className={cn(
          'absolute -inset-3 rounded-2xl pointer-events-none',
          'bg-gradient-to-r from-violet-500/20 via-indigo-500/15 to-purple-500/20',
          'transition-all duration-500',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
        style={{ transitionTimingFunction: transition }}
        aria-hidden="true"
      />

      {/* Card background */}
      <div
        className={cn(
          'relative rounded-xl overflow-hidden',
          'transition-all duration-300',
          isOpen
            ? 'bg-white/[0.06] border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.15)]'
            : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]'
        )}
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          transitionTimingFunction: transition,
        }}
      >
        {/* Left accent line with shimmer effect */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-0.5',
            'transition-all duration-400',
            isOpen
              ? 'bg-gradient-to-b from-violet-400 via-indigo-400 to-purple-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
              : 'bg-gradient-to-b from-violet-500/40 via-indigo-500/20 to-transparent opacity-60 group-hover:opacity-80'
          )}
          style={{ transitionTimingFunction: transition }}
        >
          {/* Shimmer overlay when open */}
          {isOpen && !prefersReducedMotion && (
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-shimmer-sweep"
              style={{ transitionTimingFunction: transition }}
            />
          )}
        </div>

        {/* Question button */}
        <button
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          id={`faq-question-${index}`}
          className={cn(
            'w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-inset focus-visible:ring-offset-0',
            'touch-target min-h-[56px]',
            isOpen ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
          )}
          style={{ transitionTimingFunction: transition }}
        >
          <span
            className={cn(
              'font-medium text-base md:text-lg transition-all duration-200',
              isOpen
                ? 'text-violet-200'
                : 'text-white/70 group-hover:text-white'
            )}
            style={{ transitionTimingFunction: transition }}
          >
            {item.q}
          </span>

          {/* Chevron with spring animation */}
          <ChevronDown
            className={cn(
              'w-5 h-5 flex-shrink-0 transition-all duration-300',
              isOpen ? 'text-violet-300' : 'text-white/40 group-hover:text-white/70'
            )}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transitionTimingFunction: isOpen ? EASE_SPRING : transition,
            }}
            strokeWidth={2}
          />
        </button>

        {/* Answer content with clip-path animation */}
        <div
          id={`faq-answer-${index}`}
          role="region"
          aria-labelledby={`faq-question-${index}`}
          className="overflow-hidden"
          style={{
            transitionTimingFunction: transition,
            transitionProperty: 'max-height, clip-path',
            maxHeight: isOpen ? `${contentHeight}px` : '0',
            transitionDuration: prefersReducedMotion ? '0ms' : '400ms',
          }}
        >
          <div ref={contentRef} className="px-5 md:px-6 pb-5 md:pb-6">
            {/* Animated divider */}
            <div
              className={cn(
                'h-px mb-5 bg-gradient-to-r from-violet-500/50 via-indigo-500/25 to-transparent',
                'transition-all duration-300'
              )}
              style={{
                transitionDelay: isOpen ? '100ms' : '0ms',
                transitionTimingFunction: transition,
                transform: isOpen ? 'scaleX(1)' : 'scaleX(0.3)',
                transformOrigin: 'left',
              }}
            />

            {/* Answer text with staggered reveal */}
            <p
              className={cn(
                'text-white/50 leading-relaxed pl-0.5',
                'transition-all duration-300'
              )}
              style={{
                transitionDelay: isOpen ? (prefersReducedMotion ? '0ms' : '150ms') : '0ms',
                opacity: isOpen ? 1 : 0,
                transform: prefersReducedMotion
                  ? 'none'
                  : isOpen
                    ? 'translateY(0)'
                    : 'translateY(8px)',
                transitionTimingFunction: transition,
              }}
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  defaultOpen = null,
  className,
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    defaultOpen !== null ? new Set([defaultOpen]) : new Set()
  )

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const toggleItem = useCallback(
    (index: number) => {
      setOpenItems((prev) => {
        const next = new Set(prev)

        if (next.has(index)) {
          next.delete(index)
        } else {
          if (!allowMultiple) {
            next.clear()
          }
          next.add(index)
        }

        return next
      })
    },
    [allowMultiple]
  )

  const handleFocus = useCallback((index: number) => {
    itemRefs.current[index]?.focus()
  }, [])

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Home') {
        e.preventDefault()
        itemRefs.current[0]?.focus()
      } else if (e.key === 'End') {
        e.preventDefault()
        itemRefs.current[items.length - 1]?.focus()
      }
    },
    [items.length]
  )

  return (
    <div
      className={cn('space-y-3', className)}
      onKeyDown={handleContainerKeyDown}
    >
      {items.map((item, index) => (
        <FAQAccordionItem
          key={index}
          item={item}
          index={index}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
          onFocus={() => handleFocus(index)}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  )
}
