import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductDetailPage } from './ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }
  const category = categories.find((c) => c.slug === product.category);
  const description =
    product.shortDescription ||
    `${product.brand} ${product.name} (${category?.name || product.category}) at Crescendo Namibia. Price N$ ${product.price.toLocaleString()}.`;

  const canonical = `https://www.crescendona.com/shop/${product.slug}`;
  const ogImageUrl = `https://www.crescendona.com${product.image}`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical,
    },
    keywords: [
      product.brand,
      product.name,
      'Crescendo Namibia',
      category?.name || product.category,
      'buy instruments Namibia',
    ],
    openGraph: {
      title: `${product.name} | Crescendo Namibia`,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Crescendo Namibia`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const category = categories.find((c) => c.slug === product.category);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `https://www.crescendona.com${product.image}`,
    description:
      product.shortDescription ||
      `${product.brand} ${product.name} (${category?.name || product.category}) at Crescendo Namibia.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: category?.name || product.category,
    offers: {
      '@type': 'Offer',
      url: `https://www.crescendona.com/shop/${product.slug}`,
      priceCurrency: 'NAD',
      price: product.price,
      availability:
        product.qty > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Crescendo Namibia',
      },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.crescendona.com' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.crescendona.com/shop' },
      { '@type': 'ListItem', position: 3, name: category?.name || product.category, item: `https://www.crescendona.com/category/${product.category}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: `https://www.crescendona.com/shop/${product.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetailPage
        product={product}
        category={category}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
