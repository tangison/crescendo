import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { categories } from '@/data/categories';

const BASE_URL = 'https://www.crescendona.com';

/**
 * Sitemap — canonical URLs only.
 * No query-string filter URLs (those canonicalise to /shop).
 *
 * Includes:
 *   - Static pages (home, shop, book-an-artist)
 *   - Category landing pages (6)
 *   - All product pages (1611)
 *   - Legal pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/book-an-artist`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Category landing pages only (no ?category= filter URLs)
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Legal pages
  const legalPages: MetadataRoute.Sitemap = [
    'terms', 'privacy', 'returns', 'shipping', 'warranty', 'payment', 'cookies', 'disclaimer',
  ].map((slug) => ({
    url: `${BASE_URL}/legal/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  // All product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/shop/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...legalPages, ...productPages];
}
