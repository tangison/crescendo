import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping and Delivery Policy',
  description: 'Shipping and delivery policy for Crescendo Namibia.',
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Shipping & Delivery Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Delivery Areas</h2>
          <p>We deliver to all major towns and cities across Namibia, including Windhoek, Swakopmund, Walvis Bay, Oshakati, Rundu, Katima Mulilo, Keetmanshoop, and Mariental.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Delivery Times</h2>
          <p>Windhoek: 1-2 business days. Other towns: 3-5 business days. Remote areas: 5-10 business days. Orders are processed within 24 hours of payment confirmation.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Shipping Costs</h2>
          <p>Shipping costs are calculated based on destination and order size. Windhoek deliveries: N$ 50-100. Other towns: N$ 100-250. Free shipping on orders over N$ 5,000 within Windhoek.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Collection</h2>
          <p>Orders can be collected from our store at Shop 19, Old Power Station, Southern Industrial, Windhoek, during business hours (9am-5pm weekdays).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. International Shipping</h2>
          <p>We currently do not ship outside Namibia. International customers can contact us for special arrangements.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Tracking</h2>
          <p>You will receive a WhatsApp message with delivery confirmation once your order is shipped.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Failed Deliveries</h2>
          <p>If delivery is unsuccessful, we will contact you to arrange redelivery. Additional delivery charges may apply for re-delivery attempts.</p>
        </section>
      </div>
    </div>
  );
}
