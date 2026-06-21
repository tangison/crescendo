/**
 * CustomIcon — renders a crisp, single-color SVG icon from `lucide-react`.
 *
 * This replaces the previous generation of multi-color illustrative PNG icons
 * (which were blurry at 16–24px and could not be cleanly recolored). Lucide
 * icons use `stroke="currentColor"`, so color is inherited from Tailwind
 * `text-*` utilities — no CSS filters needed.
 *
 * Tone modes (kept for backwards compatibility with the previous API):
 *   - "default"   : uses currentColor — controlled by `className="text-…"`
 *   - "mono-dark" : forces dark color (`text-brand-dark` / `text-gray-900`)
 *   - "mono-light": forces light color (`text-white`)
 *   - "mono-red"  : forces destructive color (`text-destructive`)
 *
 * Usage:
 *   <CustomIcon name="search" className="size-5" />
 *   <CustomIcon name="message-circle" className="size-4" tone="mono-light" />
 *   <CustomIcon name="trash" className="size-4" tone="mono-red" alt="Remove" />
 */

import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  ShoppingBag,
  Package,
  Tag,
  Trash,
  Users,
  Award,
  Shield,
  MapPin,
  Music,
  Mic,
  Search,
  Sliders,
  Menu,
  X,
  Plus,
  Minus,
  LayoutGrid,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'arrow-right'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'message-circle'
  | 'phone'
  | 'mail'
  | 'shopping-bag'
  | 'package'
  | 'tag'
  | 'trash'
  | 'users'
  | 'award'
  | 'shield'
  | 'map-pin'
  | 'music'
  | 'mic'
  | 'search'
  | 'sliders'
  | 'menu'
  | 'x'
  | 'plus'
  | 'minus'
  | 'layout-grid'
  | 'trending-up';

export type IconTone = 'default' | 'mono-dark' | 'mono-light' | 'mono-red';

interface CustomIconProps {
  name: IconName;
  className?: string;
  /** Accessible label. If omitted, icon is decorative (aria-hidden). */
  alt?: string;
  /** Override the default size (defaults to 24 to match lucide). */
  width?: number;
  height?: number;
  /** Stroke width override (defaults to 2 — lucide default). */
  strokeWidth?: number;
  /** Visual tone — see comment above. */
  tone?: IconTone;
}

const ICONS: Record<IconName, LucideIcon> = {
  'arrow-right': ArrowRight,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  'message-circle': MessageCircle,
  phone: Phone,
  mail: Mail,
  'shopping-bag': ShoppingBag,
  package: Package,
  tag: Tag,
  trash: Trash,
  users: Users,
  award: Award,
  shield: Shield,
  'map-pin': MapPin,
  music: Music,
  mic: Mic,
  search: Search,
  sliders: Sliders,
  menu: Menu,
  x: X,
  plus: Plus,
  minus: Minus,
  'layout-grid': LayoutGrid,
  'trending-up': TrendingUp,
};

const TONE_CLASS: Record<IconTone, string> = {
  default: '',
  // For use on light/colored buttons where dark icon is needed
  'mono-dark': 'text-brand-dark',
  // For use on dark/charcoal backgrounds where light icon is needed
  'mono-light': 'text-white',
  // For destructive contexts (trash, delete)
  'mono-red': 'text-destructive',
};

export function CustomIcon({
  name,
  className = '',
  alt,
  width = 24,
  height = 24,
  strokeWidth = 2,
  tone = 'default',
}: CustomIconProps) {
  const Icon = ICONS[name];
  if (!Icon) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[CustomIcon] Unknown icon name: ${name}`);
    }
    return null;
  }

  const toneClass = TONE_CLASS[tone];
  const isDecorative = !alt;

  return (
    <Icon
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      className={`pointer-events-none select-none inline-block shrink-0 ${toneClass} ${className}`}
      aria-hidden={isDecorative ? true : undefined}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : alt}
    />
  );
}
