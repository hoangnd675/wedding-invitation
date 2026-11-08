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

export async function DELETE(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id') || ''
  const slug = request.nextUrl.searchParams.get('couple') || 'hai-hung-mi-mi'
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'Mã khách xác nhận không hợp lệ.' }, { status: 400 })
  }

  try {
    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy cặp đôi.' }, { status: 404 })

    const response = await fetch(
      `${supabaseRestBase()}/rsvps?id=eq.${encodeURIComponent(id)}&couple_id=eq.${encodeURIComponent(couple.id)}&select=id`,
      {
        method: 'DELETE',
        headers: supabaseAdminHeaders({ Prefer: 'return=representation' }),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      const detail = await response.text()
      console.error('Supabase RSVP delete failed:', response.status, detail)
      return NextResponse.json({ error: 'Supabase không thể xóa khách xác nhận.' }, { status: 502 })
    }

    const deletedRows = await response.json()
    if (!Array.isArray(deletedRows) || deletedRows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy khách xác nhận hoặc dữ liệu đã được xóa.' }, { status: 404 })
    }

    return NextResponse.json(
      { ok: true, deletedId: deletedRows[0].id },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('RSVP deletion failed:', error)
    return NextResponse.json({ error: 'Không thể xóa khách xác nhận. Vui lòng thử lại.' }, { status: 503 })
  }
}
