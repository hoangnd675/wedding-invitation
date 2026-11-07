'use client'

import React, { useState } from 'react'
import {
  BankGiftInfo,
  RsvpSubmission,
  SharedGuestPhoto,
  ThemeConfig,
  WeddingInvitationData,
  WeddingWish,
} from '@/lib/wedding-data'
import { SectionHeader } from './couple-story-section'
import { ScrollReveal } from './scroll-reveal'
import { DoubleHappinessGlyph } from './falling-effects'
import {
  Camera,
  Check,
  Copy,
  Download,
  Heart,
  MessageSquareHeart,
  Send,
  Upload,
} from 'lucide-react'

interface RsvpWishesShareGiftProps {
  data: WeddingInvitationData
  theme: ThemeConfig
  onAddRsvp: (rsvp: Omit<RsvpSubmission, 'id' | 'createdAt'>) => void
  onAddWish: (wish: Omit<WeddingWish, 'id' | 'createdAt'>) => void
  onAddSharedPhoto: (photo: Omit<SharedGuestPhoto, 'id' | 'createdAt'>) => void
  onOpenLightbox?: (src: string, caption?: string) => void
}

function getVietQrUrl(gift: BankGiftInfo) {
  const bank = encodeURIComponent(gift.bankCode || 'VCB')
  const acct = encodeURIComponent(gift.accountNumber.replace(/\s+/g, ''))
  const info = encodeURIComponent(gift.transferNote || 'Mung cuoi')
  const name = encodeURIComponent(gift.accountHolder || '')
  return `https://img.vietqr.io/image/${bank}-${acct}-compact2.png?addInfo=${info}&accountName=${name}`
}

