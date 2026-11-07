import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['mp3', 'wav', 'm4a', 'aac', 'ogg', 'webm'])
const MIME_BY_EXTENSION: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  webm: 'audio/webm',
}

export async function POST(request: NextRequest) {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const secret = process.env.SUPABASE_ADMIN_API_SECRET
  if (!url || !key || !secret) {
    return NextResponse.json({ error: 'Máy chủ chưa cấu hình kho lưu nhạc.' }, { status: 503 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Không nhận được file nhạc.' }, { status: 400 })
    }
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: 'Định dạng chưa hỗ trợ. Hãy chọn MP3, WAV, M4A, AAC, OGG hoặc WEBM.' }, { status: 415 })
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File nhạc phải có dung lượng từ 1 byte đến 15 MB.' }, { status: 413 })
    }

    const contentType = file.type.startsWith('audio/') ? file.type : MIME_BY_EXTENSION[extension]
    const path = `uploads/${Date.now()}-${randomUUID()}.${extension}`
    const upload = await fetch(`${url}/storage/v1/object/wedding-music/${path}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'x-admin-secret': secret,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: await file.arrayBuffer(),
      cache: 'no-store',
    })

    if (!upload.ok) {
      const detail = await upload.text()
      console.error('Wedding music upload failed:', upload.status, detail)
      return NextResponse.json({ error: 'Không tải được nhạc lên kho lưu trữ. Vui lòng thử lại.' }, { status: 502 })
    }

    return NextResponse.json({
      url: `${url}/storage/v1/object/public/wedding-music/${path}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
    })
  } catch (error) {
    console.error('Wedding music upload error:', error)
    return NextResponse.json({ error: 'Có lỗi khi xử lý file nhạc.' }, { status: 500 })
  }
}
