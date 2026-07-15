'use client';

import Link from 'next/link';
import type { Product } from '@/data/products';
import { formatPrice, getStockStatus, getProductWhatsAppMessage, getWhatsAppUrl } from '@/lib/utils-crescendo';
import { motion } from 'framer-motion';
import { CustomIcon } from '@/components/ui/custom-icon';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const stockStatus = getStockStatus(product.qty);
  const whatsappUrl = getWhatsAppUrl(getProductWhatsAppMessage(product));
  const isNew = false; // Could be set based on createdAt field
  const isOnSale = false; // Could be set based on discount field

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="group"
    >
      <div className="bg-card border border-border overflow-hidden transition-all duration-300 hover:shadow-lg rounded-2xl">
        {/* Image - linked to product detail */}
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative aspect-square bg-secondary/30 p-4 sm:p-6 overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              className="img-product transition-transform duration-500 group-hover:scale-105 p-3"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Sale badge */}
            {isOnSale && (
              <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
                Sale
              </span>
            )}
            {/* New badge */}
            {isNew && !isOnSale && (
              <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                New
              </span>
            )}
            {/* Out of stock overlay */}
            {stockStatus.label === 'Out of Stock' && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <span className="px-3 py-1 bg-destructive text-white text-xs font-semibold rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <Link href={`/shop/${product.slug}`}>
            <p className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-muted-foreground mb-1">
              {product.brand}
            </p>
            <h3 className="text-sm sm:text-base font-semibold line-clamp-2 leading-tight group-hover:text-brand-accent transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <p className="text-base sm:text-lg font-mono font-bold text-brand-accent">
              {formatPrice(product.price)}
            </p>
            {stockStatus.label !== 'Out of Stock' && (
              <span className="text-[10px] text-muted-foreground">
                {product.qty} in stock
              </span>
            )}
          </div>

          {/* WhatsApp CTA - low-profile rounded-full */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 sm:mt-3 w-full flex items-center justify-center gap-2 h-9 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-medium transition-colors rounded-full"
          >
            <CustomIcon name="message-circle" tone="mono-light" className="size-3.5 sm:size-4" alt="" />
            Enquire
          </a>
        </div>
      </div>
    </motion.div>
  );
}
