import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);


const publicApi = ['/api/auth', '/api/otpless'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  if (pathname.startsWith('/api')) {
    if (publicApi.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }


    const raw = req.headers.get('authorization')?.split(' ')[1];
    if (!raw) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(raw, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }


  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', req.url));
  }


  if (pathname.startsWith('/super-admin') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }


  if (pathname.startsWith('/auth/login') && session) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/login', '/super-admin/:path*', '/api/:path*'],
};
