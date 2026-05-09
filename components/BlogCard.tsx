import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/posts";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Thumbnail */}
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-44 bg-pink-50 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {post.category && (
            <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {post.description}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-pink-600 text-sm font-semibold hover:text-pink-800 transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
