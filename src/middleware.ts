import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Allow NextAuth API routes and seed endpoint
  if (pathname.startsWith('/api/auth') || pathname === '/api/seed') {
    return NextResponse.next();
  }

  // Login page: redirect to home if already logged in
  if (pathname === '/login') {
    if (isLoggedIn) return NextResponse.redirect(new URL('/', nextUrl));
    return NextResponse.next();
  }

  // Admin routes: require admin role
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || req.auth?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // All other routes: require login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
