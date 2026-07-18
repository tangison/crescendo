'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomIcon } from '@/components/ui/custom-icon';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { formatPrice, getCategoryName } from '@/lib/utils-crescendo';
import { ProductImage } from '@/components/products/ProductImage';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  image: string;
}

interface CategoryGroup {
  category: string;
  categoryName: string;
  count: number;
  results: SearchResult[];
}

const RECENT_KEY = 'crescendo-recent-searches';
const DEBOUNCE_MS = 200;

const POPULAR_SEARCHES = ['Roland', 'Ibanez', 'Shure', 'Yamaha', 'guitar', 'keyboard', 'saxophone'];

function getRecentSearchesFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentSearchesFromStorage().filter((s) => s !== query);
    recent.unshift(query);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
  } catch {
    // ignore
  }
}

function SearchDialogContent({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearchesFromStorage());
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      setHasSearched(true);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  // GLOBAL search — searches ALL products regardless of current URL
  const groupedResults = useMemo<CategoryGroup[]>(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];

    const matched = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        getCategoryName(p.category).toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );

    const groups: Record<string, SearchResult[]> = {};
    for (const p of matched) {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push({
        id: p.id, name: p.name, slug: p.slug, brand: p.brand,
        category: p.category, price: p.price, image: p.image,
      });
    }

    return Object.entries(groups)
      .map(([cat, items]) => ({
        category: cat, categoryName: getCategoryName(cat), count: items.length,
        results: items.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const aStarts = aName.startsWith(q) ? 0 : 1;
          const bStarts = bName.startsWith(q) ? 0 : 1;
          if (aStarts !== bStarts) return aStarts - bStarts;
          return aName.localeCompare(bName);
        }).slice(0, 5),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [debouncedQuery]);

  const totalResults = useMemo(
    () => groupedResults.reduce((s, g) => s + g.count, 0),
    [groupedResults]
  );

  const matchingCategories = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(debouncedQuery);
    onOpenChange(false);
    router.push(`/shop/${result.slug}`);
  };

  const handleViewAllResults = () => {
    saveRecentSearch(debouncedQuery);
    onOpenChange(false);
    router.push(`/shop?q=${encodeURIComponent(debouncedQuery)}`);
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setHasSearched(true);
  };

  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle>Search Products</DialogTitle>
        <DialogDescription>Search across the full catalogue by name, brand, category or SKU.</DialogDescription>
      </DialogHeader>

      {/* Search header with input + SINGLE close button (no separate clear ×) */}
      <div className="flex items-center gap-2 px-4 sm:px-5 h-14 sm:h-16 border-b border-border">
        <CustomIcon name="search" className="size-5 text-muted-foreground flex-shrink-0" alt="" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search all products, brands, SKUs..."
          className="flex-1 h-full bg-transparent text-base sm:text-lg outline-none placeholder:text-muted-foreground/60 min-w-0"
          aria-label="Search products"
        />
        {/* Single close button — closes the entire dialog.
            Clear is handled by selecting all + delete, or just typing. */}
        <button
          onClick={() => onOpenChange(false)}
          className="size-11 flex items-center justify-center rounded-full hover:bg-accent transition-colors flex-shrink-0"
          aria-label="Close search"
        >
          <CustomIcon name="x" className="size-5 text-muted-foreground" alt="" />
        </button>
      </div>

      {/* Show clear filter button only when there's text, as a pill below input */}
      {query && (
        <div className="px-4 sm:px-5 py-2 border-b border-border/50">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary hover:bg-accent text-xs font-medium transition-colors"
          >
            <CustomIcon name="x" className="size-3" alt="" />
            Clear &ldquo;{query.length > 30 ? query.slice(0, 30) + '...' : query}&rdquo;
          </button>
        </div>
      )}

      <ScrollArea className="max-h-[70vh] sm:max-h-[60vh]">
        {debouncedQuery.trim() && (groupedResults.length > 0 || matchingCategories.length > 0) ? (
          <div className="py-3">
            <div className="px-4 sm:px-5 pb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </p>
              <button
                onClick={handleViewAllResults}
                className="text-xs font-medium text-brand-accent hover:underline flex items-center gap-1"
              >
                View all
                <CustomIcon name="arrow-right" className="size-3" alt="" />
              </button>
            </div>

            {matchingCategories.length > 0 && (
              <div className="mb-2 px-4 sm:px-5 py-2 bg-secondary/30">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground mb-1">Categories</p>
                {matchingCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { onOpenChange(false); router.push(`/category/${cat.slug}`); }}
                    className="block w-full text-left text-sm py-1 hover:text-brand-accent transition-colors"
                  >
                    {cat.name} <span className="text-muted-foreground">({cat.productCount})</span>
                  </button>
                ))}
              </div>
            )}

            {groupedResults.map((group) => (
              <div key={group.category} className="mb-2">
                <div className="px-4 sm:px-5 py-1.5 flex items-center justify-between bg-secondary/40">
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground">{group.categoryName}</p>
                  <span className="text-[10px] text-muted-foreground">{group.count}</span>
                </div>
                {group.results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 hover:bg-accent transition-colors text-left group"
                  >
                    <div className="relative w-12 h-12 overflow-hidden bg-secondary flex-shrink-0 border border-border rounded-xl">
                      <ProductImage src={result.image} alt={result.name} fill className="img-product p-1" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-brand-accent transition-colors">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.brand}</p>
                    </div>
                    <p className="text-sm font-mono font-semibold text-brand-accent flex-shrink-0">{formatPrice(result.price)}</p>
                  </button>
                ))}
                {group.count > 5 && (
                  <button
                    onClick={() => { saveRecentSearch(debouncedQuery); onOpenChange(false); router.push(`/shop?category=${group.category}&q=${encodeURIComponent(debouncedQuery)}`); }}
                    className="w-full px-4 sm:px-5 py-2 text-left text-xs font-medium text-brand-accent hover:bg-accent transition-colors flex items-center gap-1"
                  >
                    View all {group.count} in {group.categoryName}
                    <CustomIcon name="arrow-right" className="size-3" alt="" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : hasSearched && debouncedQuery.trim() ? (
          <div className="py-12 text-center px-5">
            <CustomIcon name="search" className="size-10 mx-auto mb-4 text-muted-foreground/30" alt="" />
            <p className="text-base font-semibold mb-1">No matching products found</p>
            <p className="text-sm text-muted-foreground mb-6">No matches for &ldquo;{debouncedQuery}&rdquo; across the full catalogue.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleClear} className="px-5 py-2.5 rounded-full border border-border hover:bg-accent text-sm font-medium transition-colors">Clear search</button>
              <button onClick={() => { onOpenChange(false); router.push('/shop'); }} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">View all products</button>
            </div>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Browse by category:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.slice(0, 4).map((cat) => (
                  <button key={cat.slug} onClick={() => { onOpenChange(false); router.push(`/category/${cat.slug}`); }} className="px-3 py-1.5 rounded-full bg-secondary hover:bg-accent text-xs font-medium transition-colors">{cat.name}</button>
                ))}
              </div>
            </div>
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="py-4">
            <p className="px-4 sm:px-5 pb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">Recent Searches</p>
            {recentSearches.map((search) => (
              <button key={search} onClick={() => handleRecentClick(search)} className="w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 hover:bg-accent transition-colors text-left text-sm">
                <CustomIcon name="search" className="size-3.5 text-muted-foreground" alt="" />
                <span className="truncate">{search}</span>
              </button>
            ))}
            <div className="mt-4 px-4 sm:px-5">
              <p className="pb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button key={term} onClick={() => handleRecentClick(term)} className="px-3 py-1.5 rounded-full bg-secondary hover:bg-accent text-xs font-medium transition-colors">{term}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center px-5">
            <CustomIcon name="search" className="size-10 mx-auto mb-4 text-muted-foreground/30" alt="" />
            <p className="text-base font-semibold mb-1">Search our catalogue</p>
            <p className="text-sm text-muted-foreground mb-6">Search across all {products.length} products by name, brand, category or SKU.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_SEARCHES.map((term) => (
                <button key={term} onClick={() => handleRecentClick(term)} className="px-3 py-1.5 rounded-full bg-secondary hover:bg-accent text-xs font-medium transition-colors">{term}</button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </>
  );
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 max-h-[100vh] sm:max-h-[85vh] overflow-hidden inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] rounded-none sm:rounded-lg border-y-0 sm:border"
        showCloseButton={false}
      >
        {open && <SearchDialogContent onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}
