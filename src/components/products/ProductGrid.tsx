'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { CustomIcon } from '@/components/ui/custom-icon';
import { getCategoryName } from '@/lib/utils-crescendo';

const PRODUCTS_PER_PAGE = 24;

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const CATEGORY_PILLS = [
  { slug: '', name: 'All' },
  ...categories.map((c) => ({ slug: c.slug, name: c.name })),
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'A-Z' },
  { value: 'name-desc', label: 'Z-A' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Professional'] as const;

interface CategoryResult {
  category: string;
  count: number;
  results: typeof products;
}

export function ProductGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state when URL changes (back/forward navigation)
  const urlCategory = searchParams.get('category') || '';
  if (urlCategory !== selectedCategory) {
    setSelectedCategory(urlCategory);
    setCurrentPage(1);
  }
  const urlQuery = searchParams.get('q') || '';
  if (urlQuery !== searchQuery) {
    setSearchQuery(urlQuery);
    setDebouncedQuery(urlQuery);
    setCurrentPage(1);
  }

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Update URL when category changes (in a callback, not an effect)
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    if (newCategory) {
      router.replace(`/shop?category=${newCategory}`, { scroll: false });
    } else {
      router.replace('/shop', { scroll: false });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          getCategoryName(p.category).toLowerCase().includes(q) ||
          (p.shortDescription || '').toLowerCase().includes(q)
      );
    }

    if (selectedSkill) {
      result = result.filter((p) => p.skillLevel === selectedSkill);
    }

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [selectedCategory, debouncedQuery, selectedSkill, sortBy]);

  // Group results by category for instant search display
  const groupedResults = useMemo<CategoryResult[]>(() => {
    if (!debouncedQuery.trim()) return [];
    const groups: Record<string, typeof products> = {};
    filteredProducts.forEach((p) => {
      const cat = p.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return Object.entries(groups)
      .map(([cat, items]) => ({
        category: cat,
        count: items.length,
        results: items.slice(0, 6), // Show 6 per group in dropdown
      }))
      .slice(0, 5); // Max 5 groups in dropdown
  }, [filteredProducts, debouncedQuery]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleClearAll = () => {
    handleCategoryChange('');
    setSelectedSkill('');
    setSortBy('name-asc');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  const hasActiveFilters =
    selectedCategory !== '' || selectedSkill !== '' || debouncedQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {selectedCategory ? getCategoryName(selectedCategory) : 'Shop'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredProducts.length} products
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange('')}
              className="ml-2 text-brand-accent hover:underline"
            >
              Clear filter
            </button>
          )}
        </p>
      </div>

      {/* Search Bar - clean, centered */}
      <div className="relative mb-4">
        <div className="relative">
          <CustomIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" alt="" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search instruments, brands, categories..."
            className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent transition-colors"
              aria-label="Clear search"
            >
              <CustomIcon name="x" className="size-4 text-muted-foreground" alt="" />
            </button>
          )}
        </div>

        {/* Instant search results dropdown */}
        {debouncedQuery.trim() && (
          <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-card border border-border rounded-xl shadow-lg max-h-[60vh] overflow-y-auto">
            {groupedResults.length > 0 ? (
              <div className="py-2">
                {groupedResults.map((group) => (
                  <div key={group.category} className="px-2">
                    <p className="px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
                      {getCategoryName(group.category)} ({group.count})
                    </p>
                    {group.results.map((p) => (
                      <a
                        key={p.id}
                        href={`/shop/${p.slug}`}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-sm"
                      >
                        <span className="flex-1 truncate">{p.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {p.brand}
                        </span>
                        <span className="text-xs font-mono font-semibold text-brand-accent flex-shrink-0">
                          N$ {p.price.toLocaleString()}
                        </span>
                      </a>
                    ))}
                    {group.count > 6 && (
                      <a
                        href={`/shop?category=${group.category}`}
                        className="block px-3 py-2 text-xs text-brand-accent hover:underline"
                      >
                        View all {group.count} in {getCategoryName(group.category)} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <CustomIcon name="search" className="size-8 mx-auto mb-3 opacity-40" alt="" />
                <p className="text-sm">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="text-xs mt-1">Try a different keyword</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Pills - horizontal scrollable on mobile */}
      <div className="mb-4 -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max pb-1">
          {CATEGORY_PILLS.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug || 'all'}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary hover:bg-accent'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toggle Row */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showFilters || selectedSkill || sortBy !== 'name-asc'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-accent'
          }`}
        >
          <CustomIcon name="sliders" className="size-4" alt="" />
          Filter
        </button>

        <span className="text-xs text-muted-foreground hidden sm:inline">
          {filteredProducts.length} results
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="ml-2 text-brand-accent hover:underline"
            >
              Clear all
            </button>
          )}
        </span>

        {/* Sort buttons */}
        <div className="flex items-center gap-1.5">
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Row - hidden by default */}
      {showFilters && (
        <div className="mb-4 p-4 rounded-xl bg-secondary/30 border border-border">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
            Skill Level
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSkill('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedSkill === ''
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-accent'
              }`}
            >
              All Levels
            </button>
            {SKILL_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() =>
                  setSelectedSkill(selectedSkill === level ? '' : level)
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedSkill === level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:bg-accent'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {paginatedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <CustomIcon name="layout-grid" className="size-12 mx-auto text-muted-foreground/40 mb-4" alt="" />
          <p className="text-lg font-semibold mb-1">No products found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your filters or search criteria
          </p>
          <Button variant="outline" onClick={handleClearAll}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <CustomIcon name="chevron-left" className="size-4" alt="" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-9 h-9 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <CustomIcon name="chevron-right" className="size-4" alt="" />
          </Button>
        </div>
      )}
    </div>
  );
}
