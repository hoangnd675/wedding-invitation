'use client'

import React, { useMemo } from 'react'
import { ParticleEffectType, ThemeConfig } from '@/lib/wedding-data'

interface FallingEffectsProps {
  theme: ThemeConfig
  effectOverride?: ParticleEffectType
}

interface ParticleItem {
  id: number
  left: string
  duration: string
  delay: string
  swayDuration: string
  scale: number
  variant: number
  opacity: number
}

const PARTICLES: ParticleItem[] = [
  { id: 1, left: '4%', duration: '13s', delay: '0s', swayDuration: '3.2s', scale: 1.0, variant: 0, opacity: 0.78 },
  { id: 2, left: '11%', duration: '10.5s', delay: '2.5s', swayDuration: '2.6s', scale: 0.72, variant: 1, opacity: 0.65 },
  { id: 3, left: '18%', duration: '15s', delay: '5.2s', swayDuration: '3.8s', scale: 1.18, variant: 2, opacity: 0.82 },
  { id: 4, left: '25%', duration: '11.5s', delay: '1.2s', swayDuration: '2.9s', scale: 0.85, variant: 0, opacity: 0.7 },
  { id: 5, left: '33%', duration: '14s', delay: '6.8s', swayDuration: '3.4s', scale: 1.08, variant: 1, opacity: 0.75 },
  { id: 6, left: '41%', duration: '12s', delay: '3.1s', swayDuration: '2.5s', scale: 0.68, variant: 2, opacity: 0.62 },
  { id: 7, left: '49%', duration: '16s', delay: '4.4s', swayDuration: '4.0s', scale: 1.15, variant: 0, opacity: 0.8 },
  { id: 8, left: '57%', duration: '10.8s', delay: '7.5s', swayDuration: '2.7s', scale: 0.78, variant: 1, opacity: 0.68 },
  { id: 9, left: '65%', duration: '13.5s', delay: '1.8s', swayDuration: '3.3s', scale: 0.96, variant: 2, opacity: 0.76 },
  { id: 10, left: '72%', duration: '11.8s', delay: '8.4s', swayDuration: '2.8s', scale: 0.74, variant: 0, opacity: 0.66 },
  { id: 11, left: '79%', duration: '14.5s', delay: '4.9s', swayDuration: '3.6s', scale: 1.12, variant: 1, opacity: 0.82 },
  { id: 12, left: '86%', duration: '12.4s', delay: '0.7s', swayDuration: '3.0s', scale: 0.88, variant: 2, opacity: 0.72 },
  { id: 13, left: '92%', duration: '15.2s', delay: '9.2s', swayDuration: '3.7s', scale: 0.7, variant: 0, opacity: 0.64 },
  { id: 14, left: '46%', duration: '16.5s', delay: '10.5s', swayDuration: '3.5s', scale: 0.95, variant: 1, opacity: 0.74 },
  { id: 15, left: '15%', duration: '13.8s', delay: '6.0s', swayDuration: '3.1s', scale: 0.9, variant: 2, opacity: 0.75 },
  { id: 16, left: '62%', duration: '12.2s', delay: '3.7s', swayDuration: '2.9s', scale: 1.04, variant: 0, opacity: 0.78 },
]

export function DoubleHappinessGlyph({
  className,
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M8 14H45M55 14H92M26.5 4V25M73.5 4V25M14 25H39M61 25H86M15 33H38V46H15ZM62 33H85V46H62Z" />
      <path d="M19 52l3 7M34 52l-3 7M66 52l3 7M81 52l-3 7M6 64H94M15 73H38V94H15ZM62 73H85V94H62Z" />
    </svg>
  )
}

