'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { formatPrice, getCategoryName } from '@/lib/utils-crescendo';
import { motion, AnimatePresence } from 'framer-motion';

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
  const recent = getRecentSearchesFromStorage().filter((s) => s !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 6)));
}

const POPULAR_SEARCHES = ['Roland', 'Ibanez', 'Shure', 'Yamaha', 'guitar', 'keyboard', 'drum', 'microphone'];

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

  // Debounced search — 200ms
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      setHasSearched(true);
    }, DEBOUNCE_MS);
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  // Compute grouped results
  const groupedResults = useMemo<CategoryGroup[]>(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];

    const matched = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        getCategoryName(p.category).toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q)
    );

    const groups: Record<string, SearchResult[]> = {};
    for (const p of matched) {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push({
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        category: p.category,
        price: p.price,
        image: p.image,
      });
    }

    // Sort groups by result count (desc), then category name
    return Object.entries(groups)
      .map(([cat, items]) => ({
        category: cat,
        categoryName: getCategoryName(cat),
        count: items.length,
        // Sort within group by best match (name starts-with first, then includes)
        results: items
          .sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const aStarts = aName.startsWith(q) ? 0 : 1;
            const bStarts = bName.startsWith(q) ? 0 : 1;
            if (aStarts !== bStarts) return aStarts - bStarts;
            return aName.localeCompare(bName);
          })
          .slice(0, 5),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [debouncedQuery]);

  const totalResults = useMemo(
    () => groupedResults.reduce((s, g) => s + g.count, 0),
    [groupedResults]
  );

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(result.name);
    onOpenChange(false);
    router.push(`/shop/${result.slug}`);
  };

  const handleViewAllInCategory = (cat: string) => {
    if (query.trim()) saveRecentSearch(query.trim());
    onOpenChange(false);
    router.push(`/shop?category=${cat}`);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    setDebouncedQuery(search);
    setHasSearched(true);
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleViewAllResults = () => {
    if (query.trim()) saveRecentSearch(query.trim());
    onOpenChange(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle>Search Products</DialogTitle>
        <DialogDescription>Search for instruments, gear, and accessories by name, brand, category, or description</DialogDescription>
      </DialogHeader>

      {/* Search input row */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
        <Search className="size-5 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search instruments, brands, categories…"
          className="flex-1 h-full bg-transparent text-base sm:text-lg outline-none placeholder:text-muted-foreground/60"
          aria-label="Search products"
        />
        {query && (
          <button
            onClick={handleClear}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <ScrollArea className="max-h-[60vh]">
        {debouncedQuery.trim() && groupedResults.length > 0 ? (
          <div className="py-3">
            {/* Result count + view all */}
            <div className="px-5 pb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'result' : 'results'} for &ldquo;{debouncedQuery}&rdquo;
              </p>
              <button
                onClick={handleViewAllResults}
                className="text-xs font-medium text-brand-accent hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="size-3" />
              </button>
            </div>

            {/* Grouped results */}
            {groupedResults.map((group) => (
              <div key={group.category} className="mb-2">
                <div className="px-5 py-1.5 flex items-center justify-between bg-secondary/40">
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground">
                    {group.categoryName}
                  </p>
                  <span className="text-[10px] text-muted-foreground">{group.count}</span>
                </div>
                {group.results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-accent transition-colors text-left group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                      <Image
                        src={result.image}
                        alt={result.name}
                        fill
                        className="object-contain img-product p-1"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-brand-accent transition-colors">
                        {result.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{result.brand}</p>
                    </div>
                    <p className="text-sm font-mono font-semibold text-brand-accent flex-shrink-0">
                      {formatPrice(result.price)}
                    </p>
                  </button>
                ))}
                {group.count > 5 && (
                  <button
                    onClick={() => handleViewAllInCategory(group.category)}
                    className="w-full px-5 py-2 text-left text-xs font-medium text-brand-accent hover:bg-accent transition-colors flex items-center gap-1"
                  >
                    View all {group.count} in {group.categoryName}
                    <ArrowRight className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : hasSearched && debouncedQuery.trim() ? (
          <div className="py-16 text-center px-5">
            <Search className="size-10 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-base font-semibold mb-1">No products found</p>
            <p className="text-sm text-muted-foreground">
              No matches for &ldquo;{debouncedQuery}&rdquo;. Try a different keyword.
            </p>
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="py-4">
            <p className="px-5 pb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Recent Searches
            </p>
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => handleRecentClick(search)}
                className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-accent transition-colors text-left text-sm"
              >
                <Search className="size-3.5 text-muted-foreground" />
                <span className="truncate">{search}</span>
              </button>
            ))}
            <div className="mt-4 px-5">
              <p className="pb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="px-3 py-1.5 rounded-full bg-secondary hover:bg-accent text-xs font-medium transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center px-5">
            <Search className="size-10 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-base font-semibold mb-1">Search our catalog</p>
            <p className="text-sm text-muted-foreground">
              Find instruments, gear, and accessories by name, brand, category, or description
            </p>
            <div className="mt-6">
              <p className="pb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="px-3 py-1.5 rounded-full bg-secondary hover:bg-accent text-xs font-medium transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Footer hint */}
      <div className="px-5 py-2.5 border-t border-border bg-secondary/30 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[9px]">↵</kbd> to select
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[9px]">esc</kbd> to close
        </span>
      </div>
    </>
  );
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 max-h-[85vh] overflow-hidden">
        {open && <SearchDialogContent onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}
