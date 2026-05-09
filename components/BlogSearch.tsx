"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import type { Post } from "@/lib/posts";

export default function BlogSearch({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Keep URL in sync with query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    const newUrl = query.trim()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [query, router]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.primaryKeyword.toLowerCase().includes(q)
    );
  }, [query, posts]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-lg mx-auto mb-10">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${posts.length} articles…`}
          className="w-full border border-gray-200 bg-white rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Results count */}
      {query && (
        <p className="text-center text-sm text-gray-400 mb-8">
          {filtered.length === 0
            ? `No results for "${query}"`
            : `${filtered.length} article${filtered.length === 1 ? "" : "s"} for "${query}"`}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 && !query ? (
        <p className="text-center text-gray-400 py-20 text-lg">
          First articles coming soon. Check back shortly!
        </p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500">No articles matched that search. Try different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
