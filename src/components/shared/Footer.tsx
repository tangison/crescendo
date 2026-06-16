'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="w-full mt-auto"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Desktop Footer — single bar */}
      <div className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Signatures */}
            <div className="flex items-center gap-3">
              <Image
                src="/branding/signature-1.webp"
                alt=""
                width={60}
                height={28}
                className="h-6 opacity-50"
                style={{ width: 'auto' }}
              />
              <Image
                src="/branding/signature-2.webp"
                alt=""
                width={60}
                height={28}
                className="h-6 opacity-50"
                style={{ width: 'auto' }}
              />
            </div>

            {/* Center: Links */}
            <nav className="flex items-center gap-6">
              <Link
                href="/shop"
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/book-an-artist"
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Book an Artist
              </Link>
              <a
                href="https://wa.me/264812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Right: WhatsApp */}
            <a
              href="https://wa.me/264812345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-[#25D366] transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="size-4" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>
          </div>

          <div className="mt-2 pt-2 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} Crescendo Namibia. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Footer — compact stacked */}
      <div className="sm:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/branding/signature-1.webp"
                alt=""
                width={44}
                height={20}
                className="h-4 opacity-40"
                style={{ width: 'auto' }}
              />
              <Image
                src="/branding/signature-2.webp"
                alt=""
                width={44}
                height={20}
                className="h-4 opacity-40"
                style={{ width: 'auto' }}
              />
            </div>
            <a
              href="https://wa.me/264812345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#25D366] transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2">
            <Link
              href="/shop"
              className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/book-an-artist"
              className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Book Artist
            </Link>
            <a
              href="https://wa.me/264812345678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>

          <p className="text-[10px] text-center text-muted-foreground mt-2">
            © {new Date().getFullYear()} Crescendo Namibia
          </p>
        </div>
      </div>
    </footer>
  );
}
