import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { formatPrice, getCategoryName } from '@/lib/utils-crescendo';
import { CategoryLandingClient } from './CategoryLandingClient';
import { ArrowRight, ChevronRight, Package, Tag, TrendingUp } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = 'https://www.crescendona.com';

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };

  const catProducts = products.filter((p) => p.category === slug);
  const title = `${category.name}: ${catProducts.length}+ Products at Crescendo Namibia`;
  const description = `Shop ${category.name.toLowerCase()} at Crescendo Namibia. ${category.description} ${catProducts.length}+ products from top brands. Expert advice, Namibia-wide shipping since 2009.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/category/${slug}` },
    keywords: [
      category.name,
      `buy ${category.name.toLowerCase()} Namibia`,
      `${category.name} Windhoek`,
      'Crescendo Namibia',
      'music store Namibia',
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/category/${slug}`,
      type: 'website',
      images: [{ url: category.image, alt: category.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const catProducts = products.filter((p) => p.category === slug);

  // Compute stats
  const brandCounts: Record<string, number> = {};
  let minPrice = Infinity;
  let maxPrice = 0;
  for (const p of catProducts) {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    if (p.price < minPrice) minPrice = p.price;
    if (p.price > maxPrice) maxPrice = p.price;
  }
  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Featured products: pick diverse, in-stock items
  const featured = catProducts
    .filter((p) => p.qty > 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);

  // Popular searches: top brands as search suggestions
  const popularSearches = topBrands.slice(0, 6).map((b) => b.name);

  // JSON-LD: ItemList schema
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.name,
    description: category.description,
    numberOfItems: catProducts.length,
    itemListElement: featured.slice(0, 6).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/shop/${p.slug}`,
      name: p.name,
    })),
  };

  // JSON-LD: Breadcrumb
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/category/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-foreground transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight className="size-3.5 flex-shrink-0" />
          <Link href="/shop" className="hover:text-foreground transition-colors whitespace-nowrap">Shop</Link>
          <ChevronRight className="size-3.5 flex-shrink-0" />
          <span className="text-foreground font-medium whitespace-nowrap">{category.name}</span>
        </nav>
      </div>

      {/* Category Hero */}
      <section className="relative overflow-hidden mt-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden aspect-[21/9] sm:aspect-[3/1]" style={{ borderRadius: '1rem' }}>
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30" />
            <div className="absolute inset-0 flex items-center">
              <div className="p-6 sm:p-10 lg:p-14 max-w-2xl">
                <p className="text-brand-accent text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">
                  {catProducts.length}+ Products Available
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-4">
                  {category.name}
                </h1>
                <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed mb-6">
                  {category.description}
                </p>
                <Link
                  href={`/shop?category=${slug}`}
                  className="inline-flex items-center gap-2 h-11 px-6 bg-brand-accent hover:bg-brand-accent/90 text-brand-dark text-sm font-semibold transition-colors"
                  style={{ borderRadius: '9999px' }}
                >
                  Browse All {category.name}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <Package className="size-5 text-brand-accent mb-2" />
            <p className="text-2xl sm:text-3xl font-black font-mono">{catProducts.length}</p>
            <p className="text-[11px] text-muted-foreground tracking-wide uppercase mt-0.5">Products</p>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <Tag className="size-5 text-brand-accent mb-2" />
            <p className="text-2xl sm:text-3xl font-black font-mono">{Object.keys(brandCounts).length}</p>
            <p className="text-[11px] text-muted-foreground tracking-wide uppercase mt-0.5">Brands</p>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-card border border-border">
            <TrendingUp className="size-5 text-brand-accent mb-2" />
            <p className="text-sm sm:text-base font-black font-mono leading-tight">
              {formatPrice(minPrice)} – {formatPrice(maxPrice)}
            </p>
            <p className="text-[11px] text-muted-foreground tracking-wide uppercase mt-0.5">Price Range</p>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      {topBrands.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Featured Brands</h2>
            <Link
              href={`/shop?category=${slug}`}
              className="text-xs font-medium text-brand-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {topBrands.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?category=${slug}&q=${encodeURIComponent(brand.name)}`}
                className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                {brand.name}
                <span className="ml-2 text-xs text-muted-foreground">{brand.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Featured {category.name}</h2>
            <Link
              href={`/shop?category=${slug}`}
              className="text-xs font-medium text-brand-accent hover:underline flex items-center gap-1"
            >
              View all {catProducts.length} products
              <ArrowRight className="size-3" />
            </Link>
          </div>
          <CategoryLandingClient products={featured} popularSearches={popularSearches} categoryName={category.name} categorySlug={slug} />
        </section>
      )}
    </>
  );
}
