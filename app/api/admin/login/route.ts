import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_SECONDS, createAdminSession } from '@/lib/admin-session'

export const runtime = 'nodejs'
export async function POST(request: NextRequest) {
  const expectedPassword = process.env.ADMIN_PASSWORD
  if (!expectedPassword || !process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: 'Máy chủ chưa cấu hình thông tin quản trị.' }, { status: 503 })
  let password = ''
  try { const body = await request.json(); password = typeof body.password === 'string' ? body.password : '' }
  catch { return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 }) }
  const a = Buffer.from(password), b = Buffer.from(expectedPassword)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'Mật khẩu không chính xác.' }, { status: 401 })
  const session = createAdminSession()
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, session.value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: ADMIN_SESSION_SECONDS, expires: new Date(session.expires * 1000) })
  return response
}