export function FallingEffects({ theme, effectOverride = 'auto' }: FallingEffectsProps) {
  const activeEffect = useMemo(() => {
    if (effectOverride === 'none') return 'none'
    if (effectOverride && effectOverride !== 'auto') return effectOverride
    return theme.defaultEffect
  }, [effectOverride, theme.defaultEffect])

  if (activeEffect === 'none') return null

  const { accent, accent2, gold, accentInk } = theme.colors

  const renderParticleShape = (p: ParticleItem) => {
    const colorPrimary = p.variant === 0 ? accent : p.variant === 1 ? gold : accent2

    switch (activeEffect) {
      case 'songhy':
        if (p.variant === 0) {
          return (
            <div className="w-5 h-5" style={{ color: accent }}>
              <DoubleHappinessGlyph className="w-full h-full drop-shadow-sm" color={accent} />
            </div>
          )
        }
        if (p.variant === 1) {
          return (
            <div className="w-4 h-4" style={{ color: gold }}>
              <DoubleHappinessGlyph className="w-full h-full drop-shadow-sm" color={gold} />
            </div>
          )
        }
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill={accent} aria-hidden="true">
            <path d="M12 21s-7-4.5-9.5-8.5C.5 9 2.5 4.5 6.5 4.5c2.3 0 4 1.3 5.5 3.2 1.5-1.9 3.2-3.2 5.5-3.2 4 0 6 4.5 4 8-2.5 4-9.5 8.5-9.5 8.5z" />
          </svg>
        )

      case 'hearts':
        if (p.variant === 2) {
          return (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={accent2} aria-hidden="true">
              <path d="M12 2C9 7 4 9 4 14a8 8 0 0 0 16 0c0-5-5-7-8-12z" opacity="0.85" />
            </svg>
          )
        }
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill={p.variant === 0 ? accent : accentInk}
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        )

      case 'petals':
        if (p.variant === 1) {
          return (
            <svg viewBox="0 0 28 28" className="w-5 h-5" aria-hidden="true">
              <path
                d="M14 2C19 7 24 14 22 21c-2 5-8 6-8 6s-6-1-8-6C4 14 9 7 14 2z"
                fill={accent2}
              />
              <path
                d="M14 6C17 10 19 15 18 20c-1 3-4 4-4 4s-3-1-4-4c-1-5 1-10 4-14z"
                fill={accent}
                opacity="0.55"
              />
            </svg>
          )
        }
        return (
          <div
            className="w-4 h-3.5"
            style={{
              borderRadius: '150% 0 150% 0',
              background: `linear-gradient(135deg, ${accent2}, ${accent})`,
              boxShadow: `0 2px 6px ${accent}33`,
            }}
          />
        )

      case 'blossoms':
        return (
          <svg viewBox="-16 -16 32 32" className="w-5 h-5" aria-hidden="true">
            <g fill={p.variant % 2 === 0 ? gold : accent}>
              <circle cy="-7" r="5.5" />
              <circle cx="6.7" cy="-2.2" r="5.5" />
              <circle cx="4.1" cy="5.7" r="5.5" />
              <circle cx="-4.1" cy="5.7" r="5.5" />
              <circle cx="-6.7" cy="-2.2" r="5.5" />
            </g>
            <circle r="2.6" fill={p.variant % 2 === 0 ? accent : gold} />
          </svg>
        )

      case 'sparkles':
        if (p.variant === 1) {
          return (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={gold} aria-hidden="true">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
            </svg>
          )
        }
        return (
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill={colorPrimary} aria-hidden="true">
            <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" />
          </svg>
        )

      case 'leaves':
        if (p.variant === 2) {
          return (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill={accent2} aria-hidden="true">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>
          )
        }
        return (
          <div
            className="w-5 h-3.5"
            style={{
              borderRadius: '0 100% 0 100%',
              background: `linear-gradient(135deg, ${accent2}, ${accent} 75%)`,
              boxShadow: `inset 0 0 0 1px ${accent}44`,
            }}
          />
        )

      case 'stars':
        if (p.variant === 2) {
          return (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={gold} aria-hidden="true">
              <path d="M14.5 3a8.5 8.5 0 1 0 6.5 14 7 7 0 1 1-6.5-14z" />
            </svg>
          )
        }
        return (
          <svg
            viewBox="0 0 20 20"
            className="w-4 h-4"
            fill={p.variant === 0 ? gold : accent2}
            style={{ filter: `drop-shadow(0 0 6px ${gold})` }}
            aria-hidden="true"
          >
            <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" />
          </svg>
        )

      case 'bubbles':
        if (p.variant === 2) {
          return (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={gold} aria-hidden="true">
              <path d="M12 2l2.6 6.4 6.9.6-5.2 4.5 1.6 6.7L12 16.6 6.1 20.2l1.6-6.7-5.2-4.5 6.9-.6L12 2z" />
            </svg>
          )
        }
        return (
          <div
            className="w-4 h-4 rounded-full"
            style={{
              border: `1.5px solid ${accent}`,
              background: `radial-gradient(circle at 30% 30%, #ffffffcc, ${accent2}55 70%)`,
              boxShadow: `0 0 8px ${accent2}66`,
            }}
          />
        )

      case 'snow':
      default:
        if (p.variant === 1) {
          return (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke={accent}
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M12 20s-7-4.4-7-9.2C5 8.2 7 6.5 9.2 6.5c1.5 0 2.8.8 2.8 2 0-1.2 1.3-2 2.8-2 2.2 0 4.2 1.7 4.2 4.3 0 4.8-7 9.2-7 9.2z" />
            </svg>
          )
        }
        return (
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle, #ffffff 30%, ${accent2}99 80%)`,
              boxShadow: `0 0 8px ${accent}55`,
            }}
          />
        )
    }
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden print:hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="wd-particle absolute -top-10"
          style={
            {
              left: p.left,
              '--dur': p.duration,
              '--delay': p.delay,
              '--sway': p.swayDuration,
              '--scale': p.scale,
              opacity: p.opacity,
            } as React.CSSProperties
          }
        >
          {renderParticleShape(p)}
        </div>
      ))}
    </div>
  )
}
