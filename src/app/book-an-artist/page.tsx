import { BookAnArtistPage } from './BookAnArtistClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book an Artist | Crescendo Namibia',
  description: 'Book talented musicians for your events, background music and stage performances in Windhoek, Namibia.',
  alternates: {
    canonical: 'https://www.crescendona.com/book-an-artist',
  },
  keywords: [
    'book musician Namibia',
    'live music Windhoek',
    'saxophonist Namibia',
    'event music Windhoek',
    'Crescendo artists',
  ],
  openGraph: {
    title: 'Book an Artist | Crescendo Namibia',
    description: 'Book talented musicians for your events, background music and stage performances in Namibia.',
    url: 'https://www.crescendona.com/book-an-artist',
    type: 'website',
  },
};

export default function Page() {
  return <BookAnArtistPage />;
}
