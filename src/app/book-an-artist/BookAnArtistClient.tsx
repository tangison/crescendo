'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Music, Users, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '@/lib/utils-crescendo';

export function BookAnArtistPage() {
  const whatsappUrl = getWhatsAppUrl(
    'Hi Crescendo! I\'d like to book an artist for an event/lesson. Could you provide more details?'
  );

  return (
    <div>
      {/* Hero Section — Single Image, cropped at bottom */}
      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/products/book-an-artist/book-an-artist-hero.webp"
          alt="Book an Artist — Live music for your events"
          fill
          className="object-cover object-bottom"
          priority
          sizes="100vw"
        />
        {/* Dark gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="text-brand-accent text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-3">
                Live Music & Lessons
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95]">
                Book an
                <br />
                <span className="text-brand-accent">Artist</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-white/70 max-w-lg leading-relaxed">
                Live music for your events. Professional musicians for lessons.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-accent mb-2">
              Simple Process
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: Music,
                step: '01',
                title: 'Browse',
                description: 'Explore our talented musicians and artists across genres and specialties.',
              },
              {
                icon: Users,
                step: '02',
                title: 'Connect',
                description: 'Reach out via WhatsApp to discuss your event or lesson requirements.',
              },
              {
                icon: Mic,
                step: '03',
                title: 'Perform',
                description: 'Book your artist and enjoy live music tailored to your occasion.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand/5 dark:bg-brand/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="size-7 text-brand-accent" />
                </div>
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-1">
                  Step {item.step}
                </p>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Get in touch with us on WhatsApp for a fast, personal response. We&apos;ll match you with the perfect artist.
            </p>

            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-5 mr-2" />
                Chat With Us on WhatsApp
              </a>
            </Button>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/50">
              <a
                href={`tel:+${WHATSAPP_DISPLAY.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Phone className="size-4" />
                {WHATSAPP_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail className="size-4" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
