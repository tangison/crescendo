import { BookAnArtistPage } from './BookAnArtistClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book an Artist — Live Music & Lessons',
  description:
    'Book professional musicians for live events or music lessons in Windhoek, Namibia. Live music for weddings, corporate events, and private functions.',
  alternates: {
    canonical: 'https://www.crescendona.com/book-an-artist',
  },
  openGraph: {
    title: 'Book an Artist — Crescendo Namibia',
    description:
      'Live music for your events. Professional musicians for lessons. Book through Crescendo Namibia.',
    url: 'https://www.crescendona.com/book-an-artist',
  },
};

export default function BookAnArtist() {
  return <BookAnArtistPage />;
}
