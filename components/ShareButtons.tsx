"use client";
import { useState } from "react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 my-8 p-5 bg-pink-50 rounded-2xl border border-pink-100">
      <span className="text-sm font-semibold text-gray-600 w-full sm:w-auto">Share this article:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        𝕏 Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#1877f2] text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
      >
        Facebook
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${enc(title + " " + url)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#25d366] text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={`https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(title)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#e60023] text-white text-sm px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
      >
        Pinterest
      </a>
      <button
        onClick={copy}
        className="flex items-center gap-1.5 bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
      >
        {copied ? "✅ Copied!" : "🔗 Copy Link"}
      </button>
    </div>
  );
}
