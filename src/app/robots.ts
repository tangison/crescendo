import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      // Be explicit with Googlebot for crawl optimization
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
        crawlDelay: 0,
      },
      // Allow image indexing
      {
        userAgent: 'Googlebot-Image',
        allow: ['/products/', '/hero/', '/branding/'],
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: 'https://www.crescendona.com/sitemap.xml',
    host: 'https://www.crescendona.com',
  };
}
