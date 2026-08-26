/**
 * Headless WordPress client for Crescendo Namibia.
 * CMS: https://crescendo.42web.io
 * Public storefront stays on Next.js. Images stay on Vercel.
 * InfinityFree free hosting cannot hold 1611 product binaries.
 */

export const WP_URL = (
  process.env.NEXT_PUBLIC_WP_URL || 'https://crescendo.42web.io'
).replace(/\/$/, '');

export type WpProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  excerpt: string;
  price: number;
  currency: string;
  sku: string;
  categorySlug: string;
  imageUrl: string;
  brand: string;
  stockStatus: string;
};

type WpRestProduct = {
  id: number;
  slug: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  excerpt?: { rendered?: string };
  meta?: Record<string, unknown> | null;
};

/** Typed error so callers can branch on status (e.g. 401 = rotate app password). */
export class WpRequestError extends Error {
  status: number;
  path: string;
  detail?: string;

  constructor(status: number, path: string, detail?: string) {
    super(`WordPress ${status} on ${path}${detail ? `: ${detail}` : ''}`);
    this.name = 'WpRequestError';
    this.status = status;
    this.path = path;
    this.detail = detail;
  }
}

function authHeader(): Record<string, string> {
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) return {};
  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${WP_URL}${path}`;
  const doFetch = () =>
    fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...authHeader(),
        ...(init?.headers || {}),
      },
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 120 },
    });

  let res: Response;
  try {
    res = await doFetch();
  } catch (err) {
    // One retry on network failure or timeout before surfacing the error.
    try {
      res = await doFetch();
    } catch {
      throw new WpRequestError(0, path, err instanceof Error ? err.message : 'network error');
    }
  }
  if (!res.ok) {
    throw new WpRequestError(res.status, path);
  }
  return res.json() as Promise<T>;
}

export function mapWpProduct(p: WpRestProduct): WpProduct {
  const meta = p.meta || {};
  const cents = Number(meta.price_cents ?? 0);
  return {
    id: p.id,
    slug: p.slug,
    name: p.title?.rendered?.replace(/<[^>]+>/g, '') || p.slug,
    description: p.content?.rendered || '',
    excerpt: p.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
    price: cents / 100,
    currency: String(meta.currency || 'NAD'),
    sku: String(meta.sku || ''),
    categorySlug: String(meta.category_slug || ''),
    imageUrl: String(meta.image_url || ''),
    brand: String(meta.brand || ''),
    stockStatus: String(meta.stock_status || 'instock'),
  };
}

export async function fetchWpProducts(page = 1, perPage = 100): Promise<WpProduct[]> {
  const items = await wpFetch<WpRestProduct[]>(
    `/wp-json/wp/v2/products?per_page=${perPage}&page=${page}&status=publish`
  );
  return items.map(mapWpProduct);
}

export async function fetchWpProductBySlug(slug: string): Promise<WpProduct | null> {
  const items = await wpFetch<WpRestProduct[]>(
    `/wp-json/wp/v2/products?slug=${encodeURIComponent(slug)}`
  );
  if (!items.length) return null;
  return mapWpProduct(items[0]);
}

export async function graphqlProducts(): Promise<Array<{ databaseId: number; title: string; slug: string }>> {
  const res = await fetch(`${WP_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({
      query: '{ products { nodes { databaseId title slug } } }',
    }),
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`WPGraphQL ${res.status}`);
  const json = (await res.json()) as {
    data?: { products?: { nodes?: Array<{ databaseId: number; title: string; slug: string }> } };
  };
  return json.data?.products?.nodes ?? [];
}
