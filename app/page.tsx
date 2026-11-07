'use client'

import { useWeddingStore } from '@/lib/wedding-store'
import { WeddingInvitationView } from '@/components/wedding/wedding-invitation-view'

/** Trang thiệp mời dành cho khách xem. */
export default function GuestWeddingPage() {
  const { data, addRsvp, addWish, addSharedPhoto } = useWeddingStore()

  return (
    <WeddingInvitationView
      data={data}
      onAddRsvp={addRsvp}
      onAddWish={addWish}
      onAddSharedPhoto={addSharedPhoto}
    />
  )
}
