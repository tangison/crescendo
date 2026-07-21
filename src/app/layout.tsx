import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
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
    default: "Crescendo Namibia: Strive for Excellence",
    template: "%s | Crescendo Namibia",
  },
  description:
    "Namibia's premier music store in Windhoek. Shop guitars, keyboards, drums, pro audio, wind instruments & accessories. Expert advice for every musician.",
  keywords: [
    "Crescendo Namibia",
    "Strive for Excellence",
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
    title: "Crescendo Namibia: Strive for Excellence",
    description:
      "A one-stop retail and entertainment store providing musical instruments, PA systems, stages, lights, audiovisual and studio solutions. Since 2019.",
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
    title: "Crescendo Namibia: Strive for Excellence",
    description:
      "A one-stop retail and entertainment store. Strive for Excellence. Since 2019.",
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
                "A one-stop retail and entertainment store providing a wide range of musical instruments, PA systems, stages, lights, audiovisual and studio solutions. Since 2019.",
              slogan: "Strive for Excellence",
              foundingDate: "2019",
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
                
              ],
              priceRange: "N$50 - N$100,000",
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
                    text: "Crescendo Namibia is located in Windhoek, Namibia. We are Namibia's premier music store, serving musicians since 2019. Contact us on +264 81 462 3936 for directions and store hours.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Crescendo Namibia ship nationwide?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we ship to all major towns and cities across Namibia including Windhoek, Swakopmund, Walvis Bay, Oshakati, Rundu, and Katima Mulilo. Contact us on WhatsApp for delivery costs and arrangements.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What products does Crescendo Namibia sell?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We stock over 1600 products across 6 categories: Guitars Ukuleles and Strings, Wind and Brass, Drums and Percussion, Pro Audio and PA Systems, Keyboards and Pianos, and Accessories. We also offer artist booking services.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I book an artist through Crescendo?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we offer artist booking services for events and live performances. Visit our Book an Artist page or contact us on +264 81 462 3936 to discuss your requirements.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What payment methods does Crescendo Namibia accept?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We accept cash (NAD), credit and debit cards, and electronic funds transfer (EFT). Enquiries and orders can be placed via WhatsApp.",
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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
