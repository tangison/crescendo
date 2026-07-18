import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Crescendo Namibia.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect your name, phone number, email address, and delivery address when you place an order or contact us. We also collect browsing data through cookies and analytics.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>We use your information to process orders, communicate about your purchases, provide customer support, and improve our services. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Cookies</h2>
          <p>We use cookies for website functionality and analytics. See our Cookie Policy for details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Data Security</h2>
          <p>We take reasonable measures to protect your personal information. Payment data is processed through secure payment gateways and is not stored on our servers.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Third-Party Services</h2>
          <p>We use WhatsApp for order communication, Google for analytics, and Vercel for hosting. These services have their own privacy policies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information by contacting us at hello@crescendona.com.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Data Retention</h2>
          <p>We retain order information for accounting and legal purposes. Personal information is deleted when no longer needed.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">8. Contact</h2>
          <p>For privacy questions, contact us at hello@crescendona.com or +264 81 462 3936.</p>
        </section>
      </div>
    </div>
  );
}
