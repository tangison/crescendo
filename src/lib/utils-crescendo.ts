import type { Product } from '@/data/products';

export function formatPrice(price: number): string {
  return `N$ ${price.toLocaleString('en-NA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export const WHATSAPP_PHONE = '264814623936'; // +264 81 462 3936
export const WHATSAPP_DISPLAY = '+264 81 462 3936';
export const CONTACT_EMAIL = 'info@crescendona.com';

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

export function getProductWhatsAppMessage(product: Product): string {
  return `Hi Crescendo! I'm interested in:\n\n${product.name}\nBrand: ${product.brand}\nPrice: ${formatPrice(product.price)}\n\nCould you provide more details?`;
}

export function getCartWhatsAppMessage(items: { product: Product; quantity: number }[]): string {
  const lines = items.map(
    (item) => `• ${item.product.name} (x${item.quantity}) — ${formatPrice(item.product.price * item.quantity)}`
  );
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return `Hi Crescendo! I'd like to enquire about:\n\n${lines.join('\n')}\n\nTotal: ${formatPrice(total)}`;
}

export function getStockStatus(qty: number): { label: string; variant: 'default' | 'secondary' | 'destructive' } {
  if (qty <= 0) return { label: 'Out of Stock', variant: 'destructive' };
  if (qty <= 5) return { label: 'Low Stock', variant: 'secondary' };
  return { label: 'In Stock', variant: 'default' };
}

export function getCategoryName(slug: string): string {
  const map: Record<string, string> = {
    accessories: 'Accessories',
    wind: 'Wind & Brass',
    guitars: 'Guitars & Ukuleles',
    strings: 'Strings',
    drums: 'Drums & Percussion',
    'pro-audio': 'Pro Audio',
    keyboards: 'Keyboards',
  };
  return map[slug] || slug;
}

export function getSkillLevelColor(level: string): string {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Intermediate':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'Professional':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}
