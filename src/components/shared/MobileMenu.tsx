'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { categories } from '@/data/categories';
import { WHATSAPP_DISPLAY, getWhatsAppUrl } from '@/lib/utils-crescendo';
import { CustomIcon } from '@/components/ui/custom-icon';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const waUrl = getWhatsAppUrl('Hi Crescendo! I have a general enquiry.');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 flex flex-col bg-brand-dark text-white border-l-0"
      >
        {/* Top: Logo + Wordmark + Close */}
        <SheetHeader className="p-5 pb-3 flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2">
            <Image
              src="/branding/crescendo-logo.webp"
              alt="Crescendo"
              width={32}
              height={32}
              className="h-7 w-auto"
            />
            <span className="text-lg font-black tracking-tight text-white">Crescendo</span>
          </SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
            className="size-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          >
            <CustomIcon name="x" tone="mono-light" className="size-5" alt="" />
          </button>
          <SheetDescription className="sr-only">Navigation menu</SheetDescription>
        </SheetHeader>

        {/* Quick links */}
        <div className="px-5 pb-3 flex items-center gap-2">
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-center px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide uppercase bg-white/5 hover:bg-white/10 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-center px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide uppercase bg-white/5 hover:bg-white/10 transition-colors"
          >
            Shop All
          </Link>
          <Link
            href="/book-an-artist"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-center px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide uppercase bg-white/5 hover:bg-white/10 transition-colors"
          >
            Book Artist
          </Link>
        </div>

        {/* Middle: Visual category cards */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="px-1 pb-3 text-[10px] font-semibold tracking-[0.25em] uppercase text-white/40">
            Browse Categories
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="group relative block aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 420px) 50vw, 200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <p className="text-xs font-bold tracking-wide uppercase text-white leading-tight">
                      {category.name}
                    </p>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      {category.productCount} products
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom: CTAs */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-black/30">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold transition-colors"
          >
            <CustomIcon name="message-circle" tone="mono-light" className="size-4" alt="" />
            WhatsApp · {WHATSAPP_DISPLAY}
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:+${WHATSAPP_DISPLAY.replace(/\D/g, '')}`}
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
            >
              <CustomIcon name="phone" tone="mono-light" className="size-4" alt="" />
              Call Us
            </a>
            <Link
              href="/book-an-artist"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
            >
              <CustomIcon name="music" tone="mono-light" className="size-4" alt="" />
              Book Artist
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
