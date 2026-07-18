import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for Crescendo Namibia.',
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your actions and preferences over time.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Cookies We Use</h2>
          <p>Essential cookies: Required for the website to function (shopping cart, login). Analytics cookies: Help us understand how visitors use our site (Google Analytics). Preference cookies: Remember your settings (language, region).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Third-Party Cookies</h2>
          <p>We use Google Analytics for website analytics. These cookies collect anonymous information about how you use the site. WhatsApp links may set cookies on the WhatsApp domain.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Disabling essential cookies may affect website functionality (e.g., shopping cart will not work).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Cookie Duration</h2>
          <p>Session cookies are deleted when you close your browser. Persistent cookies remain for up to 2 years or until you delete them.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. Updates</h2>
          <p>We may update this policy as our use of cookies changes. Check this page for the latest information.</p>
        </section>
      </div>
    </div>
  );
}
