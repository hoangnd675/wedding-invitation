import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const MIME_BY_EXTENSION: Record<string, string> = {
  mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4',
  aac: 'audio/aac', ogg: 'audio/ogg', webm: 'audio/webm',
}

export async function POST(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.' }, { status: 401 })
  try {
    const form = await request.formData()
    const file = form.get('file')
    const slug = String(form.get('couple') || 'hai-hung-mi-mi')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Không nhận được file nhạc.' }, { status: 400 })
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!MIME_BY_EXTENSION[extension]) return NextResponse.json({ error: 'Chỉ hỗ trợ MP3, WAV, M4A, AAC, OGG hoặc WEBM.' }, { status: 415 })
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'File nhạc phải có dung lượng từ 1 byte đến 15 MB.' }, { status: 413 })
    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy cặp đôi.' }, { status: 404 })
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
    if (!base) throw new Error('Thiếu cấu hình Supabase URL.')
    const path = `${couple.id}/uploads/${Date.now()}-${randomUUID()}.${extension}`
    const upload = await fetch(`${base}/storage/v1/object/wedding-music/${path}`, {
      method: 'POST',
      headers: supabaseAdminHeaders({ 'Content-Type': MIME_BY_EXTENSION[extension], 'x-upsert': 'false' }),
      body: await file.arrayBuffer(), cache: 'no-store',
    })
    if (!upload.ok) {
      console.error('Wedding music upload failed:', upload.status, await upload.text())
      return NextResponse.json({ error: 'Không tải được nhạc lên kho lưu trữ.' }, { status: 502 })
    }
    return NextResponse.json({
      url: `${base}/storage/v1/object/public/wedding-music/${path}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
    })
  } catch (error) {
    console.error('Wedding music upload error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Có lỗi khi xử lý file nhạc.' }, { status: 500 })
  }
}
