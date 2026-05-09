import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  // Single-post fetch for editing
  const slug = new URL(req.url).searchParams.get("slug");
  if (slug) {
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return NextResponse.json({ slug, raw, content, frontmatter: data });
  }

  if (!fs.existsSync(POSTS_DIR)) {
    return NextResponse.json({ posts: [] });
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      try {
        const slug = filename.replace(".md", "");
        const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
        const { data, content } = matter(raw);
        const wordCount = content.replace(/\s+/g, " ").trim().split(" ").length;
        return {
          slug,
          title:          data.title          ?? slug,
          date:           data.date           ?? "",
          category:       data.category       ?? "",
          primaryKeyword: data.primaryKeyword ?? "",
          wordCount,
          publishDate:    data.publishDate    ?? null,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());

  return NextResponse.json({ posts });
}

export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true, deleted: slug });
}
