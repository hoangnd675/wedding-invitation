import { NextRequest, NextResponse } from 'next/server'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('couple') || 'hai-hung-mi-mi'
    const couple = await findCoupleBySlug(slug)
    if (!couple) return NextResponse.json({ error: 'Không tìm thấy thiệp cưới.' }, { status: 404 })
    const base = supabaseRestBase()
    const headers = supabaseAdminHeaders()
    const [configResponse, wishesResponse, photosResponse] = await Promise.all([
      fetch(`${base}/couple_wedding_configs?couple_id=eq.${couple.id}&select=config&limit=1`, { headers, cache: 'no-store' }),
      fetch(`${base}/wedding_wishes?couple_id=eq.${couple.id}&select=id,name,message,created_at&order=created_at.desc&limit=100`, { headers, cache: 'no-store' }),
      fetch(`${base}/guest_photos?couple_id=eq.${couple.id}&select=id,guest_name,caption,image_url,created_at&order=created_at.desc&limit=100`, { headers, cache: 'no-store' }),
    ])
    if (!configResponse.ok || !wishesResponse.ok || !photosResponse.ok) {
      return NextResponse.json({ error: 'Không thể tải dữ liệu thiệp.' }, { status: 502 })
    }
    const [configs, wishes, photos] = await Promise.all([
      configResponse.json(), wishesResponse.json(), photosResponse.json(),
    ])
    return NextResponse.json({
      coupleId: couple.id,
      couple: { slug: couple.slug, groomName: couple.groom_name, brideName: couple.bride_name, status: couple.status },
      config: configs[0]?.config ?? null,
      wishes,
      photos,
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    console.error('Wedding data error:', error)
    return NextResponse.json({ error: 'Không thể tải dữ liệu thiệp.' }, { status: 503 })
  }
}
