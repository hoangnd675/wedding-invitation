'use client'

import React from 'react'
import { ThemeConfig, WeddingInvitationData } from '@/lib/wedding-data'
import { ThemeEmblem } from './theme-emblem'
import { ScrollReveal, ParallaxBox } from './scroll-reveal'
import { formatVietnameseLunarDate } from '@/lib/vietnamese-lunar'

interface HeroSectionProps {
  data: WeddingInvitationData
  theme: ThemeConfig
  onOpenLightbox?: (src: string, caption?: string) => void
}

export function BotanicalBranchSvg({
  className,
  flip = false,
}: {
  className?: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.88">
        <path d="M30 185 C70 150 95 120 110 70 C118 45 140 25 170 18" />
        <path
          d="M70 150 C55 140 42 138 28 142 C42 150 55 154 70 150Z"
          fill="currentColor"
          fillOpacity="0.24"
        />
        <path
          d="M92 118 C98 100 96 86 88 74 C84 90 84 104 92 118Z"
          fill="currentColor"
          fillOpacity="0.24"
        />
        <path
          d="M104 92 C120 88 132 80 138 66 C122 70 110 78 104 92Z"
          fill="currentColor"
          fillOpacity="0.24"
        />
        <path
          d="M128 42 C136 30 136 18 130 8 C122 20 122 32 128 42Z"
          fill="currentColor"
          fillOpacity="0.24"
        />
      </g>
      <g fill="currentColor">
        <circle cx="170" cy="18" r="9" opacity="0.55" />
        <circle cx="160" cy="12" r="7" opacity="0.4" />
        <circle cx="178" cy="28" r="6" opacity="0.4" />
        <circle cx="170" cy="18" r="3.5" fill="#fff" />
        <circle cx="52" cy="160" r="4" opacity="0.5" />
        <circle cx="118" cy="56" r="3" opacity="0.5" />
      </g>
    </svg>
  )
}

function LanternSvg({ className, gold, red }: { className?: string; gold: string; red: string }) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden="true">
      <path d="M30 0V16" stroke={gold} strokeWidth="1.5" />
      <rect x="19" y="15" width="22" height="7" rx="1.5" fill={gold} />
      <ellipse cx="30" cy="54" rx="25" ry="32" fill={red} />
      <ellipse cx="30" cy="54" rx="12" ry="32" fill="none" stroke={gold} strokeWidth="1.3" opacity=".8" />
      <path d="M30 22V86M6 54H54" stroke={gold} strokeWidth="1.1" opacity=".55" />
      <ellipse cx="22" cy="44" rx="6" ry="12" fill="#fff" opacity=".14" />
      <rect x="19" y="85" width="22" height="7" rx="1.5" fill={gold} />
      <path d="M30 92V118M25 93V112M35 93V112" stroke={gold} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function FretworkCornerSvg({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} style={{ color }} aria-hidden="true">
      <path
        d="M2 58V2H58M10 50V10H50M18 42V18H36V36H26V26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  )
}

