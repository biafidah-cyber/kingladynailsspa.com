import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

function isAdminAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("Authorization")?.replace("Bearer ", "");
  return auth === secret;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  const { html, keyword } = await req.json();
  if (!html || typeof html !== "string") {
    return NextResponse.json({ error: "html is required" }, { status: 400 });
  }

  // Gather existing posts for link targets
  let existingPosts: Array<{ slug: string; title: string; primaryKeyword: string }> = [];
  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
    existingPosts = files
      .map((f) => {
        try {
          const raw = fs.readFileSync(path.join(POSTS_DIR, f), "utf8");
          const { data } = matter(raw);
          return {
            slug: f.replace(".md", ""),
            title: data.title ?? "",
            primaryKeyword: data.primaryKeyword ?? "",
          };
        } catch {
          return null;
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .slice(0, 30); // cap at 30 to keep prompt short
  }

  if (existingPosts.length === 0) {
    return NextResponse.json({
      suggestions: [],
      message: "No existing posts found. Publish your first post before generating links.",
    });
  }

  const postList = existingPosts
    .map((p) => `- slug: "${p.slug}" | title: "${p.title}" | keyword: "${p.primaryKeyword}"`)
    .join("\n");

  const plainText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 3000);

  const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await claude.messages.create({
    model: "claude-haiku-3-5",
    max_tokens: 1024,
    system: "You are an SEO specialist who finds natural internal linking opportunities in blog articles. Return JSON only — no markdown, no explanation.",
    messages: [
      {
        role: "user",
        content: `Article topic: "${keyword}"

Article excerpt (first 3000 chars):
${plainText}

Existing posts to link to:
${postList}

Find 3-6 natural internal linking opportunities. For each:
1. Identify an exact phrase that appears in the article (verbatim)
2. Match it to the most relevant existing post
3. The anchor text must exist literally in the article

Return JSON array:
[
  {
    "anchorText": "exact phrase from article",
    "slug": "post-slug",
    "targetTitle": "Post title",
    "reason": "why this link makes sense"
  }
]

Only include high-quality, natural links. Return [] if no good matches.`,
      },
    ],
  });

  const block = message.content[0];
  const raw = block.type === "text" ? block.text.trim() : "[]";
  let suggestions: unknown[] = [];
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    suggestions = match ? JSON.parse(match[0]) : [];
  } catch {
    suggestions = [];
  }

  return NextResponse.json({ suggestions });
}
