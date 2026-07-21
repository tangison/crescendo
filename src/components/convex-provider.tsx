'use client';

import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';
import { ReactNode, useMemo } from 'react';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://academic-wombat-389.convex.cloud';

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => new ConvexReactClient(CONVEX_URL), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
