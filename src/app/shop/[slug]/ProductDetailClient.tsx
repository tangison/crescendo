'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductImage } from '@/components/products/ProductImage';
import { CustomIcon } from '@/components/ui/custom-icon';
import { useCartStore } from '@/stores/cart-store';
import {
  formatPrice,
  getCategoryName,
  getStockStatus,
  getSkillLevelColor,
  getProductWhatsAppMessage,
  getWhatsAppUrl,
} from '@/lib/utils-crescendo';
import type { Product } from '@/data/products';
import type { Category } from '@/data/categories';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductDetailPageProps {
  product: Product;
  category?: Category;
  relatedProducts: Product[];
}

export function ProductDetailPage({
  product,
  category,
  relatedProducts,
}: ProductDetailPageProps) {
  const addItem = useCartStore((s) => s.addItem);
  const stockStatus = getStockStatus(product.qty);
  const whatsappUrl = getWhatsAppUrl(getProductWhatsAppMessage(product));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Format description: split by newlines into paragraphs
  const descriptionLines = (product.shortDescription || '').split('\n').filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-foreground transition-colors whitespace-nowrap">
          Home
        </Link>
        <CustomIcon name="chevron-right" className="size-3.5 flex-shrink-0" alt="" />
        <Link href="/shop" className="hover:text-foreground transition-colors whitespace-nowrap">
          Shop
        </Link>
        <CustomIcon name="chevron-right" className="size-3.5 flex-shrink-0" alt="" />
        <Link
          href={`/category/${product.category}`}
          className="hover:text-foreground transition-colors whitespace-nowrap"
        >
          {category?.name || getCategoryName(product.category)}
        </Link>
        <CustomIcon name="chevron-right" className="size-3.5 flex-shrink-0" alt="" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square bg-card border border-border overflow-hidden p-6 sm:p-10" style={{ borderRadius: '1rem' }}>
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              className="img-product p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          {/* Brand */}
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {product.brand}
          </p>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-2xl sm:text-3xl font-mono font-bold text-brand-accent mt-3">
            {formatPrice(product.price)}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold ${getSkillLevelColor(
                product.skillLevel
              )}`}
            >
              {product.skillLevel}
            </span>
            <Badge variant={stockStatus.variant} className="text-xs">
              {stockStatus.label}
            </Badge>
            <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-xl bg-secondary">
              {getCategoryName(product.category)}
            </span>
          </div>

          <Separator className="my-5" />

          {/* Description - preserves newlines for features list */}
          {descriptionLines.length > 0 && (
            <div className="text-sm text-muted-foreground leading-relaxed mb-5 space-y-2">
              {descriptionLines.map((line, i) => (
                <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="size-9 flex items-center justify-center hover:bg-accent transition-colors rounded-l-lg"
                aria-label="Decrease quantity"
              >
                <CustomIcon name="minus" className="size-3.5" alt="" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="size-9 flex items-center justify-center hover:bg-accent transition-colors rounded-r-lg"
                aria-label="Increase quantity"
              >
                <CustomIcon name="plus" className="size-3.5" alt="" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              size="lg"
              className="flex-1 h-12 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <CustomIcon name="message-circle" tone="mono-light" className="size-5 mr-2" alt="" />
                Enquire via WhatsApp
              </a>
            </Button>
            <Button
              variant={added ? 'default' : 'outline'}
              size="lg"
              onClick={handleAddToCart}
              disabled={product.qty <= 0}
              className={`flex-1 h-12 text-base transition-all ${added ? 'bg-brand-accent text-brand-dark' : ''}`}
            >
              <CustomIcon
                name="shopping-bag"
                tone={added ? 'mono-dark' : 'default'}
                className="size-5 mr-2"
                alt=""
              />
              {added ? 'Added to List!' : 'Add to Enquiry List'}
            </Button>
          </div>

          <Separator className="my-5" />

          {/* Product Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <Link
                href={`/category/${product.category}`}
                className="font-medium hover:text-brand-accent transition-colors"
              >
                {getCategoryName(product.category)}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Skill Level</span>
              <span className="font-medium">{product.skillLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product ID</span>
              <span className="font-mono text-xs">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium">
                {product.qty > 0 ? `${product.qty} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <Separator className="mb-8" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
