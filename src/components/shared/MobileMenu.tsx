'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { categories } from '@/data/categories';
import { Phone, Mail, MessageCircle, X } from 'lucide-react';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90vw] max-w-[420px] p-0 flex flex-col bg-brand-dark text-white">
        <SheetHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Image
                src="/branding/crescendo-logo.webp"
                alt="Crescendo"
                width={140}
                height={36}
                className="h-9 brightness-0 invert"
                style={{ width: 'auto' }}
              />
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">Navigation menu</SheetDescription>
        </SheetHeader>

        <Separator className="bg-white/10" />

        {/* Navigation Links */}
        <div className="px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors min-h-[44px]"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors min-h-[44px]"
          >
            Shop All
          </Link>
          <Link
            href="/book-an-artist"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium tracking-wide uppercase hover:bg-white/10 transition-colors min-h-[44px]"
          >
            Book an Artist
          </Link>
        </div>

        <Separator className="bg-white/10" />

        {/* Category Gallery — Image-rich, immersive */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="px-3 pb-3 text-[11px] font-semibold tracking-widest uppercase text-white/50">
            Categories
          </p>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/10 transition-all group min-h-[72px]"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold tracking-wide uppercase group-hover:text-brand-accent transition-colors">
                    {category.name}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {category.productCount} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Contact Info */}
        <div className="p-5 space-y-3">
          <a
            href="https://wa.me/264812345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-white/70 hover:text-[#25D366] transition-colors min-h-[44px]"
          >
            <MessageCircle className="size-4 flex-shrink-0" />
            <span>+264 81 234 5678</span>
          </a>
          <a
            href="mailto:info@crescendo-namibia.com"
            className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors min-h-[44px]"
          >
            <Mail className="size-4 flex-shrink-0" />
            <span>info@crescendo-namibia.com</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
