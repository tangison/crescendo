import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
  description: 'Returns and refund policy for Crescendo Namibia.',
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Returns & Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Return Period</h2>
          <p>Items may be returned within 7 days of purchase, provided they are in original condition with all packaging and accessories.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Non-Returnable Items</h2>
          <p>The following items cannot be returned: reeds, mouthpieces, earplugs, harmonicas, and other personal-use items for hygiene reasons; software; gift cards; clearance items.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Return Process</h2>
          <p>Contact us at hello@crescendona.com or +264 81 462 3936 to initiate a return. We will arrange collection or you can return items to our store at Shop 19, Old Power Station, Southern Industrial, Windhoek.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Refunds</h2>
          <p>Refunds are processed within 7 business days of receiving the returned item. Refunds are issued to the original payment method. Cash purchases are refunded via EFT.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Damaged or Defective Items</h2>
          <p>If you receive a damaged or defective item, contact us within 48 hours of delivery. We will arrange a replacement or full refund at no cost to you.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Shipping Costs</h2>
          <p>Return shipping costs are the responsibility of the customer unless the item is damaged or defective.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Exchanges</h2>
          <p>Exchanges are subject to product availability. If the replacement item costs more, the difference must be paid; if less, the difference will be refunded.</p>
        </section>
      </div>
    </div>
  );
}
