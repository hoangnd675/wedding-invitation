import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập quản trị.' }, { status: 401 })
  }

  try {
    const slug = request.nextUrl.searchParams.get('couple') || 'hai-hung-mi-mi'
    const photoId = request.nextUrl.searchParams.get('id') || ''
    if (!photoId || photoId.length > 100) {
      return NextResponse.json({ error: 'Ảnh cần xóa không hợp lệ.' }, { status: 400 })
    }

    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy thiệp cưới.' }, { status: 404 })

    const base = supabaseRestBase()
    const headers = supabaseAdminHeaders()
    const lookup = await fetch(
      `${base}/guest_photos?id=eq.${encodeURIComponent(photoId)}&couple_id=eq.${encodeURIComponent(couple.id)}&select=id,image_url&limit=1`,
      { headers, cache: 'no-store' },
    )
    if (!lookup.ok) {
      console.error('Guest photo lookup failed:', lookup.status, await lookup.text())
      return NextResponse.json({ error: 'Không thể tìm ảnh cần xóa.' }, { status: 502 })
    }

    const rows = await lookup.json()
    const photo = rows[0]
    if (!photo) return NextResponse.json({ error: 'Ảnh không tồn tại hoặc đã được xóa.' }, { status: 404 })

    const imageUrl = new URL(photo.image_url)
    const marker = '/storage/v1/object/public/guest-photos/'
    const markerIndex = imageUrl.pathname.indexOf(marker)
    if (markerIndex < 0) {
      return NextResponse.json({ error: 'Không xác định được file ảnh trong kho lưu trữ.' }, { status: 422 })
    }
    const objectPath = decodeURIComponent(imageUrl.pathname.slice(markerIndex + marker.length))
    if (!objectPath.startsWith(`${couple.id}/guest/`) || objectPath.split('/').some(part => !part || part === '.' || part === '..')) {
      return NextResponse.json({ error: 'Đường dẫn ảnh không hợp lệ.' }, { status: 422 })
    }

    const storageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')}/storage/v1/object/guest-photos/${objectPath.split('/').map(encodeURIComponent).join('/')}`,
      { method: 'DELETE', headers, cache: 'no-store' },
    )
    if (!storageResponse.ok && storageResponse.status !== 404) {
      console.error('Guest photo storage delete failed:', storageResponse.status, await storageResponse.text())
      return NextResponse.json({ error: 'Không thể xóa file ảnh khỏi kho lưu trữ.' }, { status: 502 })
    }

    const deleteRow = await fetch(
      `${base}/guest_photos?id=eq.${encodeURIComponent(photoId)}&couple_id=eq.${encodeURIComponent(couple.id)}`,
      { method: 'DELETE', headers: supabaseAdminHeaders({ Prefer: 'return=minimal' }), cache: 'no-store' },
    )
    if (!deleteRow.ok) {
      console.error('Guest photo row delete failed:', deleteRow.status, await deleteRow.text())
      return NextResponse.json({ error: 'Đã xóa file ảnh nhưng chưa xóa được dữ liệu. Vui lòng tải lại và thử lại.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Guest photo delete failed:', error)
    return NextResponse.json({ error: 'Chưa thể xóa ảnh. Vui lòng thử lại.' }, { status: 503 })
  }
}
