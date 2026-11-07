import { NextResponse } from 'next/server'

export function supabaseAdminHeaders(extra: Record<string, string> = {}) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const secret = process.env.SUPABASE_ADMIN_API_SECRET
  if (!key || !secret) throw new Error('Supabase admin credentials are not configured.')
  return { apikey: key, Authorization: `Bearer ${key}`, 'x-admin-secret': secret, ...extra }
}

export function supabaseRestBase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.')
  return url.replace(/\/$/, '') + '/rest/v1'
}

export async function findCoupleBySlug(slug: string) {
  const response = await fetch(`${supabaseRestBase()}/couples?slug=eq.${encodeURIComponent(slug)}&select=id,slug,groom_name,bride_name,status&limit=1`, {
    headers: supabaseAdminHeaders(), cache: 'no-store',
  })
  if (!response.ok) throw new Error('Không thể tải hồ sơ cặp đôi.')
  const rows = await response.json()
  return rows[0] ?? null
}

export function apiError(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Lỗi máy chủ.' },
    { status: 503 },
  )
}
