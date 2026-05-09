import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Write for Us — Guest Post Guidelines | ${siteConfig.businessName}`,
  description: `Submit a guest post to ${siteConfig.businessName}. We publish expert ${siteConfig.category.toLowerCase()} articles, beauty tips, and local ${siteConfig.city} guides. Get a do-follow backlink.`,
  alternates: { canonical: `${siteConfig.siteUrl}/write-for-us` },
  robots: { index: true, follow: true },
};

const guidelines = [
  {
    icon: "✍️",
    title: "Original Content",
    body: "Articles must be 100% original, never published elsewhere. We check every submission with Copyscape. Minimum 1,200 words.",
  },
  {
    icon: "🎯",
    title: "On-Topic Only",
    body: `Content must relate to ${siteConfig.category.toLowerCase()}, beauty, wellness, self-care, or local ${siteConfig.city} lifestyle topics. No finance, crypto, or unrelated niches.`,
  },
  {
    icon: "🔗",
    title: "One Do-Follow Backlink",
    body: "You may include one contextual do-follow link to your own site within the article body. No link farms or spammy domains. We reserve the right to edit or remove links.",
  },
  {
    icon: "📸",
    title: "Images Required",
    body: "Include at least 2 royalty-free images (Unsplash, Pexels, or your own). Provide alt text. No watermarked or copyrighted images.",
  },
  {
    icon: "🧠",
    title: "Expert Perspective",
    body: "Articles should provide real value: how-to guides, trend breakdowns, product reviews, local recommendations. No AI-generated filler content.",
  },
  {
    icon: "⏱️",
    title: "Review Timeline",
    body: "We review all submissions within 5–7 business days. If accepted, your article goes live within 2 weeks. We'll notify you by email with the live URL.",
  },
];

const topics = [
  `${siteConfig.category} trends and techniques`,
  `Nail care and maintenance tips`,
  `Beauty product reviews`,
  `Bridal and event nail ideas`,
  `Local ${siteConfig.city} beauty guides`,
  `Self-care and wellness routines`,
  `Seasonal nail design inspiration`,
  `DIY nail art tutorials`,
];

export default function WriteForUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Write for Us</span>
      </nav>

      {/* Hero */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Write for {siteConfig.businessName}
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Share your expertise with our audience of {siteConfig.city} beauty enthusiasts.
          Get your byline, a do-follow backlink, and exposure to thousands of monthly readers.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-pink-50 border border-pink-100 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-black text-pink-600">10K+</p>
            <p className="text-xs text-gray-500 mt-0.5">Monthly Readers</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-black text-blue-600">DA 30+</p>
            <p className="text-xs text-gray-500 mt-0.5">Domain Authority</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-black text-green-600">Free</p>
            <p className="text-xs text-gray-500 mt-0.5">Guest Posts</p>
          </div>
        </div>
      </header>

      {/* Topics we cover */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Topics We Accept</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic) => (
            <div key={topic} className="flex items-center gap-2 text-gray-700 text-sm">
              <span className="text-pink-500 font-bold">✓</span>
              {topic}
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submission Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guidelines.map((g) => (
            <div key={g.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="text-2xl mb-2">{g.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{g.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="mb-12 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What You Get</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2"><span className="text-pink-500 mt-0.5">●</span><span><strong>Byline + author bio</strong> with your name, photo, and short bio</span></li>
          <li className="flex items-start gap-2"><span className="text-pink-500 mt-0.5">●</span><span><strong>One do-follow backlink</strong> to your website or social profile</span></li>
          <li className="flex items-start gap-2"><span className="text-pink-500 mt-0.5">●</span><span><strong>Social promotion</strong> — we share every published post to our social channels</span></li>
          <li className="flex items-start gap-2"><span className="text-pink-500 mt-0.5">●</span><span><strong>Permanent listing</strong> — articles stay live indefinitely (no time-limited posts)</span></li>
          <li className="flex items-start gap-2"><span className="text-pink-500 mt-0.5">●</span><span><strong>Indexed quickly</strong> — our IndexNow integration pings Google on publish</span></li>
        </ul>
      </section>

      {/* How to submit */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Submit</h2>
        <ol className="space-y-4 text-gray-700">
          <li className="flex gap-3">
            <span className="bg-pink-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
            <div><strong>Pitch your topic</strong> — email us a 2–3 sentence summary of your article idea before writing the full piece.</div>
          </li>
          <li className="flex gap-3">
            <span className="bg-pink-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
            <div><strong>Wait for approval</strong> — we&apos;ll respond within 48 hours with a yes/no and any direction.</div>
          </li>
          <li className="flex gap-3">
            <span className="bg-pink-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
            <div><strong>Write and submit</strong> — send your full article as a Google Doc or Word document with images attached.</div>
          </li>
          <li className="flex gap-3">
            <span className="bg-pink-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
            <div><strong>We publish</strong> — after light editing for style and SEO, your article goes live and you receive the URL.</div>
          </li>
        </ol>
      </section>

      {/* CTA */}
      <div className="bg-gray-900 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to Contribute?</h2>
        <p className="text-gray-400 mb-6">
          Email your pitch to{" "}
          <a href={`mailto:${siteConfig.email}?subject=Guest Post Pitch`} className="text-pink-400 hover:text-pink-300 underline">
            {siteConfig.email}
          </a>{" "}
          with the subject line <em>&quot;Guest Post Pitch: [Your Topic]&quot;</em>
        </p>
        <a
          href={`mailto:${siteConfig.email}?subject=Guest Post Pitch`}
          className="inline-block bg-pink-600 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-700 transition-colors"
        >
          Send Your Pitch →
        </a>
        <p className="text-gray-500 text-xs mt-4">
          We do not accept paid guest posts or link insertions in existing articles.
        </p>
      </div>
    </div>
  );
}
