import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.businessName}`,
  description: `Privacy Policy for ${siteConfig.businessName} — how we collect, use, and protect your personal data.`,
  alternates: { canonical: `${siteConfig.siteUrl}/privacy` },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "January 1, 2025";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
          <p>
            This website is operated by <strong>{siteConfig.businessName}</strong>, located at{" "}
            {siteConfig.address}, {siteConfig.city}, {siteConfig.stateCode} {siteConfig.zip}.
            You can reach us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-pink-600 hover:underline">
              {siteConfig.email}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="mb-3">We may collect the following types of information:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Contact information</strong> — name and email address when you use our contact form or subscribe to our newsletter.</li>
            <li><strong>Usage data</strong> — pages visited, time on site, browser type, and device, collected via Google Analytics (GA4).</li>
            <li><strong>Cookies</strong> — small files stored in your browser to remember preferences and improve your experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>To respond to your inquiries and provide customer service.</li>
            <li>To send you newsletters or updates you have opted into (you can unsubscribe at any time).</li>
            <li>To analyze website traffic and improve content performance.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Google Analytics</h2>
          <p>
            We use Google Analytics 4 to understand how visitors interact with our site. Google Analytics
            collects data such as pages visited, session duration, and approximate location. This data is
            anonymized and aggregated. You can opt out using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
          <p>
            Our site uses essential cookies to function, and analytics cookies (Google Analytics) to
            measure performance. You can disable cookies in your browser settings at any time, though
            this may affect some site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-Party Links</h2>
          <p>
            Our blog articles and pages may contain links to third-party websites. We are not responsible
            for the privacy practices or content of those sites. We encourage you to review the privacy
            policies of any external sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Advertising</h2>
          <p>
            We may display sponsored content and advertisements on this site. Sponsored posts are clearly
            labeled. Third-party advertisers may use cookies to serve relevant ads. We do not sell your
            personal information to advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Retention</h2>
          <p>
            We retain contact form submissions for up to 12 months. Newsletter subscriber data is retained
            until you unsubscribe. Analytics data is retained per Google&apos;s default retention settings (14 months).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Your Rights</h2>
          <p className="mb-3">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to or restrict processing of your data.</li>
            <li>Withdraw consent at any time (where processing is based on consent).</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-pink-600 hover:underline">
              {siteConfig.email}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Children&apos;s Privacy</h2>
          <p>
            This website is not directed at children under 13. We do not knowingly collect personal
            information from children. If you believe we have inadvertently collected such information,
            contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The date at the top of this page
            indicates when it was last revised. Continued use of the site after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
          <p>
            For any privacy-related questions, contact us at:
          </p>
          <address className="not-italic mt-3 text-gray-600 space-y-1">
            <p><strong>{siteConfig.businessName}</strong></p>
            <p>{siteConfig.address}</p>
            <p>{siteConfig.city}, {siteConfig.stateCode} {siteConfig.zip}</p>
            <p>
              Email:{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-pink-600 hover:underline">
                {siteConfig.email}
              </a>
            </p>
          </address>
        </section>

      </div>
    </div>
  );
}
