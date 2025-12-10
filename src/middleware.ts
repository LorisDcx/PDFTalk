import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🛡️ MIDDLEWARE:', req.nextUrl.pathname)
  
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: { headers: req.headers },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: { headers: req.headers },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Use getUser() instead of deprecated getSession() for security
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log('🛡️ MIDDLEWARE user:', !!user, error?.message || '')

  // Protected routes
  const protectedPaths = ['/dashboard', '/documents', '/billing', '/settings']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // Auth routes (redirect to dashboard if already logged in)
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname === path
  )

  if (isProtectedPath && !user) {
    console.log('🛡️ MIDDLEWARE -> redirect to /login (no user)')
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthPath && user) {
    console.log('🛡️ MIDDLEWARE -> redirect to /dashboard (has user)')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  console.log('🛡️ MIDDLEWARE -> pass through')
  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documents/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
}
