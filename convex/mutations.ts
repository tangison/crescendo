import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// All mutations are internal — not callable from client.
// Future admin dashboard will call these via authenticated actions.

export const createCategory = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    image: v.string(),
    productCount: v.number(),
    displayOrder: v.number(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("categories", { ...args, createdAt: now, updatedAt: now });
    await ctx.db.insert("auditLog", {
      actorId: "admin", action: "create", tableName: "categories",
      documentId: id, before: undefined, after: JSON.stringify(args), createdAt: now,
    });
    return id;
  },
});

export const updateProduct = internalMutation({
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
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Product not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    await ctx.db.insert("auditLog", {
      actorId: "admin", action: "update", tableName: "products",
      documentId: id, before: JSON.stringify(before), after: JSON.stringify(cleaned), createdAt: now,
    });
  },
});

export const createArtist = internalMutation({
  args: {
    slug: v.string(), name: v.string(), profession: v.string(),
    artistCategory: v.optional(v.string()), shortBio: v.optional(v.string()),
    image: v.optional(v.string()), isPublished: v.boolean(), needsReview: v.boolean(),
    displayOrder: v.number(), bookingMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("artists", { ...args, fullBio: undefined, genres: undefined, performanceTypes: undefined, location: undefined, rateNote: undefined, availabilityNote: undefined, socialLinks: undefined, reviewReasons: undefined, createdAt: now, updatedAt: now });
    await ctx.db.insert("auditLog", { actorId: "admin", action: "create", tableName: "artists", documentId: id, before: undefined, after: JSON.stringify(args), createdAt: now });
    return id;
  },
});

export const updateArtist = internalMutation({
  args: {
    id: v.string(), name: v.optional(v.string()), profession: v.optional(v.string()),
    shortBio: v.optional(v.string()), fullBio: v.optional(v.string()),
    image: v.optional(v.string()), isPublished: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()), displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Artist not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    await ctx.db.insert("auditLog", { actorId: "admin", action: "update", tableName: "artists", documentId: id, before: JSON.stringify(before), after: JSON.stringify(cleaned), createdAt: now });
  },
});

export const updateSetting = internalMutation({
  args: { key: v.string(), value: v.string(), group: v.optional(v.string()), isPublic: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteSettings").withIndex("by_key", q => q.eq("key", args.key)).first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedAt: now, ...(args.group ? { group: args.group } : {}), ...(args.isPublic !== undefined ? { isPublic: args.isPublic } : {}) });
      await ctx.db.insert("auditLog", { actorId: "admin", action: "update", tableName: "siteSettings", documentId: existing._id, before: JSON.stringify(existing), after: JSON.stringify(args), createdAt: now });
    } else {
      const id = await ctx.db.insert("siteSettings", { key: args.key, value: args.value, group: args.group ?? "business", description: undefined, isPublic: args.isPublic ?? true, updatedAt: now, updatedBy: undefined });
      await ctx.db.insert("auditLog", { actorId: "admin", action: "create", tableName: "siteSettings", documentId: id, before: undefined, after: JSON.stringify(args), createdAt: now });
    }
  },
});

export const updateLegalPage = internalMutation({
  args: { id: v.string(), title: v.optional(v.string()), content: v.optional(v.string()), isPublished: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Legal page not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    await ctx.db.insert("auditLog", { actorId: "admin", action: "update", tableName: "legalPages", documentId: id, before: JSON.stringify(before), after: JSON.stringify(cleaned), createdAt: now });
  },
});

export const updatePage = internalMutation({
  args: { id: v.string(), title: v.optional(v.string()), body: v.optional(v.string()), seoTitle: v.optional(v.string()), seoDescription: v.optional(v.string()), isPublished: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const before = await ctx.db.get(id as any);
    if (!before) throw new Error("Page not found");
    const now = Date.now();
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id as any, { ...cleaned, updatedAt: now });
    await ctx.db.insert("auditLog", { actorId: "admin", action: "update", tableName: "pages", documentId: id, before: JSON.stringify(before), after: JSON.stringify(cleaned), createdAt: now });
  },
});

export const logMigration = internalMutation({
  args: {
    migrationKey: v.string(), status: v.string(), totalSourceRecords: v.optional(v.number()),
    importedRecords: v.optional(v.number()), quarantinedRecords: v.optional(v.number()),
    failedRecords: v.optional(v.number()), errorSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("migrationRuns").withIndex("by_migration_key", q => q.eq("migrationKey", args.migrationKey)).first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, completedAt: args.status === "completed" || args.status === "failed" ? now : undefined });
    } else {
      await ctx.db.insert("migrationRuns", { ...args, sourceChecksum: "", startedAt: now, completedAt: args.status === "completed" || args.status === "failed" ? now : undefined, lastCheckpoint: undefined });
    }
  },
});
