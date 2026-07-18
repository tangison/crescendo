import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { CustomIcon } from '@/components/ui/custom-icon';

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
  const title = `${category.name} — ${catProducts.length} Products | Crescendo Namibia`;
  const description = `Shop ${category.name.toLowerCase()} at Crescendo Namibia. ${category.description}`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/category/${slug}` },
    keywords: [category.name, `buy ${category.name.toLowerCase()} Namibia`, 'Crescendo Namibia'],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <CustomIcon name="chevron-right" className="size-3.5 flex-shrink-0" alt="" />
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <CustomIcon name="chevron-right" className="size-3.5 flex-shrink-0" alt="" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>
      </div>

      {/* Category banner — minimal */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
        <div className="relative overflow-hidden aspect-[21/9] sm:aspect-[3/1] rounded-2xl">
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
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-3">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed">
                {category.description}
              </p>
              <p className="text-xs text-white/50 mt-3">{catProducts.length} products available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to shop with filters */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          href={`/shop?category=${slug}`}
          className="inline-flex items-center gap-2 h-11 px-6 bg-brand-accent hover:bg-brand-accent/90 text-brand-dark text-sm font-semibold transition-colors rounded-full"
        >
          Browse all {catProducts.length} {category.name}
          <CustomIcon name="arrow-right" className="size-4" alt="" />
        </Link>
      </section>
    </>
  );
}
