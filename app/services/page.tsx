import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

export const metadata: Metadata = {
  title:       `Our Services | ${siteConfig.businessName}`,
  description: `Explore all ${siteConfig.category} services offered by ${siteConfig.businessName} in ${siteConfig.city}. Professional ${siteConfig.category.toLowerCase()} services at affordable prices.`,
  alternates:  { canonical: `${siteConfig.siteUrl}/services` },
  openGraph: {
    title:       `Our Services | ${siteConfig.businessName}`,
    description: `All ${siteConfig.category.toLowerCase()} services at ${siteConfig.businessName} in ${siteConfig.city}.`,
    url:         `${siteConfig.siteUrl}/services`,
  },
};

const schemaJson = {
  "@context": "https://schema.org",
  "@type":    siteConfig.schemaBizType,
  "name":     siteConfig.businessName,
  "url":      siteConfig.siteUrl,
  "telephone": siteConfig.phone,
  "address": {
    "@type":           "PostalAddress",
    "streetAddress":   siteConfig.address,
    "addressLocality": siteConfig.city,
    "addressRegion":   siteConfig.stateCode,
    "postalCode":      siteConfig.zip,
    "addressCountry":  "US",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name":  "Services",
    "itemListElement": services.map((s, i) => ({
      "@type":    "Offer",
      "position": i + 1,
      "name":     s.name,
      "url":      `${siteConfig.siteUrl}/services/${s.slug}`,
      "description": s.description,
    })),
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-600 to-rose-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-pink-200 mb-3 uppercase tracking-wide">
            {siteConfig.businessName} · {siteConfig.city}, {siteConfig.stateCode}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Our {siteConfig.category} Services
          </h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8">
            Professional {siteConfig.category.toLowerCase()} services in {siteConfig.city} &mdash; expert staff,
            quality results, at prices you&apos;ll love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="bg-white text-pink-700 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors"
            >
              📞 Call {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Book an Appointment →
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Everything We Offer
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Click any service to learn more, see pricing, and read FAQs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all p-6 flex flex-col"
            >
              <div className="text-4xl mb-4">{service.emoji}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {service.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.price && (
                  <span className="bg-pink-50 text-pink-700 text-xs font-medium px-3 py-1 rounded-full">
                    {service.price}
                  </span>
                )}
                {service.duration && (
                  <span className="bg-gray-50 text-gray-500 text-xs px-3 py-1 rounded-full">
                    ⏱ {service.duration}
                  </span>
                )}
              </div>
              <div className="mt-4 text-sm font-semibold text-pink-600 group-hover:translate-x-1 transition-transform">
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-pink-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Why Clients Choose {siteConfig.businessName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: "⭐", title: `${siteConfig.rating}-Star Rated`,  desc: `${siteConfig.reviewCount.toLocaleString()}+ verified reviews from happy clients in ${siteConfig.city}.` },
              { icon: "🧼", title: "Clean & Safe",                    desc: `Fully sterilized tools and sanitized stations — we exceed ${siteConfig.stateCode} health code.` },
              { icon: "📍", title: `Serving ${siteConfig.city}`,      desc: `${siteConfig.yearEstablished ? `Trusted by the community since ${siteConfig.yearEstablished}.` : `Your local ${siteConfig.category.toLowerCase()} expert.`}` },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Book?
        </h2>
        <p className="text-gray-500 mb-8">
          Call us or stop in — we&apos;re ready to take care of you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="bg-pink-600 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-700 transition-colors"
          >
            📞 Call {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="border-2 border-pink-600 text-pink-600 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors"
          >
            Send a Message →
          </Link>
        </div>
      </section>
    </>
  );
}
