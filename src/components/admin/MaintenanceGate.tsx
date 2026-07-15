'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * MaintenanceGate — client-side gate that redirects unauthenticated visitors
 * to /coming-soon. Auth is stored in localStorage.
 *
 * On /coming-soon, the gate renders children directly (so the page shows without
 * the site chrome — Header/Footer are still in the DOM but the coming-soon page
 * is full-screen and covers them).
 *
 * On other pages, if not authed, redirect to /coming-soon.
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAuthed = localStorage.getItem('crescendo-auth') === 'true';
    const isComingSoon = pathname === '/coming-soon';

    if (!isAuthed && !isComingSoon) {
      router.replace('/coming-soon');
      return;
    }
    setChecked(true);
  }, [pathname, router]);

  // Show nothing during the check to prevent content flash
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // On coming-soon page, render children directly (no Header/Footer wrapper)
  // The coming-soon page is full-screen and covers everything
  if (pathname === '/coming-soon') {
    return <>{children}</>;
  }

  return <>{children}</>;
}
