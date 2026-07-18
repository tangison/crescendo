'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CustomIcon } from '@/components/ui/custom-icon';
import { motion } from 'framer-motion';
import { getWhatsAppUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL, SOCIAL_LINKS } from '@/lib/utils-crescendo';
import { getPublishedArtists } from '@/data/artists';

export function BookAnArtistPage() {
  const publishedArtists = getPublishedArtists();
  const whatsappUrl = getWhatsAppUrl(
    'Hello Crescendo, I would like to enquire about booking an artist for an event.'
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/products/book-an-artist/book-an-artist-hero.webp"
          alt="Book an Artist: live music for your events"
          fill
          className="object-cover object-bottom"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="text-brand-accent text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-3">
                Live Music & Events
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95]">
                Book an
                <br />
                <span className="text-brand-accent">Artist</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-white/70 max-w-lg leading-relaxed">
                Talented musicians available for events, background music and stage performances.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Artist Directory */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {publishedArtists.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-accent mb-2">
                  Our Artists
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                  Meet Our Performers
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {publishedArtists.map((artist, index) => (
                  <motion.div
                    key={artist.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    {artist.imageUrl && (
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={artist.imageUrl}
                          alt={artist.imageAlt || artist.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1">{artist.name}</h3>
                      <p className="text-sm text-brand-accent font-medium mb-2">{artist.profession}</p>
                      {artist.shortBio && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{artist.shortBio}</p>
                      )}
                      <a
                        href={getWhatsAppUrl(artist.bookingMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium transition-colors"
                      >
                        <CustomIcon name="message-circle" tone="mono-light" className="size-4" alt="" />
                        Enquire about {artist.name.split(' ')[0]}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            /* Empty state when no artists are published yet */
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand/5 flex items-center justify-center mx-auto mb-6">
                <CustomIcon name="music" className="size-8 text-muted-foreground/50" alt="" />
              </div>
              <h2 className="text-xl font-bold mb-2">Artist Directory Coming Soon</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                We are building our artist directory. If you are interested in live music for your event,
                please contact us directly and we will match you with the right performer.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* General Booking CTA */}
      <section className="py-16 sm:py-20 bg-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
              Ready to Book?
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
              Get in touch with us on WhatsApp for a fast, personal response. We will match you with the
              right artist for your event.
            </p>

            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <CustomIcon name="message-circle" tone="mono-light" className="size-5 mr-2" alt="" />
                Chat With Us on WhatsApp
              </a>
            </Button>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/50">
              <a
                href={`tel:+${WHATSAPP_DISPLAY.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <CustomIcon name="phone" tone="mono-light" className="size-4" alt="" />
                {WHATSAPP_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <CustomIcon name="mail" tone="mono-light" className="size-4" alt="" />
                {CONTACT_EMAIL}
              </a>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {SOCIAL_LINKS.facebook && (
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
                  className="size-9 flex items-center justify-center bg-white/5 hover:bg-white/15 transition-colors rounded-full"
                  aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-white/70">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.instagram && (
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
                  className="size-9 flex items-center justify-center bg-white/5 hover:bg-white/15 transition-colors rounded-full"
                  aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-white/70">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.tiktok && (
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
                  className="size-9 flex items-center justify-center bg-white/5 hover:bg-white/15 transition-colors rounded-full"
                  aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-white/70">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.youtube && (
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
                  className="size-9 flex items-center justify-center bg-white/5 hover:bg-white/15 transition-colors rounded-full"
                  aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-white/70">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
