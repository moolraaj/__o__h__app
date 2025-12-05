import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET!

// Public API routes
const publicApi = [
  '/api/otpless',
  '/api/lesion/verify',
  '/api/questionnaire/verify',
  '/api/auth', 
]

// Public pages (no authentication required)
const publicPages = [
  '/auth/login',
  '/super-admin/login', // Add this
  '/auth/error',
  '/api/auth', // NextAuth endpoints
]

// Feedback path pattern
const feedbackPath = /^\/api\/(?:lesion|questionnaire)\/[^\/]+\/feedback$/

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
 
  
  // Debug logging
  console.log('Middleware - Path:', pathname)
  
  // ========== API ROUTES ==========
  if (pathname.startsWith('/api')) {
    // Check if it's a public API route
    if (
      publicApi.some(p => pathname.startsWith(p)) ||
      feedbackPath.test(pathname) ||
      pathname.startsWith('/api/auth') // Allow all NextAuth endpoints
    ) {
      console.log('Public API route, allowing access')
      return NextResponse.next()
    }

    // Check for token in API requests
    const token = await getToken({ 
      req, 
      secret,
      raw: true // Try raw first to debug
    })
    
    console.log('API Token check:', token ? 'Token found' : 'No token')
    
    if (!token) {
      console.log('API: Unauthorized access attempt')
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }
    
    return NextResponse.next()
  }

  // ========== PAGE ROUTES ==========
  try {
    const session = await getToken({ 
      req, 
      secret,
      // Important: Use secureCookie option
      secureCookie: process.env.NODE_ENV === 'production'
    })
    
    console.log('Page Session check for', pathname, ':', session ? 'Logged in' : 'Not logged in')
    
    // If user is logged in
    if (session) {
      // Redirect away from login pages if already logged in
      if (pathname === '/auth/login' || pathname === '/super-admin/login') {
        console.log('Redirecting logged-in user from login page to dashboard')
        return NextResponse.redirect(new URL('/super-admin/dashboard', req.url))
      }
      
      // Handle root redirects
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/super-admin/dashboard', req.url))
      }
      
      // Handle super-admin base path
      if (pathname === '/super-admin') {
        return NextResponse.redirect(new URL('/super-admin/dashboard', req.url))
      }
      
      // Allow access to all other pages
      return NextResponse.next()
    }
    
    // If user is NOT logged in
    else {
      // Allow access to public pages
      if (
        publicPages.some(p => pathname.startsWith(p)) ||
        pathname === '/'
      ) {
        return NextResponse.next()
      }
      
      // Protect super-admin pages
      if (pathname.startsWith('/super-admin')) {
        console.log('Unauthorized access to protected page, redirecting to login')
        return NextResponse.redirect(new URL('/super-admin/login', req.url))
      }
      
      return NextResponse.next()
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to proceed to avoid blocking legitimate requests
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}