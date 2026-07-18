import { ProductGrid } from '@/components/products/ProductGrid';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: 'Shop Instruments, Pro Audio & Accessories in Namibia',
  description:
    'Browse over 1640 instruments, pro audio gear, and accessories at Crescendo Namibia. Guitars, keyboards, drums, wind, strings, and more in Windhoek. Namibia-wide shipping since 2019.',
  alternates: {
    canonical: 'https://www.crescendona.com/shop',
  },
  keywords: [
    'music store Namibia',
    'buy instruments Namibia',
    'guitars Windhoek',
    'keyboards Namibia',
    'drums Namibia',
    'pro audio Namibia',
    'Crescendo shop',
  ],
  openGraph: {
    title: 'Shop | Crescendo Namibia',
    description:
      'Browse our full collection of 1640+ instruments, pro audio gear, and accessories in Windhoek, Namibia.',
    url: 'https://www.crescendona.com/shop',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop | Crescendo Namibia',
    description: 'Browse 1640+ instruments, pro audio gear, and accessories in Windhoek, Namibia.',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.crescendona.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.crescendona.com/shop' },
  ],
};

function ShopContent() {
  return <ProductGrid />;
}

export default function ShopPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
    </>
  );
}
