'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice, getCartWhatsAppMessage, getWhatsAppUrl } from '@/lib/utils-crescendo';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  const total = totalPrice();
  const isEmpty = items.length === 0;

  const handleWhatsAppEnquiry = () => {
    const message = getCartWhatsAppMessage(items);
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[85vw] sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-5 pb-3">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="size-5" />
            Your Enquiry List
            {!isEmpty && (
              <span className="text-xs font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your cart items for WhatsApp enquiry
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="size-10 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold mb-1">No items yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Browse our store and add items to enquire about
            </p>
            <Button asChild variant="default" size="lg">
              <Link href="/shop" onClick={() => onOpenChange(false)}>
                Browse Store
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-4 py-3 space-y-1">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-lg bg-card border border-border"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-secondary flex-shrink-0 border border-border">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain img-product p-1"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium line-clamp-2 leading-tight">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.brand}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-mono font-semibold text-brand-accent">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="size-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="size-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="size-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive transition-colors ml-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <SheetFooter className="p-5 pt-3 space-y-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">Estimated Total</span>
                <span className="text-xl font-mono font-bold">
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                onClick={handleWhatsAppEnquiry}
                className="w-full h-12 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white"
                size="lg"
              >
                <MessageCircle className="size-5 mr-2" />
                Enquire on WhatsApp
              </Button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
              >
                Clear all items
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
