/**
 * CustomIcon — Renders a custom AI-generated illustrative icon from /public/icons/*.png
 *
 * Replaces lucide-react icons with branded custom imagery.
 * Accepts the same `className` API as lucide icons (e.g. "size-4", "size-5").
 *
 * Tone modes:
 *   - "default"   : show as-is (cyan-blue + charcoal on transparent) — best on light/white backgrounds.
 *   - "mono-dark" : CSS filter to solid black — for use on light/colored buttons where dark text is shown.
 *   - "mono-light": CSS filter to solid white — for use on dark/charcoal backgrounds where light text is shown.
 *
 * Usage:
 *   <CustomIcon name="search" className="size-5" />
 *   <CustomIcon name="message-circle" className="size-4" tone="mono-light" />
 */

import Image, { type ImageProps } from 'next/image';

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
  /** Override the default width/height (defaults to 24 to match lucide). */
  width?: number;
  height?: number;
  /** Visual tone — see comment above. */
  tone?: IconTone;
  /** Optional priority loading (rarely needed for icons). */
  priority?: ImageProps['priority'];
}

const TONE_FILTER: Record<IconTone, string> = {
  default: '',
  // brightness(0) -> solid black; for use where text is dark (e.g. on cyan/light buttons)
  'mono-dark': 'brightness(0)',
  // brightness(0) invert(1) -> solid white; for use where text is light (e.g. on dark/charcoal bg)
  'mono-light': 'brightness(0) invert(1)',
  // solid red for destructive contexts (trash, delete)
  'mono-red': 'brightness(0) sepia(1) saturate(8) hue-rotate(-30deg) brightness(1.2)',
};

export function CustomIcon({
  name,
  className = '',
  alt,
  width = 24,
  height = 24,
  tone = 'default',
  priority,
}: CustomIconProps) {
  const src = `/icons/${name}.png`;
  const filter = TONE_FILTER[tone];
  const filterStyle = filter ? { filter } : undefined;
  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      style={filterStyle}
      className={`pointer-events-none select-none inline-block shrink-0 ${className}`}
      aria-hidden={alt ? undefined : true}
      role={alt ? 'img' : undefined}
      priority={priority}
    />
  );
}
