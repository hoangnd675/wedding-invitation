'use client'

import React from 'react'
import { ThemeConfig, WeddingInvitationData } from '@/lib/wedding-data'
import { ThemeEmblem } from './theme-emblem'
import { BotanicalBranchSvg } from './hero-section'
import { ScrollReveal } from './scroll-reveal'

interface CoupleStorySectionProps {
  data: WeddingInvitationData
  theme: ThemeConfig
  onOpenLightbox?: (src: string, caption?: string) => void
}

export function SectionHeader({
  title,
  subtitle,
  theme,
  indexLabel,
}: {
  title: string
  subtitle?: string
  theme: ThemeConfig
  indexLabel?: string
}) {
  const { colors, fonts, id } = theme

  if (id === 'tapchi') {
    return (
      <ScrollReveal effect="slide-up" className="max-w-5xl mx-auto mb-12">
        <div
          className="flex items-end justify-between border-b pb-4 gap-4"
          style={{ borderColor: colors.ink }}
        >
          <div>
            {subtitle && (
              <p
                className="uppercase tracking-[0.22em] text-xs font-semibold mb-1.5"
                style={{ color: colors.muted, fontFamily: fonts.ui }}
              >
                {subtitle}
              </p>
            )}
            <h2
              className="text-3xl sm:text-5xl font-normal tracking-tight"
              style={{ fontFamily: fonts.head, color: colors.ink }}
            >
              {title}
            </h2>
          </div>
          {indexLabel && (
            <span
              className="italic text-2xl sm:text-3xl"
              style={{ fontFamily: fonts.head, color: colors.muted }}
            >
              {indexLabel}
            </span>
          )}
        </div>
      </ScrollReveal>
    )
  }

  return (
    <ScrollReveal effect="glow-rise" className="text-center mb-12 relative z-10">
      {subtitle && (
        <p
          className="uppercase tracking-[0.24em] text-xs font-semibold mb-2"
          style={{ color: colors.accent, fontFamily: fonts.ui }}
        >
          {subtitle}
        </p>
      )}
      <h2
        className="text-3xl sm:text-5xl font-semibold tracking-tight"
        style={{
          fontFamily: fonts.head,
          color: id === 'thiep' ? colors.accentInk : colors.ink,
        }}
      >
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3 mt-3.5" aria-hidden="true">
        <span className="w-12 border-t border-dotted" style={{ borderColor: colors.accent }} />
        <ThemeEmblem theme={theme} className="w-4 h-4" />
        <span className="w-12 border-t border-dotted" style={{ borderColor: colors.accent }} />
      </div>
    </ScrollReveal>
  )
}

