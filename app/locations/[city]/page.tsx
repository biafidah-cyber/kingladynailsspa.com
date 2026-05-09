import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { locations } from "@/config/locations";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

interface Props {
  params: { city: string };
}

export function generateStaticParams() {
  return locations.map((loc) => ({ city: loc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = locations.find((l) => l.slug === params.city);
  if (!loc) return {};

  const title = `${siteConfig.primaryKeyword} in ${loc.name} | ${siteConfig.businessName}`;
  const description = `Looking for ${siteConfig.primaryKeyword} near ${loc.name}? ${siteConfig.businessName} serves ${loc.name} with professional ${siteConfig.category.toLowerCase()} services. ${loc.description}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.siteUrl}/locations/${loc.slug}` },
    openGraph: { title, description, url: `${siteConfig.siteUrl}/locations/${loc.slug}` },
  };
}

export default function LocationPage({ params }: Props) {
  const loc = locations.find((l) => l.slug === params.city);
  if (!loc) notFound();

  const allPosts = getAllPosts();
  // Show posts that mention this location's city name
  const localPosts = allPosts
    .filter((p) =>
      p.title.toLowerCase().includes(loc.city.toLowerCase()) ||
      p.primaryKeyword.toLowerCase().includes(loc.city.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(loc.city.toLowerCase()))
    )
    .slice(0, 6);

  const recentPosts = allPosts.slice(0, 6);
  const postsToShow = localPosts.length >= 3 ? localPosts : recentPosts;

  const schemaJson = {
    "@context":       "https://schema.org",
    "@type":          siteConfig.schemaBizType,
    "name":           siteConfig.businessName,
    "description":    `${siteConfig.businessName} offers professional ${siteConfig.category.toLowerCase()} services serving ${loc.name}`,
    "telephone":      siteConfig.phone,
    "url":            `${siteConfig.siteUrl}/locations/${loc.slug}`,
    "areaServed":     { "@type": "City", "name": loc.city, "addressRegion": loc.stateCode },
    "address": {
      "@type":           "PostalAddress",
      "streetAddress":   siteConfig.address,
      "addressLocality": siteConfig.city,
      "addressRegion":   siteConfig.stateCode,
      "postalCode":      siteConfig.zip,
      "addressCountry":  "US",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-600 to-rose-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm font-medium text-pink-200 mb-3 uppercase tracking-wide">
            Serving {loc.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {siteConfig.primaryKeyword} near {loc.name}
          </h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8">
            {siteConfig.businessName} proudly serves customers in {loc.name} ({loc.distance}).
            Professional {siteConfig.category.toLowerCase()} services at prices you&apos;ll love.
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
              Get Directions →
            </Link>
          </div>
        </div>
      </section>

      {/* Why we serve this area */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {siteConfig.category} in {loc.name}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              {loc.description} Residents of {loc.name} no longer need to travel far for premium{" "}
              {siteConfig.category.toLowerCase()} services — {siteConfig.businessName} is conveniently
              accessible and{" "}
              <strong>{loc.distance}</strong>.
            </p>
            <p>
              We serve clients from {loc.name} and surrounding areas including{" "}
              {loc.landmarks.join(", ")}. Whether you&apos;re visiting us for the first time or
              you&apos;re a regular, we guarantee a clean, professional, and welcoming experience
              every visit.
            </p>
          </div>

          {/* Local landmarks as trust signals */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loc.landmarks.map((lm) => (
              <div key={lm} className="bg-pink-50 rounded-xl p-4 text-center">
                <span className="text-2xl">📍</span>
                <p className="text-sm font-semibold text-gray-700 mt-2">Near {lm}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Our Services in {loc.name}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Everything you need — from everyday manicures to special occasion nail art.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {siteConfig.services.map((service) => (
              <div key={service.name} className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 bg-pink-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to visit us from {loc.city}?
          </h2>
          <p className="text-pink-100 mb-8">
            Walk-ins welcome! Or call ahead to guarantee your preferred technician.
          </p>
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="bg-white text-pink-700 font-bold px-10 py-4 rounded-full text-lg hover:bg-pink-50 transition-colors inline-block"
          >
            📞 {siteConfig.phone}
          </a>
        </div>
      </section>

      {/* Related blog posts */}
      {postsToShow.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {siteConfig.category} Tips for {loc.name} Residents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {postsToShow.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other locations */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Other Areas We Serve</h2>
          <div className="flex flex-wrap gap-3">
            {locations
              .filter((l) => l.slug !== loc.slug)
              .map((l) => (
                <Link
                  key={l.slug}
                  href={`/locations/${l.slug}`}
                  className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:border-pink-400 hover:text-pink-600 transition-colors"
                >
                  {l.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
