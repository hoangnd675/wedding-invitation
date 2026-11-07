'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ThemeConfig, VenueEvent, WeddingInvitationData } from '@/lib/wedding-data'
import { SectionHeader } from './couple-story-section'
import { ScrollReveal, ParallaxBox } from './scroll-reveal'
import { Calendar, MapPin, Navigation, Clock } from 'lucide-react'
import { getVietnameseLunarDateText } from '@/lib/vietnamese-lunar'

interface CeremonyCalendarSectionProps {
  data: WeddingInvitationData
  theme: ThemeConfig
  onOpenLightbox?: (src: string, caption?: string) => void
}

function downloadIcsFile({
  title,
  location,
  startIso,
  endIso,
}: {
  title: string
  location: string
  startIso: string
  endIso: string
}) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ThiepCuoiOnline//VI',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lich-cuoi.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function CeremonyCalendarSection({
  data,
  theme,
  onOpenLightbox,
}: CeremonyCalendarSectionProps) {
  const { colors, fonts } = theme
  const hasWeddingDate = /^\d{4}-\d{2}-\d{2}$/.test(data.weddingDate)
  const lunarDateText = getVietnameseLunarDateText(data.weddingDate)
  const [openMapIds, setOpenMapIds] = useState<Record<string, boolean>>({})

  // Live Countdown State
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const compute = () => {
      if (!hasWeddingDate) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return }
      const targetStr = `${data.weddingDate}T${data.weddingTime || '11:00'}:00`
      const targetTime = new Date(targetStr).getTime()
      const now = Date.now()
      const diff = Math.max(0, targetTime - now)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const mins = Math.floor((diff / 1000 / 60) % 60)
      const secs = Math.floor((diff / 1000) % 60)
      setCountdown({ days, hours, mins, secs })
    }
    compute()
    const timer = setInterval(compute, 1000)
    return () => clearInterval(timer)
  }, [data.weddingDate, data.weddingTime, hasWeddingDate])

  // Build Monthly Calendar Cells for `data.weddingDate`
  const calendarInfo = useMemo(() => {
    const parts = hasWeddingDate ? data.weddingDate.split('-').map(Number) : []
    const today = new Date()
    const year = parts[0] || today.getFullYear()
    const month = parts[1] || today.getMonth() + 1
    const weddingDay = parts[2] || 0

    const firstDayDate = new Date(year, month - 1, 1)
    // Monday-based index (0 = Mon, 6 = Sun)
    const firstWeekday = (firstDayDate.getDay() + 6) % 7
    const daysInMonth = new Date(year, month, 0).getDate()

    const cells: (number | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return { year, month, weddingDay, cells }
  }, [data.weddingDate, hasWeddingDate])

  const toggleMap = (id: string) => {
    setOpenMapIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* 1. THÔNG TIN LỄ CƯỚI + ĐỒNG HỒ ĐẾM NGƯỢC & LỊCH CƯỚI */}
      <section
        id="event"
        className="relative py-20 sm:py-24 px-4 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, ${colors.soft} 0%, ${colors.page} 70%)`,
          color: colors.ink,
        }}
      >
        <SectionHeader
          title="Lễ thành hôn"
          subtitle="Ngày chung đôi"
          theme={theme}
          indexLabel="03"
        />

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 sm:gap-10">
          {/* Ceremony Photo */}
          <ScrollReveal effect="tilt-rotate" className="lg:col-span-5">
            <div
              onClick={() =>
                onOpenLightbox?.(
                  data.ceremonyPhoto,
                  `Lễ thành hôn ${data.groomShortName} & ${data.brideShortName}`
                )
              }
              className="relative w-[min(360px,84vw)] lg:w-full mx-auto aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-8 border-white shadow-xl rotate-2 hover:rotate-0"
            >
              <ParallaxBox speed={0.08} className="w-full h-full">
                <img
                  src={data.ceremonyPhoto}
                  alt={`Lễ thành hôn ${data.groomShortName} & ${data.brideShortName}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </ParallaxBox>
            </div>
          </ScrollReveal>

          {/* Ceremony Info + Calendar + Countdown Card */}
          <ScrollReveal
            effect="shimmer-card"
            delay={120}
            className="lg:col-span-7 rounded-2xl p-6 sm:p-10 text-center border shadow-[0_18px_45px_-20px_rgba(0,0,0,0.14)]"
            style={{
              backgroundColor: colors.paper,
              borderColor: colors.line,
            }}
          >
            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold mb-2"
              style={{ color: colors.muted, fontFamily: fonts.ui }}
            >
              {data.ceremonyIntroText}
            </p>

            <h3
              className="text-3xl sm:text-5xl font-bold my-2 flex flex-wrap items-center justify-center gap-2"
              style={{ fontFamily: fonts.name, color: colors.accentInk }}
            >
              <span className="wd-light-sweep">{data.groomShortName}</span>
              <span className="italic text-2xl font-serif" style={{ color: colors.accent }}>
                &amp;
              </span>
              <span className="wd-light-sweep">{data.brideShortName}</span>
            </h3>

            {/* Highlighted Date Lockup */}
            <div
              className="grid grid-cols-3 items-center max-w-xs mx-auto my-5 py-3 border-y"
              style={{ borderColor: colors.line }}
            >
              <span
                className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-right pr-3"
                style={{ fontFamily: fonts.ui, color: colors.muted }}
              >
                {hasWeddingDate ? `Tháng ${calendarInfo.month}` : 'Ngày cưới'}
              </span>
              <b
                className="text-4xl sm:text-5xl font-bold leading-none border-x px-4"
                style={{
                  fontFamily: fonts.head,
                  color: colors.accentInk,
                  borderColor: colors.line,
                }}
              >
                {hasWeddingDate ? calendarInfo.weddingDay : '—'}
              </b>
              <span
                className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-left pl-3"
                style={{ fontFamily: fonts.ui, color: colors.muted }}
              >
                {hasWeddingDate ? `Năm ${calendarInfo.year}` : 'Chưa cập nhật'}
              </span>
            </div>

            <p className="text-sm sm:text-base font-medium" style={{ color: colors.ink }}>
              {hasWeddingDate ? `Lúc ${data.weddingTime} · ${data.weddingDateDisplay}` : 'Ngày cưới sẽ được cập nhật sau'}
            </p>
            {lunarDateText && <p className="text-xs sm:text-sm italic mt-1" style={{ color: colors.muted }}>{lunarDateText}</p>}

            {/* Monthly Wedding Calendar */}
            <div
              className="max-w-sm mx-auto mt-6 p-4 rounded-xl border"
              style={{
                backgroundColor: `${colors.soft}70`,
                borderColor: colors.line,
              }}
            >
              <p
                className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-3"
                style={{ color: colors.accentInk, fontFamily: fonts.ui }}
              >
                {hasWeddingDate ? `Tháng ${calendarInfo.month} · ${calendarInfo.year}` : 'Lịch cưới sẽ được cập nhật'}
              </p>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((dow) => (
                  <b
                    key={dow}
                    className="py-1 font-semibold opacity-75"
                    style={{ fontFamily: fonts.ui, color: colors.muted }}
                  >
                    {dow}
                  </b>
                ))}
                {calendarInfo.cells.map((day, i) => {
                  if (!day) return <span key={`empty-${i}`} className="py-1.5" />
                  const isWeddingDay = day === calendarInfo.weddingDay
                  return (
                    <span
                      key={day}
                      className={`relative py-1.5 rounded-full flex items-center justify-center font-medium transition-transform ${
                        isWeddingDay ? 'font-bold scale-110 shadow-sm' : ''
                      }`}
                      style={
                        isWeddingDay
                          ? {
                              backgroundColor: colors.accentInk,
                              color: theme.isDark ? '#111a3a' : '#ffffff',
                            }
                          : { color: colors.ink }
                      }
                    >
                      {day}
                      {isWeddingDay && (
                        <span
                          aria-hidden="true"
                          className="absolute -top-1.5 -right-1 text-[10px] leading-none"
                          style={{ color: colors.accent }}
                        >
                          ♥
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Live Countdown Boxes */}
            {hasWeddingDate && <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto my-6">
              {[
                { value: countdown.days, label: 'Ngày' },
                { value: countdown.hours, label: 'Giờ' },
                { value: countdown.mins, label: 'Phút' },
                { value: countdown.secs, label: 'Giây' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="py-3 px-2 rounded-xl border transition-transform duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.soft,
                    borderColor: colors.line,
                  }}
                >
                  <b
                    className="block text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
                    style={{ fontFamily: fonts.head, color: colors.accentInk }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </b>
                  <span
                    className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold"
                    style={{ fontFamily: fonts.ui, color: colors.muted }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>}

            {/* Action Buttons */}
            {hasWeddingDate && <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={() =>
                  downloadIcsFile({
                    title: `Lễ cưới ${data.groomShortName} & ${data.brideShortName}`,
                    location: data.venues[0]?.address || 'Việt Nam',
                    startIso: data.venues[0]?.icsStart || '20261220T040000Z',
                    endIso: data.venues[0]?.icsEnd || '20261220T080000Z',
                  })
                }
                className="min-h-[46px] px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: colors.accentInk,
                  color: theme.isDark ? '#111a3a' : '#fff',
                  fontFamily: fonts.ui,
                }}
              >
                <Calendar className="w-4 h-4" />
                Thêm vào lịch
              </button>
              <a
                href="#location"
                className="min-h-[46px] px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 border transition-colors"
                style={{
                  borderColor: colors.accent,
                  color: colors.accentInk,
                  fontFamily: fonts.ui,
                }}
              >
                <MapPin className="w-4 h-4" />
                Xem địa điểm
              </a>
            </div>}
          </ScrollReveal>
        </div>
      </section>

      {/* 2. ĐỊA ĐIỂM TỔ CHỨC & BẢN ĐỒ */}
      <section
        id="location"
        className="relative py-20 sm:py-24 px-4 overflow-hidden"
        style={{
          backgroundColor: colors.paper,
          color: colors.ink,
        }}
      >
        <SectionHeader
          title="Địa điểm tổ chức"
          subtitle="Hân hạnh đón tiếp"
          theme={theme}
          indexLabel="04"
        />

        <div className="max-w-5xl mx-auto space-y-10">
          {data.venues.map((ev: VenueEvent, idx: number) => {
            const isEven = idx % 2 === 1
            const isMapOpen = openMapIds[ev.id] ?? true
            const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
              ev.mapQuery || ev.address
            )}&hl=vi&z=15&output=embed`
            const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              ev.mapQuery || ev.address
            )}`

            return (
              <ScrollReveal
                key={ev.id}
                effect={isEven ? 'slide-up' : 'fade-in'}
                delay={idx * 100}
                className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 rounded-2xl p-4 sm:p-6 border shadow-sm"
                style={{
                  backgroundColor: colors.page,
                  borderColor: colors.line,
                }}
              >
                {/* Interactive Map Frame */}
                <div
                  className={`lg:col-span-7 h-[260px] sm:h-[320px] rounded-xl overflow-hidden border relative ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                  style={{ borderColor: colors.line, backgroundColor: colors.soft }}
                >
                  {isMapOpen ? (
                    <iframe
                      title={`Bản đồ ${ev.title}`}
                      src={mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleMap(ev.id)}
                      className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer"
                    >
                      <MapPin className="w-8 h-8 mb-2" style={{ color: colors.accent }} />
                      <span
                        className="px-5 py-2 rounded-full text-sm font-semibold shadow-sm"
                        style={{
                          backgroundColor: colors.paper,
                          color: colors.accentInk,
                        }}
                      >
                        Nhấn để xem bản đồ
                      </span>
                      <small className="mt-2 text-xs max-w-xs" style={{ color: colors.muted }}>
                        {ev.address}
                      </small>
                    </button>
                  )}
                </div>

                {/* Venue Details Card */}
                <div
                  className={`lg:col-span-5 p-6 sm:p-8 rounded-xl text-center border shadow-md ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                  style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.line,
                  }}
                >
                  <h3
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{ fontFamily: fonts.head, color: colors.accentInk }}
                  >
                    {ev.title}
                  </h3>
                  <p
                    className="text-base sm:text-lg font-semibold mb-2"
                    style={{ fontFamily: fonts.ui, color: colors.ink }}
                  >
                    {ev.place}
                  </p>
                  <p
                    className="text-sm sm:text-base flex items-start justify-center gap-1.5 mb-2"
                    style={{ color: colors.muted }}
                  >
                    <MapPin className="w-4 h-4 shrink-0 mt-1" style={{ color: colors.accent }} />
                    <span>{ev.address}</span>
                  </p>
                  <p
                    className="text-sm sm:text-base font-medium flex items-center justify-center gap-1.5 mb-5"
                    style={{ color: colors.ink }}
                  >
                    <Clock className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                    <span>{ev.timeText}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <a
                      href={mapSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-5 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 transition-transform hover:scale-105"
                      style={{
                        backgroundColor: colors.accentInk,
                        color: theme.isDark ? '#111a3a' : '#fff',
                        fontFamily: fonts.ui,
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                      Chỉ đường
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        downloadIcsFile({
                          title: `${ev.title} · ${data.groomShortName} & ${data.brideShortName}`,
                          location: `${ev.place}, ${ev.address}`,
                          startIso: ev.icsStart,
                          endIso: ev.icsEnd,
                        })
                      }
                      className="min-h-[44px] px-5 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 border cursor-pointer"
                      style={{
                        borderColor: colors.accent,
                        color: colors.accentInk,
                        fontFamily: fonts.ui,
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      Thêm vào lịch
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* 3. TRÍCH DẪN TÌNH YÊU (PARALLAX QUOTE BANNER) */}
      <section className="relative min-h-[340px] sm:min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <ParallaxBox speed={0.18} className="w-full h-full">
            <img
              src={data.quotePhoto}
              alt=""
              className="w-full h-full object-cover"
            />
          </ParallaxBox>
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <ScrollReveal effect="glow-rise" className="relative z-10 max-w-2xl mx-auto px-6 py-16">
          <span
            aria-hidden="true"
            className="block text-5xl sm:text-6xl leading-none mb-3 opacity-80"
            style={{ fontFamily: fonts.name, color: colors.accent2 }}
          >
            &ldquo;
          </span>
          <blockquote
            className="text-xl sm:text-3xl italic font-medium leading-relaxed drop-shadow"
            style={{ fontFamily: fonts.head }}
          >
            {data.quoteText}
          </blockquote>
          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-white/80" style={{ fontFamily: fonts.ui }}>
            {data.groomShortName} &amp; {data.brideShortName}
          </p>
        </ScrollReveal>
      </section>
    </>
  )
}
