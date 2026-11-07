'use client'

import React, { useState, useEffect } from 'react'
import { useWeddingStore, loadWeddingData } from '@/lib/wedding-store'
import { WeddingInvitationData } from '@/lib/wedding-data'
import { WeddingInvitationView } from '@/components/wedding/wedding-invitation-view'

/**
 * PHẦN KHÁCH XEM (ONLINE GUEST VIEW - `/`)
 * Hiển thị thuần tuý thiệp mời cưới cho khách mời:
 * - Không hiển thị thanh đổi chủ đề, không cho phép chỉnh sửa âm thanh hay nội dung.
 * - Mở đầu bằng màn hình Phong bì (vòng tròn chữ Hỷ 囍, nút "Mở thiệp" không có nốt nhạc).
 * - Khi nhấn "Mở thiệp": phong bì mở ra và mờ dần, thiệp mời hiện dần, nhạc nền từ public/music/
 *   tự động nổi lên êm ái mà không có bất kỳ popup thông báo nhạc nào.
 */
export default function GuestWeddingPage() {
  const { addRsvp, addWish, addSharedPhoto } = useWeddingStore()
  const [data, setData] = useState<WeddingInvitationData>(loadWeddingData())

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<WeddingInvitationData>
      if (custom.detail) {
        setData(custom.detail)
      } else {
        setData(loadWeddingData())
      }
    }

    window.addEventListener('thiep_cuoi_config_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('thiep_cuoi_config_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return (
    <WeddingInvitationView
      data={data}
      onAddRsvp={addRsvp}
      onAddWish={addWish}
      onAddSharedPhoto={addSharedPhoto}
    />
  )
}
