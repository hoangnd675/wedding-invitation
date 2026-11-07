import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const slug = request.nextUrl.searchParams.get('couple') || 'hai-hung-mi-mi'
    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy cặp đôi.' }, { status: 404 })
    const response = await fetch(
      `${supabaseRestBase()}/rsvps?couple_id=eq.${couple.id}&select=id,full_name,phone,attending,guests,side,message,created_at&order=created_at.desc&limit=500`,
      { headers: supabaseAdminHeaders(), cache: 'no-store' },
    )
    if (!response.ok) return NextResponse.json({ error: 'Không tải được danh sách RSVP.' }, { status: 502 })
    return NextResponse.json({ rsvps: await response.json() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Không thể tải danh sách RSVP.' }, { status: 503 })
  }
}
