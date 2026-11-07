'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DEFAULT_WEDDING_DATA,
  WeddingInvitationData,
  WeddingWish,
  RsvpSubmission,
  SharedGuestPhoto,
  ThemeId,
} from './wedding-data'
import { hasSupabaseConfig, supabaseHeaders, supabaseRestUrl, supabaseStorageUrl, supabasePublicStorageUrl } from './supabase-rest'

const STORAGE_KEY = 'thiep_cuoi_config_v1'
const SYNC_EVENT = 'thiep_cuoi_config_updated'
let configSaveTimer: ReturnType<typeof setTimeout> | undefined

async function saveRemoteConfig(data: WeddingInvitationData) {
  const { wishes: _wishes, rsvps: _rsvps, sharedPhotos: _photos, ...config } = data
  const response = await fetch('/api/wedding-config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config }) })
  if (!response.ok) throw new Error('Không thể lưu cấu hình lên máy chủ.')
}

async function insertRemoteRow(table: string, row: Record<string, unknown>) {
  const response = await fetch(supabaseRestUrl(table), { method: 'POST', headers: supabaseHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }), body: JSON.stringify(row) })
  if (!response.ok) throw new Error('Không thể lưu dữ liệu trực tuyến.')
}

async function loadRemoteData(): Promise<Partial<WeddingInvitationData> | null> {
  if (!hasSupabaseConfig()) return null
  const [configRes, wishesRes, photosRes, rsvpRes] = await Promise.all([
    fetch('/api/wedding-config', { cache: 'no-store' }),
    fetch(supabaseRestUrl('wedding_wishes?select=id,name,message,created_at&order=created_at.desc&limit=100'), { headers: supabaseHeaders(), cache: 'no-store' }),
    fetch(supabaseRestUrl('guest_photos?select=id,guest_name,caption,image_url,created_at&order=created_at.desc&limit=100'), { headers: supabaseHeaders(), cache: 'no-store' }),
    fetch('/api/admin/rsvps', { cache: 'no-store' }),
  ])
  if (!configRes.ok) throw new Error('Không thể tải cấu hình thiệp.')
  const config = (await configRes.json())?.config || {}
  const wishes = wishesRes.ok ? await wishesRes.json() : []
  const photos = photosRes.ok ? await photosRes.json() : []
  const rsvps = rsvpRes.ok ? (await rsvpRes.json()).rsvps || [] : []
  const dateText = (value: string) => value ? new Date(value).toLocaleString('vi-VN') : 'Vừa xong'
  return {
    ...config,
    wishes: wishes.map((x: any) => ({ id: x.id, name: x.name, message: x.message, createdAt: dateText(x.created_at) })),
    sharedPhotos: photos.map((x: any) => ({ id: x.id, guestName: x.guest_name, caption: x.caption, src: x.image_url, createdAt: dateText(x.created_at) })),
    rsvps: rsvps.map((x: any) => ({ id: x.id, name: x.full_name, attending: x.attending, guests: x.guests, phone: x.phone || '', side: x.side, message: x.message || '', createdAt: dateText(x.created_at) })),
  }
}

export function loadWeddingData(): WeddingInvitationData {
  if (typeof window === 'undefined') return DEFAULT_WEDDING_DATA
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_WEDDING_DATA
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_WEDDING_DATA,
      ...parsed,
      groomGift: { ...DEFAULT_WEDDING_DATA.groomGift, ...(parsed.groomGift || {}) },
      brideGift: { ...DEFAULT_WEDDING_DATA.brideGift, ...(parsed.brideGift || {}) },
    }
  } catch {
    return DEFAULT_WEDDING_DATA
  }
}

export function saveWeddingData(data: WeddingInvitationData): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: data }))
  } catch (e) {
    console.error('Failed to save wedding config:', e)
  }
}

export function resetWeddingData(): WeddingInvitationData {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: DEFAULT_WEDDING_DATA }))
  }
  return DEFAULT_WEDDING_DATA
}

