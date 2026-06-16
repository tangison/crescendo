'use client';

import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/data/products';

interface CategoryLandingClientProps {
  products: Product[];
  popularSearches: string[];
  categoryName: string;
  categorySlug: string;
}

export function CategoryLandingClient({
  products,
  popularSearches,
  categoryName,
  categorySlug,
}: CategoryLandingClientProps) {
  const router = useRouter();

  const handleSearchClick = (term: string) => {
    router.push(`/shop?category=${categorySlug}&q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Popular searches */}
      {popularSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-secondary/40 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Search className="size-4 text-brand-accent" />
            <h3 className="text-sm font-bold tracking-wide uppercase">Popular Searches in {categoryName}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleSearchClick(term)}
                className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
