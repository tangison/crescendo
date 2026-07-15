'use client';

import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomIcon } from '@/components/ui/custom-icon';
import { getSkillLevelColor } from '@/lib/utils-crescendo';

interface ProductFiltersProps {
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSkillLevels: string[];
  priceRange: [number, number];
  onCategoryChange: (categories: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onSkillLevelChange: (levels: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearAll: () => void;
}

function getTopBrands(): { name: string; count: number }[] {
  const brandCounts: Record<string, number> = {};
  products.forEach((p) => {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
  });
  return Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Professional'];

const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: 'Under N$ 500', min: 0, max: 500 },
  { label: 'N$ 500 - N$ 1,000', min: 500, max: 1000 },
  { label: 'N$ 1,000 - N$ 5,000', min: 1000, max: 5000 },
  { label: 'N$ 5,000 - N$ 10,000', min: 5000, max: 10000 },
  { label: 'Over N$ 10,000', min: 10000, max: Infinity },
];

export function ProductFilters({
  selectedCategories,
  selectedBrands,
  selectedSkillLevels,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onSkillLevelChange,
  onPriceRangeChange,
  onClearAll,
}: ProductFiltersProps) {
  const topBrands = getTopBrands();
  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSkillLevels.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < Infinity;

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onCategoryChange(selectedCategories.filter((c) => c !== slug));
    } else {
      onCategoryChange([...selectedCategories, slug]);
    }
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const toggleSkillLevel = (level: string) => {
    if (selectedSkillLevels.includes(level)) {
      onSkillLevelChange(selectedSkillLevels.filter((l) => l !== level));
    } else {
      onSkillLevelChange([...selectedSkillLevels, level]);
    }
  };

  const togglePriceRange = (range: { min: number; max: number }) => {
    if (priceRange[0] === range.min && priceRange[1] === range.max) {
      onPriceRangeChange([0, Infinity]);
    } else {
      onPriceRangeChange([range.min, range.max]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide uppercase">Filters</h3>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-brand-accent hover:underline flex items-center gap-1"
          >
            <CustomIcon name="x" className="size-3" alt="" />
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Category Filter */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Category
        </p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors min-h-[40px] ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <span className="font-medium">{cat.name}</span>
              <span
                className={`text-xs ${
                  selectedCategories.includes(cat.slug)
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand Filter */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Brand
        </p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {topBrands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => toggleBrand(brand.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors min-h-[40px] ${
                selectedBrands.includes(brand.name)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <span className="font-medium truncate">{brand.name}</span>
              <span
                className={`text-xs flex-shrink-0 ml-2 ${
                  selectedBrands.includes(brand.name)
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {brand.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skill Level Filter */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Skill Level
        </p>
        <div className="flex flex-wrap gap-2">
          {SKILL_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => toggleSkillLevel(level)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedSkillLevels.includes(level)
                  ? getSkillLevelColor(level)
                  : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Price Range
        </p>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => togglePriceRange(range)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors min-h-[40px] ${
                priceRange[0] === range.min && priceRange[1] === range.max
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <span className="font-medium">{range.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
