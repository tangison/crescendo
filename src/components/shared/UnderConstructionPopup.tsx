'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'crescendo-popup-seen';
const DELAY_MS = 2000;

export function UnderConstructionPopup() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Site under construction notice"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-accent via-brand-warm to-brand-accent" />

        <div className="p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent transition-colors"
            aria-label="Close notice"
          >
            <X size={18} className="text-muted-foreground" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-accent/10 mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-accent"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-foreground mb-2">
            Site Under Construction
          </h2>

          {/* Body */}
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Welcome to Crescendo Namibia. This site is currently being built and
              refined by{' '}
              <a
                href="https://studio.tangison.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent underline underline-offset-2 hover:text-foreground transition-colors"
              >
                studio.tangison.com
              </a>
              .
            </p>
            <p>
              Prices, product details, and content are still being updated. Some
              information may not be final. If you have questions about a specific
              product or its price, please contact us directly.
            </p>
          </div>

          {/* Contact options */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
            <a
              href="https://wa.me/264814623936?text=Hi%20Crescendo!%20I%20have%20an%20enquiry%20about%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <button className="w-full px-4 py-2.5 rounded-xl bg-brand-accent text-brand-dark text-sm font-semibold hover:bg-brand-accent/90 transition-colors">
                WhatsApp Us
              </button>
            </a>
            <a href="mailto:hello@crescendona.com" className="flex-1">
              <button className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors">
                Email Us
              </button>
            </a>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-6 sm:px-8 py-3.5 bg-muted/50 border-t border-border">
          <p className="text-[11px] text-muted-foreground text-center">
            +264 81 462 3936 &middot; hello@crescendona.com
          </p>
        </div>
      </div>
    </div>
  );
}
