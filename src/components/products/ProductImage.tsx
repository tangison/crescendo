'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Whether to use object-contain (product) or object-cover (category hero) */
  fit?: 'contain' | 'cover';
}

/**
 * ProductImage - wraps Next.js Image with an onError fallback.
 * If the image fails to load, a placeholder with an icon renders instead
 * of a broken image symbol. Used for all product and category images.
 */
export function ProductImage({
  src,
  alt,
  fill,
  className = '',
  sizes,
  priority,
  fit = 'contain',
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary/50 ${className}`}
        aria-label={alt}
        role="img"
      >
        <Package className="size-8 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={`${className} ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
