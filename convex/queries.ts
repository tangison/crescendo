import { query } from "./_generated/server";
import { v } from "convex/values";

// Get published categories ordered by displayOrder
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_published_and_order", (q) => q.eq("isPublished", true))
      .order("asc")
      .collect();
  },
});

// Get category by slug
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get paginated products by category
export const getProductsByCategory = query({
  args: {
    categorySlug: v.string(),
    page: v.number(),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = Math.min(args.pageSize ?? 24, 48);
    const offset = (args.page - 1) * pageSize;

    const products = await ctx.db
      .query("products")
      .withIndex("by_category_and_published", (q) =>
        q.eq("categorySlug", args.categorySlug).eq("isPublished", true)
      )
      .order("asc")
      .take(offset + pageSize);

    const paginated = products.slice(offset);
    return {
      products: paginated,
      hasMore: products.length === offset + pageSize,
      page: args.page,
      pageSize,
    };
  },
});

// Get product by slug
export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .first();
  },
});

// Search products using Convex text search
export const searchProducts = query({
  args: {
    query: v.string(),
    categorySlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.query.trim().length < 2) return [];

    const limit = Math.min(args.limit ?? 20, 20);

    let searchBuilder = ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) =>
        q.search("searchText", args.query).eq("isPublished", true)
      );

    if (args.categorySlug) {
      searchBuilder = ctx.db
        .query("products")
        .withSearchIndex("search_products", (q) =>
          q.search("searchText", args.query)
            .eq("isPublished", true)
            .eq("categorySlug", args.categorySlug!)
        );
    }

    return await searchBuilder.take(limit);
  },
});

// Get published artists
export const getPublishedArtists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("artists")
      .withIndex("by_published_and_order", (q) => q.eq("isPublished", true))
      .order("asc")
      .collect();
  },
});

// Get artist by slug
export const getArtistBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artists")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .first();
  },
});

// Get published page by slug
export const getPageBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .first();
  },
});

// Get public site settings
export const getPublicSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);
  },
});

// Get published legal pages list
export const getPublishedLegalPages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("legalPages")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});

// Get legal page by slug
export const getLegalPageBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("legalPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .first();
  },
});

// Get migration status
export const getMigrationStatus = query({
  args: { migrationKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("migrationRuns")
      .withIndex("by_migration_key", (q) => q.eq("migrationKey", args.migrationKey))
      .first();
  },
});

// Get total product count (for reconciliation)
export const getProductCount = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.length;
  },
});

// Get category counts (for reconciliation)
export const getCategoryCounts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
    }
    return counts;
  },
});
