import { NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, secret = process.env.SUPABASE_ADMIN_API_SECRET
  if (!url || !key || !secret) return NextResponse.json({ error: 'Supabase chưa được cấu hình đầy đủ.' }, { status: 503 })
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rsvps?select=id,full_name,phone,attending,guests,side,message,created_at&order=created_at.desc&limit=500`, { headers: { apikey: key, Authorization: `Bearer ${key}`, 'x-admin-secret': secret }, cache: 'no-store' })
  if (!response.ok) return NextResponse.json({ error: 'Không tải được danh sách RSVP.' }, { status: 502 })
  return NextResponse.json({ rsvps: await response.json() }, { headers: { 'Cache-Control': 'no-store' } })
}
