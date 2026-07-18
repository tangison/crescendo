import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for Crescendo Namibia.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Disclaimer</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. General Information</h2>
          <p>Information on crescendona.com is provided for general purposes. While we strive for accuracy, we make no warranties about completeness or reliability.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Product Information</h2>
          <p>Product descriptions, images, and specifications are provided in good faith. Actual products may differ slightly. Contact us for confirmation of any product details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Pricing</h2>
          <p>Prices are subject to change without notice. We are not bound by pricing errors on the website and will contact you before processing affected orders.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Book an Artist</h2>
          <p>Crescendo Namibia facilitates artist bookings but is not responsible for the conduct, performance, or actions of third-party artists. Booking agreements are between the client and the artist.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. External Links</h2>
          <p>Our website may contain links to external sites. We are not responsible for the content or practices of these sites.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. No Professional Advice</h2>
          <p>Information on this website does not constitute professional musical or technical advice. Consult our staff in-store for specific product recommendations.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>Crescendo Namibia shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or our products and services.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">8. Contact</h2>
          <p>For questions about this disclaimer, contact us at info@crescendona.com or +264 81 462 3936.</p>
        </section>
      </div>
    </div>
  );
}
