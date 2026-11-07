'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Couple = { id: string; slug: string; groom_name: string; bride_name: string; status: 'active' | 'archived' }

export function CoupleManager() {
  const [selectedSlug, setSelectedSlug] = useState('hai-hung-mi-mi')
  const [couples, setCouples] = useState<Couple[]>([])
  const [groomName, setGroomName] = useState('')
  const [brideName, setBrideName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [expanded, setExpanded] = useState(true)

  const refresh = async () => {
    const response = await fetch('/api/couples', { cache: 'no-store' })
    if (response.status === 401) { window.location.replace('/config'); return }
    const result = await response.json()
    if (response.ok) setCouples(result.couples || [])
  }

  useEffect(() => {
    setSelectedSlug(new URLSearchParams(window.location.search).get('couple') || 'hai-hung-mi-mi')
    void refresh()
  }, [])

  const createCouple = async (event: FormEvent) => {
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
      window.location.assign(`/config?couple=${encodeURIComponent(result.couple.slug)}`)
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-stone-900">Quản lý thiệp mời</h2>
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="min-h-9 rounded-lg border border-stone-300 px-3 text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-stone-50">
            {expanded ? 'Thu nhỏ' : 'Mở rộng'}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        {expanded && (
        <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm font-medium">
            Đang chỉnh sửa thiệp
            <select value={selectedSlug} onChange={e => { setSelectedSlug(e.target.value); window.location.assign(`/config?couple=${encodeURIComponent(e.target.value)}`) }} className="min-h-10 rounded-lg border border-stone-300 px-3 bg-white min-w-64">
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
        )}
      </div>
    </section>
  )
}
