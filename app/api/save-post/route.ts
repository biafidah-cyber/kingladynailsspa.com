import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";
import { isSupabaseEnabled, dbSavePost } from "@/lib/db";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

// ── IndexNow ping ────────────────────────────────────────────────────────────
async function pingIndexNow(slug: string): Promise<boolean> {
  const siteUrl = siteConfig.siteUrl?.replace(/\/$/, "");
  const postUrl = `${siteUrl}/blog/${slug}`;
  // IndexNow key file must exist at /{key}.txt — we use domain hash as key
  const key = Buffer.from(siteConfig.domain).toString("hex").slice(0, 32);
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host:    siteConfig.domain,
        key,
        keyLocation: `${siteUrl}/${key}.txt`,
        urlList: [postUrl],
      }),
    });
    return res.status === 200 || res.status === 202;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Save disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, slug, description, html, primaryKeyword, tags, publishDate } = await req.json();

  if (!slug || !html) {
    return NextResponse.json({ error: "slug and html are required" }, { status: 400 });
  }

  // Validate slug format (letters, numbers, hyphens only)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
  }


  // Process image placeholders
  function escapeMarkdownAlt(text: string): string {
    return text.replace(/[\[\]\\()]/g, "\\$&");
  }

  const processedContent = html
    .replace(
      /<!-- IMAGE:\s*([^-]+) -->/gi,
      (_match: string, altText: string) =>
        `\n\n![${escapeMarkdownAlt(altText.trim())}](/images/posts/${slug}-${Math.random().toString(36).slice(2, 6)}.jpg)\n\n`
    )
    .replace(/<\/?h1[^>]*>/gi, (m: string) => (m.startsWith("</") ? "\n" : "\n# "))
    .replace(/<h2[^>]*>/gi, "\n\n## ")
    .replace(/<\/h2>/gi, "\n")
    .replace(/<h3[^>]*>/gi, "\n\n### ")
    .replace(/<\/h3>/gi, "\n")
    .replace(/<p>/gi, "\n\n")
    .replace(/<\/p>/gi, "")
    .replace(/<strong>/gi, "**")
    .replace(/<\/strong>/gi, "**")
    .replace(/<em>/gi, "_")
    .replace(/<\/em>/gi, "_")
    .replace(/<ul>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ol>/gi, "\n")
    .replace(/<\/ol>/gi, "\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<blockquote>/gi, "\n> ")
    .replace(/<\/blockquote>/gi, "\n")
    .replace(/<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_: string, url: string, text: string) => `[${text}](${url})`)
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Build frontmatter
  const today = new Date().toISOString().split("T")[0];
  const wordCount = processedContent.split(/\s+/).filter(Boolean).length;

  // Validate publishDate if provided
  let scheduledDate: string | null = null;
  if (publishDate && typeof publishDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(publishDate)) {
    scheduledDate = publishDate;
  }

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${today}"${scheduledDate ? `\npublishDate: "${scheduledDate}"` : ""}
description: "${description.replace(/"/g, '\\"')}"
primaryKeyword: "${primaryKeyword}"
category: "${siteConfig.category}"
tags: [${tags.map((t: string) => `"${t}"`).join(", ")}]
author: "${siteConfig.defaultAuthor}"
image: "/images/posts/${slug}.jpg"
wordCount: ${wordCount}
---

`;

  const content = frontmatter + processedContent;

  // Guard against oversized payloads (1 MB max)
  if (content.length > 1_000_000) {
    return NextResponse.json({ error: "Content too large (max 1 MB)" }, { status: 413 });
  }

  const postsDir = path.join(process.cwd(), "content", "posts");

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf8");

  // ── Dual-write to Supabase when configured ───────────────────────────────
  if (isSupabaseEnabled()) {
    await dbSavePost({
      slug,
      title,
      description,
      content: processedContent,
      primary_keyword: primaryKeyword,
      category: siteConfig.category,
      tags: tags ?? [],
      image: `/images/posts/${slug}.jpg`,
      author: siteConfig.defaultAuthor,
      word_count: wordCount,
      publish_date: scheduledDate ?? null,
    });
  }

  // Ping IndexNow to get the post indexed fast
  const indexed = await pingIndexNow(slug);

  // Also write the IndexNow key file to public/ if it doesn't exist yet
  const key = Buffer.from(siteConfig.domain).toString("hex").slice(0, 32);
  const keyFilePath = path.join(process.cwd(), "public", `${key}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    fs.writeFileSync(keyFilePath, key, "utf8");
  }

  return NextResponse.json({ success: true, file: `content/posts/${slug}.md`, wordCount, indexed });
}