export function HeroSection({ data, theme, onOpenLightbox }: HeroSectionProps) {
  const { colors, fonts, heroStyle } = theme
  const lunarDateText = formatVietnameseLunarDate(data.weddingDate) || data.lunarDateText

  // 1. SONG HỶ — Red velvet & gold traditional hero with lanterns, fretwork corners, circular moon-gate photo
  if (heroStyle === 'songhy-lantern') {
    return (
      <section
        id="top"
        className="relative min-h-[100svh] pt-24 pb-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 75% 60% at 50% 38%, ${colors.accent} 0%, ${colors.accentInk} 55%, ${colors.navBg} 100%)`,
          color: colors.navInk,
        }}
      >
        {/* Ambient Moving Light Orbs */}
        <div
          aria-hidden="true"
          className="wd-ambient-orb absolute top-1/4 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.gold}48 0%, transparent 70%)`,
          }}
        />

        {/* Gold Double Frame Border */}
        <div
          aria-hidden="true"
          className="absolute inset-x-3 top-[72px] bottom-3 sm:inset-x-6 sm:top-[82px] sm:bottom-6 border pointer-events-none"
          style={{
            borderColor: `${colors.gold}b3`,
            boxShadow: `inset 0 0 0 5px transparent, inset 0 0 0 6px ${colors.gold}52`,
          }}
        />

        {/* 4 Traditional Fretwork Corners */}
        <FretworkCornerSvg color={colors.gold} className="absolute top-[80px] left-5 sm:top-[92px] sm:left-8 w-10 h-10 sm:w-14 sm:h-14" />
        <FretworkCornerSvg color={colors.gold} className="absolute top-[80px] right-5 sm:top-[92px] sm:right-8 w-10 h-10 sm:w-14 sm:h-14 -scale-x-100" />
        <FretworkCornerSvg color={colors.gold} className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 w-10 h-10 sm:w-14 sm:h-14 -scale-y-100" />
        <FretworkCornerSvg color={colors.gold} className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 -scale-100" />

        {/* 2 Swaying Red & Gold Lanterns */}
        <LanternSvg gold={colors.gold} red={colors.accent} className="wd-sway-slow absolute top-14 left-[6%] sm:left-[10%] w-11 h-22 sm:w-16 sm:h-32 drop-shadow-[0_8px_16px_rgba(50,0,0,0.5)]" />
        <LanternSvg gold={colors.gold} red={colors.accent} className="wd-sway-reverse absolute top-14 right-[6%] sm:right-[10%] w-11 h-22 sm:w-16 sm:h-32 drop-shadow-[0_8px_16px_rgba(50,0,0,0.5)]" />

        <ScrollReveal effect="zoom-in" className="relative z-10 mb-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto drop-shadow-[0_0_18px_rgba(226,184,101,0.45)]">
            <ThemeEmblem theme={theme} className="w-full h-full" />
          </div>
        </ScrollReveal>

        {/* Circular Moon-Gate Main Photo with Rotating Dashed Gold Ring */}
        <ScrollReveal effect="blur-clear" className="relative z-10 my-2">
          <div className="relative w-[min(290px,70vw)] aspect-square mx-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-full border border-dashed animate-[spin_60s_linear_infinite]"
              style={{ borderColor: `${colors.gold}a6` }}
            />
            <div
              onClick={() => onOpenLightbox?.(data.heroMainPhoto, `${data.groomShortName} & ${data.brideShortName}`)}
              className="w-full h-full rounded-full overflow-hidden border-[3px] shadow-[0_0_0_7px_rgba(122,19,13,0.6),0_22px_44px_rgba(40,0,0,0.5)] cursor-pointer group"
              style={{ borderColor: colors.gold }}
            >
              <ParallaxBox speed={0.08} className="w-full h-full">
                <img
                  src={data.heroMainPhoto}
                  alt={`Ảnh cưới ${data.groomShortName} & ${data.brideShortName}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </ParallaxBox>
            </div>
          </div>
        </ScrollReveal>

        {/* Save Card Text */}
        <ScrollReveal effect="glow-rise" delay={120} className="relative z-10 mt-8 max-w-xl mx-auto px-4">
          <p
            className="uppercase tracking-[0.28em] text-xs sm:text-sm mb-3"
            style={{ fontFamily: fonts.ui, color: colors.navInk }}
          >
            {data.heroEyebrow}
          </p>
          <h1
            className="wd-hero-names text-4xl sm:text-6xl font-normal leading-tight my-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4"
            style={{ fontFamily: fonts.name }}
          >
            <span className="wd-gold-shimmer-text">{data.groomShortName}</span>
            <span className="text-2xl sm:text-4xl italic font-serif" style={{ color: colors.navInk }}>&amp;</span>
            <span className="wd-gold-shimmer-text">{data.brideShortName}</span>
          </h1>
          <p className="text-lg sm:text-xl mt-3 font-medium" style={{ fontFamily: fonts.head, color: colors.navInk }}>
            Chủ nhật, {data.weddingDateDisplay} · {data.weddingTime}
          </p>
          <p className="text-sm sm:text-base italic mt-1" style={{ color: colors.gold }}>{lunarDateText}</p>
        </ScrollReveal>
      </section>
    )
  }

  // 2. THIỆP HỒNG — Fullscreen cover photo with gradient overlay & handwritten script at bottom
  if (heroStyle === 'thiep-fullscreen') {
    return (
      <section
        id="top"
        className="relative min-h-[100svh] flex items-end justify-center text-center overflow-hidden bg-stone-900"
      >
        <div
          onClick={() => onOpenLightbox?.(data.heroMainPhoto, `${data.groomShortName} & ${data.brideShortName}`)}
          className="absolute inset-0 cursor-pointer"
        >
          <ParallaxBox speed={0.12} className="w-full h-full">
            <img
              src={data.heroMainPhoto}
              alt={`Ảnh cưới ${data.groomShortName} & ${data.brideShortName}`}
              className="w-full h-full object-cover"
            />
          </ParallaxBox>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/75"
          />
        </div>

        {/* Floating light shimmer */}
        <div
          aria-hidden="true"
          className="wd-ambient-orb absolute bottom-16 left-1/2 -translate-x-1/2 w-[420px] h-[240px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.accent}44 0%, transparent 70%)`,
          }}
        />

        <ScrollReveal
          effect="glow-rise"
          className="relative z-10 w-full max-w-2xl px-6 pt-28 pb-16 sm:pb-20 text-white"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 h-px bg-white/70" />
            <p className="uppercase tracking-[0.24em] text-xs sm:text-sm text-white/90" style={{ fontFamily: fonts.ui }}>
              {data.heroEyebrow}
            </p>
            <span className="w-12 h-px bg-white/70" />
          </div>

          <h1
            className="text-5xl sm:text-7xl font-bold leading-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4"
            style={{ fontFamily: fonts.name }}
          >
            <span className="wd-light-sweep">{data.groomShortName}</span>
            <span className="text-3xl sm:text-5xl text-[#f3b6ae] mx-1">&amp;</span>
            <span className="wd-light-sweep">{data.brideShortName}</span>
          </h1>

          <p className="text-base sm:text-lg tracking-[0.28em] uppercase text-white/95 font-medium" style={{ fontFamily: fonts.ui }}>
            {data.weddingDateDisplay} · {data.weddingTime}
          </p>
          <p className="text-sm sm:text-base text-white/80 italic mt-1.5">{lunarDateText}</p>
        </ScrollReveal>
      </section>
    )
  }

  // 3. ĐÊM SAO — Starry night sky, twinkling stars, shooting star, crescent moon, glowing orbital portrait
  if (heroStyle === 'demsao-celestial') {
    return (
      <section
        id="top"
        className="relative min-h-[100svh] pt-24 pb-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          background:
            `radial-gradient(ellipse 90% 55% at 50% 110%, ${colors.accent2}55 0%, transparent 65%), radial-gradient(ellipse at 50% 0%, ${colors.soft} 0%, ${colors.navBg} 72%)`,
          color: colors.ink,
        }}
      >
        {/* Starry sky layers & shooting star */}
        <div aria-hidden="true" className="wd-starfield absolute inset-0 pointer-events-none opacity-85" />
        <div aria-hidden="true" className="wd-shooting-star absolute top-[18%] right-[15%] w-36 h-[2px] pointer-events-none" />

        {/* Glowing Crescent Moon */}
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="wd-sway-slow absolute top-24 right-[8%] w-16 h-16 sm:w-20 sm:h-20"
          style={{ color: colors.gold, filter: `drop-shadow(0 0 24px ${colors.gold}a6)` }}
        >
          <path d="M62 6A44 44 0 1 0 94 72A36 36 0 1 1 62 6Z" fill="currentColor" />
        </svg>

        <ScrollReveal effect="zoom-in" className="relative z-10 my-4">
          <div className="relative w-[min(280px,68vw)] aspect-square mx-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-full border animate-[spin_50s_linear_infinite]"
              style={{ borderColor: `${colors.gold}73` }}
            >
              <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: colors.gold, boxShadow: `0 0 12px ${colors.gold}` }} />
            </div>
            <div
              onClick={() => onOpenLightbox?.(data.heroMainPhoto, `${data.groomShortName} & ${data.brideShortName}`)}
              className="w-full h-full rounded-full overflow-hidden border-2 cursor-pointer group"
              style={{ borderColor: colors.gold, boxShadow: `0 0 45px ${colors.gold}4d` }}
            >
              <ParallaxBox speed={0.08} className="w-full h-full">
                <img
                  src={data.heroMainPhoto}
                  alt={`Ảnh cưới ${data.groomShortName} & ${data.brideShortName}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </ParallaxBox>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal effect="glow-rise" delay={140} className="relative z-10 mt-8 max-w-xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-3" style={{ fontFamily: fonts.ui, color: colors.muted }}>
            {data.heroEyebrow}
          </p>
          <h1
            className="text-5xl sm:text-7xl font-normal leading-tight my-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4"
            style={{ fontFamily: fonts.name, color: colors.gold }}
          >
            <span className="wd-gold-shimmer-text">{data.groomShortName}</span>
            <span className="text-3xl sm:text-4xl italic font-serif" style={{ color: colors.ink }}>&amp;</span>
            <span className="wd-gold-shimmer-text">{data.brideShortName}</span>
          </h1>
          <p className="text-lg sm:text-xl mt-3 tracking-widest" style={{ fontFamily: fonts.head, color: colors.ink }}>
            {data.weddingDateDisplay} · {data.weddingTime}
          </p>
          <p className="text-sm sm:text-base italic mt-1" style={{ color: colors.muted }}>{lunarDateText}</p>
        </ScrollReveal>
      </section>
    )
  }

  // 4. TẠP CHÍ (Editorial Magazine) — Masthead, 2-column high-fashion layout, scrolling marquee
  if (heroStyle === 'tapchi-editorial') {
    return (
      <>
        <section
          id="top"
          className="relative min-h-[92svh] pt-24 pb-12 px-4 sm:px-10 max-w-7xl mx-auto flex flex-col justify-between"
          style={{ backgroundColor: colors.page, color: colors.ink }}
        >
          {/* Editorial Masthead */}
          <div
            className="flex items-center justify-between border-y py-2.5 text-xs uppercase tracking-[0.24em] mb-8"
            style={{ borderColor: colors.ink, fontFamily: fonts.ui }}
          >
            <span>Số đặc biệt</span>
            <b className="font-semibold">
              {data.groomShortName[0]} &amp; {data.brideShortName[0]}
            </b>
            <span>{data.weddingDateDisplay}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-auto">
            <ScrollReveal effect="slide-up" className="lg:col-span-5 text-left order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-px" style={{ backgroundColor: colors.ink }} />
                <p className="uppercase tracking-[0.24em] text-xs font-semibold" style={{ fontFamily: fonts.ui }}>
                  {data.heroEyebrow}
                </p>
              </div>
              <h1
                className="text-5xl sm:text-7xl font-normal leading-[0.95] tracking-tight mb-6"
                style={{ fontFamily: fonts.name }}
              >
                <span className="block wd-light-sweep">{data.groomShortName}</span>
                <span className="block italic text-3xl sm:text-4xl my-2" style={{ color: colors.muted }}>
                  &amp;
                </span>
                <span className="block wd-light-sweep">{data.brideShortName}</span>
              </h1>
              <div className="border-t pt-4" style={{ borderColor: colors.ink }}>
                <p className="uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold" style={{ fontFamily: fonts.ui }}>
                  Chủ nhật · {data.weddingDateDisplay} · {data.weddingTime}
                </p>
                <p className="text-sm mt-1" style={{ color: colors.muted }}>
                  {lunarDateText}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal effect="blur-clear" className="lg:col-span-7 order-1 lg:order-2">
              <div
                onClick={() => onOpenLightbox?.(data.heroMainPhoto, `${data.groomShortName} & ${data.brideShortName}`)}
                className="relative aspect-[4/5] sm:aspect-[4/3] w-full overflow-hidden cursor-pointer group"
              >
                <ParallaxBox speed={0.1} className="w-full h-full">
                  <img
                    src={data.heroMainPhoto}
                    alt={`Ảnh cưới ${data.groomShortName} & ${data.brideShortName}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </ParallaxBox>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Editorial Marquee */}
        <div
          className="overflow-hidden border-y py-3.5 select-none"
          style={{ borderColor: colors.ink, backgroundColor: colors.page, color: colors.ink }}
          aria-hidden="true"
        >
          <div className="wd-marquee-track flex whitespace-nowrap gap-10 text-lg sm:text-2xl italic" style={{ fontFamily: fonts.head }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-10">
                <span>
                  {data.groomShortName} &amp; {data.brideShortName} · {data.weddingDateDisplay}
                </span>
                <span className="text-xs not-italic">✦</span>
              </span>
            ))}
          </div>
        </div>
      </>
    )
  }

  // 5. Default Rich Theme Hero (Serenity, Lavender, Summer, Hoàng Kim, Vườn Hoa, Sen, Mai Đào, Biển Xanh, Huế, Tinh Khôi)
  const isArch = heroStyle === 'vuonhoa-arch' || heroStyle === 'hue-bridge'
  const isCircle = heroStyle === 'bienxanh-ocean'
  const isLotus = heroStyle === 'sen-lotus'
  const isRoyal = heroStyle === 'hoangkim-royal'

  return (
    <section
      id="top"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 20% 15%, ${colors.accent2}38 0%, transparent 55%), radial-gradient(ellipse at 85% 30%, ${colors.accent}22 0%, transparent 55%), ${colors.soft}`,
        color: colors.ink,
      }}
    >
      {/* Moving Ambient Glow */}
      <div
        aria-hidden="true"
        className="wd-ambient-orb absolute top-16 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colors.accent}24 0%, transparent 70%)`,
        }}
      />

      {/* Hoàng Kim Double Royal Border */}
      {isRoyal && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-x-3 top-20 bottom-3 sm:inset-x-6 sm:top-24 sm:bottom-6 border pointer-events-none"
            style={{ borderColor: `${colors.gold}88` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-5 top-22 bottom-5 sm:inset-x-8 sm:top-26 sm:bottom-8 border pointer-events-none"
            style={{ borderColor: `${colors.gold}40` }}
          />
        </>
      )}

      {/* Tilted Background Polaroids for Serenity / Lavender / Summer */}
      {heroStyle === 'classic-polaroid' && (
        <div
          aria-hidden="true"
          className="hidden md:flex justify-between items-start absolute inset-x-0 top-28 px-4 pointer-events-none max-w-7xl mx-auto"
        >
          <div
            onClick={() => onOpenLightbox?.(data.heroLeftPhoto, 'Ảnh kỷ niệm')}
            className="w-[26vw] max-w-[320px] aspect-[4/3] border-8 border-white shadow-lg rotate-[5deg] -ml-4 overflow-hidden pointer-events-auto cursor-pointer group"
          >
            <img
              src={data.heroLeftPhoto}
              alt=""
              className="w-full h-full object-cover blur-[1.5px] group-hover:blur-0 transition-all duration-500 group-hover:scale-105"
            />
          </div>
          <div
            onClick={() => onOpenLightbox?.(data.heroRightPhoto, 'Ảnh kỷ niệm')}
            className="w-[26vw] max-w-[320px] aspect-[4/3] border-8 border-white shadow-lg -rotate-[4deg] -mr-4 overflow-hidden pointer-events-auto cursor-pointer group"
          >
            <img
              src={data.heroRightPhoto}
              alt=""
              className="w-full h-full object-cover blur-[1.5px] group-hover:blur-0 transition-all duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Main Hero Photo Frame */}
        <ScrollReveal
          effect="blur-clear"
          className={`relative mx-auto ${
            isArch || isLotus || isCircle
              ? 'w-[min(320px,76vw)] aspect-[4/5]'
              : 'w-[min(580px,92vw)] aspect-[4/3]'
          }`}
        >
          {/* Swaying Botanical Branches around photo */}
          <BotanicalBranchSvg
            className="wd-sway-slow absolute -left-12 -bottom-8 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none z-20"
          />
          <BotanicalBranchSvg
            flip
            className="wd-sway-reverse absolute -right-12 -top-8 w-28 h-28 sm:w-40 sm:h-40 pointer-events-none z-20 opacity-80"
          />

          {/* Lotus side petals for Sen theme */}
          {isLotus && (
            <>
              <div
                aria-hidden="true"
                className="absolute bottom-2 -left-8 w-28 h-40 rounded-full -rotate-[32deg] opacity-75 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.accent2} 80%)`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute bottom-2 -right-8 w-28 h-40 rounded-full rotate-[32deg] opacity-75 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.accent2} 80%)`,
                }}
              />
            </>
          )}

          <div
            onClick={() => onOpenLightbox?.(data.heroMainPhoto, `${data.groomShortName} & ${data.brideShortName}`)}
            className={`relative w-full h-full overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${
              isArch
                ? 'rounded-t-[999px] border-4 border-white shadow-xl'
                : isCircle
                ? 'rounded-full aspect-square border-4 border-white shadow-xl'
                : isLotus
                ? 'rounded-t-[160px] rounded-b-[90px] border-4 border-white shadow-xl'
                : heroStyle === 'classic-polaroid'
                ? 'border-8 border-white shadow-xl -rotate-2 hover:rotate-0'
                : 'rounded-2xl border-4 border-white shadow-xl'
            }`}
          >
            <ParallaxBox speed={0.09} className="w-full h-full">
              <img
                src={data.heroMainPhoto}
                alt={`Ảnh cưới ${data.groomShortName} & ${data.brideShortName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </ParallaxBox>
          </div>
        </ScrollReveal>

        {/* Save the Date Paper Card */}
        <ScrollReveal
          effect="shimmer-card"
          delay={150}
          className="relative w-full max-w-2xl mt-9 sm:mt-11 px-6 py-9 sm:px-12 sm:py-12 text-center rounded-2xl shadow-[0_14px_40px_-15px_rgba(0,0,0,0.12)] border"
          style={{
            backgroundColor: colors.paper,
            borderColor: colors.line,
          }}
        >
          {/* Chữ Hỷ or Crest Badge at top of card */}
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center border"
            style={{
              borderColor: `${colors.accent}55`,
              color: colors.accent,
              backgroundColor: `${colors.soft}88`,
            }}
          >
            <ThemeEmblem theme={theme} className="w-6 h-6" />
          </div>

          <p
            className="uppercase tracking-[0.24em] text-xs sm:text-sm font-semibold mb-3"
            style={{ color: colors.muted, fontFamily: fonts.ui }}
          >
            {data.heroEyebrow}
          </p>

          <h1
            className="wd-hero-names text-4xl sm:text-6xl font-bold leading-tight my-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4"
            style={{
              fontFamily: fonts.name,
              fontStyle: fonts.nameStyle || 'normal',
              color: colors.ink,
            }}
          >
            <span className="wd-light-sweep">{data.groomShortName}</span>
            <span className="text-2xl sm:text-4xl italic font-serif" style={{ color: colors.accent }}>
              &amp;
            </span>
            <span className="wd-light-sweep">{data.brideShortName}</span>
          </h1>

          <p
            className="text-lg sm:text-2xl font-semibold mt-4 tracking-wide"
            style={{ fontFamily: fonts.head, color: colors.ink }}
          >
            Chủ nhật, {data.weddingDateDisplay} · {data.weddingTime}
          </p>
          <p className="text-sm sm:text-base italic mt-1.5" style={{ color: colors.muted }}>
            {lunarDateText}
          </p>

          {/* Heart Divider */}
          <div className="flex items-center justify-center gap-3 mt-6" aria-hidden="true">
            <span className="w-14 border-t border-dotted" style={{ borderColor: colors.accent }} />
            <span className="text-lg" style={{ color: colors.accent }}>
              ♥
            </span>
            <span className="w-14 border-t border-dotted" style={{ borderColor: colors.accent }} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
