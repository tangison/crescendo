'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ConvexClientProvider } from '@/components/convex-provider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('crescendo-admin') === 'true';
    const isLoginPage = pathname === '/admin/login';
    if (!isAuthed && !isLoginPage) {
      router.push('/admin/login');
      return;
    }
    setAuthed(isAuthed);
    setLoading(false);
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLoginPage = pathname === '/admin/login';

  // Login page and unauthed pages render without admin chrome
  if (isLoginPage || !authed) {
    return <ConvexClientProvider>{children}</ConvexClientProvider>;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('crescendo-admin');
    router.push('/admin/login');
  };

  return (
    <ConvexClientProvider>
      <div className="min-h-screen bg-secondary/30">
        <header className="sticky top-0 z-40 bg-brand-dark text-white border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/branding/crescendo-logo.webp" alt="Crescendo" className="h-7 w-auto" />
              <span className="text-sm font-bold tracking-tight">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank" className="text-xs text-white/50 hover:text-white transition-colors">
                View Site
              </Link>
              <button onClick={handleLogout} className="text-xs text-white/50 hover:text-white transition-colors">
                Logout
              </button>
            </div>
          </div>
        </header>

        <nav className="bg-background border-b border-border">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-12 overflow-x-auto no-scrollbar">
            <Link href="/admin" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors whitespace-nowrap">Overview</Link>
            <Link href="/admin/products" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors whitespace-nowrap">Products</Link>
            <Link href="/admin/artists" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors whitespace-nowrap">Artists</Link>
            <Link href="/admin/settings" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors whitespace-nowrap">Settings</Link>
            <Link href="/admin/legal" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors whitespace-nowrap">Legal Pages</Link>
          </div>
        </nav>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </ConvexClientProvider>
  );
}
