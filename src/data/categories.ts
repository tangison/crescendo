// Crescendo Namibia — 6 public categories
// Guitars & Ukuleles merged with Orchestral Strings into "Guitars, Ukuleles & Strings"
// Pro Audio renamed to "Pro Audio & PA Systems"
// Keyboards renamed to "Keyboards & Pianos"
export interface Category {
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: string;
  // Internal subcategories for future filtering
  subcategories?: string[];
}

export const categories: Category[] = [
  {
    slug: "accessories",
    name: "Accessories",
    description: "Cases, bags, stands, cables, replacement parts, and maintenance tools.",
    productCount: 466,
    image: "/products/accessories/mic-stand.webp",
    subcategories: ["Cases & Bags", "Stands", "Cables", "Replacement Parts", "Maintenance"],
  },
  {
    slug: "wind",
    name: "Wind & Brass",
    description: "Saxophones, trumpets, clarinets, flutes, and other brass and woodwind instruments.",
    productCount: 282,
    image: "/products/wind/yanagisawa-wo1-sax.webp",
    subcategories: ["Saxophones", "Trumpets", "Clarinets", "Flutes", "Accessories"],
  },
  {
    slug: "strings",
    name: "Guitars, Ukuleles & Strings",
    description: "Guitars, ukuleles, violins, violas, cellos, basses, and related accessories.",
    productCount: 444,
    image: "/products/guitars/cort-ad810-acoustic.webp",
    subcategories: ["Acoustic Guitars", "Electric Guitars", "Bass Guitars", "Classical Guitars", "Ukuleles", "Violins", "Violas", "Cellos", "Bows", "Guitar Accessories", "String Accessories"],
  },
  {
    slug: "drums",
    name: "Drums & Percussion",
    description: "Acoustic kits, electronic drums, percussion, drumheads, sticks, and hardware.",
    productCount: 319,
    image: "/products/drums/roland-td17kv2.webp",
    subcategories: ["Drum Kits", "Drumheads", "Drumsticks", "Cymbals", "Hardware", "Percussion"],
  },
  {
    slug: "pro-audio",
    name: "Pro Audio & PA Systems",
    description: "Microphones, PA systems, speakers, mixers, interfaces, and studio equipment.",
    productCount: 79,
    image: "/products/pro-audio/shure-sm58.webp",
    subcategories: ["Microphones", "PA Systems", "Speakers", "Mixers", "Audio Interfaces", "Studio Equipment"],
  },
  {
    slug: "keyboards",
    name: "Keyboards & Pianos",
    description: "Digital pianos, arrangers, synthesisers, and MIDI controllers.",
    productCount: 50,
    image: "/products/keyboards/roland-ex20.webp",
    subcategories: ["Digital Pianos", "Arrangers", "Synthesisers", "MIDI Controllers", "Keyboard Accessories"],
  },
];
