'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Đăng nhập thất bại.')
      router.replace('/cau-hinh')
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể đăng nhập.') }
    finally { setLoading(false) }
  }
  return <main className="min-h-screen grid place-items-center bg-stone-100 px-4 py-10"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 sm:p-9 shadow-xl space-y-5"><div className="text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-800 text-amber-100 text-2xl">♥</div><h1 className="text-2xl font-bold text-stone-900">Quản trị thiệp cưới</h1><p className="mt-2 text-sm text-stone-500">Đăng nhập để chỉnh sửa nội dung thiệp.</p></div><label className="block space-y-2 text-sm font-semibold text-stone-700">Mật khẩu quản trị<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full min-h-12 rounded-xl border border-stone-300 px-4 text-base font-normal outline-none focus:border-red-700" required /></label>{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button disabled={loading || !password} className="w-full min-h-12 rounded-xl bg-red-800 px-4 font-semibold text-white disabled:opacity-50">{loading ? 'Đang xác thực...' : 'Đăng nhập'}</button><Link href="/" className="block text-center text-sm text-stone-500 underline">Quay lại thiệp mời</Link></form></main>
}
