import { NextRequest, NextResponse } from 'next/server'
import { isAdminSessionValid } from '@/lib/admin-session'
import { findCoupleBySlug, supabaseAdminHeaders, supabaseRestBase } from '@/lib/couple-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function makeSlug(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
}

export async function GET() {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const response = await fetch(`${supabaseRestBase()}/couples?select=id,slug,groom_name,bride_name,status,created_at&order=created_at.desc`, {
      headers: supabaseAdminHeaders(), cache: 'no-store',
    })
    if (!response.ok) return NextResponse.json({ error: 'Không tải được danh sách cặp đôi.' }, { status: 502 })
    return NextResponse.json({ couples: await response.json() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Không thể kết nối cơ sở dữ liệu.' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const groomName = String(body.groomName || '').trim().slice(0, 120)
    const brideName = String(body.brideName || '').trim().slice(0, 120)
    if (!groomName || !brideName) return NextResponse.json({ error: 'Vui lòng nhập đầy đủ tên cô dâu và chú rể.' }, { status: 400 })

    const sourceSlug = String(body.sourceSlug || 'hai-hung-mi-mi')
    const source = await findCoupleBySlug(sourceSlug)
    if (!source) return NextResponse.json({ error: 'Không tìm thấy thiệp mẫu để sao chép.' }, { status: 404 })
    const base = supabaseRestBase()
    const headers = supabaseAdminHeaders({ 'Content-Type': 'application/json', Prefer: 'return=representation' })
    const configResponse = await fetch(`${base}/couple_wedding_configs?couple_id=eq.${source.id}&select=config&limit=1`, { headers: supabaseAdminHeaders(), cache: 'no-store' })
    if (!configResponse.ok) throw new Error('Không đọc được cấu hình thiệp mẫu.')
    const sourceConfigs = await configResponse.json()
    const config = { ...(sourceConfigs[0]?.config || {}) }
    const groomShortName = groomName.split(/\s+/).slice(-2).join(' ')
    const brideShortName = brideName.split(/\s+/).slice(-2).join(' ')
    // Giữ lại chủ đề đã chọn, nhưng tuyệt đối không sao chép dữ liệu riêng của đám cưới trước.
    Object.assign(config, {
      groomFullName: groomName, brideFullName: brideName,
      groomShortName, brideShortName,
      groomFamilyInfo: '', brideFamilyInfo: '',
      weddingDate: '', weddingTime: '', weddingDateDisplay: '', lunarDateText: '',
      heroMainPhoto: '', heroLeftPhoto: '', heroRightPhoto: '',
      groomPhoto: '', bridePhoto: '', ceremonyPhoto: '', quotePhoto: '',
      quoteText: '', stories: [], venues: [], album: [],
      musicSrc: '/music/beautiful-in-white.mp3',
      musicTitle: 'Beautiful In White',
      wishes: [], rsvps: [], sharedPhotos: [],
      groomGift: {
        sideLabel: 'Nhà trai', accountHolder: '', bankName: '',
        bankCode: '', accountNumber: '', transferNote: '',
      },
      brideGift: {
        sideLabel: 'Nhà gái', accountHolder: '', bankName: '',
        bankCode: '', accountNumber: '', transferNote: '',
      },
    })

    const root = makeSlug(`${groomShortName}-${brideShortName}`) || 'cap-doi-moi'
    let slug = root
    let suffix = 2
    while (await findCoupleBySlug(slug)) { slug = `${root}-${suffix++}` }

    const coupleResponse = await fetch(`${base}/couples`, {
      method: 'POST', headers, body: JSON.stringify({ slug, groom_name: groomName, bride_name: brideName, status: 'active' }),
    })
    if (!coupleResponse.ok) throw new Error('Không tạo được hồ sơ cặp đôi.')
    const [created] = await coupleResponse.json()
    const saveConfig = await fetch(`${base}/couple_wedding_configs`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ couple_id: created.id, config }),
    })
    if (!saveConfig.ok) {
      await fetch(`${base}/couples?id=eq.${created.id}`, { method: 'DELETE', headers: supabaseAdminHeaders() })
      throw new Error('Đã tạo hồ sơ nhưng không lưu được cấu hình thiệp.')
    }
    return NextResponse.json({ couple: created, url: `/thiep/${slug}` }, { status: 201 })
  } catch (error) {
    console.error('Create couple failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Không tạo được thiệp mới.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const slug = String(body.slug || '')
    const status = body.status === 'archived' ? 'archived' : 'active'
    const response = await fetch(`${supabaseRestBase()}/couples?slug=eq.${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: supabaseAdminHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    })
    if (!response.ok) throw new Error('Không cập nhật được trạng thái thiệp.')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi máy chủ.' }, { status: 500 })
  }
}
