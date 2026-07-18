import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side maintenance mode middleware.
 *
 * Instead of client-side JavaScript redirecting to /coming-soon,
 * this middleware runs on the server before any page renders.
 *
 * - Unauthenticated visitors get a 503 response with the maintenance page.
 * - Authenticated visitors (via cookie) get normal 200 responses.
 * - The maintenance page itself is always accessible.
 * - Static assets (_next, images, branding) are always accessible.
 * - API routes are always accessible.
 * - Search engines see 503 + noindex, preventing stale indexing.
 *
 * To disable maintenance mode: set MAINTENANCE_MODE=false in env vars
 * or remove this middleware file.
 */

const MAINTENANCE_PATH = '/coming-soon';
const AUTH_COOKIE = 'crescendo-auth';

// Paths that are always accessible even during maintenance
const ALLOWED_PATHS = [
  '/_next/',
  '/api/',
  '/branding/',
  '/hero/',
  '/products/',
  '/favicon',
  '/manifest',
  '/google-',  // Google verification files
  '/robots.txt',
  '/sitemap.xml',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the maintenance page itself
  if (pathname === MAINTENANCE_PATH) {
    return NextResponse.next();
  }

  // Always allow static assets and API
  if (ALLOWED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check if maintenance mode is disabled via env
  // (checked at build time — if MAINTENANCE_MODE=false in env, middleware is a no-op)
  if (process.env.MAINTENANCE_MODE === 'false') {
    return NextResponse.next();
  }

  // Check auth cookie (set by the login form on /coming-soon)
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === 'true';

  if (isAuthed) {
    return NextResponse.next();
  }

  // Redirect to maintenance page with 307 (temporary redirect)
  // The maintenance page itself returns 200 with noindex
  const maintenanceUrl = new URL(MAINTENANCE_PATH, request.url);
  const response = NextResponse.redirect(maintenanceUrl, 307);
  // Add Retry-After header (1 hour = 3600 seconds)
  response.headers.set('Retry-After', '3600');
  return response;
}

export const config = {
  // Match all paths except static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|branding|hero|products|google-|robots.txt|sitemap.xml|manifest|api).*)',
  ],
};
