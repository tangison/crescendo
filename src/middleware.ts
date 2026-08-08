import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js middleware.
 *
 * Maintenance mode is currently DISABLED.
 * The site is live with an under-construction banner and popup instead.
 * 
 * To re-enable maintenance mode: set MAINTENANCE_MODE=true in env vars.
 */

export function middleware(_request: NextRequest) {
  // Maintenance mode disabled — pass all requests through.
  // The under-construction notice is handled client-side via banner + popup.
  return NextResponse.next();
}

export const config = {
  // Match all paths except static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|branding|hero|products|google-|robots.txt|sitemap.xml|manifest|api).*)',
  ],
};
