import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Crescendo Namibia — Strive for Excellence",
  description:
    "A one-stop retail and entertainment store — providing a wide range of musical instruments, PA systems, stages, lights, audiovisual, and studio solutions. Since 2019.",
  alternates: {
    canonical: "https://www.crescendona.com",
  },
  keywords: [
    "Crescendo Namibia", "Strive for Excellence",
    "music store Namibia",
    "instruments Windhoek",
    "music shop Namibia",
    "buy instruments online Namibia",
    "guitars keyboards drums Namibia",
  ],
  openGraph: {
    title: "Crescendo Namibia — Strive for Excellence",
    description:
      "A one-stop retail and entertainment store — musical instruments, PA systems, stages, lights, audiovisual, and studio solutions. Since 2019.",
    url: "https://www.crescendona.com",
    type: "website",
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
    title: "Crescendo Namibia — Strive for Excellence",
    description: "A one-stop retail and entertainment store — musical instruments, PA systems, stages, lights, audiovisual, and studio solutions. Since 2019.",
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
