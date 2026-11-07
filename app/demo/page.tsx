'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  getThemeById,
  MUSIC_TRACKS,
  ParticleEffectType,
  ThemeId,
  FontPresetId,
  WEDDING_THEMES,
} from '@/lib/wedding-data'
import { useWeddingStore } from '@/lib/wedding-store'
import { WeddingInvitationView } from '@/components/wedding/wedding-invitation-view'
import { FontStylePicker } from '@/components/wedding/font-style-picker'
import {
  Eye,
  MailOpen,
  Music,
  Palette,
  Settings,
  Sparkles,
  Type,
} from 'lucide-react'

const PARTICLE_OPTIONS: { id: ParticleEffectType; label: string }[] = [
  { id: 'auto', label: 'Theo chủ đề' },
  { id: 'songhy', label: 'Chữ Song Hỷ & Tim' },
  { id: 'hearts', label: 'Trái tim hồng' },
  { id: 'petals', label: 'Cánh hoa rơi' },
  { id: 'blossoms', label: 'Hoa Mai & Đào' },
  { id: 'sparkles', label: 'Ánh kim lấp lánh' },
  { id: 'leaves', label: 'Lá thiên nhiên' },
  { id: 'stars', label: 'Sao đêm & Trăng' },
  { id: 'bubbles', label: 'Bọt biển & Sao biển' },
  { id: 'snow', label: 'Tuyết trắng & Tim' },
  { id: 'none', label: 'Tắt hiệu ứng rơi' },
]

// Lấy tên tiếng Việt trong dấu ngoặc
const getVietnameseName = (name: string) => {
  if (name.includes('(')) {
    return name.split('(')[1].split(')')[0].trim()
  }
  return name
}

