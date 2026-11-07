import { isAdminSessionValid } from '@/lib/admin-session'
import { ConfigurationLogin } from './configuration-login'
import ConfigurationStudio from './configuration-studio'

export const dynamic = 'force-dynamic'

export default async function ConfigurationPage() {
  const authenticated = await isAdminSessionValid()
  if (!authenticated) return <ConfigurationLogin />
  return <ConfigurationStudio />
}
