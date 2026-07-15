import type { Metadata } from 'next';
import { ComingSoonClient } from './ComingSoonClient';

export const metadata: Metadata = {
  title: 'Crescendo Namibia — Coming Soon',
  description: 'Crescendo Namibia is getting a refresh. Our updated catalog will be live soon.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return <ComingSoonClient />;
}
