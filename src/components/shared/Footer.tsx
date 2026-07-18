'use client';

import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import {
  WHATSAPP_DISPLAY,
  CONTACT_EMAIL,
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_ADDRESS,
  BUSINESS_HOURS,
  BUSINESS_SINCE,
  SOCIAL_LINKS,
  getWhatsAppUrl,
} from '@/lib/utils-crescendo';
import { motion } from 'framer-motion';

function SocialIcon({ platform }: { platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };
  return <>{icons[platform]}</>;
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/branding/crescendo-logo.webp"
        alt="Crescendo"
        width={40}
        height={40}
        className="h-8 sm:h-9 w-auto"
      />
      <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
        Crescendo
      </span>
    </div>
  );
}

export function Footer() {
  const waUrl = getWhatsAppUrl('Hi Crescendo! I have a general enquiry.');

  return (
    <footer className="w-full mt-auto bg-brand-dark text-white">
      {/* ============================
          SECTION 1 - Featured Categories
          ============================ */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-start sm:items-center justify-between mb-5 gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-accent mb-1">
                Browse by Category
              </p>
              <h3 className="text-base sm:text-xl font-bold tracking-tight">Find Your Sound</h3>
            </div>
            <Link
              href="/shop"
              className="shrink-0 text-[10px] sm:text-xs font-medium tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden border border-white/10 rounded-2xl"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-white leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-[9px] text-white/50 mt-0.5 hidden sm:block">{cat.productCount}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================
          SECTION 2 - Brand + Social + Links + Contact
          ============================ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand + Tagline + Social */}
          <div className="space-y-5">
            <BrandLogo />
            <div>
              <p className="text-brand-accent text-sm font-bold tracking-wide uppercase mb-1">
                {BUSINESS_TAGLINE}
              </p>
              <p className="text-xs text-white/60">
                A one-stop retail and entertainment store — providing a wide range of
                musical instruments, PA systems, stages, lights, audiovisual, and
                studio solutions. Since {BUSINESS_SINCE}.
              </p>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 flex items-center justify-center bg-white/5 hover:bg-[#1877F2]/20 hover:text-[#1877F2] transition-colors rounded-full"
                aria-label="Facebook"
              >
                <SocialIcon platform="facebook" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 flex items-center justify-center bg-white/5 hover:bg-[#E4405F]/20 hover:text-[#E4405F] transition-colors rounded-full"
                aria-label="Instagram"
              >
                <SocialIcon platform="instagram" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 flex items-center justify-center bg-white/5 hover:bg-white/20 transition-colors rounded-full"
                aria-label="TikTok"
              >
                <SocialIcon platform="tiktok" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 flex items-center justify-center bg-white/5 hover:bg-[#FF0000]/20 hover:text-[#FF0000] transition-colors rounded-full"
                aria-label="YouTube"
              >
                <SocialIcon platform="youtube" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/book-an-artist" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
                  Book an Artist
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/returns" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-white/70 hover:text-brand-accent transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Address</p>
                <p className="text-sm text-white/70 leading-relaxed">{BUSINESS_ADDRESS}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Phone / WhatsApp</p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-brand-accent transition-colors block">
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-white/70 hover:text-brand-accent transition-colors block">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Hours</p>
                <p className="text-sm text-white/70">{BUSINESS_HOURS}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40 text-center sm:text-left">
              © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <Link href="/legal/terms" className="hover:text-white/70 transition-colors">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
              <Link href="/legal/returns" className="hover:text-white/70 transition-colors">Returns</Link>
              <Link href="/legal/shipping" className="hover:text-white/70 transition-colors">Shipping</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
