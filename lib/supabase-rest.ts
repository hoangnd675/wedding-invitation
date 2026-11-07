const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function hasSupabaseConfig() { return Boolean(URL && KEY) }
export function supabaseRestUrl(path: string) {
  if (!URL) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL')
  return `${URL}/rest/v1/${path}`
}
export function supabaseHeaders(extra: Record<string, string> = {}) {
  if (!KEY) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra }
}
export function supabaseStorageUrl(path: string) {
  if (!URL) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL')
  return `${URL}/storage/v1/object/${path}`
}
export function supabasePublicStorageUrl(path: string) {
  if (!URL) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL')
  return `${URL}/storage/v1/object/public/${path}`
}
