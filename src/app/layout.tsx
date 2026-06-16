import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Crescendo Namibia — Your Music, Our Passion",
    template: "%s — Crescendo Namibia",
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
  icons: {
    icon: "/branding/crescendo-logo.webp",
  },
  metadataBase: new URL("https://www.crescendona.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Crescendo Namibia — Your Music, Our Passion",
    description:
      "Namibia's premier music store in Windhoek. Instruments, pro audio, accessories, and expert advice for every musician.",
    siteName: "Crescendo Namibia",
    type: "website",
    url: "https://www.crescendona.com",
    locale: "en_NA",
    images: [
      {
        url: "/branding/crescendo-logo.webp",
        width: 1200,
        height: 630,
        alt: "Crescendo Namibia — Your Music, Our Passion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crescendo Namibia — Your Music, Our Passion",
    description:
      "Namibia's premier music store in Windhoek. Your Music, Our Passion.",
    images: ["/branding/crescendo-logo.webp"],
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
              "@type": "Organization",
              name: "Crescendo Namibia",
              url: "https://www.crescendona.com",
              logo: "https://www.crescendona.com/branding/crescendo-logo.webp",
              description:
                "Namibia's premier music store. Instruments, pro audio, accessories, and expert advice.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Windhoek",
                addressCountry: "NA",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+264-81-234-5678",
                contactType: "sales",
                availableLanguage: ["English"],
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
