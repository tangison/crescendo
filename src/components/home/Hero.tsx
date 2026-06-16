'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.3 }
      );
      const el = localRef.current;
      if (el) observer.observe(el);
      return () => {
        if (el) observer.unobserve(el);
      };
    }, [hasStarted]);

    useEffect(() => {
      if (!hasStarted) return;
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, [hasStarted, end, duration]);

    return (
      <div ref={setRefs}>
        <p className="text-3xl sm:text-4xl font-black text-brand-accent font-mono">
          {count.toLocaleString()}
          {suffix}
        </p>
        <p className="text-xs sm:text-sm text-white/50 tracking-wide uppercase mt-1">
          {label}
        </p>
      </div>
    );
  }
);

CountUpStat.displayName = 'CountUpStat';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand min-h-[60vh] sm:min-h-[70vh] flex items-center">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand/60 to-brand/80 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="text-brand-accent text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Namibia&apos;s Premier Music Store
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
            Crescendo
            <br />
            <span className="text-brand-accent">Namibia</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-white/70 max-w-md leading-relaxed">
            Your Music, Our Passion. Instruments, gear, and expertise for every musician.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base font-semibold bg-brand-accent hover:bg-brand-accent/90 text-brand-dark"
            >
              <Link href="/shop">
                Explore Our Store
                <ArrowRight className="size-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/book-an-artist">Book an Artist</Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 flex items-center gap-8 sm:gap-12"
        >
          <CountUpStat
            end={TOTAL_PRODUCTS}
            duration={2000}
            suffix=""
            label="Products"
          />
          <CountUpStat
            end={YEARS}
            duration={1500}
            suffix="+"
            label="Years"
          />
          <CountUpStat
            end={STUDENTS}
            duration={1800}
            suffix="+"
            label="Students"
          />
        </motion.div>
      </div>
    </section>
  );
}
