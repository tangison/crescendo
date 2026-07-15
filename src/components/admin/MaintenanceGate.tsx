'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

/**
 * MaintenanceGate — handles maintenance redirect AND site chrome.
 *
 * - On /coming-soon: renders children immediately (no loading state, no Header/Footer)
 * - On other pages: if authed, renders Header + children + Footer
 * - On other pages: if NOT authed, redirects to /coming-soon
 *
 * Key: /coming-soon is rendered server-side with no gate delay.
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only check auth on non-coming-soon pages
    if (pathname !== '/coming-soon') {
      const isAuthed = localStorage.getItem('crescendo-auth') === 'true';
      if (!isAuthed) {
        router.replace('/coming-soon');
        return;
      }
    }
    setChecked(true);
  }, [pathname, router]);

  // On coming-soon page, render immediately — no loading state, no chrome
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

  // Authed — render full site
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
