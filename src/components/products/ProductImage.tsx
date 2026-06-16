'use client';

import Image from 'next/image';
import { useState } from 'react';

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
 * If the image fails to load, a custom illustrative "no preview" image
 * renders instead of a broken image symbol. Used for all product and
 * category images.
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
        className={`flex items-center justify-center bg-secondary/40 p-4 ${className}`}
        aria-label={alt}
        role="img"
      >
        <Image
          src="/fallback/no-preview.png"
          alt=""
          width={240}
          height={240}
          className="max-w-full max-h-full w-auto h-auto object-contain opacity-80"
          aria-hidden
        />
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
