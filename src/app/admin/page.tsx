'use client';

import { useState, useEffect } from 'react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{ products: number; categories: Record<string, number>; artists: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [countRes, catRes, artistRes] = await Promise.all([
        fetch('https://academic-wombat-389.convex.cloud/api/query', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: 'queries.js:getProductCount', args: {}, format: 'json' }),
        }),
        fetch('https://academic-wombat-389.convex.cloud/api/query', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: 'queries.js:getCategoryCounts', args: {}, format: 'json' }),
        }),
        fetch('https://academic-wombat-389.convex.cloud/api/query', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: 'admin.js:adminGetArtists', args: {}, format: 'json' }),
        }),
      ]);
      const [count, cats, artists] = await Promise.all([countRes.json(), catRes.json(), artistRes.json()]);
      setStats({
        products: count.value,
        categories: cats.value,
        artists: artists.value?.length || 0,
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-6">Overview</h1>

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black font-mono">{stats.products}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Products</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black font-mono">{Object.keys(stats.categories).length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Categories</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black font-mono">{stats.artists}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Artists</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black font-mono text-brand-accent">Live</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Status</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
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
