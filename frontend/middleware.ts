import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Read auth from cookies (set by authStore.login)
  const authToken = request.cookies.get('auth-token')?.value;
  const authUserCookie = request.cookies.get('auth-user')?.value;
  let user: any = null;
  
  try {
    if (authToken && authUserCookie) {
      user = JSON.parse(decodeURIComponent(authUserCookie));
    }
  } catch (e) {
    // Invalid cookie - ignore
    console.warn('Failed to parse auth cookie:', e);
  }

  const pathname = request.nextUrl.pathname;

  // Check if route requires authentication
  // Note: /cart doesn't require auth (can view cart before login)
  // But /checkout requires auth
  const requiresAuth = pathname.startsWith('/account') || 
                      pathname.startsWith('/checkout') ||
                      pathname.startsWith('/orders') ||
                      pathname.startsWith('/employee') ||
                      pathname.startsWith('/manager') ||
                      pathname.startsWith('/shipper') ||
                      pathname.startsWith('/admin');

  if (requiresAuth && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role-based access
  if (user) {
    const userRole = user.role;
    
    // Employee routes
    if (pathname.startsWith('/employee') && !['employee', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Manager routes
    if (pathname.startsWith('/manager') && !['manager', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Shipper routes
    if (pathname.startsWith('/shipper') && !['shipper', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Admin routes
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect authenticated users from auth pages
    if (pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/employee/:path*',
    '/manager/:path*',
    '/shipper/:path*',
    '/admin/:path*',
    '/auth/:path*',
  ],
};
