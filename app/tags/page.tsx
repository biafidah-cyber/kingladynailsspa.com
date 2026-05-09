import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600; // re-generate tag cloud every hour

export const metadata: Metadata = {
  title: `All Topics | ${siteConfig.businessName} Blog`,
  description: `Browse ${siteConfig.businessName} articles by topic — ${siteConfig.category.toLowerCase()} tips, guides, and trends in ${siteConfig.city}.`,
  alternates: { canonical: `${siteConfig.siteUrl}/tags` },
};

export default function TagsPage() {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((p) => {
    p.tags?.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });

  const tags = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Topics</span>
      </nav>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Browse by Topic</h1>
      <p className="text-gray-500 mb-10">
        {tags.length} topics across {posts.length} article{posts.length !== 1 ? "s" : ""}
      </p>

      {tags.length === 0 ? (
        <p className="text-gray-400">Topics will appear here once articles are published.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
              className="bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              {tag}
              <span className="ml-2 bg-pink-200 text-pink-600 text-xs px-2 py-0.5 rounded-full">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