export function RsvpWishesShareGiftSection({
  data,
  theme,
  onAddRsvp,
  onAddWish,
  onAddSharedPhoto,
  onOpenLightbox,
}: RsvpWishesShareGiftProps) {
  const { colors, fonts } = theme

  // 1. RSVP Form State
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpAttend, setRsvpAttend] = useState<'yes' | 'no'>('yes')
  const [rsvpGuests, setRsvpGuests] = useState(1)
  const [rsvpPhone, setRsvpPhone] = useState('')
  const [rsvpSide, setRsvpSide] = useState<'groom' | 'bride'>('groom')
  const [rsvpMessage, setRsvpMessage] = useState('')
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)

  // 2. Wishes Form State
  const [wishName, setWishName] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [wishSubmitted, setWishSubmitted] = useState(false)
  const [showAllWishes, setShowAllWishes] = useState(false)

  // 3. Guest Photo Sharing State
  const [showShareModal, setShowShareModal] = useState(false)
  const [guestPhotoName, setGuestPhotoName] = useState('')
  const [guestPhotoCaption, setGuestPhotoCaption] = useState('')
  const [guestPhotoPreview, setGuestPhotoPreview] = useState<string>('')
  const [shareSuccess, setShareSuccess] = useState(false)

  // 4. Copy Bank Account State
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName.trim()) return
    onAddRsvp({
      name: rsvpName.trim(),
      attending: rsvpAttend,
      guests: rsvpAttend === 'yes' ? Number(rsvpGuests) || 1 : 0,
      phone: rsvpPhone.trim(),
      side: rsvpSide,
      message: rsvpMessage.trim(),
    })
    setRsvpSubmitted(true)
  }

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wishName.trim() || !wishMessage.trim()) return
    onAddWish({
      name: wishName.trim(),
      message: wishMessage.trim(),
    })
    setWishName('')
    setWishMessage('')
    setWishSubmitted(true)
    setTimeout(() => setWishSubmitted(false), 4000)
  }

  const handleGuestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGuestPhotoPreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSharePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestPhotoPreview) return
    onAddSharedPhoto({
      guestName: guestPhotoName.trim() || 'Khách mời thân thiết',
      caption: guestPhotoCaption.trim() || 'Khoảnh khắc đẹp trong ngày vui!',
      src: guestPhotoPreview,
    })
    setGuestPhotoName('')
    setGuestPhotoCaption('')
    setGuestPhotoPreview('')
    setShareSuccess(true)
    setTimeout(() => {
      setShareSuccess(false)
      setShowShareModal(false)
    }, 1500)
  }

  const handleCopyAccount = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num.replace(/\s+/g, ''))
      setCopiedAccount(num)
      setTimeout(() => setCopiedAccount(null), 2500)
    } catch {
      // Fallback
    }
  }

  const visibleWishes = showAllWishes ? data.wishes : data.wishes.slice(0, 6)
  const hiddenWishCount = Math.max(0, data.wishes.length - 6)

  return (
    <>
      {/* 1. RSVP — XÁC NHẬN THAM DỰ */}
      <section
        id="rsvp"
        className="relative py-20 sm:py-24 px-4 overflow-hidden"
        style={{
          backgroundColor: colors.paper,
          color: colors.ink,
        }}
      >
        <SectionHeader
          title="Xác nhận tham dự"
          subtitle="Sự hiện diện của bạn là niềm vinh hạnh"
          theme={theme}
          indexLabel="06"
        />

        <ScrollReveal effect="shimmer-card" className="max-w-xl mx-auto">
          {rsvpSubmitted ? (
            <div
              className="rounded-2xl p-8 text-center border shadow-md"
              style={{
                backgroundColor: colors.page,
                borderColor: colors.line,
              }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: colors.accentInk,
                  color: theme.isDark ? '#111a3a' : '#fff',
                }}
              >
                <Check className="w-7 h-7" />
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: fonts.head, color: colors.ink }}
              >
                Cảm ơn {rsvpName} đã xác nhận!
              </h3>
              <p className="text-sm sm:text-base mb-6" style={{ color: colors.muted }}>
                {rsvpAttend === 'yes'
                  ? 'Vợ chồng mình rất mong được đón tiếp bạn tại buổi tiệc.'
                  : 'Cảm ơn bạn đã gửi lời nhắn. Hẹn gặp bạn vào một dịp gần nhất nhé!'}
              </p>
              <button
                type="button"
                onClick={() => setRsvpSubmitted(false)}
                className="min-h-[44px] px-6 py-2 rounded-full text-sm font-semibold border cursor-pointer"
                style={{
                  borderColor: colors.accent,
                  color: colors.accentInk,
                  fontFamily: fonts.ui,
                }}
              >
                Chỉnh sửa câu trả lời
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleRsvpSubmit}
              className="rounded-2xl p-6 sm:p-9 border shadow-[0_14px_38px_-16px_rgba(0,0,0,0.12)] space-y-5"
              style={{
                backgroundColor: colors.page,
                borderColor: colors.line,
              }}
            >
              <p className="text-center italic text-sm sm:text-base" style={{ color: colors.muted }}>
                Hãy cho chúng mình biết bạn có đến chung vui được không nhé!
              </p>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                  Tên của bạn <span style={{ color: colors.accent }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nhập họ và tên của bạn..."
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-base focus:outline-none"
                  style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.line,
                    color: colors.ink,
                  }}
                />
              </div>

              {/* Attend Yes / No */}
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Xác nhận tham dự">
                <button
                  type="button"
                  onClick={() => setRsvpAttend('yes')}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={
                    rsvpAttend === 'yes'
                      ? {
                          backgroundColor: colors.accentInk,
                          color: theme.isDark ? '#111a3a' : '#fff',
                          borderColor: colors.accentInk,
                        }
                      : {
                          backgroundColor: colors.paper,
                          color: colors.ink,
                          borderColor: colors.line,
                        }
                  }
                >
                  <span>✓ Sẽ tham dự</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpAttend('no')}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={
                    rsvpAttend === 'no'
                      ? {
                          backgroundColor: colors.accentInk,
                          color: theme.isDark ? '#111a3a' : '#fff',
                          borderColor: colors.accentInk,
                        }
                      : {
                          backgroundColor: colors.paper,
                          color: colors.ink,
                          borderColor: colors.line,
                        }
                  }
                >
                  <span>✕ Không thể tham dự</span>
                </button>
              </div>

              {rsvpAttend === 'yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                      Khách của
                    </label>
                    <select
                      value={rsvpSide}
                      onChange={(e) => setRsvpSide(e.target.value as 'groom' | 'bride')}
                      className="w-full min-h-[46px] px-3 py-2.5 rounded-xl border text-base focus:outline-none"
                      style={{
                        backgroundColor: colors.paper,
                        borderColor: colors.line,
                        color: colors.ink,
                      }}
                    >
                      <option value="groom">Nhà trai</option>
                      <option value="bride">Nhà gái</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                      Số người tham dự
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(Number(e.target.value))}
                      className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-base focus:outline-none"
                      style={{
                        backgroundColor: colors.paper,
                        borderColor: colors.line,
                        color: colors.ink,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="Không bắt buộc"
                      className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-base focus:outline-none"
                      style={{
                        backgroundColor: colors.paper,
                        borderColor: colors.line,
                        color: colors.ink,
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                  Lời chúc gửi cô dâu chú rể <small className="font-normal opacity-75">(không bắt buộc)</small>
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Nhắn gửi đôi lời yêu thương đến hai vợ chồng..."
                  className="w-full px-4 py-2.5 rounded-xl border text-base focus:outline-none"
                  style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.line,
                    color: colors.ink,
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[50px] rounded-full text-base font-semibold inline-flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
                style={{
                  backgroundColor: colors.accentInk,
                  color: theme.isDark ? '#111a3a' : '#fff',
                  fontFamily: fonts.ui,
                }}
              >
                <Send className="w-4 h-4" />
                Gửi xác nhận
              </button>
            </form>
          )}
        </ScrollReveal>
      </section>

      {/* 2. LỜI CHÚC (WEDDING WISHES WALL) */}
      <section
        id="loi-chuc"
        className="relative py-20 sm:py-24 px-4 overflow-hidden"
        style={{
          backgroundColor: colors.page,
          color: colors.ink,
        }}
      >
        <SectionHeader
          title="Sổ lưu bút & Lời chúc"
          subtitle="Gửi trao yêu thương"
          theme={theme}
          indexLabel="07"
        />

        <div className="max-w-4xl mx-auto space-y-10">
          {/* Wish Form */}
          <ScrollReveal effect="slide-up" className="max-w-xl mx-auto">
            <form
              onSubmit={handleWishSubmit}
              className="rounded-2xl p-6 sm:p-8 border shadow-sm space-y-4"
              style={{
                backgroundColor: colors.paper,
                borderColor: colors.line,
              }}
            >
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                  Tên của bạn <span style={{ color: colors.accent }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Ví dụ: Anh Tuấn (đồng nghiệp), Cô Lan..."
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-xl border text-base focus:outline-none"
                  style={{
                    backgroundColor: colors.page,
                    borderColor: colors.line,
                    color: colors.ink,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                  Lời chúc của bạn <span style={{ color: colors.accent }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={1000}
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                  className="w-full px-4 py-2.5 rounded-xl border text-base focus:outline-none"
                  style={{
                    backgroundColor: colors.page,
                    borderColor: colors.line,
                    color: colors.ink,
                  }}
                />
              </div>

              {wishSubmitted && (
                <p
                  className="text-sm font-medium flex items-center gap-1.5"
                  style={{ color: colors.accentInk }}
                >
                  <Check className="w-4 h-4" /> Cảm ơn lời chúc tuyệt vời của bạn!
                </p>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-8 py-2.5 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: colors.accentInk,
                  color: theme.isDark ? '#111a3a' : '#fff',
                  fontFamily: fonts.ui,
                }}
              >
                <MessageSquareHeart className="w-4 h-4" />
                Gửi lời chúc
              </button>
            </form>
          </ScrollReveal>

          {/* Wishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {visibleWishes.map((w, idx) => (
              <ScrollReveal
                key={w.id}
                effect={idx % 2 === 0 ? 'fade-in' : 'slide-up'}
                delay={(idx % 4) * 60}
              >
                <blockquote
                  className="h-full rounded-2xl p-5 sm:p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                  style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.line,
                    borderLeft: `4px solid ${colors.accent}`,
                  }}
                >
                  <p className="text-base leading-relaxed italic mb-3" style={{ color: colors.ink }}>
                    &ldquo;{w.message}&rdquo;
                  </p>
                  <footer className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t" style={{ borderColor: `${colors.line}88` }}>
                    <cite className="not-italic font-bold" style={{ color: colors.accentInk, fontFamily: fonts.ui }}>
                      {w.name}
                    </cite>
                    <span style={{ color: colors.muted }}>{w.createdAt}</span>
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>

          {hiddenWishCount > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowAllWishes((prev) => !prev)}
                className="min-h-[44px] px-6 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer"
                style={{
                  borderColor: colors.accent,
                  color: colors.accentInk,
                  fontFamily: fonts.ui,
                }}
              >
                {showAllWishes
                  ? 'Thu gọn lời chúc'
                  : `Xem thêm lời chúc (${hiddenWishCount})`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. CHIA SẺ ẢNH (GUEST PHOTO SHARING) */}
      <section
        id="anh-khach"
        className="relative py-20 sm:py-24 px-4 overflow-hidden text-center"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${colors.soft} 0%, ${colors.paper} 75%)`,
          color: colors.ink,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <ScrollReveal effect="glow-rise">
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                backgroundColor: colors.soft,
                color: colors.accentInk,
                border: `1px solid ${colors.accent}44`,
              }}
            >
              <Camera className="w-6 h-6" />
            </div>
            <h2
              className="text-2xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: fonts.head, color: colors.ink }}
            >
              Bạn có ảnh đẹp của chúng mình?
            </h2>
            <p className="max-w-lg mx-auto text-sm sm:text-base mb-6" style={{ color: colors.muted }}>
              Gửi tặng cô dâu chú rể những khoảnh khắc bạn đã chụp — không cần cài ứng dụng, không cần đăng nhập.
            </p>
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="min-h-[48px] px-8 py-3 rounded-full text-sm sm:text-base font-semibold inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: colors.accentInk,
                color: theme.isDark ? '#111a3a' : '#fff',
                fontFamily: fonts.ui,
              }}
            >
              <Upload className="w-4 h-4" />
              Gửi ảnh ngay
            </button>
          </ScrollReveal>

          {/* Shared Guest Photos Grid */}
          {data.sharedPhotos.length > 0 && (
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              {data.sharedPhotos.map((sp, i) => (
                <ScrollReveal
                  key={sp.id}
                  effect={i % 2 === 0 ? 'zoom-in' : 'blur-clear'}
                  delay={i * 80}
                >
                  <div
                    onClick={() => onOpenLightbox?.(sp.src, `${sp.caption} — Ảnh từ ${sp.guestName}`)}
                    className="group rounded-2xl overflow-hidden border shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                    style={{
                      backgroundColor: colors.paper,
                      borderColor: colors.line,
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={sp.src}
                        alt={sp.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs sm:text-sm font-medium line-clamp-2 mb-1" style={{ color: colors.ink }}>
                        {sp.caption}
                      </p>
                      <p className="text-xs font-semibold" style={{ color: colors.accentInk, fontFamily: fonts.ui }}>
                        📷 {sp.guestName}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Modal Upload Guest Photo */}
        {showShareModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Gửi tặng ảnh cưới"
            onClick={() => setShowShareModal(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 text-left border shadow-2xl space-y-4"
              style={{
                backgroundColor: colors.paper,
                borderColor: colors.line,
                color: colors.ink,
              }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: colors.line }}>
                <h3 className="text-xl font-bold" style={{ fontFamily: fonts.head }}>
                  Chia sẻ khoảnh khắc ngày cưới
                </h3>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="text-sm px-2.5 py-1 rounded-lg border cursor-pointer"
                  style={{ borderColor: colors.line }}
                >
                  Đóng
                </button>
              </div>

              <form onSubmit={handleSharePhotoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ fontFamily: fonts.ui }}>
                    Chọn ảnh từ máy của bạn <span style={{ color: colors.accent }}>*</span>
                  </label>
                  <label
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors"
                    style={{
                      borderColor: colors.accent,
                      backgroundColor: `${colors.soft}66`,
                    }}
                  >
                    {guestPhotoPreview ? (
                      <img
                        src={guestPhotoPreview}
                        alt="Xem trước"
                        className="max-h-44 rounded-lg object-contain mb-2"
                      />
                    ) : (
                      <>
                        <Upload className="w-7 h-7 mb-1.5" style={{ color: colors.accent }} />
                        <span className="text-sm font-medium">Chạm để chọn ảnh từ điện thoại / máy tính</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGuestFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ fontFamily: fonts.ui }}>
                    Tên của bạn
                  </label>
                  <input
                    type="text"
                    value={guestPhotoName}
                    onChange={(e) => setGuestPhotoName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-base"
                    style={{
                      backgroundColor: colors.page,
                      borderColor: colors.line,
                      color: colors.ink,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ fontFamily: fonts.ui }}>
                    Lời nhắn / Chú thích ảnh
                  </label>
                  <input
                    type="text"
                    value={guestPhotoCaption}
                    onChange={(e) => setGuestPhotoCaption(e.target.value)}
                    placeholder="Khoảnh khắc đáng nhớ..."
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-base"
                    style={{
                      backgroundColor: colors.page,
                      borderColor: colors.line,
                      color: colors.ink,
                    }}
                  />
                </div>

                {shareSuccess && (
                  <p className="text-sm font-semibold" style={{ color: colors.accentInk }}>
                    ✓ Đã chia sẻ ảnh thành công!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!guestPhotoPreview}
                  className="w-full min-h-[46px] rounded-full text-sm font-semibold transition-opacity disabled:opacity-45 cursor-pointer"
                  style={{
                    backgroundColor: colors.accentInk,
                    color: theme.isDark ? '#111a3a' : '#fff',
                    fontFamily: fonts.ui,
                  }}
                >
                  Gửi tặng ảnh
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* 4. QUÀ CƯỚI & MÃ QR (HỘP MỪNG CƯỚI) */}
      <section
        id="mung-cuoi"
        className="relative py-20 sm:py-24 px-4 overflow-hidden text-center"
        style={{
          backgroundColor: colors.page,
          color: colors.ink,
        }}
      >
        <SectionHeader
          title="Hộp mừng cưới"
          subtitle="Quà cưới & Mã QR"
          theme={theme}
          indexLabel="08"
        />

        <p className="max-w-xl mx-auto text-sm sm:text-base mb-10" style={{ color: colors.muted }}>
          Sự hiện diện của bạn là món quà lớn nhất đối với gia đình chúng mình. Nếu bạn muốn gửi quà mừng từ xa, bạn có thể quét mã QR bên dưới.
        </p>

        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[data.groomGift, data.brideGift].map((gift, idx) => {
            const qrUrl = getVietQrUrl(gift)
            const isCopied = copiedAccount === gift.accountNumber

            return (
              <ScrollReveal
                key={gift.sideLabel + idx}
                effect={idx === 0 ? 'tilt-rotate' : 'zoom-in'}
                delay={idx * 120}
              >
                <article
                  className="rounded-2xl p-6 sm:p-8 border shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col items-center"
                  style={{
                    backgroundColor: colors.paper,
                    borderColor: colors.line,
                  }}
                >
                  <span
                    className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.16em] mb-4"
                    style={{
                      backgroundColor: colors.soft,
                      color: colors.accentInk,
                      fontFamily: fonts.ui,
                    }}
                  >
                    {gift.sideLabel}
                  </span>

                  {/* QR Code Box */}
                  <div
                    className="w-48 h-48 sm:w-52 sm:h-52 rounded-2xl p-3 border bg-white flex items-center justify-center mb-4 shadow-inner"
                    style={{ borderColor: colors.line }}
                  >
                    <img
                      src={qrUrl}
                      alt={`Mã QR ${gift.bankName} ${gift.accountNumber}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p
                    className="text-base sm:text-lg font-bold tracking-wide"
                    style={{ color: colors.ink, fontFamily: fonts.ui }}
                  >
                    {gift.accountHolder}
                  </p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: colors.muted }}>
                    Ngân hàng: <b style={{ color: colors.ink }}>{gift.bankName}</b>
                  </p>

                  <div
                    className="mt-3 px-4 py-2 rounded-xl border inline-flex items-center gap-2.5"
                    style={{
                      backgroundColor: colors.page,
                      borderColor: colors.line,
                    }}
                  >
                    <span className="font-mono text-sm sm:text-base font-bold tracking-wider">
                      {gift.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(gift.accountNumber)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: colors.accentInk,
                        color: theme.isDark ? '#111a3a' : '#fff',
                        fontFamily: fonts.ui,
                      }}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Đã chép
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Sao chép
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`qr-${gift.sideLabel}.png`}
                    className="mt-4 min-h-[40px] px-5 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors"
                    style={{
                      borderColor: colors.accent,
                      color: colors.accentInk,
                      fontFamily: fonts.ui,
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải mã QR
                  </a>
                </article>
              </ScrollReveal>
            )
          })}
        </div>

        <p className="mt-8 text-xs sm:text-sm" style={{ color: colors.muted }}>
          Mở ứng dụng ngân hàng → Quét mã QR hoặc sao chép số tài khoản.
          <br />
          <span className="inline-flex items-center gap-1 font-medium mt-1" style={{ color: colors.accentInk }}>
            Cảm ơn tấm lòng của bạn <Heart className="w-3.5 h-3.5 fill-current" />
          </span>
        </p>
      </section>

      {/* 5. FOOTER */}
      <footer
        className="py-16 px-4 text-center border-t"
        style={{
          backgroundColor: colors.soft,
          borderColor: colors.line,
          color: colors.ink,
        }}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border"
          style={{
            borderColor: colors.accent,
            color: colors.accent,
            backgroundColor: colors.paper,
          }}
        >
          <DoubleHappinessGlyph className="w-10 h-10" color={colors.accent} />
        </div>
        <p
          className="text-xl sm:text-2xl font-medium max-w-md mx-auto mb-2"
          style={{ fontFamily: fonts.head }}
        >
          {data.footerText}
        </p>
        <p className="text-sm font-medium tracking-wider uppercase" style={{ color: colors.muted, fontFamily: fonts.ui }}>
          {data.groomShortName} &amp; {data.brideShortName} · {data.weddingDateDisplay}
        </p>
        <p className="text-xs mt-2 opacity-75" style={{ color: colors.muted }}>
          Nhạc nền: {data.musicTitle}
        </p>
      </footer>
    </>
  )
}
