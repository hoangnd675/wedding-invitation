import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'wedding_admin_session'
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET chưa được cấu hình')
  return createHmac('sha256', secret).update(value).digest('hex')
}
export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS
  return { value: `${expires}.${sign(String(expires))}`, expires }
}
export async function isAdminSessionValid() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false
  const [expiresText, signature, ...rest] = token.split('.')
  const expires = Number(expiresText)
  if (!expiresText || !signature || rest.length || !Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000)) return false
  const expected = Buffer.from(sign(expiresText)), actual = Buffer.from(signature)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
