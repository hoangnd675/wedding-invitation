'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  getThemeById,
  ParticleEffectType,
  RsvpSubmission,
  SharedGuestPhoto,
  ThemeId,
  WeddingInvitationData,
  WeddingWish,
} from '@/lib/wedding-data'
import { EnvelopeCover } from './envelope-cover'
import { FallingEffects } from './falling-effects'
import { HeroSection } from './hero-section'
import { CoupleStorySection } from './couple-story-section'
import { CeremonyCalendarSection } from './ceremony-calendar-section'
import { AlbumLightboxSection } from './album-lightbox-section'
import { RsvpWishesShareGiftSection } from './rsvp-wishes-share-gift-section'
import { Menu, Volume2, VolumeX, X } from 'lucide-react'

interface WeddingInvitationViewProps {
  data: WeddingInvitationData
  themeOverride?: ThemeId
  particleOverride?: ParticleEffectType
  musicOverride?: string
  initialCoverOpen?: boolean
  onCoverOpenChange?: (open: boolean) => void
  onAddRsvp: (rsvp: Omit<RsvpSubmission, 'id' | 'createdAt'>) => void | Promise<unknown>
  onAddWish: (wish: Omit<WeddingWish, 'id' | 'createdAt'>) => void
  onAddSharedPhoto: (photo: Omit<SharedGuestPhoto, 'id' | 'createdAt'>) => void
}

