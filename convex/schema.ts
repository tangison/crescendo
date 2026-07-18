/**
 * Convex schema for Crescendo Namibia.
 *
 * This is a SCHEMA PROPOSAL — do not deploy until a Convex project is connected.
 * When ready: `npx convex dev` will use this file to create tables.
 *
 * 6 public categories:
 *   accessories, wind, strings (guitars+strings merged),
 *   drums, pro-audio, keyboards
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ===== PRODUCTS =====
  products: defineTable({
    // Stable identifiers (from source CSV — never change)
    legacyId: v.string(),           // Original CSV 'code' field
    sku: v.string(),                // Same as legacyId for now
    slug: v.string(),               // URL slug

    // Name management
    legacyName: v.string(),         // Original imported name (never modify)
    displayName: v.string(),        // Cleaned name for website display
    brand: v.string(),
    model: v.optional(v.string()),  // Extracted model number (future)

    // Category management
    legacyCategory: v.string(),     // Original CSV category
    publicCategory: v.string(),     // Corrected public category slug
    subcategory: v.optional(v.string()),
    productType: v.optional(v.string()), // instrument, amplifier, case, bag, etc.

    // Content (empty until verified — never AI-generated)
    shortDescription: v.optional(v.string()),
    description: v.optional(v.string()),
    specifications: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),

    // Pricing
    priceNAD: v.number(),
    stockQuantity: v.number(),

    // Images
    imageUrls: v.optional(v.array(v.string())),
    primaryImageUrl: v.string(),

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("out_of_stock"),
      v.literal("discontinued"),
      v.literal("archived"),
    ),
    isPublished: v.boolean(),
    isFeatured: v.boolean(),
    isVerified: v.boolean(),
    needsReview: v.boolean(),
    reviewNotes: v.optional(v.string()),

    // Research tracking (for Tavily enrichment workflow)
    researchStatus: v.union(
      v.literal("not_started"),
      v.literal("searching"),
      v.literal("matched"),
      v.literal("ambiguous"),
      v.literal("not_found"),
      v.literal("needs_human_review"),
      v.literal("verified"),
      v.literal("rejected"),
    ),
    researchConfidence: v.optional(v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low"),
    )),
    sourceUrls: v.optional(v.array(v.string())),
    officialSourceUrl: v.optional(v.string()),
    researchedAt: v.optional(v.number()),
    researchNotes: v.optional(v.string()),
    descriptionVerified: v.boolean(),
    verifiedBy: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),

    // Metadata
    source: v.string(),             // "csv_import", "manual", etc.
    priceVerifiedAt: v.optional(v.number()),
    contentVerifiedAt: v.optional(v.number()),
    skillLevel: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_publicCategory", ["publicCategory"])
    .index("by_status", ["status"])
    .index("by_needsReview", ["needsReview"])
    .index("by_sku", ["sku"]),

  // ===== CATEGORIES =====
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    heroImageUrl: v.string(),
    thumbnailImageUrl: v.string(),
    altText: v.string(),
    order: v.number(),
    isVisible: v.boolean(),
    subcategories: v.optional(v.array(v.string())),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  // ===== PAGES (legal, about, book-an-artist, etc.) =====
  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_slug", ["slug"]),

  // ===== SITE SETTINGS =====
  siteSettings: defineTable({
    businessName: v.string(),
    foundingYear: v.number(),
    tagline: v.string(),
    email: v.string(),
    telephone: v.string(),
    whatsapp: v.string(),
    address: v.string(),
    openingHours: v.string(),
    socialLinks: v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      tiktok: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    nationwideDeliveryStatement: v.string(),
    footerContent: v.optional(v.string()),
    maintenanceMode: v.boolean(),
  }),

  // ===== USERS =====
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("editor"),
    ),
  })
    .index("by_email", ["email"]),
});
