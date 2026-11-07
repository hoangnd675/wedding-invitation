'use client'

import React, { useEffect, useCallback } from 'react'
import { AlbumPhoto, PhotoScrollEffect, ThemeConfig, WeddingInvitationData } from '@/lib/wedding-data'
import { SectionHeader } from './couple-story-section'
import { ScrollReveal } from './scroll-reveal'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

interface AlbumLightboxSectionProps {
  data: WeddingInvitationData
  theme: ThemeConfig
  lightboxIndex: number | null
  setLightboxIndex: (idx: number | null) => void
}

const EFFECT_CYCLE: PhotoScrollEffect[] = [
  'fade-in',
  'slide-up',
  'zoom-in',
  'blur-clear',
  'tilt-rotate',
]

const EFFECT_LABELS: Record<PhotoScrollEffect, string> = {
  'fade-in': 'Hiện dần (Fade In)',
  'slide-up': 'Trượt lên (Slide Up)',
  'zoom-in': 'Phóng nhẹ (Zoom In)',
  'blur-clear': 'Làm nét (Blur → Nét)',
  'tilt-rotate': 'Xoay nhẹ (Tilt Frame)',
}

export function AlbumLightboxSection({
  data,
  theme,
  lightboxIndex,
  setLightboxIndex,
}: AlbumLightboxSectionProps) {
  const { colors, fonts } = theme
  const photos = data.album

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || photos.length === 0) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }, [lightboxIndex, photos.length, setLightboxIndex])

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || photos.length === 0) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }, [lightboxIndex, photos.length, setLightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, handlePrev, handleNext, setLightboxIndex])

  const activePhoto: AlbumPhoto | null =
    lightboxIndex !== null && photos[lightboxIndex] ? photos[lightboxIndex] : null

  return (
    <section
      id="gallery"
      className="relative py-20 sm:py-24 px-4 overflow-hidden"
      style={{
        backgroundColor: colors.page,
        color: colors.ink,
      }}
    >
      {/* Ambient Moving Light */}
      <div
        aria-hidden="true"
        className="wd-ambient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 70%)`,
        }}
      />

      <SectionHeader
        title="Album ảnh cưới"
        subtitle="Khoảnh khắc hạnh phúc"
        theme={theme}
        indexLabel="05"
      />

      {/* Album Grid with 5 repeatable scroll animations + gentle frame tilt + hover lift & shadow */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 relative z-10">
        {photos.map((photo, index) => {
          const effect: PhotoScrollEffect =
            photo.effect || EFFECT_CYCLE[index % EFFECT_CYCLE.length]
          // Subtle alternating frame tilt that straightens and lifts on hover
          const tiltClass =
            index % 4 === 0
              ? 'sm:-rotate-[1.2deg]'
              : index % 4 === 2
              ? 'sm:rotate-[1.2deg]'
              : ''

          return (
            <ScrollReveal
              key={photo.id}
              effect={effect}
              delay={(index % 4) * 75}
              className="h-full"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Xem ảnh cưới ${index + 1}/${photos.length}`}
                title={EFFECT_LABELS[effect]}
                className={`group relative w-full aspect-[4/5] rounded-2xl overflow-hidden block cursor-pointer border-4 transition-all duration-500 ease-out ${tiltClass} hover:rotate-0 hover:-translate-y-2.5 hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.32)] focus-visible:outline-2`}
                style={{
                  borderColor: colors.paper,
                  backgroundColor: colors.soft,
                  boxShadow: `0 8px 22px -10px rgba(0,0,0,0.16)`,
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption || `Ảnh cưới ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                />

                {/* Moving Light Shimmer Sweep on Hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Expand Icon & Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium line-clamp-2 drop-shadow">
                    {photo.caption || `Ảnh cưới ${index + 1}`}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-xs flex items-center justify-center shrink-0">
                    <Expand className="w-4 h-4 text-white" />
                  </span>
                </div>
              </button>
            </ScrollReveal>
          )
        })}
      </div>

      {/* Fullscreen Lightbox Modal with Prev / Next Navigation */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh toàn màn hình"
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between text-white/90 z-10"
          >
            <span className="text-sm font-medium tracking-wider px-3 py-1 rounded-full bg-white/10" style={{ fontFamily: fonts.ui }}>
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Đóng album"
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image + Prev/Next Buttons */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-2 overflow-hidden"
          >
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước"
              className="absolute left-1 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              key={activePhoto.id}
              src={activePhoto.src}
              alt={activePhoto.caption || `Ảnh cưới ${lightboxIndex + 1}`}
              className="max-h-[76vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
            />

            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh tiếp theo"
              className="absolute right-1 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption & Thumbnail Strip */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl flex flex-col items-center gap-3 z-10"
          >
            {activePhoto.caption && (
              <p className="text-white/90 text-sm sm:text-base text-center font-medium">
                {activePhoto.caption}
              </p>
            )}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2">
              {photos.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Chọn ảnh ${idx + 1}`}
                  className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === lightboxIndex
                      ? 'border-white scale-110 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={thumb.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
