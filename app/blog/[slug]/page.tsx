import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import TableOfContents from "@/components/TableOfContents";
import GiscusComments from "@/components/GiscusComments";

export const revalidate = 86400; // re-generate individual posts daily
import { generateTableOfContents } from "@/lib/posts";

// ── Static paths ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `${siteConfig.siteUrl}/blog/${post.slug}`;
  return {
    title: `${post.title} | ${siteConfig.businessName}`,
    description: post.description,
    keywords: [post.primaryKeyword, ...post.tags].join(", "),
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type:        "article",
      url,
      title:       post.title,
      description: post.description,
      images:      [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      authors:     [post.author],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image] },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related   = getRelatedPosts(post, 3);
  const canonical = `${siteConfig.siteUrl}/blog/${post.slug}`;
  const toc       = generateTableOfContents(post.content);

  // Article + BreadcrumbList + FAQPage JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id":   `${canonical}#article`,
        headline: post.title,
        description: post.description,
        image: post.image,
        datePublished: post.date,
        dateModified:  post.date,
        author: { "@type": "Person", name: post.author },
        publisher: {
          "@type": "Organization",
          name: siteConfig.businessName,
          logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl}${siteConfig.logo}` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        keywords: [post.primaryKeyword, ...post.tags].join(", "),
        wordCount: post.content.split(/\s+/).length,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
      ...(post.faqs && post.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type":          "Question",
                name:             faq.question,
                acceptedAnswer:   { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-pink-600">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 truncate max-w-xs inline-block align-bottom">{post.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="bg-pink-100 text-pink-700 text-xs font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-lg mb-4">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-y border-gray-100 py-4">
            <span>✍️ {post.author}</span>
            <span>📅 {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>⏱️ {post.readingTime} min read</span>
          </div>
        </header>

        {/* Hero image */}
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10 bg-pink-50">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>

        {/* Table of Contents */}
        <TableOfContents headings={toc} />

        {/* Article body */}
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html || "" }}
        />

        {/* Share buttons */}
        <ShareButtons url={canonical} title={post.title} />

        {/* FAQ Section */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-12 bg-pink-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq, i) => (
                <details key={i} className="group bg-white rounded-xl p-5 shadow-sm cursor-pointer">
                  <summary className="font-semibold text-gray-900 list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-pink-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Author bio + CTA */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-3">About the Author</p>
          <p className="font-semibold text-gray-800 mb-1">{post.author}</p>
          <p className="text-gray-500 text-sm mb-4">
            The editorial team at {siteConfig.businessName} — your trusted source for
            {" "}{siteConfig.primaryKeyword} information in {siteConfig.city}.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors"
          >
            Visit {siteConfig.businessName} →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More {siteConfig.city} {siteConfig.category} Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <BlogCard key={rp.slug} post={rp} />
              ))}
            </div>
          </section>
        )}

        {/* Comments (Giscus — configure env vars to enable) */}
        <GiscusComments term={post.slug} />
      </div>
    </>
  );
}
