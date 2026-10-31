import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the JWT secret - make sure this is set in your .env file
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-change-me');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip paths that don't need protection
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // 2. Validate token if present
  let isAuthenticated = false;
  if (token) {
    try {
      // Step 1 of verification: Signature & Expiration
      await jwtVerify(token, SECRET);
      
      // Step 2 of verification: Could add further checks here 
      // (e.g., check user status in a database/cache)
      isAuthenticated = true;
    } catch (e) {
      isAuthenticated = false;
    }
  }

  // 3. Routing Logic
  
  // If user is authenticated and tries to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is NOT authenticated and tries to access protected routes, redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proceed for all other cases
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except api, _next/static, _next/image, favicon.ico
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
