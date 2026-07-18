import type { Metadata } from 'next';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'Crescendo Namibia is getting a refresh. Our updated catalog will be live soon.',
  alternates: {
    canonical: '/coming-soon',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ComingSoonClient />;
}
