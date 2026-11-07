'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DEFAULT_WEDDING_DATA, WeddingInvitationData, WeddingWish,
  RsvpSubmission, SharedGuestPhoto, ThemeId,
} from './wedding-data'
import {
  hasSupabaseConfig, supabaseHeaders, supabaseRestUrl,
  supabaseStorageUrl, supabasePublicStorageUrl,
} from './supabase-rest'

const SYNC_EVENT = 'thiep_cuoi_config_updated'
let configSaveTimer: ReturnType<typeof setTimeout> | undefined

function getCoupleSlug() {
  if (typeof window === 'undefined') return 'hai-hung-mi-mi'
  const pathMatch = window.location.pathname.match(/^\/thiep\/([^/]+)/)
  return pathMatch?.[1] || new URLSearchParams(window.location.search).get('couple') || 'hai-hung-mi-mi'
}
const storageKey = (slug: string) => `thiep_cuoi_config_v1:${slug}`

async function saveRemoteConfig(data: WeddingInvitationData, slug: string) {
  const { wishes: _wishes, rsvps: _rsvps, sharedPhotos: _photos, ...config } = data
  const response = await fetch(`/api/wedding-config?couple=${encodeURIComponent(slug)}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config }),
  })
  if (!response.ok) throw new Error('Không thể lưu cấu hình lên máy chủ.')
}

async function insertRemoteRow(table: string, row: Record<string, unknown>) {
  const response = await fetch(supabaseRestUrl(table), {
    method: 'POST',
    headers: supabaseHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  })
  if (!response.ok) throw new Error('Không thể lưu dữ liệu trực tuyến.')
}

async function loadRemoteData(slug: string) {
  if (!hasSupabaseConfig()) return null
  const [dataResponse, rsvpResponse] = await Promise.all([
    fetch(`/api/wedding-data?couple=${encodeURIComponent(slug)}`, { cache: 'no-store' }),
    fetch(`/api/admin/rsvps?couple=${encodeURIComponent(slug)}`, { cache: 'no-store' }),
  ])
  if (!dataResponse.ok) throw new Error('Không thể tải dữ liệu thiệp.')
  const remote = await dataResponse.json()
  if (remote.error) throw new Error(remote.error)
  const rsvps = rsvpResponse.ok ? (await rsvpResponse.json()).rsvps || [] : []
  const dateText = (value: string) => value ? new Date(value).toLocaleString('vi-VN') : 'Vừa xong'
  return {
    coupleId: remote.coupleId as string,
    data: {
      ...(remote.config || {}),
      wishes: (remote.wishes || []).map((x: any) => ({ id: x.id, name: x.name, message: x.message, createdAt: dateText(x.created_at) })),
      sharedPhotos: (remote.photos || []).map((x: any) => ({ id: x.id, guestName: x.guest_name, caption: x.caption, src: x.image_url, createdAt: dateText(x.created_at) })),
      rsvps: rsvps.map((x: any) => ({ id: x.id, name: x.full_name, attending: x.attending, guests: x.guests, phone: x.phone || '', side: x.side, message: x.message || '', createdAt: dateText(x.created_at) })),
    } as Partial<WeddingInvitationData>,
  }
}

export function loadWeddingData(slug = 'hai-hung-mi-mi'): WeddingInvitationData {
  if (typeof window === 'undefined') return DEFAULT_WEDDING_DATA
  try {
    const raw = window.localStorage.getItem(storageKey(slug))
    if (!raw) return DEFAULT_WEDDING_DATA
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_WEDDING_DATA, ...parsed,
      groomGift: { ...DEFAULT_WEDDING_DATA.groomGift, ...(parsed.groomGift || {}) },
      brideGift: { ...DEFAULT_WEDDING_DATA.brideGift, ...(parsed.brideGift || {}) },
    }
  } catch { return DEFAULT_WEDDING_DATA }
}

export function saveWeddingData(data: WeddingInvitationData, slug = 'hai-hung-mi-mi'): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { data, slug } }))
  } catch (error) { console.error('Failed to save wedding config:', error) }
}

export function resetWeddingData(slug = 'hai-hung-mi-mi'): WeddingInvitationData {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(storageKey(slug))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { data: DEFAULT_WEDDING_DATA, slug } }))
  }
  return DEFAULT_WEDDING_DATA
}

export function useWeddingStore() {
  const [data, setData] = useState<WeddingInvitationData>(DEFAULT_WEDDING_DATA)
  const [hydrated, setHydrated] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [coupleSlug] = useState(getCoupleSlug)

  useEffect(() => {
    let active = true
    const hydrateStore = async () => {
      const localData = loadWeddingData(coupleSlug)
      if (!hasSupabaseConfig()) {
        if (active) { setData(localData); setLoadError(''); setHydrated(true) }
        return
      }
      try {
        const remote = await loadRemoteData(coupleSlug)
        if (!active) return
        if (!remote) throw new Error('Không tải được dữ liệu thiệp.')
        setCoupleId(remote.coupleId)
        setLoadError('')
        const next = { ...localData, ...remote.data } as WeddingInvitationData
        setData(next)
        saveWeddingData(next, coupleSlug)
      } catch (error) {
        console.error('Đồng bộ trực tuyến thất bại:', error)
        if (active) { setData(localData); setLoadError('Không thể tải thiệp này. Vui lòng kiểm tra đường link hoặc thử lại sau.') }
      } finally { if (active) setHydrated(true) }
    }
    void hydrateStore()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey(coupleSlug)) setData(loadWeddingData(coupleSlug))
    }
    const handleCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ data: WeddingInvitationData; slug: string }>).detail
      if (detail?.slug === coupleSlug && detail.data) setData(detail.data)
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener(SYNC_EVENT, handleCustom)
    return () => {
      active = false
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(SYNC_EVENT, handleCustom)
    }
  }, [coupleSlug])

  const updateData = useCallback((
    updater: Partial<WeddingInvitationData> | ((prev: WeddingInvitationData) => WeddingInvitationData),
    syncRemote = true,
  ) => {
    const next = typeof updater === 'function' ? updater(data) : { ...data, ...updater }
    setData(next)
    saveWeddingData(next, coupleSlug)
    if (syncRemote) {
      if (configSaveTimer) clearTimeout(configSaveTimer)
      configSaveTimer = setTimeout(() => {
        if (hasSupabaseConfig()) {
          void saveRemoteConfig(next, coupleSlug).catch(error => {
            console.error('Lưu cấu hình trực tuyến thất bại:', error)
            window.dispatchEvent(new CustomEvent('wedding-config-save-error'))
          })
        }
      }, 300)
    }
  }, [data, coupleSlug])

  const setThemeId = useCallback((themeId: ThemeId) => {
    updateData(prev => ({ ...prev, themeId }))
  }, [updateData])

  const addWish = useCallback((wish: Omit<WeddingWish, 'id' | 'createdAt'>) => {
    const newWish: WeddingWish = { ...wish, id: 'w-' + Date.now(), createdAt: 'Vừa xong' }
    updateData(prev => ({ ...prev, wishes: [newWish, ...prev.wishes] }), false)
    if (hasSupabaseConfig() && coupleId) {
      void insertRemoteRow('wedding_wishes', { couple_id: coupleId, name: wish.name.slice(0, 80), message: wish.message.slice(0, 1000) }).catch(console.error)
    }
    return newWish
  }, [updateData, coupleId])

  const addRsvp = useCallback(async (rsvp: Omit<RsvpSubmission, 'id' | 'createdAt'>) => {
    if (!hasSupabaseConfig()) throw new Error('Thiệp cưới chưa kết nối dữ liệu trực tuyến. Vui lòng thử lại sau.')
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        couple: coupleSlug,
        name: rsvp.name,
        attending: rsvp.attending,
        guests: rsvp.attending === 'yes' ? rsvp.guests : 0,
        phone: rsvp.phone,
        side: rsvp.side,
        message: rsvp.message,
      }),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || 'Không thể lưu xác nhận. Vui lòng thử lại.')
    const saved = result.rsvp
    const newRsvp: RsvpSubmission = {
      ...rsvp,
      id: saved?.id || 'r-' + Date.now(),
      createdAt: saved?.created_at ? new Date(saved.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
    }
    updateData(prev => {
      const updatedWishes = rsvp.message.trim() ? [{
        id: 'w-rsvp-' + Date.now(), name: rsvp.name, message: rsvp.message.trim(), createdAt: 'Vừa xong',
      }, ...prev.wishes] : prev.wishes
      return { ...prev, rsvps: [newRsvp, ...prev.rsvps], wishes: updatedWishes }
    }, false)
    if (rsvp.message.trim()) {
      void insertRemoteRow('wedding_wishes', {
        couple_id: coupleId, name: rsvp.name.slice(0, 80), message: rsvp.message.trim().slice(0, 1000),
      }).catch(error => console.error('Không lưu được lời chúc đi kèm RSVP:', error))
    }
    return newRsvp
  }, [updateData, coupleSlug])

  const addSharedPhoto = useCallback(async (photo: Omit<SharedGuestPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: SharedGuestPhoto = { ...photo, id: 'sp-' + Date.now(), createdAt: 'Vừa xong' }
    if (hasSupabaseConfig() && coupleId && photo.src.startsWith('data:image/')) {
      const blob = await (await fetch(photo.src)).blob()
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.type) || blob.size > 5 * 1024 * 1024) {
        throw new Error('Ảnh phải là JPG, PNG hoặc WebP và tối đa 5 MB.')
      }
      const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `${coupleId}/guest/${Date.now()}-${crypto.randomUUID()}.${ext}`
      const upload = await fetch(supabaseStorageUrl(`guest-photos/${path}`), {
        method: 'POST', headers: supabaseHeaders({ 'Content-Type': blob.type, 'x-upsert': 'false' }), body: blob,
      })
      if (!upload.ok) throw new Error('Không tải được ảnh lên kho lưu trữ.')
      newPhoto.src = supabasePublicStorageUrl(`guest-photos/${path}`)
      await insertRemoteRow('guest_photos', {
        couple_id: coupleId, guest_name: photo.guestName.slice(0, 80),
        caption: photo.caption.slice(0, 300), image_url: newPhoto.src,
      })
    }
    updateData(prev => ({ ...prev, sharedPhotos: [newPhoto, ...prev.sharedPhotos] }), false)
    return newPhoto
  }, [updateData, coupleId])

  return {
    data, hydrated, loadError, updateData, setThemeId, addWish, addRsvp, addSharedPhoto,
    resetData: () => setData(resetWeddingData(coupleSlug)),
  }
}
