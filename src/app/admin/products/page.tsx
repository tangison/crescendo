'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Product {
  _id: string;
  name: string;
  brand: string;
  sku: string;
  categorySlug: string;
  priceCents: number;
  quantity: number;
  isPublished: boolean;
  needsReview: boolean;
  image: string;
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const data = useQuery(api.admin.adminGetProducts, {
    page,
    pageSize: 24,
    searchQuery: search || undefined,
    categorySlug: category || undefined,
  });

  const updateProduct = useMutation(api.admin.adminUpdateProduct);

  const formatPrice = (cents: number) => `N$ ${(cents / 100).toFixed(2)}`;

  const handleSave = async (product: Product, updates: Record<string, unknown>) => {
    await updateProduct({ id: product._id, ...updates });
    setEditingProduct(null);
  };

  const categories = [
    { slug: '', name: 'All Categories' },
    { slug: 'accessories', name: 'Accessories' },
    { slug: 'wind', name: 'Wind & Brass' },
    { slug: 'strings', name: 'Guitars, Ukuleles & Strings' },
    { slug: 'drums', name: 'Drums & Percussion' },
    { slug: 'pro-audio', name: 'Pro Audio' },
    { slug: 'keyboards', name: 'Keyboards & Pianos' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? '...'} total products</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, brand, SKU..."
          className="flex-1 px-4 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {data === undefined ? (
        <div className="text-center py-12">
          <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">Loading products...</p>
        </div>
      ) : data.products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found.
        </div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((p: Product) => (
                    <tr key={p._id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="size-10 rounded-lg object-cover bg-secondary flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{p.sku}</td>
                      <td className="px-4 py-3 text-xs hidden md:table-cell">{p.categorySlug}</td>
                      <td className="px-4 py-3 text-right font-mono font-medium">{formatPrice(p.priceCents)}</td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">{p.quantity}</td>
                      <td className="px-4 py-3 text-center">
                        {p.needsReview ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium">Review</span>
                        ) : p.isPublished ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Published</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium">Hidden</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setEditingProduct(p)} className="text-xs text-brand-accent hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.total > data.pageSize && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-full border border-border text-sm font-medium disabled:opacity-40 hover:bg-accent transition-colors">Previous</button>
              <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(data.total / data.pageSize)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / data.pageSize)} className="px-4 py-2 rounded-full border border-border text-sm font-medium disabled:opacity-40 hover:bg-accent transition-colors">Next</button>
            </div>
          )}
        </>
      )}

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSave} />
      )}
    </div>
  );
}

function EditProductModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product, u: Record<string, unknown>) => void }) {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState((product.priceCents / 100).toFixed(2));
  const [qty, setQty] = useState(String(product.quantity));
  const [image, setImage] = useState(product.image);
  const [isPublished, setIsPublished] = useState(product.isPublished);
  const [needsReview, setNeedsReview] = useState(product.needsReview);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(product, {
      name, brand,
      priceCents: Math.round(parseFloat(price) * 100),
      quantity: parseInt(qty) || 0,
      image, isPublished, needsReview,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Edit Product</h2>
            <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Brand</label>
              <input value={brand} onChange={e => setBrand(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Price (NAD)</label>
                <input value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Stock Qty</label>
                <input value={qty} onChange={e => setQty(e.target.value)} type="number" className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Image URL</label>
              <input value={image} onChange={e => setImage(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded" />
                <span className="text-sm">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={needsReview} onChange={e => setNeedsReview(e.target.checked)} className="rounded" />
                <span className="text-sm">Needs Review</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 rounded-full bg-brand-accent text-brand-dark text-sm font-semibold hover:bg-brand-accent/90 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
