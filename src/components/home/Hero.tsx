'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CustomIcon } from '@/components/ui/custom-icon';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Hero images */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/mobile.webp"
          alt="Crescendo Namibia: a vintage microphone silhouetted against the red dunes of Sossusvlei at golden hour"
          fill
          priority
          sizes="100vw"
          className="block lg:hidden object-cover"
        />
        <Image
          src="/hero/tablet.webp"
          alt="Crescendo Namibia: a vintage microphone silhouetted against the red dunes of Sossusvlei at golden hour"
          fill
          priority
          sizes="100vw"
          className="hidden lg:hidden xl:block object-cover"
        />
        <Image
          src="/hero/desktop.webp"
          alt="Crescendo Namibia: a vintage microphone silhouetted against the red dunes of Sossusvlei at golden hour"
          fill
          priority
          sizes="100vw"
          className="hidden lg:block xl:hidden object-cover"
        />
      </div>

      {/* Gradient overlays — subtle, preserves the Namibian landscape photo clarity */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brand-accent text-[11px] sm:text-sm font-semibold tracking-[0.3em] uppercase mb-4 sm:mb-5"
          >
            Namibia&apos;s Premier Music Store · Since 2019
          </motion.p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] drop-shadow-2xl">
            Strive for
            <br />
            <span className="text-brand-accent">Excellence</span>
          </h1>
          <p className="mt-5 sm:mt-7 text-base sm:text-xl text-white/85 max-w-md leading-relaxed drop-shadow-lg">
            A one-stop retail and entertainment store — providing a wide range of
            musical instruments, PA systems, stages, lights, audiovisual, and
            studio solutions.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Button
              asChild
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-brand-accent hover:bg-brand-accent/90 text-brand-dark shadow-xl"
            >
              <Link href="/shop">
                Explore Our Store
                <CustomIcon name="arrow-right" tone="mono-dark" className="size-4 sm:size-5 ml-2" alt="" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-transparent border-white/40 text-white hover:bg-white/15 hover:text-white hover:border-white/70 backdrop-blur-sm shadow-lg shadow-black/20"
            >
              <Link href="/book-an-artist">Book an Artist</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
