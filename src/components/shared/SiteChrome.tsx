'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

/**
 * SiteChrome — renders Header/Footer on all pages EXCEPT /coming-soon.
 * The coming-soon page is standalone (no site chrome).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isComingSoon = pathname === '/coming-soon';

  if (isComingSoon) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
