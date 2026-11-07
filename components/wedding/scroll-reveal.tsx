'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PhotoScrollEffect } from '@/lib/wedding-data'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  effect?: PhotoScrollEffect | 'glow-rise' | 'shimmer-card'
  delay?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Repeatable scroll animation wrapper:
 * Every time the element scrolls into view, it triggers the animation (`inView = true`).
 * When it scrolls out of view, it resets (`inView = false`) so scrolling back replays the effect!
 */
export function ScrollReveal({
  children,
  effect = 'slide-up',
  delay = 0,
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        } else {
          // Reset when leaving viewport so scrolling back replays the animation
          setInView(false)
        }
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -6% 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const effectClasses: Record<string, { hidden: string; visible: string }> = {
    'fade-in': {
      hidden: 'opacity-0 scale-[0.97]',
      visible: 'opacity-100 scale-100',
    },
    'slide-up': {
      hidden: 'opacity-0 translate-y-12',
      visible: 'opacity-100 translate-y-0',
    },
    'zoom-in': {
      hidden: 'opacity-0 scale-[0.82]',
      visible: 'opacity-100 scale-100',
    },
    'blur-clear': {
      hidden: 'opacity-0 blur-[10px] scale-[1.05]',
      visible: 'opacity-100 blur-0 scale-100',
    },
    'tilt-rotate': {
      hidden: 'opacity-0 -rotate-6 translate-y-8 scale-[0.92]',
      visible: 'opacity-100 rotate-0 translate-y-0 scale-100',
    },
    'glow-rise': {
      hidden: 'opacity-0 translate-y-10 scale-[0.96]',
      visible: 'opacity-100 translate-y-0 scale-100 wd-glow-active',
    },
    'shimmer-card': {
      hidden: 'opacity-0 translate-y-8 scale-[0.98]',
      visible: 'opacity-100 translate-y-0 scale-100 wd-shimmer-active',
    },
  }

  const chosen = effectClasses[effect] || effectClasses['slide-up']

  return (
    <div
      ref={ref}
      style={{ ...style, transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity,filter]',
        inView ? chosen.visible : chosen.hidden,
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Parallax container that shifts smoothly based on scroll position
 */
export function ParallaxBox({
  children,
  speed = 0.15,
  className,
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const windowCenter = window.innerHeight / 2
        const elementCenter = rect.top + rect.height / 2
        const delta = (elementCenter - windowCenter) * speed
        setOffset(Math.max(-45, Math.min(45, delta)))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [speed])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <div
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.08)` }}
        className="w-full h-full transition-transform duration-150 ease-out will-change-transform"
      >
        {children}
      </div>
    </div>
  )
}
