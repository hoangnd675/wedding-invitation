'use client'

import { useWeddingStore } from '@/lib/wedding-store'
import { WeddingInvitationView } from '@/components/wedding/wedding-invitation-view'

export default function CoupleInvitationPage() {
  const { data, hydrated, loadError, addRsvp, addWish, addSharedPhoto } = useWeddingStore()
  if (!hydrated) {
    return <main aria-busy="true" className="min-h-screen grid place-items-center" style={{ backgroundColor: '#f8f5f0', color: '#6b6258' }}>
      <div className="text-center px-6"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" /><p className="text-sm tracking-wide">Đang tải thiệp cưới...</p></div>
    </main>
  }
  if (loadError) return <main className="min-h-screen grid place-items-center p-6 text-center text-stone-700"><div><h1 className="text-xl font-semibold">Không tìm thấy thiệp cưới</h1><p className="mt-2 text-sm">{loadError}</p></div></main>
  return <WeddingInvitationView data={data} onAddRsvp={addRsvp} onAddWish={addWish} onAddSharedPhoto={addSharedPhoto} />
}
