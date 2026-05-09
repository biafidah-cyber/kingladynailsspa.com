import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

export const revalidate = 3600; // re-generate tag archives every hour

// Build all tag slugs for static generation
export function generateStaticParams() {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((t) => tags.add(t.toLowerCase().replace(/\s+/g, "-"))));
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const label = decodeURIComponent(params.tag).replace(/-/g, " ");
  return {
    title: `${label} Articles | ${siteConfig.businessName} Blog`,
    description: `Browse all ${siteConfig.businessName} articles tagged "${label}" — tips, guides, and expert advice for ${siteConfig.city}.`,
    alternates: { canonical: `${siteConfig.siteUrl}/tags/${params.tag}` },
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = getAllPosts();
  const tagLabel = decodeURIComponent(params.tag).replace(/-/g, " ");

  const filtered = posts.filter((p) =>
    p.tags?.some((t) => t.toLowerCase().replace(/\s+/g, "-") === params.tag.toLowerCase())
  );

  if (filtered.length === 0) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tagLabel} Articles`,
    url: `${siteConfig.siteUrl}/tags/${params.tag}`,
    description: `All articles tagged "${tagLabel}" on ${siteConfig.businessName}`,
    numberOfItems: filtered.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-pink-600">Blog</Link>
          <span className="mx-2">/</span>
          <Link href="/tags" className="hover:text-pink-600">Topics</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 capitalize">{tagLabel}</span>
        </nav>

        <header className="mb-12">
          <div className="inline-block bg-pink-100 text-pink-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Topic
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 capitalize">{tagLabel}</h1>
          <p className="text-gray-500 text-lg">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""} about{" "}
            <strong>{tagLabel}</strong> in {siteConfig.city}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tags"
            className="text-pink-600 font-semibold hover:underline"
          >
            ← Browse all topics
          </Link>
        </div>
      </div>
    </>
  );
}
