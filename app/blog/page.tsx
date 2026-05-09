import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import BlogSearch from "@/components/BlogSearch";

export const revalidate = 3600; // re-generate blog index every hour

export const metadata: Metadata = {
  title: `${siteConfig.category} Blog — Tips & Guides for ${siteConfig.city}`,
  description: `Expert ${siteConfig.primaryKeyword} tips, guides, and advice. Learn about nail care, trends, and how to find the best ${siteConfig.category.toLowerCase()} in ${siteConfig.city}.`,
  alternates: { canonical: `${siteConfig.siteUrl}/blog` },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Blog</span>
      </nav>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {siteConfig.city} {siteConfig.category} Blog
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Expert guides, trends, and tips about {siteConfig.primaryKeyword}.
          New articles every week.
        </p>
      </header>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.slug} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      }>
        <BlogSearch posts={posts} />
      </Suspense>
    </div>
  );
}
