// Crescendo Namibia — Artist model
// Compatible with future Convex migration.
// Most fields are optional until verified client information is provided.

export interface Artist {
  legacyId: string;
  slug: string;
  name: string;
  stageName?: string;
  profession: string;
  artistCategory?: string;
  shortBio?: string;
  fullBio?: string;
  imageUrl?: string;
  imageAlt?: string;
  genres?: string[];
  performanceTypes?: string[];
  services?: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  isFeatured: boolean;
  isPublished: boolean;
  needsReview: boolean;
  displayOrder: number;
  bookingMessage: string;
}

// Seed data — only confirmed information.
// Fabrice Katumba is the first artist profile.
// His profile is NOT published until his image and minimum booking info are available.
export const artists: Artist[] = [
  {
    legacyId: 'artist-001',
    slug: 'fabrice-katumba',
    name: 'Fabrice Katumba',
    profession: 'Saxophonist',
    isFeatured: false,
    isPublished: false,  // NOT published until image + booking info confirmed
    needsReview: true,
    displayOrder: 1,
    bookingMessage: 'Hello Crescendo, I would like to enquire about booking Fabrice Katumba.',
  },
];

// Helper: get published artists only
export function getPublishedArtists(): Artist[] {
  return artists
    .filter((a) => a.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

// Helper: get featured artists
export function getFeaturedArtists(): Artist[] {
  return artists
    .filter((a) => a.isPublished && a.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

// Helper: get artist by slug
export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}
