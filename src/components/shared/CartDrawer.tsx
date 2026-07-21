'use client';

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
import { CustomIcon } from '@/components/ui/custom-icon';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice, getCartWhatsAppMessage, getWhatsAppUrl } from '@/lib/utils-crescendo';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '@/components/products/ProductImage';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  const total = totalPrice();
  const isEmpty = items.length === 0;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const handleWhatsAppEnquiry = () => {
    const message = getCartWhatsAppMessage(items);
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[92vw] sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-5 pb-3">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <CustomIcon name="shopping-bag" className="size-5" alt="" />
            Your Enquiry List
            {!isEmpty && (
              <span className="text-xs font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-5"
            >
              <CustomIcon name="shopping-bag" className="size-10 text-muted-foreground" alt="" />
            </motion.div>
            <p className="text-base font-semibold mb-1">Your enquiry list is empty</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Browse our catalog of 1611+ instruments and gear, then add items to enquire about via WhatsApp.
            </p>
            <Button asChild variant="default" size="lg">
              <Link href="/shop" onClick={() => onOpenChange(false)}>
                Browse Store
                <CustomIcon name="arrow-right" className="size-4 ml-2" alt="" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-4 py-3 space-y-2">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="relative w-20 h-20 overflow-hidden bg-secondary flex-shrink-0 border border-border"
                        style={{ borderRadius: '0.375rem' }}
                      >
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="img-product p-1"
                          sizes="80px"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/shop/${item.product.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="text-sm font-medium line-clamp-2 leading-tight hover:text-brand-accent transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-mono font-semibold text-brand-accent">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="size-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <CustomIcon name="minus" className="size-3" alt="" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.qty}
                              className="size-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <CustomIcon name="plus" className="size-3" alt="" />
                            </button>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="size-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive transition-colors ml-1"
                              aria-label="Remove item"
                            >
                              <CustomIcon name="trash" tone="mono-red" className="size-3.5" alt="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <Separator />

            <SheetFooter className="p-5 pt-3 space-y-3">
              {/* Subtotal breakdown */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-mono">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-muted-foreground">Quoted on enquiry</span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full pt-2 border-t border-border">
                <span className="text-sm font-semibold">Estimated Total</span>
                <span className="text-xl font-mono font-bold">{formatPrice(total)}</span>
              </div>

              <Button
                onClick={handleWhatsAppEnquiry}
                className="w-full h-12 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white"
                size="lg"
              >
                <CustomIcon name="message-circle" tone="mono-light" className="size-5 mr-2" alt="" />
                Enquire on WhatsApp
              </Button>

              <div className="flex items-center justify-between w-full">
                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
                >
                  Clear all items
                </button>
                <Link
                  href="/shop"
                  onClick={() => onOpenChange(false)}
                  className="text-xs text-brand-accent hover:underline"
                >
                  Continue shopping
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
