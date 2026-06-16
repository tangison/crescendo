'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CustomIcon } from '@/components/ui/custom-icon';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, forwardRef } from 'react';
import { products } from '@/data/products';

const TOTAL_PRODUCTS = products.length;
const YEARS = new Date().getFullYear() - 2009; // Founded in 2009
const STUDENTS = 500;

interface CountUpStatProps {
  end: number;
  duration: number;
  suffix: string;
  label: string;
}

const CountUpStat = forwardRef<HTMLDivElement, CountUpStatProps>(
  ({ end, duration, suffix, label }, ref) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const localRef = useRef<HTMLDivElement>(null);
    const startedRef = useRef(false);

    // Combine local ref with forwarded ref
    const setRefs = (element: HTMLDivElement | null) => {
      localRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    useEffect(() => {
      const el = localRef.current;
      if (!el) return;

      // If element is already in viewport on mount, start immediately
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !startedRef.current) {
        startedRef.current = true;
        setHasStarted(true);
        return;
      }

      // Otherwise observe for intersection
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            setHasStarted(true);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
      );
      observer.observe(el);
      return () => {
        observer.disconnect();
      };
    }, []);

    useEffect(() => {
      if (!hasStarted) return;
      const startTime = Date.now();
      let rafId: number;
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }, [hasStarted, end, duration]);

    return (
      <div ref={setRefs} className="text-center sm:text-left">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums drop-shadow-lg">
          {count.toLocaleString()}
          {suffix}
        </p>
        <p className="text-[10px] sm:text-xs text-white/70 tracking-[0.2em] uppercase mt-1 font-medium">
          {label}
        </p>
      </div>
    );
  }
);

CountUpStat.displayName = 'CountUpStat';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] sm:min-h-[92vh] flex items-center">
      {/* Background hero image - responsive */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/mobile.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/hero/tablet.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden md:block lg:hidden object-cover"
        />
        <Image
          src="/hero/desktop.webp"
          alt="Crescendo Namibia: music stage in the Namib Desert at golden hour"
          fill
          priority
          sizes="100vw"
          className="hidden lg:block object-cover"
        />
      </div>

      {/* Gradient overlays for text readability - strong dark contrast for hero legibility */}
      <div className="absolute inset-0 z-10 bg-black/60" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/55" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/55" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
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
            Namibia&apos;s Premier Music Store · Since 2009
          </motion.p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] drop-shadow-2xl">
            Your Music,
            <br />
            <span className="text-brand-accent">Our Passion</span>
          </h1>
          <p className="mt-5 sm:mt-7 text-base sm:text-xl text-white/85 max-w-md leading-relaxed drop-shadow-lg">
            Instruments, gear, and expertise for every musician. From the dunes of the Namib to stages worldwide.
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

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 sm:mt-20 flex items-center gap-8 sm:gap-14"
        >
          <CountUpStat
            end={TOTAL_PRODUCTS}
            duration={2000}
            suffix="+"
            label="Products"
          />
          <div className="h-10 sm:h-12 w-px bg-white/20" />
          <CountUpStat
            end={YEARS}
            duration={1500}
            suffix="+"
            label="Years"
          />
          <div className="h-10 sm:h-12 w-px bg-white/20" />
          <CountUpStat
            end={STUDENTS}
            duration={1800}
            suffix="+"
            label="Students"
          />
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
