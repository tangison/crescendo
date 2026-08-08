'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './MobileMenu';
import { SearchDialog } from './SearchDialog';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/stores/cart-store';
import { CustomIcon } from '@/components/ui/custom-icon';
import { categories } from '@/data/categories';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const itemCount = hasHydrated ? totalItems : 0;
  const pathname = usePathname();
  const categoriesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setShopDropdownOpen(false);
  }, [pathname]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openCategories = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    setCategoriesOpen(true);
  };
  const closeCategories = () => {
    categoriesTimeoutRef.current = setTimeout(() => setCategoriesOpen(false), 150);
  };

  const openShopDropdown = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    setShopDropdownOpen(true);
  };
  const closeShopDropdown = () => {
    categoriesTimeoutRef.current = setTimeout(() => setShopDropdownOpen(false), 150);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-background/95 backdrop-blur-md ${
          scrolled ? 'shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]' : ''
        }`}
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* ============================
            ROW 1 - Main navigation bar
            ============================ */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] sm:h-[76px]">
            {/* Left: Menu (mobile) / Logo (desktop) */}
            <div className="flex items-center gap-3 flex-1">
              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="size-10 md:hidden"
              >
                <CustomIcon name="menu-2line" className="size-5" alt="" />
              </Button>

              {/* Desktop: Home + Shop dropdown */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-2 text-[13px] font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
                >
                  Home
                </Link>

                <div
                  className="relative"
                  onMouseEnter={openShopDropdown}
                  onMouseLeave={closeShopDropdown}
                >
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
                    aria-expanded={shopDropdownOpen}
                  >
                    Shop
                    <CustomIcon name="chevron-down" className={`size-3.5 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} alt="" />
                  </button>

                  <AnimatePresence>
                    {shopDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 pt-2 w-64"
                      >
                        <div className="bg-popover rounded-xl border border-border shadow-xl overflow-hidden">
                          <Link
                            href="/shop"
                            className="flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-accent transition-colors border-b border-border"
                          >
                            All Products
                            <span className="text-[10px] text-muted-foreground font-normal">1611+</span>
                          </Link>
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/category/${cat.slug}`}
                              className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                            >
                              <span>{cat.name}</span>
                              <span className="text-[10px] text-muted-foreground">{cat.productCount}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/book-an-artist"
                  className="px-3 py-2 text-[13px] font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
                >
                  Book an Artist
                </Link>
              </nav>
            </div>

            {/* Center: Logo + Wordmark (perfectly centered) */}
            <div className="flex items-center justify-center">
              <Link href="/" className="flex items-center gap-2" aria-label="Crescendo home">
                <Image
                  src="/branding/crescendo-logo.webp"
                  alt="Crescendo"
                  width={36}
                  height={36}
                  className="h-7 sm:h-8 md:h-9 w-auto"
                  priority
                />
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-foreground">
                  Crescendo
                </span>
              </Link>
            </div>

            {/* Right: Search + Cart */}
            <div className="flex items-center justify-end gap-1 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="size-10"
              >
                <CustomIcon name="search" className="size-5" alt="" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                aria-label="Open enquiry list"
                className="size-10 relative"
              >
                <CustomIcon name="shopping-bag" className="size-5" alt="" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-brand-accent text-brand-dark text-[10px] font-bold px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ============================
            ROW 2 - Visual Category Cards (desktop only)
            ============================ */}
        <div className="hidden md:block border-t border-border bg-card/50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-7 gap-1 py-1.5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="relative w-9 h-9 rounded-md overflow-hidden flex-shrink-0 border border-border/50 bg-secondary">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="36px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold tracking-wide uppercase truncate group-hover:text-brand-accent transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {cat.productCount} items
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
