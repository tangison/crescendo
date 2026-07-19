/**
 * Crescendo Namibia — Convex Schema
 * Production schema for 6-category catalogue with 1,640 products.
 *
 * Deployment: dev:academic-wombat-389 (development)
 * URL: https://academic-wombat-389.convex.cloud
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ===== CATEGORIES (6 public categories) =====
  categories: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    image: v.string(),
    productCount: v.number(),
    displayOrder: v.number(),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_display_order", ["displayOrder"])
    .index("by_published_and_order", ["isPublished", "displayOrder"]),

  // ===== PRODUCTS (1,640 source records) =====
  products: defineTable({
    // Stable identifiers
    sourceKey: v.string(),           // Unique migration key (legacyRowId or compound)
    legacyRowId: v.string(),         // Source row identifier (row_N)
    sku: v.string(),                 // Original SKU (may be duplicated)
    skuNormalized: v.string(),       // Lowercase SKU for search
    isDuplicateSku: v.boolean(),     // Flag for 29 duplicate SKUs

    // Product identity
    name: v.string(),                // Display name (same as legacy for now)
    legacyName: v.string(),          // Original imported name (never modified)
    nameNormalized: v.string(),      // Lowercase for search
    slug: v.string(),                // URL slug
    brand: v.string(),
    brandNormalized: v.string(),     // Lowercase for search
    categorySlug: v.string(),        // Public category slug
    productType: v.optional(v.string()), // instrument, amplifier, case, etc.

    // Pricing (integers only — no floating point)
    priceCents: v.number(),          // Price in cents (N$292.60 = 29260)
    currency: v.string(),            // Always "NAD"
    quantity: v.number(),            // Stock quantity (non-negative integer)

    // Content
    skillLevel: v.optional(v.string()),
    image: v.string(),               // Image URL/path
    imageStatus: v.optional(v.string()), // "verified", "unverified", "placeholder"
    shortDescription: v.optional(v.string()), // Empty until verified
    descriptionStatus: v.optional(v.string()), // "empty", "draft", "verified"

    // State
    isPublished: v.boolean(),
    needsReview: v.boolean(),
    reviewReasons: v.optional(v.array(v.string())),
    source: v.string(),              // "csv_import"
    sourceRowNumber: v.number(),     // Original CSV row number
    dataVersion: v.string(),         // Migration version

    // Search text (normalized combination for text search)
    searchText: v.string(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_source_key", ["sourceKey"])
    .index("by_legacy_row_id", ["legacyRowId"])
    .index("by_slug", ["slug"])
    .index("by_sku_normalized", ["skuNormalized"])
    .index("by_category_and_published", ["categorySlug", "isPublished"])
    .index("by_brand_and_published", ["brandNormalized", "isPublished"])
    .index("by_review_status", ["needsReview"])
    .index("by_published_and_updated", ["isPublished", "updatedAt"])
    // Text search index
    .searchIndex("search_products", {
      searchField: "searchText",
      filterFields: ["categorySlug", "isPublished"],
    }),

  // ===== ARTISTS =====
  artists: defineTable({
    slug: v.string(),
    name: v.string(),
    profession: v.string(),
    artistCategory: v.optional(v.string()),
    shortBio: v.optional(v.string()),
    fullBio: v.optional(v.string()),
    image: v.optional(v.string()),
    genres: v.optional(v.array(v.string())),
    performanceTypes: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    rateNote: v.optional(v.string()),
    availabilityNote: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      tiktok: v.optional(v.string()),
      youtube: v.optional(v.string()),
    })),
    bookingMessage: v.string(),
    isPublished: v.boolean(),
    needsReview: v.boolean(),
    reviewReasons: v.optional(v.array(v.string())),
    displayOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_and_order", ["isPublished", "displayOrder"])
    .index("by_category_and_published", ["artistCategory", "isPublished"]),

  // ===== PAGES (book-an-artist, about, etc.) =====
  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    body: v.string(),
    status: v.string(),             // "draft", "published"
    isPublished: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  // ===== SITE SETTINGS =====
  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
    group: v.string(),              // "business", "social", "seo", "maintenance"
    description: v.optional(v.string()),
    isPublic: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_key", ["key"]),

  // ===== LEGAL PAGES =====
  legalPages: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    version: v.string(),
    effectiveDate: v.number(),
    isPublished: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  // ===== MIGRATION RUNS =====
  migrationRuns: defineTable({
    migrationKey: v.string(),
    sourceChecksum: v.string(),
    status: v.string(),             // "running", "completed", "failed"
    totalSourceRecords: v.number(),
    importedRecords: v.number(),
    quarantinedRecords: v.number(),
    failedRecords: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    lastCheckpoint: v.optional(v.string()),
    errorSummary: v.optional(v.string()),
  })
    .index("by_migration_key", ["migrationKey"]),

  // ===== IMPORT ISSUES =====
  importIssues: defineTable({
    migrationKey: v.string(),
    sourceKey: v.string(),
    issueType: v.string(),          // "duplicate_sku", "missing_image", "category_mismatch"
    severity: v.string(),           // "low", "medium", "high"
    message: v.string(),
    sourceData: v.string(),         // JSON string of the source row
    status: v.string(),             // "open", "resolved", "ignored"
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_migration", ["migrationKey"])
    .index("by_status", ["status"])
    .index("by_source_key", ["sourceKey"]),

  // ===== AUDIT LOG =====
  auditLog: defineTable({
    actorId: v.string(),
    action: v.string(),             // "create", "update", "delete", "publish"
    tableName: v.string(),
    documentId: v.optional(v.string()),
    before: v.optional(v.string()), // JSON string
    after: v.optional(v.string()),  // JSON string
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_table_and_document", ["tableName", "documentId"])
    .index("by_actor", ["actorId"]),
});
