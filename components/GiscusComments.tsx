"use client";
// components/GiscusComments.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Free GitHub Discussions-based comment system — no backend, no database.
// Setup (one-time, takes 5 minutes):
//
//  1. Make your site's GitHub repo public (comments live there as Discussions)
//  2. Go to https://github.com/apps/giscus and install on your repo
//  3. Enable Discussions in repo Settings → Features → Discussions
//  4. Go to https://giscus.app — fill in your repo info → copy the 4 IDs
//  5. Add to .env.local:
//       NEXT_PUBLIC_GISCUS_REPO=username/repo-name
//       NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxxxx
//       NEXT_PUBLIC_GISCUS_CATEGORY=General
//       NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxxx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";

interface GiscusCommentsProps {
  /** Unique key for the page — usually the post slug */
  term: string;
}

export default function GiscusComments({ term }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const repo       = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId     = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category   = process.env.NEXT_PUBLIC_GISCUS_CATEGORY   ?? "General";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  const isConfigured = Boolean(repo && repoId && categoryId);

  useEffect(() => {
    if (!isConfigured) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[GiscusComments] Missing one or more NEXT_PUBLIC_GISCUS_* env vars. " +
          "Comments will not render. See .env.local.example for setup instructions."
        );
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Remove any existing script (re-mounts when slug changes)
    const existing = container.querySelector("script");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src               = "https://giscus.app/client.js";
    script.async             = true;
    script.crossOrigin       = "anonymous";
    script.setAttribute("data-repo",            repo ?? "");
    script.setAttribute("data-repo-id",         repoId ?? "");
    script.setAttribute("data-category",        category);
    script.setAttribute("data-category-id",     categoryId ?? "");
    script.setAttribute("data-mapping",         "specific");   // use `term` as the key
    script.setAttribute("data-term",            term);
    script.setAttribute("data-strict",          "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata",   "0");
    script.setAttribute("data-input-position",  "top");
    script.setAttribute("data-theme",           "light");
    script.setAttribute("data-lang",            "en");
    script.setAttribute("data-loading",         "lazy");
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [isConfigured, repo, repoId, category, categoryId, term]);

  if (!isConfigured) return null;

  return (
    <section className="mt-12" aria-label="Comments">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
      <div ref={containerRef} />
    </section>
  );
}
