import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication here
const protectedPaths = [
  '/my-list',
  '/stats',
  '/settings'
]

// Add paths that authenticated users shouldn't see
const authPaths = [
  '/login',
  '/register'
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Check if path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect away from auth pages if already logged in
  const isAuthPage = authPaths.some(path => pathname.startsWith(path))
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
