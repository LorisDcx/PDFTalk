import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
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
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet, responseHeaders) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
          Object.entries(responseHeaders ?? {}).forEach(([name, value]) => res.headers.set(name, value))
        },
      },
    }
  )

  // Use getUser() instead of deprecated getSession() for security
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/dashboard', '/documents', '/billing', '/settings', '/flashcards', '/writer']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
  )

  // Auth routes (redirect to dashboard if already logged in)
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname === path
  )

  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return redirectWithCookies(redirectUrl, res)
  }

  if (isAuthPath && user) {
    return redirectWithCookies(new URL('/dashboard', req.url), res)
  }

  // Add X-Robots-Tag: noindex,nofollow for protected/app pages
  if (isProtectedPath) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Security headers (global)
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documents/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/flashcards/:path*',
    '/writer/:path*',
    '/login',
    '/signup',
  ],
}

function redirectWithCookies(url: URL, response: NextResponse) {
  const redirect = NextResponse.redirect(url)
  response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie))
  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = response.headers.get(header)
    if (value) redirect.headers.set(header, value)
  }
  return redirect
}
