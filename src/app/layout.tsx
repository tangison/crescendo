import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MaintenanceGate } from "@/components/admin/MaintenanceGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Crescendo Namibia: Your Music, Our Passion",
    template: "%s | Crescendo Namibia",
  },
  description:
    "Namibia's premier music store in Windhoek. Shop guitars, keyboards, drums, pro audio, wind instruments & accessories. Expert advice for every musician.",
  keywords: [
    "Crescendo Namibia",
    "music store Namibia",
    "instruments Windhoek",
    "guitars Namibia",
    "keyboards Namibia",
    "drums Namibia",
    "pro audio Namibia",
    "music shop Windhoek",
    "buy instruments Namibia",
  ],
  authors: [{ name: "Crescendo Namibia" }],
  creator: "Crescendo Namibia",
  publisher: "Crescendo Namibia",
  applicationName: "Crescendo Namibia",
  category: "Shopping",
  icons: {
    icon: [
      { url: "/branding/crescendo-logo.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/branding/crescendo-logo.webp",
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://www.crescendona.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Crescendo Namibia: Your Music, Our Passion",
    description:
      "Namibia's premier music store in Windhoek. Instruments, pro audio, accessories, and expert advice for every musician.",
    siteName: "Crescendo Namibia",
    type: "website",
    url: "https://www.crescendona.com",
    locale: "en_NA",
    images: [
      {
        url: "/hero/og.webp",
        width: 1200,
        height: 630,
        alt: "Crescendo Namibia: a vintage microphone silhouetted against the red dunes of Sossusvlei at golden hour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crescendo Namibia: Your Music, Our Passion",
    description:
      "Namibia's premier music store in Windhoek. Your Music, Our Passion.",
    images: ["/hero/og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "SAZAuvRLUPxDmr3ZY-l8PTCPEaq4OH7JX4pb3dwsSK0",
  },
  other: {
    "msvalidate.01": "", // Bing verification - add token when available
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicStore",
              name: "Crescendo Namibia",
              legalName: "Crescendo Namibia",
              url: "https://www.crescendona.com",
              logo: "https://www.crescendona.com/branding/crescendo-logo.webp",
              image: "https://www.crescendona.com/hero/og.webp",
              description:
                "Namibia's premier music store in Windhoek. Instruments, pro audio, accessories, and expert advice for every musician since 2009.",
              slogan: "Your Music, Our Passion",
              foundingDate: "2009",
              currenciesAccepted: "NAD, USD",
              paymentAccepted: "Cash, Credit Card, Debit Card, EFT",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Windhoek",
                addressRegion: "Khomas",
                addressCountry: "NA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -22.5609,
                longitude: 17.0658,
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+264-81-462-3936",
                contactType: "sales",
                areaServed: "NA",
                availableLanguage: ["English", "Afrikaans"],
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:30",
                  closes: "17:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "13:00",
                },
              ],
              priceRange: "N$50 - N$50,000",
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Crescendo Namibia",
              url: "https://www.crescendona.com",
              inLanguage: "en-NA",
              publisher: {
                "@type": "MusicStore",
                name: "Crescendo Namibia",
                url: "https://www.crescendona.com",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.crescendona.com/shop?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Where is Crescendo Namibia located?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Crescendo Namibia is located in Windhoek, Namibia. We are Namibia's premier music store, serving musicians since 2009. Contact us on +264 81 462 3936 for directions and store hours.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Crescendo Namibia ship nationwide?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we ship to all major towns and cities across Namibia including Windhoek, Swakopmund, Walvis Bay, Oshakati, Rundu, and Katima Mulilo. Shipping costs are calculated at checkout based on destination and order size.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What products does Crescendo Namibia sell?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We stock over 1640 products across 7 categories: guitars and ukuleles, keyboards and digital pianos, drums and percussion, pro audio equipment (microphones, PA systems, mixers), wind and brass instruments, string instruments (violins, cellos), and accessories. We also stock music books and offer artist booking services.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I book a music lesson or artist through Crescendo?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we offer artist booking services for events, live performances, and music lessons. Visit our Book an Artist page or contact us on +264 81 462 3936 to discuss your requirements.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What payment methods does Crescendo Namibia accept?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We accept cash (NAD), credit and debit cards, and electronic funds transfer (EFT). For online orders, you can also order via WhatsApp and pay on delivery or collection.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <MaintenanceGate>
          {children}
        </MaintenanceGate>
      </body>
    </html>
  );
}
