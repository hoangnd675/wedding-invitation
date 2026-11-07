import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'wedding_admin_session'
export const ADMIN_SESSION_SECONDS = 60 * 30

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function createAdminSession() {
  const secret = getSessionSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET chưa được cấu hình')

  const expires = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS
  return {
    value: `${expires}.${sign(String(expires), secret)}`,
    expires,
  }
}

export async function isAdminSessionValid(): Promise<boolean> {
  const secret = getSessionSecret()
  if (!secret) return false

  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false

  const [expiresText, signature, ...rest] = token.split('.')
  const expires = Number(expiresText)

  if (
    !expiresText ||
    !signature ||
    rest.length > 0 ||
    !Number.isSafeInteger(expires) ||
    expires <= Math.floor(Date.now() / 1000)
  ) {
    return false
  }

  const expected = Buffer.from(sign(expiresText, secret))
  const actual = Buffer.from(signature)

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
