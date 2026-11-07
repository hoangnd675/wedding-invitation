import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('couple') || 'hai-hung-mi-mi'
    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy thiệp cưới.' }, { status: 404 })
    const response = await fetch(`${supabaseRestBase()}/couple_wedding_configs?couple_id=eq.${couple.id}&select=config&limit=1`, {
      headers: supabaseAdminHeaders(), cache: 'no-store',
    })
    if (!response.ok) return NextResponse.json({ error: 'Không tải được cấu hình thiệp.' }, { status: 502 })
    const rows = await response.json()
    return NextResponse.json({ config: rows[0]?.config ?? null }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi máy chủ.' }, { status: 503 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Bạn cần đăng nhập quản trị.' }, { status: 401 })
  try {
    const slug = request.nextUrl.searchParams.get('couple') || 'hai-hung-mi-mi'
    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy thiệp cưới.' }, { status: 404 })
    const body = await request.json()
    if (!body?.config || typeof body.config !== 'object') return NextResponse.json({ error: 'Cấu hình không hợp lệ.' }, { status: 400 })
    const response = await fetch(`${supabaseRestBase()}/couple_wedding_configs?on_conflict=couple_id`, {
      method: 'POST',
      headers: supabaseAdminHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ couple_id: couple.id, config: body.config, updated_at: new Date().toISOString() }),
      cache: 'no-store',
    })
    if (!response.ok) return NextResponse.json({ error: 'Không lưu được cấu hình thiệp.' }, { status: 502 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi máy chủ.' }, { status: 500 })
  }
}
