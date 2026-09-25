import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const destination = new URL('/reset-password', request.url)

  if (!code) {
    destination.searchParams.set('error', 'invalid')
  } else {
    try {
      const supabase = await createServerClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) destination.searchParams.set('error', 'invalid')
    } catch {
      destination.searchParams.set('error', 'invalid')
    }
  }

  const response = NextResponse.redirect(destination)
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}
