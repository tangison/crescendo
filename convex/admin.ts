import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ===== ADMIN QUERIES (public for now, will add auth later) =====

// Get ALL products (admin view, including unpublished)
export const adminGetProducts = query({
  args: {
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
    categorySlug: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pageSize = Math.min(args.pageSize ?? 24, 100);
    const page = args.page ?? 1;
    const offset = (page - 1) * pageSize;

    let q = ctx.db.query("products");

    if (args.categorySlug) {
      q = q.withIndex("by_category_and_published", (q) =>
        q.eq("categorySlug", args.categorySlug!)
      );
    }

    const all = await q.collect();

    let filtered = all;
    if (args.searchQuery) {
      const sq = args.searchQuery.toLowerCase();
      filtered = all.filter(p =>
        p.name.toLowerCase().includes(sq) ||
        p.brand.toLowerCase().includes(sq) ||
        p.sku.toLowerCase().includes(sq)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + pageSize);

    return { products: paginated, total, page, pageSize };
  },
});

// Get single product by ID (admin)
export const adminGetProductById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id as any);
  },
});

// Get ALL artists (admin, including unpublished)
export const adminGetArtists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("artists")
      .order("asc")
      .collect();
  },
});

// Get single artist by ID (admin)
export const adminGetArtistById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id as any);
  },
});

// Get all categories (admin)
export const adminGetCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .order("asc")
      .collect();
  },
});

// Get all settings (admin)
export const adminGetSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("siteSettings")
      .collect();
  },
});

// Get all legal pages (admin)
export const adminGetLegalPages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("legalPages")
      .collect();
  },
});

// Get all pages (admin)
export const adminGetPages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pages")
      .collect();
  },
});

// ===== ADMIN MUTATIONS (public for now — will add auth via Convex auth later) =====

export const adminUpdateProduct = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    priceCents: v.optional(v.number()),
    quantity: v.optional(v.number()),
    image: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    needsReview: v.optional(v.boolean()),
    categorySlug: v.optional(v.string()),
    skillLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Product not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    // Update searchText if name/brand changed
    if (cleaned.name || cleaned.brand) {
      cleaned.searchText = `${(cleaned.name || before.name).toLowerCase()} ${(cleaned.brand || before.brand).toLowerCase()} ${before.sku.toLowerCase()} ${(cleaned.categorySlug || before.categorySlug).toLowerCase()}`;
      cleaned.nameNormalized = (cleaned.name || before.name).toLowerCase();
      cleaned.brandNormalized = (cleaned.brand || before.brand).toLowerCase();
    }
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    return { success: true };
  },
});

export const adminCreateArtist = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    profession: v.string(),
    artistCategory: v.optional(v.string()),
    shortBio: v.optional(v.string()),
    fullBio: v.optional(v.string()),
    image: v.optional(v.string()),
    isPublished: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    displayOrder: v.number(),
    bookingMessage: v.string(),
    genres: v.optional(v.array(v.string())),
    performanceTypes: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    rateNote: v.optional(v.string()),
    availabilityNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("artists", {
      ...args,
      needsReview: false,
      reviewReasons: [],
      socialLinks: undefined,
      createdAt: now,
      updatedAt: now,
    });
    return { success: true, id };
  },
});

export const adminUpdateArtist = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    profession: v.optional(v.string()),
    shortBio: v.optional(v.string()),
    fullBio: v.optional(v.string()),
    image: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
    bookingMessage: v.optional(v.string()),
    genres: v.optional(v.array(v.string())),
    performanceTypes: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    rateNote: v.optional(v.string()),
    availabilityNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Artist not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    return { success: true };
  },
});

export const adminUpdateCategory = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    productCount: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Category not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    return { success: true };
  },
});

export const adminUpdateSetting = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedAt: now });
    }
    return { success: true };
  },
});

export const adminUpdateLegalPage = mutation({
  args: {
    id: v.string(),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Legal page not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    return { success: true };
  },
});
