import { NextRequest, NextResponse } from 'next/server'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RsvpBody = {
  couple?: unknown
  name?: unknown
  attending?: unknown
  guests?: unknown
  phone?: unknown
  side?: unknown
  message?: unknown
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RsvpBody
    const slug = typeof body.couple === 'string' ? body.couple.trim() : 'hai-hung-mi-mi'
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const attending = body.attending === 'yes' || body.attending === 'no' ? body.attending : null
    const side = body.side === 'groom' || body.side === 'bride' ? body.side : null
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const guestsValue = Number(body.guests)
    const guests = attending === 'yes' && Number.isInteger(guestsValue) ? guestsValue : 0

    if (!slug || slug.length > 100) return NextResponse.json({ error: 'Đường dẫn thiệp không hợp lệ.' }, { status: 400 })
    if (!name || name.length > 120) return NextResponse.json({ error: 'Vui lòng nhập họ tên (tối đa 120 ký tự).' }, { status: 400 })
    if (!attending || !side) return NextResponse.json({ error: 'Thông tin xác nhận không hợp lệ.' }, { status: 400 })
    if (phone.length > 40 || message.length > 1000) return NextResponse.json({ error: 'Số điện thoại hoặc lời nhắn quá dài.' }, { status: 400 })
    if (attending === 'yes' && (guests < 1 || guests > 20)) return NextResponse.json({ error: 'Số người tham dự phải từ 1 đến 20.' }, { status: 400 })

    const couple = await findCoupleBySlug(slug)
    if (!couple || couple.status !== 'active') return NextResponse.json({ error: 'Không tìm thấy thiệp cưới đang hoạt động.' }, { status: 404 })

    const row = {
      couple_id: couple.id,
      full_name: name,
      email: '',
      phone,
      attendance_status: attending === 'yes' ? 'attending' : 'not_attending',
      guest_count: guests,
      wishes: message,
      attending,
      guests,
      side,
      message,
    }
    const response = await fetch(`${supabaseRestBase()}/rsvps`, {
      method: 'POST',
      headers: supabaseAdminHeaders({
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      }),
      body: JSON.stringify(row),
      cache: 'no-store',
    })
    if (!response.ok) {
      const detail = await response.text()
      console.error('Supabase RSVP insert failed:', response.status, detail)
      return NextResponse.json({ error: 'Chưa thể lưu xác nhận. Vui lòng thử lại sau.' }, { status: 502 })
    }
    const rows = await response.json()
    return NextResponse.json({ ok: true, rsvp: rows[0] ?? null }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('RSVP submission failed:', error)
    return NextResponse.json({ error: 'Máy chủ chưa thể xử lý xác nhận. Vui lòng thử lại.' }, { status: 503 })
  }
}
