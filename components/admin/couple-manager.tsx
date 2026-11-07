'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Couple = { id: string; slug: string; groom_name: string; bride_name: string; status: 'active' | 'archived' }

export function CoupleManager() {
  const search = useSearchParams()
  const selectedSlug = search.get('couple') || 'hai-hung-mi-mi'
  const [couples, setCouples] = useState<Couple[]>([])
  const [groomName, setGroomName] = useState('')
  const [brideName, setBrideName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const refresh = async () => {
    const response = await fetch('/api/couples', { cache: 'no-store' })
    if (response.status === 401) { window.location.replace('/admin-login'); return }
    const result = await response.json()
    if (response.ok) setCouples(result.couples || [])
  }

  useEffect(() => { void refresh() }, [])

  const createCouple = async (event: React.FormEvent) => {
    event.preventDefault()
    setCreating(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/couples', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groomName, brideName, sourceSlug: selectedSlug }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Không tạo được thiệp.')
      setGroomName(''); setBrideName('')
      await refresh()
      setNotice(`Đã tạo thiệp: ${window.location.origin}${result.url}`)
      window.location.assign(`/cau-hinh?couple=${encodeURIComponent(result.couple.slug)}`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Có lỗi xảy ra.') }
    finally { setCreating(false) }
  }

  const toggleArchive = async (couple: Couple) => {
    const status = couple.status === 'archived' ? 'active' : 'archived'
    const response = await fetch('/api/couples', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: couple.slug, status }),
    })
    if (!response.ok) { setError('Không cập nhật được trạng thái thiệp.'); return }
    await refresh()
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-5">
      <div className="rounded-2xl border border-rose-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <div>
          <h2 className="font-bold text-stone-900">Quản lý nhiều cặp đôi</h2>
          <p className="text-sm text-stone-500">Mỗi cặp đôi có cấu hình, RSVP, lời chúc, ảnh và đường link riêng.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm font-medium">
            Đang chỉnh sửa thiệp
            <select value={selectedSlug} onChange={e => window.location.assign(`/cau-hinh?couple=${encodeURIComponent(e.target.value)}`)} className="min-h-10 rounded-lg border border-stone-300 px-3 bg-white min-w-64">
              {couples.map(c => <option key={c.id} value={c.slug}>{c.groom_name} &amp; {c.bride_name}{c.status === 'archived' ? ' (Đã lưu trữ)' : ''}</option>)}
            </select>
          </label>
          <a href={`/thiep/${selectedSlug}`} target="_blank" rel="noreferrer" className="min-h-10 inline-flex items-center rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white">Mở link thiệp</a>
          <button type="button" onClick={() => { void navigator.clipboard.writeText(`${window.location.origin}/thiep/${selectedSlug}`); setNotice('Đã sao chép link thiệp.') }} className="min-h-10 rounded-lg border border-stone-300 px-4 text-sm font-semibold">Sao chép link</button>
          {couples.find(c => c.slug === selectedSlug) && (
            <button type="button" onClick={() => void toggleArchive(couples.find(c => c.slug === selectedSlug)!)} className="min-h-10 rounded-lg border border-stone-300 px-4 text-sm font-semibold">
              {couples.find(c => c.slug === selectedSlug)?.status === 'archived' ? 'Mở lưu trữ' : 'Lưu trữ thiệp'}
            </button>
          )}
        </div>
        <form onSubmit={createCouple} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 border-t border-stone-100 pt-4">
          <label className="grid gap-1 text-sm font-medium">Tên chú rể<input value={groomName} onChange={e => setGroomName(e.target.value)} required maxLength={120} placeholder="Nguyễn Văn A" className="min-h-11 rounded-lg border border-stone-300 px-3" /></label>
          <label className="grid gap-1 text-sm font-medium">Tên cô dâu<input value={brideName} onChange={e => setBrideName(e.target.value)} required maxLength={120} placeholder="Trần Thị B" className="min-h-11 rounded-lg border border-stone-300 px-3" /></label>
          <button disabled={creating} className="self-end min-h-11 rounded-lg bg-rose-800 px-5 font-semibold text-white disabled:opacity-50">{creating ? 'Đang tạo...' : '＋ Tạo thiệp mới'}</button>
        </form>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {notice && <p className="break-all text-sm text-emerald-700">{notice}</p>}
      </div>
    </section>
  )
}
