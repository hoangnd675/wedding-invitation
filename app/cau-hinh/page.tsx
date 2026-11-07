'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  AlbumPhoto,
  MUSIC_TRACKS,
  ParticleEffectType,
  PhotoScrollEffect,
  StoryMilestone,
  ThemeId,
  VenueEvent,
  WEDDING_THEMES,
} from '@/lib/wedding-data'
import { useWeddingStore } from '@/lib/wedding-store'
import { WeddingInvitationView } from '@/components/wedding/wedding-invitation-view'
import { CoupleManager } from '@/components/admin/couple-manager'
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  Eye,
  Heart,
  Image as ImageIcon,
  MapPin,
  Music,
  Palette,
  Plus,
  QrCode,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'

const SCROLL_EFFECT_OPTIONS: { value: PhotoScrollEffect; label: string }[] = [
  { value: 'fade-in', label: 'Hiện dần (Fade In)' },
  { value: 'slide-up', label: 'Lia từ dưới lên (Slide Up)' },
  { value: 'zoom-in', label: 'Zoom từ từ (Zoom In)' },
  { value: 'blur-clear', label: 'Làm nét từ Blur (Blur → Nét)' },
  { value: 'tilt-rotate', label: 'Xoay nhẹ khung (Tilt Rotate)' },
]

const PARTICLE_EFFECT_OPTIONS: { value: ParticleEffectType; label: string }[] = [
  { value: 'auto', label: 'Tự động theo chủ đề' },
  { value: 'songhy', label: 'Chữ Song Hỷ & Trái tim' },
  { value: 'hearts', label: 'Trái tim lãng mạn' },
  { value: 'petals', label: 'Cánh hoa mềm mại' },
  { value: 'blossoms', label: 'Hoa Mai & Hoa Đào' },
  { value: 'sparkles', label: 'Ánh kim Hoàng Kim' },
  { value: 'leaves', label: 'Lá thiên nhiên' },
  { value: 'stars', label: 'Sao đêm & Trăng khuyết' },
  { value: 'bubbles', label: 'Bọt biển & Sao biển' },
  { value: 'snow', label: 'Tuyết trắng & Tim tối giản' },
  { value: 'none', label: 'Tắt hiệu ứng hạt rơi' },
]

type ConfigTab =
  | 'theme-music'
  | 'couple-date'
  | 'photos-album'
  | 'story-venues'
  | 'gifts-qr'
  | 'rsvp-wishes'

