
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET!

const publicApi = [
  '/api/auth',
  '/api/otpless',
  '/api/lesion/verify',
  '/api/questionnaire/verify',
]

 
const feedbackPath = /^\/api\/(?:lesion|questionnaire)\/[^\/]+\/feedback$/

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api')) {
    if (
      publicApi.some(p => pathname.startsWith(p)) ||
      feedbackPath.test(pathname)
    ) {
      return NextResponse.next()
    }

    const token = await getToken({ req, secret })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // …your existing front-end redirects…
  const session = await getToken({ req, secret })
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', req.url))
  }
  if (pathname.startsWith('/super-admin') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  if (pathname.startsWith('/auth/login') && session) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/super-admin/:path*',
    '/api/:path*',
    '/api/lesion/verify',
    '/api/questionnaire/verify',
    
  ],
}
