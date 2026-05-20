import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import TrustBadges from "@/components/TrustBadges";
import TestimonialSection from "@/components/TestimonialSection";

export const metadata: Metadata = {
  title: `${siteConfig.primaryKeyword} — ${siteConfig.businessName}`,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.siteUrl },
};

// Star rating display
function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-pink-600 font-semibold text-sm tracking-widest uppercase mb-3">
            {siteConfig.city}, {siteConfig.stateCode}
          </p>
          {/* H1 — primary keyword must be here */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-5 leading-tight">
            {siteConfig.primaryKeyword.split(" ").map((word, i) => (
              <span key={i} className={i === 0 ? "capitalize" : ""}>{word} </span>
            ))}
            <span className="text-pink-600">You'll Love</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {siteConfig.tagline}. Serving {siteConfig.city} since {siteConfig.yearEstablished}.
            Walk-ins welcome — no appointment needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              📞 Call {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-bold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Get Directions
            </Link>
          </div>
          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Stars rating={siteConfig.rating} />
              <strong className="text-gray-700 ml-1">{siteConfig.rating}</strong>
              ({siteConfig.reviewCount.toLocaleString()} reviews)
            </span>
            <span>✅ Walk-ins Welcome</span>
            <span>✅ Licensed & Insured</span>
            <span>✅ Since {siteConfig.yearEstablished}</span>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ──────────────────────────────────────────────────────── */}
      <TrustBadges />

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Our Services in {siteConfig.city}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Professional {siteConfig.category.toLowerCase()} services at affordable prices
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.services.map((service) => (
              <div
                key={service.name}
                className="border border-pink-100 rounded-2xl p-6 hover:shadow-lg hover:border-pink-300 transition-all group"
              >
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-pink-600 transition-colors">
                  {service.name} in {siteConfig.city}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-pink-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Why {siteConfig.city} Chooses {siteConfig.businessName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteConfig.about.values.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────────── */}
      <TestimonialSection />

      {/* ── HOURS & LOCATION ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Hours */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
            <div className="space-y-3">
              {Object.entries(siteConfig.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-700">{day}</span>
                  <span className="text-gray-500">{hours}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Address / Contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Visit Us in {siteConfig.city}
            </h2>
            <address className="not-italic text-gray-600 space-y-3">
              <p className="flex items-start gap-2">
                <span>📍</span>
                <span>
                  {siteConfig.address}<br />
                  {siteConfig.city}, {siteConfig.stateCode} {siteConfig.zip}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`} className="text-pink-600 hover:underline">
                  {siteConfig.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span>
                <a href={`mailto:${siteConfig.email}`} className="text-pink-600 hover:underline">
                  {siteConfig.email}
                </a>
              </p>
            </address>
            <a
              href={siteConfig.mapEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors"
            >
              📍 Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── LATEST BLOG POSTS ─────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              {siteConfig.city} {siteConfig.category} Tips & Guides
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Expert advice on {siteConfig.primaryKeyword} trends, care tips, and more
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-bold px-8 py-3 rounded-full transition-colors"
              >
                View All Articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-pink-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready for the Best {siteConfig.category} Experience in {siteConfig.city}?
          </h2>
          <p className="text-pink-100 mb-8 text-lg">
            Walk in today or call ahead. We're ready to make your nails beautiful.
          </p>
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
            className="bg-white text-pink-600 font-bold px-10 py-4 rounded-full text-lg hover:bg-pink-50 transition-colors inline-block shadow-lg"
          >
            Call {siteConfig.phone} Now
          </a>
        </div>
      </section>
    </>
  );
}
