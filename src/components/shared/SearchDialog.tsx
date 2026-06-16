'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import { products } from '@/data/products';
import { formatPrice, getCategoryName } from '@/lib/utils-crescendo';

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

const RECENT_KEY = 'crescendo-recent-searches';

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
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
}

function SearchDialogContent({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches = useMemo(() => getRecentSearchesFromStorage(), []);

  const searchProducts = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matched = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
    setResults(matched);
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      // Debounced search via setTimeout
      setTimeout(() => searchProducts(value), 200);
    },
    [searchProducts]
  );

  // Auto-focus on mount
  useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(result.name);
    onOpenChange(false);
    router.push(`/shop/${result.slug}`);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    searchProducts(search);
  };

  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle>Search Products</DialogTitle>
        <DialogDescription>Search for instruments, gear, and accessories</DialogDescription>
      </DialogHeader>
      <div className="flex items-center border-b px-4">
        <Search className="size-5 text-muted-foreground flex-shrink-0" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search instruments, brands, categories..."
          className="border-0 shadow-none focus-visible:ring-0 h-12 text-base"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="p-1.5 hover:bg-accent rounded-md transition-colors"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <ScrollArea className="max-h-[60vh]">
        {results.length > 0 ? (
          <div className="py-2">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
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
                  <p className="text-sm font-medium truncate">{result.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.brand} · {getCategoryName(result.category)}
                  </p>
                </div>
                <p className="text-sm font-mono font-semibold text-brand-accent flex-shrink-0">
                  {formatPrice(result.price)}
                </p>
              </button>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="py-12 text-center text-muted-foreground">
            <Search className="size-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No products found for &ldquo;{query}&rdquo;</p>
            <p className="text-xs mt-1">Try different keywords</p>
          </div>
        ) : recentSearches.length > 0 ? (
          <div className="py-3">
            <p className="px-4 pb-2 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
              Recent Searches
            </p>
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => handleRecentClick(search)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left text-sm"
              >
                <Search className="size-3.5 text-muted-foreground" />
                <span className="truncate">{search}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Search className="size-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Start typing to search</p>
            <p className="text-xs mt-1">Search by name, brand, or category</p>
          </div>
        )}
      </ScrollArea>
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
