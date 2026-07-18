import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Policy',
  description: 'Payment policy for Crescendo Namibia.',
};

export default function PaymentPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Payment Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Accepted Payment Methods</h2>
          <p>We accept the following payment methods: Cash (NAD), Credit Cards (Visa, Mastercard), Debit Cards, Electronic Funds Transfer (EFT), and WhatsApp order with payment on delivery or collection.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Currency</h2>
          <p>All prices are in Namibian Dollars (NAD). South African Rand (ZAR) is accepted at 1:1 parity.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Payment Security</h2>
          <p>Card payments are processed through secure payment gateways. We do not store your card information on our servers.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. EFT Details</h2>
          <p>For EFT payments, use the following details and email proof of payment to hello@crescendona.com: Bank: [Bank Name], Account: [Account Number], Branch: [Branch Code]. Contact us for current banking details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. WhatsApp Orders</h2>
          <p>You can place orders via WhatsApp at +264 81 462 3936. Payment can be made on delivery (Windhoek only) or before shipping for other areas.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Invoices</h2>
          <p>Invoices are provided with every purchase. Tax invoices are available on request for business customers.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Laybyes</h2>
          <p>Laybye arrangements are available for in-store purchases. Contact us for terms and conditions.</p>
        </section>
      </div>
    </div>
  );
}
