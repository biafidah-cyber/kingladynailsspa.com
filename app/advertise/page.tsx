import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Advertise With Us | ${siteConfig.businessName} — ${siteConfig.city}`,
  description: `Reach thousands of ${siteConfig.city} ${siteConfig.category.toLowerCase()} customers. Advertise on ${siteConfig.businessName} — sponsored posts, display ads, newsletter sponsorships.`,
  alternates: { canonical: `${siteConfig.siteUrl}/advertise` },
};

const placements = [
  {
    icon: "📝",
    name: "Sponsored Article",
    price: "$150",
    period: "one-time",
    features: [
      "1,200+ word article written by us or you",
      "Permanent do-follow backlink",
      "Promoted via social media",
      "Indexed by Google via IndexNow",
      "Labeled 'Sponsored' (FTC compliant)",
    ],
    highlight: true,
  },
  {
    icon: "📧",
    name: "Newsletter Mention",
    price: "$50",
    period: "per send",
    features: [
      "Dedicated shout-out to our email list",
      "Your headline, description, and link",
      "Reaches engaged local subscribers",
      "Sent within 7 business days",
    ],
    highlight: false,
  },
  {
    icon: "🖼️",
    name: "Banner Ad",
    price: "$80",
    period: "per month",
    features: [
      "Sidebar or in-article placement",
      "Provide your own 300×250 image",
      "Link to your landing page",
      "Impression report included",
    ],
    highlight: false,
  },
  {
    icon: "📍",
    name: "Local Business Spotlight",
    price: "$200",
    period: "one-time",
    features: [
      "Dedicated profile page for your business",
      "NAP data, photos, hours, services",
      "Schema.org LocalBusiness markup",
      "Permanent listing in our directory",
      "Ideal for local ${siteConfig.city} businesses",
    ],
    highlight: false,
  },
];

const stats = [
  { label: "Monthly Readers", value: "10,000+" },
  { label: "Avg. Pages / Visit", value: "3.2" },
  { label: "Avg. Time on Page", value: "4 min" },
  { label: "Email Subscribers", value: "500+" },
  { label: "Primary Location", value: siteConfig.city },
  { label: "Core Audience", value: `${siteConfig.category} Customers` },
];

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Advertise</span>
      </nav>

      {/* Hero */}
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Advertise on {siteConfig.businessName}
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Reach thousands of active {siteConfig.city} beauty customers who are already
          searching for exactly what you offer.
        </p>
      </header>

      {/* Audience stats */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Audience</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl font-black text-pink-600 mb-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad packages */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Advertising Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {placements.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 border ${
                p.highlight
                  ? "bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-100"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              {p.highlight && (
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className={`text-xl font-bold mb-1 ${p.highlight ? "text-white" : "text-gray-900"}`}>
                {p.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-3xl font-black ${p.highlight ? "text-white" : "text-pink-600"}`}>
                  {p.price}
                </span>
                <span className={`text-sm ${p.highlight ? "text-white/70" : "text-gray-400"}`}>
                  / {p.period}
                </span>
              </div>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${p.highlight ? "text-white/90" : "text-gray-600"}`}>
                    <span className={p.highlight ? "text-white" : "text-pink-500"}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Who advertises with us */}
      <section className="mb-14 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Should Advertise Here?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
          {[
            `Local ${siteConfig.city} ${siteConfig.category.toLowerCase()} businesses`,
            `${siteConfig.category} product brands & suppliers`,
            "Service software & booking tools",
            "Training programs & certifications",
            "Equipment & supply companies",
            "Wedding & event planners",
            "Influencer & affiliate programs",
            "Local hotels & hospitality near " + siteConfig.city,
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="text-pink-500">●</span> {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gray-900 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Started?</h2>
        <p className="text-gray-400 mb-2">
          Email us with your package of interest and business details.
        </p>
        <p className="text-gray-400 mb-6">
          <a
            href={`mailto:${siteConfig.email}?subject=Advertising Inquiry`}
            className="text-pink-400 hover:text-pink-300 underline"
          >
            {siteConfig.email}
          </a>{" "}
          — subject: <em>&quot;Advertising Inquiry&quot;</em>
        </p>
        <a
          href={`mailto:${siteConfig.email}?subject=Advertising Inquiry`}
          className="inline-block bg-pink-600 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-700 transition-colors"
        >
          Contact Us About Advertising →
        </a>
        <p className="text-gray-500 text-xs mt-4">
          All placements are FTC-compliant and clearly labeled as sponsored content where required.
        </p>
      </div>
    </div>
  );
}
