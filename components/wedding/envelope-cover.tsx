'use client'

import React, { useState } from 'react'
import { ThemeConfig, WeddingInvitationData } from '@/lib/wedding-data'
import { DoubleHappinessGlyph } from './falling-effects'

interface EnvelopeCoverProps {
  data: WeddingInvitationData
  theme: ThemeConfig
  isOpen: boolean
  onOpen: () => void
}

export function EnvelopeCover({ data, theme, isOpen, onOpen }: EnvelopeCoverProps) {
  const [isOpening, setIsOpening] = useState(false)

  // Format date with spaces like "2 0 . 1 2 . 2 0 2 6" as in the reference screenshot
  const formattedSpacedDate = data.weddingDateDisplay
    .replace(/\s+/g, '')
    .split('')
    .join(' ')

  const handleOpenClick = () => {
    if (isOpening || isOpen) return
    setIsOpening(true)
    // Start music and reveal main invitation simultaneously while envelope opens and fades out
    onOpen()
  }

  return (
    <div
      onClick={handleOpenClick}
      role="dialog"
      aria-modal={!isOpen}
      aria-label="Phong bì thiệp mời cưới"
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 select-none cursor-pointer transition-all duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isOpen
          ? 'opacity-0 pointer-events-none scale-[1.06]'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: `radial-gradient(circle at 50% 42%, ${theme.colors.soft} 0%, ${theme.colors.page} 70%)`,
        color: theme.colors.ink,
      }}
    >
      {/* Envelope Left & Right Flaps that part smoothly when opening */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1/2 pointer-events-none transition-transform duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-left ${
          isOpen || isOpening ? '-translate-x-12 scale-x-95 opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          background: `linear-gradient(90deg, ${theme.colors.soft}44 0%, transparent 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 w-1/2 pointer-events-none transition-transform duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-right ${
          isOpen || isOpening ? 'translate-x-12 scale-x-95 opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          background: `linear-gradient(-90deg, ${theme.colors.soft}44 0%, transparent 100%)`,
        }}
      />

      {/* Subtle concentric ambient light rings matching Image.jpeg */}
      <div
        aria-hidden="true"
        className="absolute w-[min(92vw,520px)] aspect-square rounded-full pointer-events-none transition-transform duration-1000"
        style={{
          background: `radial-gradient(circle, ${theme.colors.soft}88 0%, ${theme.colors.page}00 70%)`,
          boxShadow: `inset 0 0 80px ${theme.colors.accent}0d`,
          transform: isOpen || isOpening ? 'scale(1.35)' : 'scale(1)',
        }}
      />

      {/* Top envelope flap fold line */}
      <div
        aria-hidden="true"
        className={`absolute top-0 inset-x-0 h-[38vh] pointer-events-none transition-all duration-[850ms] ease-out origin-top ${
          isOpen || isOpening ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-40'
        }`}
        style={{
          background: `linear-gradient(180deg, ${theme.colors.accent}12 0%, transparent 100%)`,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }}
      />

      {/* Center Invitation Card Content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center max-w-md w-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen || isOpening
            ? '-translate-y-6 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        }`}
      >
        {/* Circle with Chữ Hỷ (囍) matching active theme */}
        <div
          className="w-[92px] h-[92px] rounded-full flex items-center justify-center mb-6 relative transition-transform duration-700"
          style={{
            border: `1.5px solid ${theme.colors.accent}`,
            color: theme.colors.accent,
            boxShadow: `0 0 32px ${theme.colors.accent}18`,
          }}
        >
          <DoubleHappinessGlyph
            className="w-11 h-11 transition-transform duration-500"
            color={theme.colors.accent}
          />
        </div>

        {/* Eyebrow: THIỆP MỜI CƯỚI */}
        <p
          className=" uppercase tracking-[0.32em] text-[13px] sm:text-sm font-medium mb-5"
          style={{
            color: theme.colors.muted,
            fontFamily: theme.fonts.ui,
          }}
        >
          {data.envelopeEyebrow || 'THIỆP MỜI CƯỚI'}
        </p>

        {/* Couple Names: Groom / & / Bride */}
        <div
          className="flex flex-col items-center leading-[1.15] mb-6"
          style={{
            fontFamily: theme.fonts.head,
            color: theme.colors.ink,
          }}
        >
          <span className="text-[42px] sm:text-[52px] font-normal tracking-tight">
            {data.groomShortName}
          </span>
          <span
            className="italic text-[26px] sm:text-[30px] my-1 font-serif"
            style={{ color: theme.colors.accent }}
          >
            &amp;
          </span>
          <span className="text-[42px] sm:text-[52px] font-normal tracking-tight">
            {data.brideShortName}
          </span>
        </div>

        {/* Spaced Wedding Date: 2 0 . 1 2 . 2 0 2 6 */}
        <p
          className="text-[17px] sm:text-[19px] tracking-[0.14em] font-normal mb-9"
          style={{
            color: theme.colors.muted,
            fontFamily: theme.fonts.ui,
          }}
        >
          {formattedSpacedDate}
        </p>

        {/* Pill Button with Double Ring Halo — "Mở thiệp" WITHOUT musical note */}
        <div
          className="p-[5px] rounded-full transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            border: `2px solid ${theme.colors.accent}45`,
            background: `${theme.colors.accent}12`,
            boxShadow: `0 12px 30px -6px ${theme.colors.accent}40`,
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenClick()
            }}
            className="min-w-[176px] min-h-[52px] px-10 py-3 rounded-full text-[17px] font-medium tracking-[0.03em] transition-all duration-300 cursor-pointer flex items-center justify-center"
            style={{
              backgroundColor: theme.colors.accentInk,
              color: theme.isDark ? '#111a3a' : '#ffffff',
              fontFamily: theme.fonts.ui,
              boxShadow: `inset 0 1px 1px rgba(255,255,255,0.25)`,
            }}
          >
            Mở thiệp
          </button>
        </div>
      </div>
    </div>
  )
}
