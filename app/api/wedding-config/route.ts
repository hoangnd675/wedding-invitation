import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
function base() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL')
  return url.replace(/\/$/, '')
}
function headers() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return { apikey: key, Authorization: `Bearer ${key}` }
}
export async function GET() {
  try {
    const response = await fetch(`${base()}/rest/v1/wedding_config?id=eq.true&select=config&limit=1`, { headers: headers(), cache: 'no-store' })
    if (!response.ok) return NextResponse.json({ error: 'Không tải được cấu hình thiệp.' }, { status: 502 })
    const rows = await response.json()
    return NextResponse.json({ config: rows?.[0]?.config ?? null }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi máy chủ.' }, { status: 503 }) }
}
export async function PUT(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Bạn cần đăng nhập quản trị.' }, { status: 401 })
  const secret = process.env.SUPABASE_ADMIN_API_SECRET
  if (!secret) return NextResponse.json({ error: 'Máy chủ chưa cấu hình quyền ghi Supabase.' }, { status: 503 })
  try {
    const body = await request.json()
    if (!body?.config || typeof body.config !== 'object') return NextResponse.json({ error: 'Cấu hình không hợp lệ.' }, { status: 400 })
    const response = await fetch(`${base()}/rest/v1/wedding_config?on_conflict=id`, {
      method: 'POST', headers: { ...headers(), 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal', 'x-admin-secret': secret },
      body: JSON.stringify({ id: true, config: body.config, updated_at: new Date().toISOString() }), cache: 'no-store',
    })
    if (!response.ok) return NextResponse.json({ error: 'Không lưu được cấu hình thiệp.', detail: await response.text() }, { status: 502 })
    return NextResponse.json({ ok: true })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi máy chủ.' }, { status: 500 }) }
}
