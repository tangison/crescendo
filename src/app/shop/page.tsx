import { ProductGrid } from '@/components/products/ProductGrid';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Instruments, Pro Audio & Accessories',
  description:
    'Browse over 1600 instruments, pro audio gear, and accessories at Crescendo Namibia. Guitars, keyboards, drums, wind, strings, and more in Windhoek.',
  alternates: {
    canonical: 'https://www.crescendona.com/shop',
  },
  openGraph: {
    title: 'Shop — Crescendo Namibia',
    description:
      'Browse our full collection of instruments, pro audio gear, and accessories in Windhoek, Namibia.',
    url: 'https://www.crescendona.com/shop',
  },
};

function ShopContent() {
  return <ProductGrid />;
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-secondary rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-secondary rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
