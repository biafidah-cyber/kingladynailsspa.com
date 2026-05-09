"use client";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl mb-4">⚠️</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h2>
      <p className="text-gray-500 max-w-md mb-8">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="bg-pink-600 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-700 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border-2 border-pink-600 text-pink-600 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