export default function DemoShowcasePage() {
  const {
    data,
    hydrated,
    addRsvp,
    addWish,
    addSharedPhoto,
  } = useWeddingStore()

  const [demoTheme, setDemoTheme] = useState<ThemeId>(data.themeId)
  const [demoParticle, setDemoParticle] =
    useState<ParticleEffectType>('auto')
  const [demoMusic, setDemoMusic] = useState<string>(data.musicSrc)
  const [demoFontPreset, setDemoFontPreset] = useState<FontPresetId>(data.fontPreset || 'theme')

  const [coverOpen, setCoverOpen] = useState<boolean>(false)
  const [panelExpanded, setPanelExpanded] = useState<boolean>(true)

  const [activeTab, setActiveTab] =
    useState<'themes' | 'effects' | 'music' | 'fonts'>('themes')

  // Quản lý nhạc nghe thử
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  const [previewingMusic, setPreviewingMusic] =
    useState<string | null>(null)

  const currentThemeObj = getThemeById(demoTheme)
  const currentThemeName = getVietnameseName(currentThemeObj.name)

  // Nạp lựa chọn hiện tại sau khi dữ liệu máy chủ sẵn sàng.
  // Các thay đổi sau đó trong demo vẫn chỉ nằm trong state cục bộ.
  useEffect(() => {
    if (!hydrated) return
    setDemoTheme(data.themeId)
    setDemoMusic(data.musicSrc)
    setDemoFontPreset(data.fontPreset || 'theme')
  }, [hydrated, data.themeId, data.musicSrc, data.fontPreset])

  // Dừng bài nhạc đang nghe thử
  const stopMusicPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current.currentTime = 0
      previewAudioRef.current = null
    }

    setPreviewingMusic(null)
  }

  // Chọn bài nhạc và phát ngay lập tức
  const handleSelectMusic = async (src: string) => {
    // Dừng bài cũ
    stopMusicPreview()

    // Cập nhật bài nhạc được chọn
    setDemoMusic(src)

    // Tạo trình phát mới
    const audio = new Audio(src)

    audio.volume = 0.8
    audio.preload = 'auto'

    previewAudioRef.current = audio

    setPreviewingMusic(src)

    // Khi bài nhạc kết thúc
    audio.onended = () => {
      if (previewAudioRef.current === audio) {
        previewAudioRef.current = null
        setPreviewingMusic(null)
      }
    }

    // Khi không tải được nhạc
    audio.onerror = () => {
      if (previewAudioRef.current === audio) {
        previewAudioRef.current = null
        setPreviewingMusic(null)
      }

      console.error('Không thể tải file nhạc:', src)
    }

    // Phát nhạc
    try {
      await audio.play()
    } catch (error) {
      if (previewAudioRef.current === audio) {
        previewAudioRef.current = null
        setPreviewingMusic(null)
      }

      console.error('Không thể phát nhạc:', error)
    }
  }

  // Dọn trình phát khi rời trang
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
        previewAudioRef.current = null
      }
    }
  }, [])

  // Xử lý nút Xem trước / Chỉnh sửa
  const handleToggleView = () => {
    if (panelExpanded) {
      // Dừng nhạc thử
      stopMusicPreview()

      // Chỉ đóng bảng xem thử. Mọi lựa chọn trong trang demo đều là trạng thái tạm thời.
      // Không ghi vào LocalStorage hoặc Supabase.

      // Thu gọn bảng
      setPanelExpanded(false)
    } else {
      // Mở lại bảng chỉnh sửa
      setPanelExpanded(true)
    }
  }

  return (
    <div className="relative min-h-screen">

      <WeddingInvitationView
        data={data}
        themeOverride={demoTheme}
        particleOverride={demoParticle}
        musicOverride={demoMusic}
        fontPresetOverride={demoFontPreset}
        initialCoverOpen={coverOpen}
        onCoverOpenChange={setCoverOpen}
        onAddRsvp={addRsvp}
        onAddWish={addWish}
        onAddSharedPhoto={addSharedPhoto}
      />

      <aside
        aria-label="Bảng dùng thử chủ đề và âm thanh"
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[min(96vw,900px)] z-[60] max-h-[min(82dvh,780px)] overflow-y-auto overscroll-contain rounded-2xl bg-stone-950/95 text-white backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-300"
      >

        {/* Phần Top Bar */}
        <div className="sticky top-0 z-10 bg-stone-950/95 backdrop-blur-xl px-3 py-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10">

          {/* Cố định chiều rộng để tránh nhảy layout khi tên chủ đề thay đổi */}
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-none sm:w-[180px] shrink-0">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/40"
              style={{
                backgroundColor: currentThemeObj.colors.accent,
              }}
            />

            <span className="text-xs sm:text-sm font-semibold truncate">
              <strong className="text-amber-300">
                {currentThemeName}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto sm:flex-1">

            {/* Nút mở thiệp */}
            <button
              type="button"
              onClick={() => setCoverOpen((prev) => !prev)}
              className="flex-1 justify-center min-h-[34px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Xem hoặc đóng màn hình phong bì"
            >
              <MailOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />

              <span className="truncate">
                {coverOpen ? 'Xem phong bì' : 'Mở thiệp'}
              </span>
            </button>

            {/* Nút Xem trước / Chỉnh sửa */}
            <button
              type="button"
              onClick={handleToggleView}
              className="flex-1 justify-center min-h-[34px] px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              {panelExpanded ? (
                <>
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Xem trước</span>
                </>
              ) : (
                <>
                  <Settings className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Chỉnh sửa</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Nội dung bảng */}
        {panelExpanded && (
          <div className="p-3 sm:p-4 space-y-3">

            {/* Các tab */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl overflow-x-auto overscroll-x-contain">

              {/* Tab chủ đề */}
              <button
                type="button"
                onClick={() => setActiveTab('themes')}
                className={`flex-1 min-w-max py-2 px-2.5 sm:px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'themes'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Chủ đề
              </button>

              {/* Tab hiệu ứng */}
              <button
                type="button"
                onClick={() => setActiveTab('effects')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'effects'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hiệu ứng rơi
              </button>

              {/* Tab phông chữ */}
              <button
                type="button"
                onClick={() => setActiveTab('fonts')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'fonts'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                Phông chữ
              </button>

              {/* Tab nhạc */}
              <button
                type="button"
                onClick={() => setActiveTab('music')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'music'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                Nhạc nền
              </button>

            </div>

            {/* TAB CHỦ ĐỀ */}
            {activeTab === 'themes' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2 max-h-[min(34dvh,300px)] overflow-y-auto overscroll-contain pr-1">

                {WEDDING_THEMES.map((t) => {
                  const active = t.id === demoTheme
                  const vnName = getVietnameseName(t.name)

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDemoTheme(t.id)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        active
                          ? 'border-amber-400 bg-white/15 ring-2 ring-amber-400/40'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">

                        <div className="flex items-center -space-x-1">
                          <span
                            className="w-4 h-4 rounded-full border border-white/50"
                            style={{
                              backgroundColor: t.colors.accent,
                            }}
                          />

                          <span
                            className="w-4 h-4 rounded-full border border-white/50"
                            style={{
                              backgroundColor: t.colors.gold,
                            }}
                          />

                          <span
                            className="w-4 h-4 rounded-full border border-white/50"
                            style={{
                              backgroundColor: t.colors.page,
                            }}
                          />
                        </div>

                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                          {t.badge}
                        </span>
                      </div>

                      <p className="text-xs font-bold leading-tight truncate">
                        {vnName}
                      </p>
                    </button>
                  )
                })}

              </div>
            )}

            {/* TAB HIỆU ỨNG */}
            {activeTab === 'effects' && (
              <div className="flex flex-wrap gap-1.5 max-h-[min(30dvh,260px)] overflow-y-auto overscroll-contain">

                {PARTICLE_OPTIONS.map((opt) => {
                  const active = demoParticle === opt.id

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDemoParticle(opt.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                        active
                          ? 'bg-amber-400 text-stone-950 border-amber-300'
                          : 'bg-white/5 text-white/85 border-white/10 hover:bg-white/15'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}

              </div>
            )}

            {/* TAB PHÔNG CHỮ - CHỈ THAY ĐỔI BẢN DEMO */}
            {activeTab === 'fonts' && (
              <div className="max-h-[min(38dvh,340px)] overflow-y-auto overscroll-contain pr-1">
                <FontStylePicker
                  variant="dark"
                  selected={demoFontPreset}
                  fallbackFonts={currentThemeObj.fonts}
                  onChange={setDemoFontPreset}
                />
              </div>
            )}

            {/* TAB NHẠC NỀN */}
            {activeTab === 'music' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[min(32dvh,280px)] overflow-y-auto overscroll-contain">

                {MUSIC_TRACKS.map((track) => {
                  const active = demoMusic === track.src
                  const isPlaying = previewingMusic === track.src

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectMusic(track.src)}
                      aria-pressed={active}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        active
                          ? 'border-amber-400 bg-white/15'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >

                      <div className="min-w-0">

                        <p className="text-xs font-bold truncate">
                          {track.title}
                        </p>

                        <p className="text-[11px] text-white/65 truncate">
                          {track.artist} · {track.mood}
                        </p>

                      </div>

                      {/* Trạng thái phát nhạc */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          isPlaying
                            ? 'bg-emerald-400 text-stone-950'
                            : active
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-white/10 text-white/75'
                        }`}
                      >
                        {isPlaying
                          ? 'Đang phát'
                          : active
                            ? 'Đang chọn'
                            : 'Chạm để phát'}
                      </span>

                    </button>
                  )
                })}

              </div>
            )}

          </div>
        )}

      </aside>
    </div>
  )
}
