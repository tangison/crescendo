import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Crescendo Namibia — Your Music, Our Passion",
  description:
    "Namibia's premier music store in Windhoek. Over 1600 instruments, pro audio, and accessories. Shop guitars, keyboards, drums, and more since 2009.",
  alternates: {
    canonical: "https://www.crescendona.com",
  },
  openGraph: {
    title: "Crescendo Namibia — Your Music, Our Passion",
    description:
      "Namibia's premier music store. Over 1600 instruments, pro audio, and accessories since 2009.",
    url: "https://www.crescendona.com",
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
