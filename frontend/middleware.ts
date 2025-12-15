import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value;

  // Protect authenticated routes
  const protectedRoutes = ['/cart', '/checkout', '/orders', '/profile'];
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users from auth pages
  if (request.nextUrl.pathname.startsWith('/auth/') && token) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
