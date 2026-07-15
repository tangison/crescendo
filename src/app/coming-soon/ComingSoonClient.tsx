'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MaintenanceLogin } from '@/components/admin/MaintenanceLogin';
import { CustomIcon } from '@/components/ui/custom-icon';
import { WHATSAPP_DISPLAY, CONTACT_EMAIL, getWhatsAppUrl } from '@/lib/utils-crescendo';

export default function ComingSoonPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const waUrl = getWhatsAppUrl('Hi Crescendo! I have an urgent enquiry.');

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background decoration — large faint musical notation SVG */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"
        aria-hidden
      >
        <Image
          src="/branding/crescendo-notation.svg"
          alt=""
          width={800}
          height={800}
          className="w-[600px] h-[600px] max-w-[80vw] max-h-[80vw]"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Big logo + wordmark */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            src="/branding/crescendo-logo.webp"
            alt="Crescendo Namibia"
            width={120}
            height={120}
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            priority
          />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Crescendo
          </h1>
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-brand-accent">
            Namibia
          </p>
        </div>

        {/* Coming soon message */}
        <div className="space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            We'll Be Right Back
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
            Crescendo Namibia is getting a refresh. Our updated catalog will be
            live soon. For urgent enquiries, reach us below.
          </p>
        </div>

        {/* Contact options */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-full" size="lg">
              <CustomIcon name="message-circle" className="size-4" alt="" />
              WhatsApp
            </Button>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-full" size="lg">
              <CustomIcon name="mail" className="size-4" alt="" />
              Email
            </Button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {WHATSAPP_DISPLAY} · {CONTACT_EMAIL}
        </p>
      </div>

      {/* Small admin icon — fixed to the right side of the screen */}
      <button
        onClick={() => setLoginOpen(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group"
        aria-label="Site Admin"
        title="Site Admin"
      >
        <CustomIcon
          name="shield"
          className="size-4 text-muted-foreground group-hover:text-foreground transition-colors"
          alt=""
        />
      </button>

      <MaintenanceLogin open={loginOpen} onOpenChange={setLoginOpen} />
    </main>
  );
}
