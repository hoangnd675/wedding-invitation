import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { isAdminSessionValid } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminSessionValid()

  if (!authenticated) {
    redirect('/admin-login')
  }

  return children
}
