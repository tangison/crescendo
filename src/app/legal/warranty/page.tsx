import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warranty Policy',
  description: 'Warranty policy for Crescendo Namibia.',
};

export default function WarrantyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Warranty Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Manufacturer Warranties</h2>
          <p>Most new instruments and electronics carry manufacturer warranties. Warranty periods vary by brand and product (typically 1-5 years). Contact us for specific warranty information on any product.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Crescendo Namibia Role</h2>
          <p>Crescendo Namibia facilitates warranty claims with manufacturers but is not the warrantor. We will assist you in contacting the manufacturer and shipping the product if needed.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. What Is Covered</h2>
          <p>Manufacturer warranties typically cover defects in materials and workmanship under normal use. They do not cover damage from misuse, modification, accidents, or normal wear.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. How to Make a Warranty Claim</h2>
          <p>Contact us at info@crescendona.com or +264 81 462 3936 with your proof of purchase and a description of the issue. We will guide you through the claim process.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Repairs vs Replacement</h2>
          <p>Warranty claims may result in repair, replacement, or refund at the manufacturer discretion. The process can take 2-8 weeks depending on the manufacturer.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Extended Warranties</h2>
          <p>Some products offer extended warranty options. Ask our staff for details at the time of purchase.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">7. Non-Warranty Repairs</h2>
          <p>For non-warranty repairs, we offer repair services or can refer you to authorized service centers. Repair costs are quoted before work begins.</p>
        </section>
      </div>
    </div>
  );
}
