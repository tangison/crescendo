import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for Crescendo Namibia.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Introduction</h2>
          <p>These Terms and Conditions govern your use of crescendona.com and any purchases made through Crescendo Namibia. By using our website or placing an order, you agree to these terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Products & Pricing</h2>
          <p>All products are subject to availability. Prices are listed in Namibian Dollars (NAD) and include VAT where applicable. We reserve the right to correct pricing errors and cancel orders affected by such errors.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Orders</h2>
          <p>Orders are confirmed once payment is received. We reserve the right to refuse any order. If we cannot fulfill your order, we will refund your payment in full.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Payment</h2>
          <p>We accept cash (NAD), credit and debit cards, and electronic funds transfer (EFT). Orders via WhatsApp can be paid on delivery or collection.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Delivery</h2>
          <p>We ship to all major towns and cities across Namibia. Delivery times and costs are calculated based on destination and order size.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Returns & Refunds</h2>
          <p>Returns are accepted within 7 days of purchase for items in original condition. See our Returns & Refund Policy for full details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Warranty</h2>
          <p>Products carry manufacturer warranties where applicable. Crescendo Namibia facilitates warranty claims but is not the warrantor.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">8. Book an Artist</h2>
          <p>Artist bookings are subject to availability and separate agreements. Crescendo Namibia acts as a booking facilitator and is not liable for the performance of third-party artists.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">9. Limitation of Liability</h2>
          <p>Crescendo Namibia is not liable for indirect, incidental, or consequential damages arising from the use of our products or services.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">10. Contact</h2>
          <p>For questions about these Terms, contact us at info@crescendona.com or +264 81 462 3936.</p>
        </section>
      </div>
    </div>
  );
}
