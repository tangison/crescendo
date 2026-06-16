'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './MobileMenu';
import { SearchDialog } from './SearchDialog';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/stores/cart-store';
import { Menu, Search, ShoppingBag, ChevronDown } from 'lucide-react';
import { categories } from '@/data/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const itemCount = totalItems;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-sm shadow-sm'
            : 'bg-background'
        }`}
        style={{ borderBottom: scrolled ? '1px solid var(--border)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/branding/crescendo-logo.webp"
                  alt="Crescendo Namibia"
                  width={160}
                  height={40}
                  className="h-9 sm:h-10"
                  style={{ width: 'auto' }}
                  priority
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
              >
                Home
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors">
                    Shop
                    <ChevronDown className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuLabel className="text-[11px] tracking-widest uppercase text-muted-foreground">
                    Categories
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/shop" className="font-medium">
                      All Products
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.slug} asChild>
                      <Link href={`/shop?category=${cat.slug}`}>
                        {cat.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {cat.productCount}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/book-an-artist"
                className="px-4 py-2 text-sm font-medium tracking-wide uppercase hover:text-brand-accent transition-colors"
              >
                Book an Artist
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="size-10"
              >
                <Search className="size-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className="size-10 relative"
              >
                <ShoppingBag className="size-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-brand-accent text-brand-dark text-[10px] font-bold">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>

              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Menu"
                className="size-10 md:hidden"
              >
                <Menu className="size-5" />
              </Button>
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
