import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  // const token = await getToken({ req: request, secret });
  // const { pathname } = request.nextUrl;

 
  // if (pathname === "/" && token) {
  //   return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
  // }

 
  // if ((pathname === "/" || pathname.startsWith("/super-admin")) && !token) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

 
  // if (pathname.startsWith("/auth/login") && token) {
  //   return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
  // }

 
  return NextResponse.next();
}



 
export const config = {
  matcher: ["/", "/auth/login", "/super-admin/:path*"],
};
