import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/'],
        disallow: ['/api/', '/admin/'],
      },
      // Be explicit with Googlebot for crawl optimization — allow JS/CSS for rendering
      {
        userAgent: 'Googlebot',
        allow: ['/', '/_next/static/'],
        disallow: ['/api/', '/admin/'],
        crawlDelay: 0,
      },
      // Allow image indexing
      {
        userAgent: 'Googlebot-Image',
        allow: ['/products/', '/hero/', '/branding/', '/_next/static/', '/_next/image'],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://www.crescendona.com/sitemap.xml',
    host: 'https://www.crescendona.com',
  };
}