function splitParentNames(value: string) {
  const cleaned = value.replace(/^(?:Con trai|Con gái)\s+/i, '').trim()
  const parts = cleaned.split(/\s*&\s*|\s+và\s+/i)
  return { father: parts[0]?.trim() || cleaned, mother: parts.slice(1).join(' và ').trim() }
}
function familyInfoFontSize(value: string) {
  const { father, mother } = splitParentNames(value)
  const longest = Math.max(father.length, mother.length, 1)
  return `${Math.max(0.68, Math.min(1.12, 30 / longest * 0.92))}rem`
}
export function CoupleStorySection({ data, theme, onOpenLightbox }: CoupleStorySectionProps) {
  const { colors, fonts } = theme

  return (
    <>
      {/* 1. GIỚI THIỆU CÔ DÂU & CHÚ RỂ */}
      <section
        id="couple"
        className="relative py-20 sm:py-24 px-4 overflow-hidden"
        style={{
          backgroundColor: colors.paper,
          color: colors.ink,
        }}
      >
        {/* Ambient Moving Light */}
        <div
          aria-hidden="true"
          className="wd-ambient-orb absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.accent}18 0%, transparent 70%)`,
          }}
        />
        <div
          aria-hidden="true"
          style={{ color: colors.accent }}
          className="pointer-events-none"
        >
          <BotanicalBranchSvg
            flip
            className="wd-sway-slow absolute -right-10 top-10 w-36 h-36 sm:w-48 sm:h-48 opacity-45"
          />
          <BotanicalBranchSvg
            className="wd-sway-reverse absolute -left-10 bottom-8 w-36 h-36 sm:w-48 sm:h-48 opacity-45"
          />
        </div>

        <SectionHeader
          title="Cô dâu & Chú rể"
          subtitle="Hai nhân vật chính"
          theme={theme}
          indexLabel="01"
        />

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 items-start gap-8 md:gap-5 relative z-10">
          {/* Groom Card */}
          <ScrollReveal effect="blur-clear" className="md:col-span-5 flex flex-col items-center text-center">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-4"
              style={{
                backgroundColor: colors.soft,
                color: colors.accentInk,
                fontFamily: fonts.ui,
              }}
            >
              Nhà trai
            </span>

            <div
              onClick={() => onOpenLightbox?.(data.groomPhoto, `Chú rể ${data.groomFullName}`)}
              className="relative w-[min(270px,72vw)] aspect-[3/4] rounded-[999px] overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl -rotate-1 hover:rotate-0"
              style={{
                border: `6px solid ${colors.soft}`,
                boxShadow: `0 0 0 1.5px ${colors.accent2}, 0 18px 36px -12px ${colors.accent}35`,
              }}
            >
              <img
                src={data.groomPhoto}
                alt={`Chú rể ${data.groomFullName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold mt-5 mb-1.5"
              style={{ color: colors.muted, fontFamily: fonts.ui }}
            >
              Chú rể
            </p>
            <h3
              className="wd-light-sweep text-2xl sm:text-3xl font-bold px-5 py-1.5 rounded-full"
              style={{
                fontFamily: fonts.head,
                color: colors.ink,
              }}
            >
              {data.groomFullName}
            </h3>
            {data.groomFamilyInfo && (
              <p className="mt-2 w-full text-center leading-relaxed flex flex-col items-center" style={{ color: colors.muted, fontSize: familyInfoFontSize(data.groomFamilyInfo) }}>
                <span>{splitParentNames(data.groomFamilyInfo).father}</span>
                <span className="font-semibold">và</span>
                {splitParentNames(data.groomFamilyInfo).mother && <span>{splitParentNames(data.groomFamilyInfo).mother}</span>}
              </p>
            )}
          </ScrollReveal>

          {/* Center Emblem (Rings / Double Happiness) */}
          <ScrollReveal
            effect="zoom-in"
            delay={120}
            className="md:col-span-2 flex flex-col items-center justify-center py-2 md:mt-[188px] md:py-0"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border"
              style={{
                borderColor: colors.accent,
                backgroundColor: colors.soft,
                color: colors.accent,
                boxShadow: `0 8px 24px ${colors.accent}18`,
              }}
            >
              <ThemeEmblem theme={theme} className="w-9 h-9" />
            </div>
          </ScrollReveal>

          {/* Bride Card */}
          <ScrollReveal
            effect="blur-clear"
            delay={160}
            className="md:col-span-5 flex flex-col items-center text-center"
          >
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-4"
              style={{
                backgroundColor: colors.soft,
                color: colors.accentInk,
                fontFamily: fonts.ui,
              }}
            >
              Nhà gái
            </span>

            <div
              onClick={() => onOpenLightbox?.(data.bridePhoto, `Cô dâu ${data.brideFullName}`)}
              className="relative w-[min(270px,72vw)] aspect-[3/4] rounded-[999px] overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rotate-1 hover:rotate-0"
              style={{
                border: `6px solid ${colors.soft}`,
                boxShadow: `0 0 0 1.5px ${colors.accent2}, 0 18px 36px -12px ${colors.accent}35`,
              }}
            >
              <img
                src={data.bridePhoto}
                alt={`Cô dâu ${data.brideFullName}`}
                className="w-full h-full object-cover object-[50%_32%] scale-[1.15] transition-transform duration-700 group-hover:scale-125"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold mt-5 mb-1.5"
              style={{ color: colors.muted, fontFamily: fonts.ui }}
            >
              Cô dâu
            </p>
            <h3
              className="wd-light-sweep text-2xl sm:text-3xl font-bold px-5 py-1.5 rounded-full"
              style={{
                fontFamily: fonts.head,
                color: colors.ink,
              }}
            >
              {data.brideFullName}
            </h3>
            {data.brideFamilyInfo && (
              <p className="mt-2 w-full text-center leading-relaxed flex flex-col items-center" style={{ color: colors.muted, fontSize: familyInfoFontSize(data.brideFamilyInfo) }}>
                <span>{splitParentNames(data.brideFamilyInfo).father}</span>
                <span className="font-semibold">và</span>
                {splitParentNames(data.brideFamilyInfo).mother && <span>{splitParentNames(data.brideFamilyInfo).mother}</span>}
              </p>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 2. CHUYỆN TÌNH YÊU (LOVE STORY TIMELINE) */}
      {data.stories.length > 0 && (
        <section
          id="chuyen-tinh-yeu"
          className="relative py-20 sm:py-24 px-4 overflow-hidden"
          style={{
            backgroundColor: colors.page,
            color: colors.ink,
          }}
        >
          <SectionHeader
            title="Chuyện tình yêu"
            subtitle="Hành trình bên nhau"
            theme={theme}
            indexLabel="02"
          />

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Timeline Line */}
            <div
              aria-hidden="true"
              className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
              style={{ backgroundColor: `${colors.accent}45` }}
            />

            <ol className="space-y-8 sm:space-y-10">
              {data.stories.map((item, idx) => {
                const isEven = idx % 2 === 1
                return (
                  <li key={item.id} className="relative pl-12 sm:pl-0">
                    {/* Timeline Heart Node */}
                    <div
                      aria-hidden="true"
                      className="
                        absolute left-4 sm:left-1/2 top-5 -translate-x-1/2
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10
                      "
                      style={{
                        backgroundColor: colors.accentInk,
                        color: theme.isDark ? '#111a3a' : '#fff',
                        boxShadow: `0 0 0 4px ${colors.page}`,
                      }}
                    >
                      ♥
                    </div>

                    <div
                      className={`sm:w-[calc(50%-28px)] ${
                        isEven ? 'sm:ml-auto sm:text-left' : 'sm:mr-auto sm:text-right'
                      }`}
                    >
                      <ScrollReveal
                        effect={isEven ? 'slide-up' : 'tilt-rotate'}
                        delay={idx * 80}
                        className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                          backgroundColor: colors.paper,
                          borderColor: colors.line,
                        }}
                      >
                        <div
                          className={`flex items-center gap-2.5 mb-2 ${
                            isEven ? 'sm:justify-start' : 'sm:justify-end'
                          }`}
                        >
                          <span
                            className="px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase"
                            style={{
                              backgroundColor: colors.soft,
                              color: colors.accentInk,
                              fontFamily: fonts.ui,
                            }}
                          >
                            {item.year}
                          </span>
                          <h3
                            className="text-lg sm:text-xl font-bold"
                            style={{ fontFamily: fonts.head, color: colors.ink }}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.muted }}>
                          {item.description}
                        </p>
                      </ScrollReveal>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      )}
    </>
  )
}
