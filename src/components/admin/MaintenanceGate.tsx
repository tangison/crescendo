'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Lazy-load Header/Footer so they don't break SSR of /coming-soon
const Header = lazy(() => import('@/components/shared/Header').then(m => ({ default: m.Header })));
const Footer = lazy(() => import('@/components/shared/Footer').then(m => ({ default: m.Footer })));

/**
 * MaintenanceGate — handles maintenance redirect AND site chrome.
 *
 * - On /coming-soon: renders children immediately (no Header/Footer, no loading)
 * - On other pages: if authed, renders Header + children + Footer
 * - On other pages: if NOT authed, redirects to /coming-soon
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname !== '/coming-soon') {
      const isAuthed = localStorage.getItem('crescendo-auth') === 'true';
      if (!isAuthed) {
        router.replace('/coming-soon');
        return;
      }
    }
    setChecked(true);
  }, [pathname, router]);

  // On coming-soon page, render immediately — no chrome, no loading
  if (pathname === '/coming-soon') {
    return <>{children}</>;
  }

  // On other pages, show loading until auth check completes
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authed — render full site with lazy-loaded Header/Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
