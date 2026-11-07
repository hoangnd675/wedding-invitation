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

const STORAGE_KEY = 'thiep_cuoi_config_v1'
const SYNC_EVENT = 'thiep_cuoi_config_updated'

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
    setData(loadWeddingData())
    setHydrated(true)

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
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(SYNC_EVENT, handleCustom)
    }
  }, [])

  const updateData = useCallback(
    (updater: Partial<WeddingInvitationData> | ((prev: WeddingInvitationData) => WeddingInvitationData)) => {
      setData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
        saveWeddingData(next)
        return next
      })
    },
    []
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
    updateData((prev) => ({
      ...prev,
      wishes: [newWish, ...prev.wishes],
    }))
    return newWish
  }, [updateData])

  const addRsvp = useCallback((rsvp: Omit<RsvpSubmission, 'id' | 'createdAt'>) => {
    const newRsvp: RsvpSubmission = {
      ...rsvp,
      id: 'r-' + Date.now(),
      createdAt: 'Vừa xong',
    }
    updateData((prev) => {
      const updatedWishes =
        rsvp.message && rsvp.message.trim().length > 0
          ? [
              {
                id: 'w-rsvp-' + Date.now(),
                name: rsvp.name,
                message: rsvp.message.trim(),
                createdAt: 'Vừa xong',
              },
              ...prev.wishes,
            ]
          : prev.wishes
      return {
        ...prev,
        rsvps: [newRsvp, ...prev.rsvps],
        wishes: updatedWishes,
      }
    })
    return newRsvp
  }, [updateData])

  const addSharedPhoto = useCallback((photo: Omit<SharedGuestPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: SharedGuestPhoto = {
      ...photo,
      id: 'sp-' + Date.now(),
      createdAt: 'Vừa xong',
    }
    updateData((prev) => ({
      ...prev,
      sharedPhotos: [newPhoto, ...prev.sharedPhotos],
    }))
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
