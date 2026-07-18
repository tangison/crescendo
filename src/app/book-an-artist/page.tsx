import { BookAnArtistPage } from './BookAnArtistClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book an Artist: Live Music for Your Events in Windhoek',
  description:
    'Book professional musicians for live events in Windhoek, Namibia. Live music for weddings, corporate events, and private functions. Experienced artists available.',
  alternates: {
    canonical: 'https://www.crescendona.com/book-an-artist',
  },
  keywords: [
    'book musician Namibia',
    'live music Windhoek',
    'wedding music Namibia',
    'corporate event music',
    'Crescendo artists',
  ],
  openGraph: {
    title: 'Book an Artist | Crescendo Namibia',
    description:
      'Live music for your events. Professional musicians for your events. Book through Crescendo Namibia.',
    url: 'https://www.crescendona.com/book-an-artist',
    type: 'website',
    images: [
      {
        url: '/products/book-an-artist/book-an-artist-hero.webp',
        alt: 'Book an Artist: live music for your events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book an Artist | Crescendo Namibia',
    description: 'Live music for your events. Professional musicians for your events.',
    images: ['/products/book-an-artist/book-an-artist-hero.webp'],
  },
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Book an Artist: Live Music for Your Events',
  serviceType: 'Live Music Performance',
  provider: {
    '@type': 'Organization',
    name: 'Crescendo Namibia',
    url: 'https://www.crescendona.com',
    telephone: '+264-81-462-3936',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Namibia',
  },
  description:
    'Book professional musicians for live events (weddings, corporate, private)  in Windhoek and across Namibia.',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'NAD',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'NAD',
      description: 'Pricing varies by event type and duration. Enquire via WhatsApp for a quote.',
    },
  },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of events can I book artists for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our artists are available for weddings, corporate events, private parties, restaurant residencies, church events, and studio sessions across Namibia.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer music lessons?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Crescendo Namibia has taught over 500 students since 2009. We offer lessons in guitar, piano, drums, vocals, strings, wind instruments, and music theory from beginner to professional level.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book an artist or lesson?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply message us on WhatsApp at +264 81 462 3936 with your event details or lesson interests. Our team will match you with the right artist and provide a quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which areas do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We are based in Windhoek and serve clients across Namibia. For events outside Windhoek, travel arrangements can be discussed during booking.',
      },
    },
  ],
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.crescendona.com' },
    { '@type': 'ListItem', position: 2, name: 'Book an Artist', item: 'https://www.crescendona.com/book-an-artist' },
  ],
};

export default function BookAnArtist() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BookAnArtistPage />
    </>
  );
}
