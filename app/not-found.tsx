import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `404 — Page Not Found | ${siteConfig.businessName}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-8xl font-black text-pink-200 mb-0 leading-none select-none">404</p>
      <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Page Not Found</h1>
      <p className="text-gray-500 text-lg max-w-md mb-8">
        Sorry, we couldn&apos;t find that page. It may have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="bg-pink-600 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-700 transition-colors"
        >
          ← Back to Home
        </Link>
        <Link
          href="/blog"
          className="border-2 border-pink-600 text-pink-600 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors"
        >
          Browse Articles
        </Link>
      </div>
      <p className="mt-8 text-gray-400 text-sm">
        Need help?{" "}
        <a
          href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`}
          className="text-pink-600 hover:underline"
        >
          Call {siteConfig.phone}
        </a>
      </p>
    </div>
  );
}
