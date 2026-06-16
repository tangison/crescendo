'use client';

import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';

function getFeaturedProducts() {
  // Pick diverse products from different categories with stock
  const targetCategories = ['guitars', 'keyboards', 'drums', 'strings', 'wind', 'pro-audio', 'accessories'];
  const picked: typeof products = [];
  const usedIds = new Set<string>();

  for (const cat of targetCategories) {
    const match = products.find(
      (p) => p.category === cat && !usedIds.has(p.id) && p.qty > 0
    );
    if (match) {
      picked.push(match);
      usedIds.add(match.id);
    }
  }

  // Fill remaining slots with popular accessories
  const remaining = products.filter(
    (p) => !usedIds.has(p.id) && p.qty > 0 && p.price > 500
  );
  while (picked.length < 8 && remaining.length > 0) {
    const next = remaining.shift()!;
    if (!usedIds.has(next.id)) {
      picked.push(next);
      usedIds.add(next.id);
    }
  }

  return picked.slice(0, 8);
}

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-accent mb-2">
            Curated Selection
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Featured Instruments
          </h2>
        </motion.div>

        {/* Desktop: 4-column grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal scrollable */}
        <div className="sm:hidden flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {featured.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[200px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