export default function ConfigurationStudioPage() {
  const searchParams = useSearchParams()
  const currentCoupleSlug = searchParams.get('couple') || 'hai-hung-mi-mi'
  const {
    data,
    hydrated,
    updateData,
    setThemeId, // Đã bổ sung hàm setThemeId để đồng bộ chủ đề
    addRsvp,
    addWish,
    addSharedPhoto,
    resetData,
  } = useWeddingStore()

  const [activeTab, setActiveTab] = useState<ConfigTab>('theme-music')
  const [showLivePreview, setShowLivePreview] = useState(false)
  const [previewCoverOpen, setPreviewCoverOpen] = useState(true)
  const [savedNotice, setSavedNotice] = useState(false)
  const [musicUploading, setMusicUploading] = useState(false)
  const [musicUploadError, setMusicUploadError] = useState('')
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [newPhotoCaption, setNewPhotoCaption] = useState('')
  const [newPhotoEffect, setNewPhotoEffect] = useState<PhotoScrollEffect>('fade-in')

  const triggerSavedNotice = () => {
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2000)
  }

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onResult: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result)
        triggerSavedNotice()
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    if (!file) return

    setMusicUploadError('')
    const extension = file.name.split('.').pop()?.toLowerCase()
    const allowed = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'webm']
    if (!extension || !allowed.includes(extension)) {
      setMusicUploadError('Định dạng chưa hỗ trợ. Hãy chọn MP3, WAV, M4A, AAC, OGG hoặc WEBM.')
      input.value = ''
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setMusicUploadError('File nhạc vượt quá 15 MB. Vui lòng chọn file nhẹ hơn.')
      input.value = ''
      return
    }

    setMusicUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('couple', new URLSearchParams(window.location.search).get('couple') || 'hai-hung-mi-mi')
      const response = await fetch('/api/admin/music-upload', { method: 'POST', body: form })
      const result = await response.json()
      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Không thể tải file nhạc lên.')
      }
      updateData({ musicSrc: result.url, musicTitle: result.title || file.name })
      triggerSavedNotice()
    } catch (error) {
      setMusicUploadError(error instanceof Error ? error.message : 'Tải nhạc thất bại. Vui lòng thử lại.')
    } finally {
      setMusicUploading(false)
      input.value = ''
    }
  }

  const handleAddAlbumPhoto = (src: string, caption?: string) => {
    if (!src.trim()) return
    const item: AlbumPhoto = {
      id: 'al-' + Date.now(),
      src: src.trim(),
      caption: caption?.trim() || 'Khoảnh khắc hạnh phúc',
      effect: newPhotoEffect,
    }
    updateData((prev) => ({
      ...prev,
      album: [...prev.album, item],
    }))
    setNewPhotoUrl('')
    setNewPhotoCaption('')
    triggerSavedNotice()
  }

  const moveAlbumPhoto = (index: number, direction: -1 | 1) => {
    updateData((prev) => {
      const next = [...prev.album]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      const temp = next[index]
      next[index] = next[target]
      next[target] = temp
      return { ...prev, album: next }
    })
  }

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'thiep-cuoi-config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen grid place-items-center bg-stone-100 text-stone-600" aria-busy="true">
        <div className="text-center px-6">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <p className="text-sm">Đang tải cấu hình mới nhất từ máy chủ...</p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-800 text-amber-200 flex items-center justify-center shadow-xs shrink-0">
              <Heart className="w-5 h-5 fill-amber-200 text-amber-200" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                Trình Cấu Hình Thiệp Cưới
              </h1>
              <p className="text-xs text-stone-500">
                Tuỳ chỉnh toàn bộ chủ đề, nhạc nền, hình ảnh, tên &amp; ngày cưới
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {savedNotice && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã lưu thay đổi
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowLivePreview((prev) => !prev)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              {showLivePreview ? 'Ẩn khung xem thử' : 'Bật xem thử trực tiếp'}
            </button>

            <Link
              href="/"
              className="min-h-[40px] px-4 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4" />
              Mở Trang Khách Xem
            </Link>
          </div>
        </div>
      </header>

      <CoupleManager />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={showLivePreview ? 'lg:col-span-6 space-y-6' : 'lg:col-span-12 space-y-6'}>
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-2xs">
            {[
              { id: 'theme-music', label: '1. Chủ đề & Nhạc nền', icon: Palette },
              { id: 'couple-date', label: '2. Cô dâu Chú rể & Ngày cưới', icon: Heart },
              { id: 'photos-album', label: '3. Ảnh bìa & Album ảnh', icon: ImageIcon },
              { id: 'story-venues', label: '4. Chuyện tình & Địa điểm', icon: MapPin },
              { id: 'gifts-qr', label: '5. Quà cưới & Mã QR', icon: QrCode },
              { id: 'rsvp-wishes', label: `6. Lời chúc (${data.wishes.length}) & RSVP (${data.rsvps.length})`, icon: Users },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ConfigTab)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-all ${
                    active
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {activeTab === 'theme-music' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
                <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-red-700" />
                  Chọn Chủ đề Thiệp cưới
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mb-4">
                  Mỗi chủ đề tự động đồng bộ bảng màu, phông chữ, biểu tượng chữ Song Hỷ trên phong bì và các vật thể rơi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {WEDDING_THEMES.map((t) => {
                    const active = data.themeId === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setThemeId(t.id) // Sử dụng trực tiếp hàm setThemeId để lưu và cập nhật ngay lập tức
                          triggerSavedNotice()
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          active
                            ? 'border-red-700 bg-red-50/50 ring-2 ring-red-700/20'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center -space-x-1">
                              <span
                                className="w-5 h-5 rounded-full border border-white shadow-2xs"
                                style={{ backgroundColor: t.colors.accent }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-white shadow-2xs"
                                style={{ backgroundColor: t.colors.gold }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                                style={{ backgroundColor: t.colors.page }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                              {t.badge}
                            </span>
                          </div>
                          <p className="font-bold text-sm text-stone-900">{t.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{t.subtitle}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                          <span className="text-stone-500">Hiệu ứng: {t.defaultEffect}</span>
                          {active && <span className="font-bold text-red-700">✓ Đang dùng</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
                <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Hiệu ứng rơi vật thể &amp; biểu tượng theo màu chủ đề
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mb-4">
                  Các biểu tượng rơi sẽ tự động đổi màu khớp với chủ đề đang chọn.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {PARTICLE_EFFECT_OPTIONS.map((opt) => {
                    const active = data.particleEffect === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          updateData({ particleEffect: opt.value })
                          triggerSavedNotice()
                        }}
                        className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-left cursor-pointer transition-all ${
                          active
                            ? 'border-red-700 bg-red-800 text-white'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Music className="w-5 h-5 text-red-700" />
                      Nhạc nền từ thư mục <code className="text-xs bg-stone-100 px-2 py-0.5 rounded">public/music/</code>
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Tự động phát êm ái ngay khi khách nhấn &ldquo;Mở thiệp&rdquo;
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.autoPlayOnOpen}
                      onChange={(e) => {
                        updateData({ autoPlayOnOpen: e.target.checked })
                        triggerSavedNotice()
                      }}
                      className="w-4 h-4 accent-red-800"
                    />
                    Tự phát khi mở phong bì
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MUSIC_TRACKS.map((track) => {
                    const active = data.musicSrc === track.src
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          updateData({
                            musicSrc: track.src,
                            musicTitle: `${track.title} -- ${track.artist}`,
                          })
                          triggerSavedNotice()
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          active
                            ? 'border-red-700 bg-red-50/60 ring-2 ring-red-700/20'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-stone-900 truncate">{track.title}</p>
                          <p className="text-xs text-stone-500 truncate">{track.artist}</p>
                          <p className="text-[11px] text-stone-400 font-mono mt-0.5">{track.src}</p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                            active ? 'bg-red-800 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {active ? 'Đang chọn' : 'Chọn'}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                      Đường dẫn file nhạc (trong public/music/ hoặc URL)
                    </label>
                    <input
                      type="text"
                      value={data.musicSrc}
                      onChange={(e) => updateData({ musicSrc: e.target.value })}
                      placeholder="/music/beautiful-in-white.mp3"
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                      Hoặc tải file nhạc (.mp3 / .wav) từ máy
                    </label>
                    <label className="min-h-[42px] px-4 py-2 rounded-xl border border-dashed border-stone-400 hover:border-red-700 bg-stone-50 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer">
                      <Upload className="w-4 h-4 text-red-700" />
                      <span>{musicUploading ? 'Đang tải nhạc lên...' : 'Chọn file nhạc từ máy tính / điện thoại'}</span>
                      <input
                        type="file"
                        accept=".mp3,.wav,.m4a,.aac,.ogg,.webm,audio/*"
                        onChange={handleAudioUpload}
                        disabled={musicUploading}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-stone-500">Hỗ trợ MP3, WAV, M4A, AAC, OGG, WEBM · tối đa 15 MB. Nhạc được lưu trực tuyến để phát trên thiết bị khác.</p>
                    {musicUploading && <p role="status" className="mt-2 text-xs font-medium text-amber-700">Đang tải file lên kho nhạc...</p>}
                    {musicUploadError && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{musicUploadError}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'couple-date' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-700" />
                Thông tin Cô dâu, Chú rể &amp; Ngày giờ cưới
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Tên ngắn Chú rể (Hiển thị trên Phong bì &amp; Bìa)
                  </label>
                  <input
                    type="text"
                    value={data.groomShortName}
                    onChange={(e) => updateData({ groomShortName: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Tên ngắn Cô dâu (Hiển thị trên Phong bì &amp; Bìa)
                  </label>
                  <input
                    type="text"
                    value={data.brideShortName}
                    onChange={(e) => updateData({ brideShortName: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Họ và tên đầy đủ Chú rể
                  </label>
                  <input
                    type="text"
                    value={data.groomFullName}
                    onChange={(e) => updateData({ groomFullName: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Họ và tên đầy đủ Cô dâu
                  </label>
                  <input
                    type="text"
                    value={data.brideFullName}
                    onChange={(e) => updateData({ brideFullName: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Thông tin gia đình Nhà trai
                  </label>
                  <input
                    type="text"
                    value={data.groomFamilyInfo}
                    onChange={(e) => updateData({ groomFamilyInfo: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Thông tin gia đình Nhà gái
                  </label>
                  <input
                    type="text"
                    value={data.brideFamilyInfo}
                    onChange={(e) => updateData({ brideFamilyInfo: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Ngày cưới (Tự cập nhật Lịch &amp; Đếm ngược)
                  </label>
                  <input
                    type="date"
                    value={data.weddingDate}
                    onChange={(e) => {
                      const val = e.target.value
                      const [y, m, d] = val.split('-')
                      updateData({
                        weddingDate: val,
                        weddingDateDisplay: d && m && y ? `${d}.${m}.${y}` : data.weddingDateDisplay,
                      })
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Giờ làm lễ
                  </label>
                  <input
                    type="time"
                    value={data.weddingTime}
                    onChange={(e) => updateData({ weddingTime: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Chuỗi ngày hiển thị (VD: 20.12.2026)
                  </label>
                  <input
                    type="text"
                    value={data.weddingDateDisplay}
                    onChange={(e) => updateData({ weddingDateDisplay: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Ngày Âm lịch
                  </label>
                  <input
                    type="text"
                    value={data.lunarDateText}
                    onChange={(e) => updateData({ lunarDateText: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Tiêu đề phụ trên trang bìa
                  </label>
                  <input
                    type="text"
                    value={data.heroEyebrow}
                    onChange={(e) => updateData({ heroEyebrow: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                    Câu trích dẫn tình yêu (Parallax Banner)
                  </label>
                  <input
                    type="text"
                    value={data.quoteText}
                    onChange={(e) => updateData({ quoteText: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos-album' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-700" />
                  Ảnh chính trong thiệp (Ảnh bìa, Chú rể, Cô dâu, Lễ cưới, Trích dẫn)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'heroMainPhoto', label: 'Ảnh bìa chính (Hero)' },
                    { key: 'groomPhoto', label: 'Ảnh chân dung Chú rể' },
                    { key: 'bridePhoto', label: 'Ảnh chân dung Cô dâu' },
                    { key: 'ceremonyPhoto', label: 'Ảnh mục Lễ thành hôn' },
                    { key: 'quotePhoto', label: 'Ảnh nền Trích dẫn' },
                    { key: 'heroLeftPhoto', label: 'Ảnh phụ trái (Serenity/Summer)' },
                  ].map((item) => {
                    const currentVal = data[item.key as keyof typeof data] as string
                    return (
                      <div
                        key={item.key}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2.5"
                      >
                        <p className="text-xs font-bold uppercase text-stone-700">{item.label}</p>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200 border border-stone-300">
                          <img src={currentVal} alt={item.label} className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) =>
                            updateData({ [item.key]: e.target.value } as Record<string, string>)
                          }
                          placeholder="/photos/..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                        />
                        <label className="w-full py-1.5 px-3 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-red-700" />
                          <span>Tải ảnh mới lên</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, (url) =>
                                updateData({ [item.key]: url } as Record<string, string>)
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold">
                      Quản lý Album ảnh cưới ({data.album.length} ảnh)
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Thêm/bớt ảnh, đổi thứ tự vị trí ảnh, và chọn hiệu ứng chuyển động lặp lại khi khách cuộn tới từng ảnh.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      URL ảnh hoặc tải ảnh từ máy
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="https://... hoặc /photos/..."
                        className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                      <label className="px-3 min-h-[40px] rounded-lg bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center cursor-pointer shrink-0">
                        <Upload className="w-4 h-4 text-red-700" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, (dataUrl) => handleAddAlbumPhoto(dataUrl, newPhotoCaption))
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Chú thích ảnh
                    </label>
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="Khoảnh khắc bên nhau..."
                      className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Hiệu ứng khi cuộn tới
                    </label>
                    <select
                      value={newPhotoEffect}
                      onChange={(e) => setNewPhotoEffect(e.target.value as PhotoScrollEffect)}
                      className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    >
                      {SCROLL_EFFECT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => handleAddAlbumPhoto(newPhotoUrl, newPhotoCaption)}
                      className="w-full min-h-[40px] rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Thêm ảnh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.album.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="p-3 rounded-xl border border-stone-200 bg-white flex flex-col gap-2.5 shadow-2xs"
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100">
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/65 text-white text-[11px] font-bold">
                          #{idx + 1}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => {
                          const val = e.target.value
                          updateData((prev) => ({
                            ...prev,
                            album: prev.album.map((p, i) =>
                              i === idx ? { ...p, caption: val } : p
                            ),
                          }))
                        }}
                        placeholder="Chú thích ảnh..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />

                      <select
                        value={photo.effect}
                        onChange={(e) => {
                          const val = e.target.value as PhotoScrollEffect
                          updateData((prev) => ({
                            ...prev,
                            album: prev.album.map((p, i) =>
                              i === idx ? { ...p, effect: val } : p
                            ),
                          }))
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                      >
                        {SCROLL_EFFECT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between gap-1 pt-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveAlbumPhoto(idx, -1)}
                            title="Đưa lên trước"
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === data.album.length - 1}
                            onClick={() => moveAlbumPhoto(idx, 1)}
                            title="Đưa xuống sau"
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateData((prev) => ({
                              ...prev,
                              album: prev.album.filter((_, i) => i !== idx),
                            }))
                          }
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'story-venues' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Chuyện tình yêu ({data.stories.length} cột mốc)</h2>
                  <button
                    type="button"
                    onClick={() => {
                      const newMilestone: StoryMilestone = {
                        id: 'st-' + Date.now(),
                        year: '2026',
                        title: 'Cột mốc mới',
                        description: 'Mô tả kỷ niệm đáng nhớ của hai bạn...',
                      }
                      updateData((prev) => ({
                        ...prev,
                        stories: [...prev.stories, newMilestone],
                      }))
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-800 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm cột mốc
                  </button>
                </div>

                <div className="space-y-3">
                  {data.stories.map((st, idx) => (
                    <div
                      key={st.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-start"
                    >
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                          Năm / Thời gian
                        </label>
                        <input
                          type="text"
                          value={st.year}
                          onChange={(e) => {
                            const val = e.target.value
                            updateData((prev) => ({
                              ...prev,
                              stories: prev.stories.map((item, i) =>
                                i === idx ? { ...item, year: val } : item
                              ),
                            }))
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const val = e.target.value
                            updateData((prev) => ({
                              ...prev,
                              stories: prev.stories.map((item, i) =>
                                i === idx ? { ...item, title: val } : item
                              ),
                            }))
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                          Nội dung
                        </label>
                        <textarea
                          rows={2}
                          value={st.description}
                          onChange={(e) => {
                            const val = e.target.value
                            updateData((prev) => ({
                              ...prev,
                              stories: prev.stories.map((item, i) =>
                                i === idx ? { ...item, description: val } : item
                              ),
                            }))
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div className="sm:col-span-1 pt-5 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            updateData((prev) => ({
                              ...prev,
                              stories: prev.stories.filter((_, i) => i !== idx),
                            }))
                          }
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Địa điểm &amp; Bản đồ ({data.venues.length} sự kiện)</h2>
                  <button
                    type="button"
                    onClick={() => {
                      const newVenue: VenueEvent = {
                        id: 'ev-' + Date.now(),
                        title: 'Tiệc báo hỷ',
                        place: 'Trung tâm Hội nghị',
                        address: 'TP. Hồ Chí Minh',
                        timeText: '18 giờ, Chủ nhật 20/12/2026',
                        mapQuery: 'TP. Hồ Chí Minh',
                        icsStart: '20261220T110000Z',
                        icsEnd: '20261220T150000Z',
                      }
                      updateData((prev) => ({
                        ...prev,
                        venues: [...prev.venues, newVenue],
                      }))
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-800 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm địa điểm
                  </button>
                </div>

                <div className="space-y-4">
                  {data.venues.map((ev, idx) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Tên sự kiện (VD: Lễ vu quy / Tiệc cưới)
                        </label>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => {
                            const val = e.target.value
                            updateData((prev) => ({
                              ...prev,
                              venues: prev.venues.map((v, i) =>
                                i === idx ? { ...v, title: val } : v
                              ),
                            }))
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Tên địa điểm / Nhà hàng
                        </label>
                        <input
                          type="text"
                          value={ev.place}
                          onChange={(e) => {
                            const val = e.target.value
                            updateData((prev) => ({
                              ...prev,
                              venues: prev.venues.map((v, i) =>
                                i === idx ? { ...v, place: val } : v
                              ),
                            }))
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Địa chỉ chi tiết (Tự động định vị Google Maps)
                        </label>
                        <input
                          type="text"
                          value={ev.address}
                          onChange={(e) => {
                            const val = e.target.value
                            updateData((prev) => ({
                              ...prev,
                              venues: prev.venues.map((v, i) =>
                                i === idx ? { ...v, address: val, mapQuery: val } : v
                              ),
                            }))
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-stone-600 mb-1">
                            Thời gian hiển thị
                          </label>
                          <input
                            type="text"
                            value={ev.timeText}
                            onChange={(e) => {
                              const val = e.target.value
                              updateData((prev) => ({
                                ...prev,
                                venues: prev.venues.map((v, i) =>
                                  i === idx ? { ...v, timeText: val } : v
                                ),
                              }))
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateData((prev) => ({
                              ...prev,
                              venues: prev.venues.filter((_, i) => i !== idx),
                            }))
                          }
                          className="px-3 py-2 rounded-lg bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gifts-qr' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-red-700" />
                Cấu hình Hộp mừng cưới &amp; Mã QR Ngân hàng (VietQR tự động)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'groomGift' as const, heading: 'Tài khoản Nhà trai' },
                  { key: 'brideGift' as const, heading: 'Tài khoản Nhà gái' },
                ].map(({ key, heading }) => {
                  const gift = data[key]
                  return (
                    <div
                      key={key}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3"
                    >
                      <h3 className="font-bold text-base text-red-800">{heading}</h3>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Nhãn hiển thị
                        </label>
                        <input
                          type="text"
                          value={gift.sideLabel}
                          onChange={(e) =>
                            updateData({
                              [key]: { ...gift, sideLabel: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1">
                            Tên ngân hàng
                          </label>
                          <input
                            type="text"
                            value={gift.bankName}
                            onChange={(e) =>
                              updateData({
                                [key]: { ...gift, bankName: e.target.value },
                              })
                            }
                            placeholder="Vietcombank"
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1">
                            Mã VietQR (VCB, TCB, MB, ACB...)
                          </label>
                          <input
                            type="text"
                            value={gift.bankCode}
                            onChange={(e) =>
                              updateData({
                                [key]: { ...gift, bankCode: e.target.value.toUpperCase() },
                              })
                            }
                            placeholder="VCB"
                            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Số tài khoản
                        </label>
                        <input
                          type="text"
                          value={gift.accountNumber}
                          onChange={(e) =>
                            updateData({
                              [key]: { ...gift, accountNumber: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Chủ tài khoản (Không dấu)
                        </label>
                        <input
                          type="text"
                          value={gift.accountHolder}
                          onChange={(e) =>
                            updateData({
                              [key]: { ...gift, accountHolder: e.target.value.toUpperCase() },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">
                          Nội dung chuyển khoản gợi ý
                        </label>
                        <input
                          type="text"
                          value={gift.transferNote}
                          onChange={(e) =>
                            updateData({
                              [key]: { ...gift, transferNote: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'rsvp-wishes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Sao lưu cấu hình &amp; Khôi phục mặc định</h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Xuất file JSON cấu hình hoặc đặt lại dữ liệu mẫu ban đầu.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Xuất file JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetData()
                      triggerSavedNotice()
                    }}
                    className="min-h-[42px] px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-base font-bold">
                  Danh sách khách xác nhận tham dự ({data.rsvps.length})
                </h3>
                <div className="divide-y divide-stone-200">
                  {data.rsvps.map((r) => (
                    <div key={r.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                      <div>
                        <p className="font-bold text-stone-900">
                          {r.name}{' '}
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                              r.attending === 'yes'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {r.attending === 'yes' ? `Tham dự (${r.guests} người)` : 'Không tham dự'}
                          </span>
                        </p>
                        <p className="text-xs text-stone-500">
                          Khách {r.side === 'groom' ? 'Nhà trai' : 'Nhà gái'} · SĐT: {r.phone || '--'} · {r.message}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            rsvps: prev.rsvps.filter((item) => item.id !== r.id),
                          }))
                        }
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-base font-bold">Danh sách lời chúc ({data.wishes.length})</h3>
                <div className="divide-y divide-stone-200 max-h-[360px] overflow-y-auto">
                  {data.wishes.map((w) => (
                    <div key={w.id} className="py-3 flex items-start justify-between gap-4 text-sm">
                      <div>
                        <p className="font-bold text-stone-900">
                          {w.name} <span className="font-normal text-xs text-stone-400">({w.createdAt})</span>
                        </p>
                        <p className="text-stone-600">{w.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            wishes: prev.wishes.filter((item) => item.id !== w.id),
                          }))
                        }
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {showLivePreview && (
          <div className="lg:col-span-6">
            <div className="sticky top-20 rounded-2xl border-4 border-stone-800 bg-stone-900 shadow-2xl overflow-hidden">
              <div className="bg-stone-800 text-white px-4 py-2 flex items-center justify-between text-xs">
                <span className="font-semibold">Xem trước trực tiếp</span>
                <button
                  type="button"
                  onClick={() => setPreviewCoverOpen((prev) => !prev)}
                  className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 font-medium cursor-pointer"
                >
                  {previewCoverOpen ? 'Xem màn hình Phong bì' : 'Mở vào Thiệp chính'}
                </button>
              </div>
              <div className="h-[78vh] overflow-y-auto bg-white relative">
                <WeddingInvitationView
                  data={data}
                  initialCoverOpen={previewCoverOpen}
                  onCoverOpenChange={setPreviewCoverOpen}
                  onAddRsvp={addRsvp}
                  onAddWish={addWish}
                  onAddSharedPhoto={addSharedPhoto}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
