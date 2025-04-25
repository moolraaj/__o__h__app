import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET!

const publicApi = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/superadmin',
  '/api/auth/verify',
  '/api/otpless/send-otp',
  '/api/otpless/verify-otp',
  '/api/lesion/verify',
  '/api/questionnaire/verify',
]

const feedbackPath = /^\/api\/(?:lesion|questionnaire)\/[^\/]+\/feedback$/
const submitPath = /^\/api\/(?:lesion|questionnaire)\/submit\/[^\/]+$/


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl


  if (pathname.startsWith('/api')) {
    const isPublic =
      publicApi.includes(pathname) ||
      feedbackPath.test(pathname) ||
      submitPath.test(pathname)

    if (!isPublic) {
      const token = await getToken({ req, secret })
      if (!token) {
        return NextResponse.json(
          { status: 401, error: 'Unauthorized! access denied' },
        )
      }
    }
    return NextResponse.next()
  }

  const session = await getToken({ req, secret })
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', req.url))
  }
  if (pathname === '/super-admin' && session) {
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
    '/auth/:path*',
    '/super-admin/:path*',
    '/api/:path*',
  ],
}
