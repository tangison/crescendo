// Crescendo Namibia — Category definitions
// Categories match source CSV (crescendo-products-clean.csv)
export interface Category {
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: string;
}

export const categories: Category[] = [
  {
    slug: "accessories",
    name: "Accessories",
    description: "Essential gear and add-ons for every musician.",
    productCount: 630,
    image: "/products/accessories/mic-stand.webp",
  },
  {
    slug: "wind",
    name: "Wind & Brass",
    description: "Brass and woodwind instruments — trumpets, saxophones, clarinets, flutes, and more.",
    productCount: 282,
    image: "/products/wind/yanagisawa-wo1-sax.webp",
  },
  {
    slug: "guitars",
    name: "Guitars & Ukuleles",
    description: "Electric, acoustic, classical, and bass guitars from trusted brands.",
    productCount: 281,
    image: "/products/guitars/cort-ad810-acoustic.webp",
  },
  {
    slug: "strings",
    name: "Orchestral Strings",
    description: "Violins, violas, cellos, and accessories for classical string players.",
    productCount: 162,
    image: "/products/strings/category-tile-violin.webp",
  },
  {
    slug: "drums",
    name: "Drums & Percussion",
    description: "Acoustic kits, electronic drums, percussion, heads, sticks, and hardware.",
    productCount: 156,
    image: "/products/drums/roland-td17kv2.webp",
  },
  {
    slug: "pro-audio",
    name: "Pro Audio",
    description: "Microphones, PA systems, DJ equipment, mixers, interfaces, and studio essentials.",
    productCount: 79,
    image: "/products/pro-audio/shure-sm58.webp",
  },
  {
    slug: "keyboards",
    name: "Keyboards & Pianos",
    description: "Digital pianos, arrangers, synths, and MIDI controllers.",
    productCount: 50,
    image: "/products/keyboards/roland-ex20.webp",
  },
];
