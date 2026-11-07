'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let active = true
    fetch('/api/admin/session', { cache: 'no-store' }).then((r) => r.json()).then((v) => {
      if (!active) return
      if (!v.authenticated) router.replace('/admin-login')
      else setReady(true)
    }).catch(() => router.replace('/admin-login'))
    return () => { active = false }
  }, [router])
  if (!ready) return <div className="min-h-screen grid place-items-center bg-stone-100 text-stone-600">Đang kiểm tra quyền quản trị...</div>
  return <>{children}</>
}
