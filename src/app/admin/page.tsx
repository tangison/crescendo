'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminOverviewPage() {
  const productCount = useQuery(api.queries.getProductCount, {});
  const categoryCounts = useQuery(api.queries.getCategoryCounts, {});
  const artists = useQuery(api.admin.adminGetArtists, {});

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-6">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black font-mono">{productCount ?? '...'}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Products</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black font-mono">{categoryCounts ? Object.keys(categoryCounts).length : '...'}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Categories</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black font-mono">{artists ? artists.length : '...'}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Artists</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black font-mono text-brand-accent">Live</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Status</p>
        </div>
      </div>
      {categoryCounts && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-8">
          <h2 className="text-sm font-bold mb-3">Products by Category</h2>
          <div className="space-y-2">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{cat.replace('-', ' ')}</span>
                <span className="font-mono font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/admin/products" className="bg-card border border-border rounded-2xl p-5 hover:border-brand-accent transition-colors">
          <h3 className="font-bold mb-1">Manage Products</h3>
          <p className="text-sm text-muted-foreground">Edit prices, stock, images and categories.</p>
        </a>
        <a href="/admin/artists" className="bg-card border border-border rounded-2xl p-5 hover:border-brand-accent transition-colors">
          <h3 className="font-bold mb-1">Manage Artists</h3>
          <p className="text-sm text-muted-foreground">Create and edit artist profiles for booking.</p>
        </a>
      </div>
    </div>
  );
}
