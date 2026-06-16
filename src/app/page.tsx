import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Crescendo Namibia — Your Music, Our Passion",
  description:
    "Namibia's premier music store in Windhoek. Over 1640 instruments, pro audio, and accessories. Shop guitars, keyboards, drums, and more since 2009. Book artists and music lessons.",
  alternates: {
    canonical: "https://www.crescendona.com",
  },
  keywords: [
    "Crescendo Namibia",
    "music store Namibia",
    "instruments Windhoek",
    "music shop Namibia",
    "buy instruments online Namibia",
    "guitars keyboards drums Namibia",
  ],
  openGraph: {
    title: "Crescendo Namibia — Your Music, Our Passion",
    description:
      "Namibia's premier music store. Over 1640 instruments, pro audio, and accessories since 2009.",
    url: "https://www.crescendona.com",
    type: "website",
    images: [
      {
        url: "/hero/og.webp",
        width: 1200,
        height: 630,
        alt: "Crescendo Namibia — World-class music stage in the Namib Desert at golden hour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crescendo Namibia — Your Music, Our Passion",
    description: "Namibia's premier music store. Over 1640 instruments, pro audio, and accessories since 2009.",
    images: ["/hero/og.webp"],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
    </>
  );
}
