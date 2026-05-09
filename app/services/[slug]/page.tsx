import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};

  const title = `${service.name} in ${siteConfig.city} | ${siteConfig.businessName}`;
  const url   = `${siteConfig.siteUrl}/services/${service.slug}`;

  return {
    title,
    description:  service.description,
    keywords:     service.keywords.join(", "),
    alternates:   { canonical: url },
    openGraph: {
      title,
      description: service.description,
      url,
      type: "website",
    },
  };
}

export default function ServicePage({ params }: Props) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const url = `${siteConfig.siteUrl}/services/${service.slug}`;

  // Related blog posts (match service name or keywords)
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => {
      const text = `${p.title} ${p.primaryKeyword} ${p.tags?.join(" ")}`.toLowerCase();
      return service.keywords.some((kw) => text.includes(kw.split(" ")[0].toLowerCase()));
    })
    .slice(0, 3);

  // Other services for "You might also like"
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  // Schema.org markup
  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":       "Service",
        "@id":         `${url}#service`,
        "name":        `${service.name} in ${siteConfig.city}`,
        "description": service.description,
        "provider": {
          "@type": siteConfig.schemaBizType,
          "name":  siteConfig.businessName,
          "url":   siteConfig.siteUrl,
          "telephone": siteConfig.phone,
          "address": {
            "@type":           "PostalAddress",
            "streetAddress":   siteConfig.address,
            "addressLocality": siteConfig.city,
            "addressRegion":   siteConfig.stateCode,
            "postalCode":      siteConfig.zip,
            "addressCountry":  "US",
          },
        },
        ...(service.price ? { "offers": { "@type": "Offer", "description": service.price } } : {}),
        "areaServed": { "@type": "City", "name": siteConfig.city, "addressRegion": siteConfig.stateCode },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",     "item": siteConfig.siteUrl },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": `${siteConfig.siteUrl}/services` },
          { "@type": "ListItem", "position": 3, "name": service.name, "item": url },
        ],
      },
      ...(service.faqs.length > 0
        ? [{
            "@type": "FAQPage",
            "mainEntity": service.faqs.map((faq) => ({
              "@type": "Question",
              "name":  faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a },
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-600 to-rose-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-pink-200 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-white">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{service.name}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="text-5xl mt-1 hidden sm:block">{service.emoji}</div>
            <div>
              <p className="text-sm font-medium text-pink-200 mb-2 uppercase tracking-wide">
                {siteConfig.businessName} · {siteConfig.city}, {siteConfig.stateCode}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                {service.name} in {siteConfig.city}
              </h1>
              <p className="text-lg text-pink-100 max-w-2xl mb-6">{service.tagline}</p>
              <div className="flex flex-wrap gap-3">
                {service.price && (
                  <span className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full">
                    💰 {service.price}
                  </span>
                )}
                {service.duration && (
                  <span className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full">
                    ⏱ {service.duration}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="bg-white text-pink-700 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors text-center"
            >
              📞 Book Now — Call {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-center"
            >
              Send a Message →
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <article className="lg:col-span-2 space-y-10">

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About Our {service.name} Service
              </h2>
              <div className="prose prose-pink max-w-none text-gray-700 leading-relaxed space-y-4">
                {service.body.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What&apos;s Included
              </h2>
              <ul className="space-y-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="text-pink-500 mt-0.5 text-lg">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQs */}
            {service.faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, i) => (
                    <details key={i} className="group bg-pink-50 rounded-xl p-5 cursor-pointer">
                      <summary className="font-semibold text-gray-900 list-none flex justify-between items-center">
                        {faq.q}
                        <span className="text-pink-500 group-open:rotate-180 transition-transform ml-4 shrink-0">▼</span>
                      </summary>
                      <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Related blog posts */}
            {related.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {related.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Business info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">{siteConfig.businessName}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <span>📍</span>
                  <span>{siteConfig.address}, {siteConfig.city}, {siteConfig.stateCode} {siteConfig.zip}</span>
                </div>
                <div className="flex gap-2">
                  <span>📞</span>
                  <a href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                    className="text-pink-600 hover:underline font-medium">
                    {siteConfig.phone}
                  </a>
                </div>
                <div className="flex gap-2">
                  <span>⭐</span>
                  <span>{siteConfig.rating} stars · {siteConfig.reviewCount}+ reviews</span>
                </div>
                <div className="flex gap-2">
                  <span>🕐</span>
                  <span>Mon–Fri 9am–7pm · Sat 9am–8pm · Sun 10am–6pm</span>
                </div>
                <div className="flex gap-2">
                  <span>🚶</span>
                  <span>Walk-ins welcome</span>
                </div>
              </div>
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="mt-5 w-full block bg-pink-600 text-white text-center font-bold px-6 py-3 rounded-full hover:bg-pink-700 transition-colors"
              >
                📞 Call to Book
              </a>
              <Link
                href="/contact"
                className="mt-3 w-full block border border-pink-200 text-pink-600 text-center font-semibold px-6 py-2.5 rounded-full hover:bg-pink-50 transition-colors text-sm"
              >
                Send a Message
              </Link>
            </div>

            {/* Other services */}
            {otherServices.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Other Services</h3>
                <div className="space-y-2">
                  {otherServices.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600 hover:bg-white rounded-lg px-3 py-2 transition-colors"
                    >
                      <span>{s.emoji}</span>
                      <span>{s.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:underline px-3 py-2"
                  >
                    View all services →
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
