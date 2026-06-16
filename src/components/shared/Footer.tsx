'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Phone, Mail, MapPin, Shield, Award, Users, Package } from 'lucide-react';
import { categories } from '@/data/categories';
import { WHATSAPP_DISPLAY, CONTACT_EMAIL, getWhatsAppUrl } from '@/lib/utils-crescendo';
import { motion } from 'framer-motion';

const TRUST_INDICATORS = [
  { icon: Award, value: 'Since 2009', label: 'Trusted for 16+ years' },
  { icon: Users, value: '500+ Students', label: 'Taught and inspired' },
  { icon: Package, value: '1640+ Products', label: 'In stock and catalogued' },
  { icon: MapPin, value: 'Namibia Wide', label: 'Shipping nationwide' },
];

function BrandLogo({ variant }: { variant: 'light' | 'dark' }) {
  // Logo PNG rendered as-is, no filters, no recolor.
  // On dark backgrounds (footer), the original cyan logo shows correctly on its own.
  // Wordmark "Crescendo" sits next to it in the matching color.
  const wordmarkColor = variant === 'light' ? 'text-white' : 'text-foreground';
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/branding/crescendo-logo.webp"
        alt="Crescendo"
        width={40}
        height={40}
        className="h-8 sm:h-9 w-auto"
      />
      <span className={`text-xl sm:text-2xl font-black tracking-tight ${wordmarkColor}`}>
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
          SECTION 1 - Featured Categories (visual)
          ============================ */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-accent mb-1">
                Browse by Category
              </p>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">Find Your Sound</h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-medium tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
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
                  className="group relative block aspect-[4/3] overflow-hidden border border-white/10"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
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
          SECTION 2 + 3 - Brand, Links, Contact, Trust
          Mobile: single column stack with generous spacing
          Desktop: 3-column grid
          ============================ */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">

            {/* Brand + Quick Links */}
            <div className="space-y-4">
              <Link href="/" className="inline-flex" aria-label="Crescendo home">
                <BrandLogo variant="light" />
              </Link>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                Namibia&apos;s premier music store. Instruments, pro audio, accessories, and expert advice for every musician since 2009.
              </p>
              <nav className="flex flex-wrap gap-x-5 gap-y-2">
                <Link href="/" className="text-xs tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors">Home</Link>
                <Link href="/shop" className="text-xs tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors">Shop</Link>
                <Link href="/book-an-artist" className="text-xs tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors">Book an Artist</Link>
                <Link href="/shop?category=guitars" className="text-xs tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors">Guitars</Link>
                <Link href="/shop?category=keyboards" className="text-xs tracking-wide uppercase text-white/60 hover:text-brand-accent transition-colors">Keyboards</Link>
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-accent">
                Get in Touch
              </p>
              <div className="space-y-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/80 hover:text-[#25D366] transition-colors group"
                >
                  <span className="size-9 flex items-center justify-center bg-white/5 group-hover:bg-[#25D366]/15 transition-colors" style={{ borderRadius: '0.5rem' }}>
                    <MessageCircle className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] text-white/40 uppercase tracking-wide">WhatsApp</span>
                    {WHATSAPP_DISPLAY}
                  </span>
                </a>
                <a
                  href={`tel:+${WHATSAPP_DISPLAY.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 text-sm text-white/80 hover:text-brand-accent transition-colors group"
                >
                  <span className="size-9 flex items-center justify-center bg-white/5 group-hover:bg-brand-accent/15 transition-colors" style={{ borderRadius: '0.5rem' }}>
                    <Phone className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] text-white/40 uppercase tracking-wide">Call</span>
                    {WHATSAPP_DISPLAY}
                  </span>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 text-sm text-white/80 hover:text-brand-accent transition-colors group"
                >
                  <span className="size-9 flex items-center justify-center bg-white/5 group-hover:bg-brand-accent/15 transition-colors" style={{ borderRadius: '0.5rem' }}>
                    <Mail className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] text-white/40 uppercase tracking-wide">Email</span>
                    {CONTACT_EMAIL}
                  </span>
                </a>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span className="size-9 flex items-center justify-center bg-white/5" style={{ borderRadius: '0.5rem' }}>
                    <MapPin className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[10px] text-white/40 uppercase tracking-wide">Location</span>
                    Windhoek, Namibia
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-accent">
                Why Crescendo
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TRUST_INDICATORS.map((item) => (
                  <div key={item.label} className="p-3 bg-white/5 border border-white/10" style={{ borderRadius: '0.5rem' }}>
                    <item.icon className="size-4 text-brand-accent mb-2" />
                    <p className="text-sm font-bold leading-tight">{item.value}</p>
                    <p className="text-[10px] text-white/50 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================
          SECTION 4 - Bottom bar
          Mobile: stack with clear spacing
          ============================ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <Image
              src="/branding/signature-1.webp"
              alt=""
              width={50}
              height={24}
              className="h-5 w-auto"
              style={{ opacity: 0.5 }}
            />
            <Image
              src="/branding/signature-2.webp"
              alt=""
              width={50}
              height={24}
              className="h-5 w-auto"
              style={{ opacity: 0.5 }}
            />
          </div>
          <p className="text-[11px] text-white/40 order-1 sm:order-2">
            © {new Date().getFullYear()} Crescendo · Your Music, Our Passion
          </p>
          <div className="flex items-center gap-3 text-[10px] text-white/40 order-3">
            <span className="flex items-center gap-1">
              <Shield className="size-3" />
              Secure Enquiries
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
