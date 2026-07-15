'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

/**
 * MaintenanceGate — handles BOTH maintenance redirect AND site chrome rendering.
 *
 * - On /coming-soon: renders children only (no Header/Footer)
 * - On other pages: if authed, renders Header + children + Footer
 * - On other pages: if NOT authed, redirects to /coming-soon
 * - Shows a loading spinner during the initial auth check
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState<'checking' | 'authed' | 'unauthed'>('checking');

  useEffect(() => {
    const isComingSoon = pathname === '/coming-soon';
    if (isComingSoon) {
      setAuthState('authed'); // always allow coming-soon page
      return;
    }
    const isAuthed = localStorage.getItem('crescendo-auth') === 'true';
    if (isAuthed) {
      setAuthState('authed');
    } else {
      setAuthState('unauthed');
      router.replace('/coming-soon');
    }
  }, [pathname, router]);

  // Loading state during auth check
  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // On coming-soon page OR unauthed (about to redirect), render children only
  if (pathname === '/coming-soon' || authState === 'unauthed') {
    return <>{children}</>;
  }

  // Authed — render full site with Header/Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