export function useWeddingStore() {
  const [data, setData] = useState<WeddingInvitationData>(DEFAULT_WEDDING_DATA)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true

    // Không hiển thị theme mặc định trước khi đã tải cấu hình đã lưu trên máy chủ.
    const hydrateStore = async () => {
      const localData = loadWeddingData()
      if (!hasSupabaseConfig()) {
        if (active) {
          setData(localData)
          setHydrated(true)
        }
        return
      }

      try {
        const remote = await loadRemoteData()
        if (!active) return
        const next = remote
          ? { ...localData, ...remote } as WeddingInvitationData
          : localData
        setData(next)
        saveWeddingData(next)
      } catch (error) {
        console.error('Đồng bộ trực tuyến thất bại:', error)
        if (active) setData(localData)
      } finally {
        if (active) setHydrated(true)
      }
    }

    void hydrateStore()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setData(loadWeddingData())
      }
    }

    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent<WeddingInvitationData>
      if (custom.detail) {
        setData(custom.detail)
      } else {
        setData(loadWeddingData())
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(SYNC_EVENT, handleCustom)
    return () => {
      active = false
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(SYNC_EVENT, handleCustom)
    }
  }, [])

  const updateData = useCallback(
    (updater: Partial<WeddingInvitationData> | ((prev: WeddingInvitationData) => WeddingInvitationData), syncRemote = true) => {
      // Resolve the next value outside React's state updater so Strict Mode cannot
      // duplicate persistence side effects or leave a stale debounced write.
      const next = typeof updater === 'function' ? updater(data) : { ...data, ...updater }
      setData(next)
      saveWeddingData(next)
      if (syncRemote) {
        if (configSaveTimer) clearTimeout(configSaveTimer)
        configSaveTimer = setTimeout(() => {
          if (hasSupabaseConfig()) {
            void saveRemoteConfig(next).catch((error) => {
              console.error('Lưu cấu hình trực tuyến thất bại:', error)
              window.dispatchEvent(new CustomEvent('wedding-config-save-error'))
            })
          }
        }, 300)
      }
    },
    [data]
  )

  // Hàm chuyên dụng để cập nhật nhanh riêng themeId từ phần config
  const setThemeId = useCallback(
    (themeId: ThemeId) => {
      updateData((prev) => ({ ...prev, themeId }))
    },
    [updateData]
  )

  const addWish = useCallback((wish: Omit<WeddingWish, 'id' | 'createdAt'>) => {
    const newWish: WeddingWish = {
      ...wish,
      id: 'w-' + Date.now(),
      createdAt: 'Vừa xong',
    }
    updateData((prev) => ({ ...prev, wishes: [newWish, ...prev.wishes] }), false)
    if (hasSupabaseConfig()) insertRemoteRow('wedding_wishes', { name: wish.name.slice(0, 80), message: wish.message.slice(0, 1000) }).catch(console.error)
    return newWish
  }, [updateData])

  const addRsvp = useCallback(async (rsvp: Omit<RsvpSubmission, 'id' | 'createdAt'>) => {
    if (!hasSupabaseConfig()) {
      throw new Error('Thiệp cưới chưa kết nối Supabase. Vui lòng thử lại sau.')
    }

    const safeRsvp = {
      full_name: rsvp.name.trim().slice(0, 120),
      email: '',
      phone: rsvp.phone.trim().slice(0, 40),
      attendance_status: rsvp.attending === 'yes' ? 'attending' : 'not_attending',
      guest_count: rsvp.attending === 'yes' ? rsvp.guests : 0,
      wishes: rsvp.message.trim().slice(0, 1000),
      attending: rsvp.attending,
      guests: rsvp.attending === 'yes' ? rsvp.guests : 0,
      side: rsvp.side,
      message: rsvp.message.trim().slice(0, 1000),
    }

    // Chỉ cập nhật giao diện sau khi Supabase xác nhận đã ghi dữ liệu.
    await insertRemoteRow('rsvps', safeRsvp)

    const newRsvp: RsvpSubmission = {
      ...rsvp,
      id: 'r-' + Date.now(),
      createdAt: new Date().toLocaleString('vi-VN'),
    }

    updateData((prev) => {
      const updatedWishes =
        rsvp.message.trim().length > 0
          ? [{
              id: 'w-rsvp-' + Date.now(),
              name: rsvp.name,
              message: rsvp.message.trim(),
              createdAt: 'Vừa xong',
            }, ...prev.wishes]
          : prev.wishes

      return { ...prev, rsvps: [newRsvp, ...prev.rsvps], wishes: updatedWishes }
    }, false)

    if (rsvp.message.trim()) {
      void insertRemoteRow('wedding_wishes', {
        name: rsvp.name.slice(0, 80),
        message: rsvp.message.trim().slice(0, 1000),
      }).catch((error) => console.error('Không lưu được lời chúc đi kèm RSVP:', error))
    }

    return newRsvp
  }, [updateData])

  const addSharedPhoto = useCallback(async (photo: Omit<SharedGuestPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: SharedGuestPhoto = {
      ...photo,
      id: 'sp-' + Date.now(),
      createdAt: 'Vừa xong',
    }
    if (hasSupabaseConfig() && photo.src.startsWith('data:image/')) {
      const blob = await (await fetch(photo.src)).blob()
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.type) || blob.size > 5 * 1024 * 1024) throw new Error('Ảnh phải là JPG, PNG hoặc WebP và tối đa 5 MB.')
      const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `guest/${Date.now()}-${crypto.randomUUID()}.${ext}`
      const upload = await fetch(supabaseStorageUrl(`guest-photos/${path}`), { method: 'POST', headers: supabaseHeaders({ 'Content-Type': blob.type, 'x-upsert': 'false' }), body: blob })
      if (!upload.ok) throw new Error('Không tải được ảnh lên kho lưu trữ.')
      newPhoto.src = supabasePublicStorageUrl(`guest-photos/${path}`)
      await insertRemoteRow('guest_photos', { guest_name: photo.guestName.slice(0, 80), caption: photo.caption.slice(0, 300), image_url: newPhoto.src })
    }
    updateData((prev) => ({ ...prev, sharedPhotos: [newPhoto, ...prev.sharedPhotos] }), false)
    return newPhoto
  }, [updateData])

  return {
    data,
    hydrated,
    updateData,
    setThemeId,
    addWish,
    addRsvp,
    addSharedPhoto,
    resetData: () => setData(resetWeddingData()),
  }
}
