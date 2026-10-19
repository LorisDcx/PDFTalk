import { createBrowserClient } from '@supabase/ssr'
import { authFetch } from './auth-request'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { fetch: authFetch } }
  )
}