export function WeddingInvitationView({
  data,
  themeOverride,
  particleOverride,
  musicOverride,
  initialCoverOpen = false,
  onCoverOpenChange,
  onAddRsvp,
  onAddWish,
  onAddSharedPhoto,
}: WeddingInvitationViewProps) {
  const activeThemeId = themeOverride || data.themeId
  const theme = getThemeById(activeThemeId)
  const { colors, fonts } = theme

  const [isOpened, setIsOpened] = useState(initialCoverOpen)
  const [envKey, setEnvKey] = useState(0)
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [singlePreview, setSinglePreview] = useState<{ src: string; caption?: string } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeMusicSrc = musicOverride || data.musicSrc

  // Đồng bộ reset phong bì từ bên ngoài
  useEffect(() => {
    setIsOpened(initialCoverOpen)
    if (!initialCoverOpen) {
      setEnvKey((prev) => prev + 1)
    }
  }, [initialCoverOpen])

  // Khoá cuộn trang khi chưa mở thiệp
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpened])

  // Tải lại nhạc nền khi thay đổi nhạc trong lúc đang demo
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const wasPlaying = !audio.paused
    audio.src = activeMusicSrc
    audio.load()
    if (wasPlaying) {
      audio.play().catch(() => {
        setIsPlayingMusic(false)
      })
    }
  }, [activeMusicSrc])

  // Tự động dừng nhạc khi người dùng ẩn tab hoặc thoát khỏi trang web
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        setIsPlayingMusic(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Phát nhạc từ từ
  const startMusicSilently = () => {
    const audio = audioRef.current
    if (!audio || !data.autoPlayOnOpen) return
    audio.volume = 0.05
    audio
      .play()
      .then(() => {
        setIsPlayingMusic(true)
        let vol = 0.05
        const fadeTimer = setInterval(() => {
          vol = Math.min(0.85, vol + 0.08)
          if (audioRef.current) {
            audioRef.current.volume = vol
          }
          if (vol >= 0.85) clearInterval(fadeTimer)
        }, 90)
      })
      .catch(() => {
        setIsPlayingMusic(false)
      })
  }

  const handleOpenEnvelope = () => {
    setIsOpened(true)
    onCoverOpenChange?.(true)
    startMusicSilently()
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0.85
      audio
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false))
    } else {
      audio.pause()
      setIsPlayingMusic(false)
    }
  }

  const navLinksLeft = [
    { href: '#couple', label: 'Cặp đôi' },
    { href: '#chuyen-tinh-yeu', label: 'Chuyện tình' },
    { href: '#event', label: 'Lễ cưới' },
    { href: '#location', label: 'Địa điểm' },
  ]

  const navLinksRight = [
    { href: '#gallery', label: 'Album' },
    { href: '#rsvp', label: 'Xác nhận' },
    { href: '#loi-chuc', label: 'Lời chúc' },
    { href: '#mung-cuoi', label: 'Mừng cưới' },
  ]

  return (
    <div
      data-theme={activeThemeId}
      className="min-h-screen relative selection:bg-amber-200/50 transition-colors duration-500"
      style={
        {
          '--accent': colors.accent,
          '--accent-ink': colors.accentInk,
          '--accent-2': colors.accent2,
          '--gold': colors.gold,
          '--soft': colors.soft,
          '--ink': colors.ink,
          '--muted': colors.muted,
          '--page': colors.page,
          '--paper': colors.paper,
          '--line': colors.line,
          backgroundColor: colors.page,
          color: colors.ink,
          fontFamily: fonts.body,
        } as React.CSSProperties
      }
    >
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={activeMusicSrc} loop preload="auto" className="hidden" />

      {/* Phong bì */}
      <EnvelopeCover
        key={`envelope-${envKey}`}
        data={data}
        theme={theme}
        isOpen={isOpened}
        onOpen={handleOpenEnvelope}
      />

      {/* Hiệu ứng hạt rơi */}
      {isOpened && (
        <FallingEffects
          theme={theme}
          effectOverride={particleOverride || data.particleEffect}
        />
      )}

      {/* Nút phát nhạc nổi */}
      <div
        className={`fixed right-4 bottom-5 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
          title={isPlayingMusic ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-90"
          style={{
            backgroundColor: colors.accentInk,
            color: theme.isDark ? '#111a3a' : '#ffffff',
            boxShadow: `0 0 0 3px ${colors.paper}, 0 8px 20px rgba(0,0,0,0.25)`,
          }}
        >
          <div className={`flex items-center justify-center w-full h-full rounded-full transition-transform ${isPlayingMusic ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            {isPlayingMusic ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
        </button>
      </div>

      {/* Nội dung thiệp cưới chính */}
      <div
        className={`transition-all duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpened
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.97] translate-y-4 pointer-events-none'
        }`}
      >
        <header
          className="fixed top-0 inset-x-0 z-40 border-b backdrop-blur-md transition-colors duration-300"
          style={{
            backgroundColor: `${colors.navBg}ee`,
            color: colors.navInk,
            borderColor: `${colors.line}66`,
            fontFamily: fonts.ui,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinksLeft.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="opacity-85 hover:opacity-100 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="#top"
              aria-label="Về đầu trang"
              className="w-11 h-11 rounded-full border flex items-center justify-center shrink-0 transition-transform hover:scale-105"
              style={{
                borderColor: colors.navInk,
                color: colors.navInk,
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinksRight.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="opacity-85 hover:opacity-100 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer"
              style={{ borderColor: `${colors.navInk}44`, color: colors.navInk }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav
              className="md:hidden px-4 pt-2 pb-4 border-t grid grid-cols-2 gap-2"
              style={{
                backgroundColor: colors.navBg,
                borderColor: `${colors.navInk}22`,
              }}
            >
              {[...navLinksLeft, ...navLinksRight].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] px-3 rounded-lg flex items-center text-sm font-medium hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        <main>
          <HeroSection
            data={data}
            theme={theme}
            onOpenLightbox={(src, caption) => setSinglePreview({ src, caption })}
          />

          <CoupleStorySection
            data={data}
            theme={theme}
            onOpenLightbox={(src, caption) => setSinglePreview({ src, caption })}
          />

          <CeremonyCalendarSection
            data={data}
            theme={theme}
            onOpenLightbox={(src, caption) => setSinglePreview({ src, caption })}
          />

          <AlbumLightboxSection
            data={data}
            theme={theme}
            lightboxIndex={lightboxIndex}
            setLightboxIndex={setLightboxIndex}
          />

          <RsvpWishesShareGiftSection
            data={data}
            theme={theme}
            onAddRsvp={onAddRsvp}
            onAddWish={onAddWish}
            onAddSharedPhoto={onAddSharedPhoto}
            onOpenLightbox={(src, caption) => setSinglePreview({ src, caption })}
          />
        </main>
      </div>

      {singlePreview && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSinglePreview(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setSinglePreview(null)}
            aria-label="Đóng ảnh"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={singlePreview.src}
            alt={singlePreview.caption || 'Ảnh cưới'}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
          {singlePreview.caption && (
            <p className="mt-3 text-white/90 text-sm sm:text-base font-medium text-center">
              {singlePreview.caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
